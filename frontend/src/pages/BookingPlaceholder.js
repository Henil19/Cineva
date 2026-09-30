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
      <section className="booking-card">
        <h1>Seat selection</h1>
        {error ? <p className="booking-error">{error}</p> : !showtime ? <p>Loading showtime...</p> : (
          <>
            <p className="booking-movie">{showtime.movieId?.title || 'Movie'}</p>
            <p>{showtime.theaterId?.name} · {showtime.theaterId?.city}</p>
            <p>{new Date(showtime.date).toLocaleDateString()} · {showtime.time}</p>
            <p className="booking-notice">Seat selection and booking are not available yet. No booking has been made.</p>
          </>
        )}
        <Link className="booking-back" to={showtime ? `/showtimes/${showtime.movieId?._id}` : '/'}>Back to showtimes</Link>
      </section>
    </main>
  );
}

export default BookingPlaceholder;
