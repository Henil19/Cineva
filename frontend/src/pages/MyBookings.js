import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import './MyBookings.css';

const formatShowDate = (value) => new Intl.DateTimeFormat(undefined, {
  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
}).format(new Date(value));
const formatCreatedDate = (value) => new Intl.DateTimeFormat(undefined, {
  month: 'short', day: 'numeric', year: 'numeric',
}).format(new Date(value));

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingService.getMyBookings();
      setBookings(response.data);
    } catch (requestError) {
      setError(requestError.response?.status === 401
        ? 'Your session ended. Please sign in again to see your bookings.'
        : 'Your bookings could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  return (
    <main className="my-bookings-page">
      <div className="container my-bookings-container">
        <div className="my-bookings-heading"><div><span className="section-kicker">Your Cineva account</span><h1>My bookings</h1><p>All your upcoming movie plans in one place.</p></div><Link className="button-secondary" to="/">Explore movies</Link></div>

        {loading && <div className="state-panel" aria-live="polite"><div><div className="loading-dots" aria-hidden="true"><span /><span /><span /></div><p>Loading your bookings…</p></div></div>}
        {error && <div className="state-panel" role="alert"><div><h2>Bookings unavailable</h2><p>{error}</p></div><button className="button-secondary" type="button" onClick={loadBookings}>Try again</button></div>}
        {!loading && !error && bookings.length === 0 && (
          <div className="state-panel my-bookings-empty" role="status"><div><span className="empty-ticket-icon" aria-hidden="true">✦</span><h2>No bookings yet</h2><p>When you choose seats and confirm a show, your booking will appear here.</p><Link className="button-primary" to="/">Find a movie</Link></div></div>
        )}
        {!loading && !error && bookings.length > 0 && (
          <div className="my-bookings-list">
            {bookings.map((booking) => {
              const showtime = booking.showtimeId || {};
              const movie = booking.movieId || {};
              const theater = booking.theaterId || {};
              return (
                <Link className="booking-list-card" to={`/bookings/${encodeURIComponent(booking.bookingReference)}`} key={booking._id}>
                  <div className="booking-list-top"><div><span className="booking-ref-label">BOOKING REFERENCE</span><strong className="booking-ref">{booking.bookingReference}</strong></div><span className="booking-status">{booking.status}</span></div>
                  <div className="booking-list-main"><div><h2>{movie.title || 'Movie'}</h2><p>{theater.name || 'Theater'}{theater.city ? ` · ${theater.city}` : ''}</p></div><strong className="booking-list-total">₹{Number(booking.amount).toLocaleString('en-IN')}</strong></div>
                  <div className="booking-list-meta"><span>{showtime.date ? formatShowDate(showtime.date) : 'Date unavailable'}{showtime.time ? ` · ${showtime.time}` : ''}</span><span>{booking.seatNumbers.join(', ')}</span><span>Booked {formatCreatedDate(booking.createdAt)}</span></div>
                  <span className="booking-card-arrow" aria-hidden="true">→</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyBookings;
