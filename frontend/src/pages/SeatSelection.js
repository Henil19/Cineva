import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { bookingService, showtimeService } from '../services/api';
import SeatLayout from '../components/SeatLayout';
import './SeatSelection.css';

const MAX_SEATS = 8;
const seatOrder = (left, right) => left.charCodeAt(0) - right.charCodeAt(0) || Number(left.slice(1)) - Number(right.slice(1));
const calendarDate = (value) => new Intl.DateTimeFormat(undefined, {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
}).format(new Date(value));

function SeatSelection() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [selectionNotice, setSelectionNotice] = useState('');

  const loadShowtime = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');
      const response = await showtimeService.getShowtimeById(showtimeId);
      setShowtime(response.data);
      setSelectedSeats((current) => current.filter((seat) => !response.data.bookedSeats?.includes(seat)));
    } catch (error) {
      setLoadError(error.response?.status === 404
        ? 'This screening could not be found. Please choose another showtime.'
        : 'We could not load this screening. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [showtimeId]);

  useEffect(() => { loadShowtime(); }, [loadShowtime]);

  const sortedSeats = useMemo(() => [...selectedSeats].sort(seatOrder), [selectedSeats]);
  const subtotal = useMemo(() => selectedSeats.reduce((total, seat) => {
    const price = seat[0] >= 'I' ? showtime?.premiumPrice : showtime?.priceStandard;
    return total + (Number(price) || 0);
  }, 0), [selectedSeats, showtime]);

  const toggleSeat = (seat) => {
    setSelectionNotice('');
    setBookingError('');
    if (selectedSeats.includes(seat)) {
      setSelectedSeats((current) => current.filter((selected) => selected !== seat));
      return;
    }
    if (selectedSeats.length >= MAX_SEATS) {
      setSelectionNotice(`You can select up to ${MAX_SEATS} seats per booking.`);
      return;
    }
    setSelectedSeats((current) => [...current, seat]);
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0 || booking) return;
    setBooking(true);
    setBookingError('');
    try {
      const response = await bookingService.createBooking({ showtimeId, seatNumbers: selectedSeats });
      navigate(`/booking/confirmation/${encodeURIComponent(response.data.bookingReference)}`);
    } catch (error) {
      if (error.response?.status === 409) {
        setBookingError('One or more seats were just booked by someone else. We refreshed availability; please choose again.');
        await loadShowtime();
      } else if (error.response?.status === 400) {
        setBookingError(error.response.data?.error || 'Please review your seat selection and try again.');
      } else {
        setBookingError(error.response?.data?.error || 'Your booking could not be completed. Please try again.');
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <main className="seat-selection-page container"><div className="state-panel" aria-live="polite"><div><div className="loading-dots" aria-hidden="true"><span /><span /><span /></div><p>Loading this screening…</p></div></div></main>;
  if (loadError || !showtime) return (
    <main className="seat-selection-page container">
      <div className="state-panel" role="alert"><div><h1>Screening unavailable</h1><p>{loadError || 'This screening could not be found.'}</p></div><Link className="button-secondary" to="/">Browse movies</Link></div>
    </main>
  );

  const movie = showtime.movieId || {};
  const theater = showtime.theaterId || {};
  const bookedSeats = showtime.bookedSeats || [];

  return (
    <main className="seat-selection-page">
      <div className="container seat-selection-container">
        <Link className="seat-back-link" to={`/showtimes/${movie._id}`}>← <span>Back to showtimes</span></Link>
        <div className="seat-page-heading">
          <div><span className="section-kicker">Make this movie night yours</span><h1>Pick your seats</h1></div>
          <div className="seat-show-summary"><strong>{movie.title || 'Movie'}</strong><span>{theater.name}{theater.city ? ` · ${theater.city}` : ''}</span><span>{calendarDate(showtime.date)} · {showtime.time}</span></div>
        </div>

        <div className="seat-selection-layout">
          <SeatLayout bookedSeats={bookedSeats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} disabled={booking} />
          <aside className="booking-summary-panel" aria-labelledby="booking-summary-title">
            <span className="section-kicker">Review your seats</span>
            <h2 id="booking-summary-title">Booking summary</h2>
            <div className="summary-selection" aria-live="polite">
              <span className="summary-label">Selected seats <span>{selectedSeats.length}/{MAX_SEATS}</span></span>
              {sortedSeats.length > 0 ? <p className="summary-seat-list">{sortedSeats.join(', ')}</p> : <p className="summary-empty">Choose seats from the map to get started.</p>}
            </div>
            <div className="summary-price-lines">
              <div><span>Standard · Rows A–H</span><span>₹{Number(showtime.priceStandard).toLocaleString('en-IN')}</span></div>
              <div><span>Premium · Rows I–J</span><span>₹{Number(showtime.premiumPrice).toLocaleString('en-IN')}</span></div>
            </div>
            <div className="summary-subtotal"><span>Subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div>
            <div className="summary-total"><span>Total <small>({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} · no extra fees)</small></span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div>
            {selectionNotice && <p className="selection-notice" role="status">{selectionNotice}</p>}
            {bookingError && <p className="booking-error" role="alert">{bookingError}</p>}
            <button className="button-primary confirm-booking-button" type="button" onClick={confirmBooking} disabled={selectedSeats.length === 0 || booking}>
              {booking ? 'Confirming…' : 'Confirm booking'} <span aria-hidden="true">→</span>
            </button>
            <p className="demo-booking-note">Local demo booking only. No payment is collected.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default SeatSelection;
