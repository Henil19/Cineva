import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bookingService } from '../services/api';
import './BookingConfirmation.css';

const calendarDate = (value) => new Intl.DateTimeFormat(undefined, {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
}).format(new Date(value));

function BookingConfirmation() {
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
        ? 'We could not find a booking with this reference.'
        : 'Booking details could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [bookingReference]);

  useEffect(() => { loadBooking(); }, [loadBooking]);

  if (loading) return <main className="confirmation-page container"><div className="state-panel" aria-live="polite"><div><div className="loading-dots" aria-hidden="true"><span /><span /><span /></div><p>Loading your booking…</p></div></div></main>;
  if (error || !booking) return (
    <main className="confirmation-page container">
      <div className="state-panel" role="alert"><div><h1>Booking unavailable</h1><p>{error || 'Booking details could not be loaded.'}</p></div><Link className="button-secondary" to="/">Back to movies</Link></div>
    </main>
  );

  const showtime = booking.showtimeId || {};
  const movie = booking.movieId || {};
  const theater = booking.theaterId || {};

  return (
    <main className="confirmation-page">
      <div className="container confirmation-container">
        <section className="confirmation-card" aria-labelledby="confirmation-title">
          <div className="confirmation-success-mark" aria-hidden="true">✓</div>
          <span className="section-kicker">Your plans are set</span>
          <h1 id="confirmation-title">Booking confirmed</h1>
          <p className="confirmation-subtitle">Your Cineva demo booking has been saved.</p>

          <div className="confirmation-reference"><span>BOOKING REFERENCE</span><strong>{booking.bookingReference}</strong></div>
          <div className="confirmation-details">
            <div><span>Movie</span><strong>{movie.title || 'Movie'}</strong></div>
            <div><span>Theater</span><strong>{theater.name || 'Theater'}{theater.city ? ` · ${theater.city}` : ''}</strong></div>
            <div><span>Date & time</span><strong>{showtime.date ? calendarDate(showtime.date) : 'Date unavailable'}{showtime.time ? ` · ${showtime.time}` : ''}</strong></div>
            <div><span>Seats</span><strong>{booking.seatNumbers.join(', ')}</strong></div>
            <div className="confirmation-total"><span>Total</span><strong>₹{Number(booking.amount).toLocaleString('en-IN')}</strong></div>
          </div>
          <p className="confirmation-demo-note">This is a local demo booking. No payment was processed.</p>
          <Link className="button-primary confirmation-home-link" to="/">Back to movies <span aria-hidden="true">→</span></Link>
        </section>
      </div>
    </main>
  );
}

export default BookingConfirmation;
