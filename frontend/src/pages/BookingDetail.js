import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bookingService } from '../services/api';
import './BookingDetail.css';

const formatShowDate = (value) => new Intl.DateTimeFormat(undefined, {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
}).format(new Date(value));
const formatCreatedDate = (value) => new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(value));

function BookingDetail() {
  const { bookingReference } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooking = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingService.getBookingByReference(bookingReference);
      setBooking(response.data);
    } catch (requestError) {
      setError(requestError.response?.status === 404
        ? 'This booking is unavailable. Check the reference or return to your bookings.'
        : 'Booking details could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [bookingReference]);

  useEffect(() => { loadBooking(); }, [loadBooking]);

  if (loading) return <main className="booking-detail-page container"><div className="state-panel" aria-live="polite"><div><div className="loading-dots" aria-hidden="true"><span /><span /><span /></div><p>Loading booking details…</p></div></div></main>;
  if (error || !booking) return (
    <main className="booking-detail-page container">
      <div className="state-panel" role="alert"><div><h1>Booking unavailable</h1><p>{error || 'Booking details could not be loaded.'}</p></div><Link className="button-secondary" to="/bookings">My bookings</Link></div>
    </main>
  );

  const showtime = booking.showtimeId || {};
  const movie = booking.movieId || {};
  const theater = booking.theaterId || {};

  return (
    <main className="booking-detail-page">
      <div className="container booking-detail-container">
        <Link className="booking-detail-back" to="/bookings">← <span>My bookings</span></Link>
        <article className="booking-detail-card">
          <div className="booking-detail-heading"><div><span className="section-kicker">Booking details</span><h1>{movie.title || 'Movie'}</h1></div><span className="booking-status">{booking.status}</span></div>
          <p className="booking-detail-venue">{theater.name || 'Theater'}{theater.city ? ` · ${theater.city}` : ''}</p>
          <div className="booking-detail-reference"><span>BOOKING REFERENCE</span><strong>{booking.bookingReference}</strong></div>
          <div className="booking-detail-grid">
            <div><span>Date</span><strong>{showtime.date ? formatShowDate(showtime.date) : 'Date unavailable'}</strong></div>
            <div><span>Showtime</span><strong>{showtime.time || 'Time unavailable'}</strong></div>
            <div><span>Seats</span><strong>{booking.seatNumbers.join(', ')}</strong></div>
            <div><span>Booked</span><strong>{formatCreatedDate(booking.createdAt)}</strong></div>
          </div>
          <section className="booking-breakdown" aria-labelledby="seat-breakdown-title">
            <h2 id="seat-breakdown-title">Seat breakdown</h2>
            {booking.seatBreakdown.map((item) => (
              <div className="booking-breakdown-row" key={item.category}>
                <span><strong>{item.category}</strong><small>{item.seatNumbers.join(', ')} · ₹{Number(item.unitPrice).toLocaleString('en-IN')} each</small></span>
                <strong>₹{Number(item.subtotal).toLocaleString('en-IN')}</strong>
              </div>
            ))}
          </section>
          <div className="booking-detail-total"><span>Total</span><strong>₹{Number(booking.amount).toLocaleString('en-IN')}</strong></div>
          <p className="booking-detail-demo-note">This is a local Cineva demo booking. No payment was processed.</p>
        </article>
      </div>
    </main>
  );
}

export default BookingDetail;
