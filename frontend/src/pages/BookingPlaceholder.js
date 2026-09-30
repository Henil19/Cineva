import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { showtimeService } from '../services/api';
import './BookingPlaceholder.css';

function BookingPlaceholder() {
  const { showtimeId } = useParams();
  const [showtime, setShowtime] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    showtimeService.getShowtimeById(showtimeId)
      .then((response) => setShowtime(response.data))
      .catch(() => setError('This showtime could not be loaded. Please return to showtime selection and choose another.'));
  }, [showtimeId]);

  return (
    <main className="booking-page container">
      <section className="booking-shell">
        <span className="booking-eyebrow">Your movie night</span>
        <h1 className="booking-heading">Seat selection</h1>
        <div className="booking-card">
          <div className="booking-summary">
            {error ? <p className="booking-error" role="alert">{error}</p> : !showtime ? <p aria-live="polite">Loading screening details…</p> : (
              <>
                <p className="booking-movie">{showtime.movieId?.title || 'Movie'}</p>
                <p className="booking-theater">{showtime.theaterId?.name}{showtime.theaterId?.city ? ` · ${showtime.theaterId.city}` : ''}</p>
                <div className="booking-details">
                  <div><span className="booking-detail-label">Date</span>{new Date(showtime.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                  <div><span className="booking-detail-label">Showtime</span>{showtime.time}</div>
                </div>
                <p className="booking-notice">Seat selection is being prepared. You have not selected seats and no booking has been made.</p>
              </>
            )}
            <Link className="booking-back" to={showtime ? `/showtimes/${showtime.movieId?._id}` : '/'}>← Back to showtimes</Link>
          </div>
          <aside className="booking-art" aria-label="Seat selection preview">
            <div className="seat-illustration" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div>
            <p><strong>Pick your perfect spot</strong>Choose a screening first. Interactive seat selection is coming soon.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default BookingPlaceholder;
