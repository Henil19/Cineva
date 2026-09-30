import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { showtimeService, movieService } from '../services/api';
import { format, addDays } from 'date-fns';
import './ShowtimeSelection.css';

function ShowtimeSelection() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dates] = useState(() => Array.from({ length: 7 }, (_, index) => addDays(new Date(), index)));

  const fetchMovie = useCallback(async () => {
    try {
      const response = await movieService.getMovieById(movieId);
      setMovie(response.data);
    } catch (err) {
      setError('Failed to load movie');
      console.error(err);
    }
  }, [movieId]);

  const fetchShowtimes = useCallback(async () => {
    try {
      setLoading(true);
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const response = await showtimeService.getShowtimesByQuery({
        movieId,
        date: dateString,
      });
      setShowtimes(response.data);
    } catch (err) {
      setError('Failed to load showtimes');
      console.error(err);
      setShowtimes([]);
    } finally {
      setLoading(false);
    }
  }, [movieId, selectedDate]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  const isDateSelected = (date) => {
    return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  };

  const groupByTheater = () => {
    const grouped = {};
    showtimes.forEach(showtime => {
      const theaterId = showtime.theaterId._id;
      if (!grouped[theaterId]) {
        grouped[theaterId] = {
          theater: showtime.theaterId,
          shows: [],
        };
      }
      grouped[theaterId].shows.push(showtime);
    });
    return Object.values(grouped);
  };

  const availableSeats = (showtime) => {
    return showtime.totalSeats - (showtime.bookedSeats ? showtime.bookedSeats.length : 0);
  };

  if (!movie) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="showtime-selection-page">
      <div className="container">
        <h1>Select Showtime for {movie.title}</h1>

        {/* Date Selector */}
        <div className="date-selector">
          {dates.map((date, index) => (
            <button
              key={index}
              className={`date-btn ${isDateSelected(date) ? 'active' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="date-day">{format(date, 'EEE')}</div>
              <div className="date-date">{format(date, 'd')}</div>
              <div className="date-month">{format(date, 'MMM')}</div>
            </button>
          ))}
        </div>

        {/* Showtimes List */}
        <div className="showtimes-section">
          {error && <p className="error">{error}</p>}
          {loading && <p className="loading">Loading showtimes...</p>}

          {!loading && showtimes.length === 0 && (
            <p className="no-shows">No showtimes available for this date</p>
          )}

          {!loading && showtimes.length > 0 && (
            <div className="theaters-list">
              {groupByTheater().map((group) => (
                <div key={group.theater._id} className="theater-group">
                  <div className="theater-header">
                    <h2>{group.theater.name}</h2>
                    <p className="theater-address">📍 {group.theater.city}</p>
                  </div>

                  <div className="shows-container">
                    {group.shows.map((show) => (
                      <div key={show._id} className="showtime-card">
                        <div className="show-time">
                          <span className="time-display">{show.time}</span>
                        </div>

                        <div className="show-details">
                          <p className="language">🎬 {movie.language[0]}</p>
                          <p className="format">Standard</p>
                        </div>

                        <div className="show-pricing">
                          <p className="price">₹{show.priceStandard}</p>
                          <p className="available">
                            {availableSeats(show)} seats available
                          </p>
                        </div>

                        <Link
                          className="book-show-btn"
                          to={`/booking/${show._id}`}
                          aria-disabled={availableSeats(show) === 0}
                          onClick={(event) => {
                            if (availableSeats(show) === 0) event.preventDefault();
                          }}
                        >
                          {availableSeats(show) === 0 ? 'Housefull' : 'Book'}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowtimeSelection;
