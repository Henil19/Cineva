import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { showtimeService, movieService } from '../services/api';
import { format, addDays } from 'date-fns';
import './ShowtimeSelection.css';

function ShowtimeSelection() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [movieLoading, setMovieLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movieError, setMovieError] = useState('');
  const [showtimeError, setShowtimeError] = useState('');
  const [dates] = useState(() => Array.from({ length: 7 }, (_, index) => addDays(new Date(), index)));

  const fetchMovie = useCallback(async () => {
    try {
      setMovieLoading(true);
      setMovieError('');
      const response = await movieService.getMovieById(movieId);
      setMovie(response.data);
    } catch (err) {
      setMovieError('We could not load this movie. Return to the movie list and try again.');
      console.error(err);
    } finally {
      setMovieLoading(false);
    }
  }, [movieId]);

  const fetchShowtimes = useCallback(async () => {
    try {
      setLoading(true);
      setShowtimeError('');
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const response = await showtimeService.getShowtimesByQuery({
        movieId,
        date: dateString,
      });
      setShowtimes(response.data);
    } catch (err) {
      setShowtimeError('Showtimes could not be loaded. Please try selecting the date again.');
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
    return Math.max(150 - (showtime.bookedSeats ? showtime.bookedSeats.length : 0), 0);
  };

  if (movieLoading) return <main className="showtime-page-loading container"><div className="detail-loading-card" aria-label="Loading showtimes" /></main>;
  if (!movie) return <main className="container showtime-page-error"><div className="state-panel" role="alert"><div><h2>Movie unavailable</h2><p>{movieError || 'This movie could not be found.'}</p></div><Link className="button-secondary" to="/">Browse movies</Link></div></main>;

  return (
    <main className="showtime-selection-page">
      <div className="container">
        <div className="showtime-page-heading">
          <div><span className="section-kicker">Make it a movie night</span><h1>Choose a screening</h1></div>
          <div className="showtime-movie-pill"><span>FOR</span>{movie.title}</div>
        </div>

        <section className="date-picker-panel" aria-label="Choose a show date">
          <div className="date-picker-heading"><div><h2>Pick a date</h2><p>Screenings for the next seven days</p></div><span className="calendar-icon" aria-hidden="true" /></div>
          <div className="date-selector" role="group" aria-label="Available dates">
          {dates.map((date) => (
            <button
              key={format(date, 'yyyy-MM-dd')}
              className={`date-btn ${isDateSelected(date) ? 'active' : ''}`}
              type="button"
              aria-pressed={isDateSelected(date)}
              aria-label={format(date, 'EEEE, MMMM d')}
              onClick={() => setSelectedDate(date)}
            >
              <div className="date-day">{format(date, 'EEE')}</div>
              <div className="date-date">{format(date, 'd')}</div>
              <div className="date-month">{format(date, 'MMM')}</div>
            </button>
          ))}
          </div>
        </section>

        <div className="showtimes-section">
          <div className="showtimes-section-heading"><div><span className="section-kicker">Find your seat time</span><h2>Available screenings</h2></div>{!loading && !showtimeError && <span className="screening-count">{showtimes.length} {showtimes.length === 1 ? 'screening' : 'screenings'}</span>}</div>
          {showtimeError && <div className="state-panel showtime-state" role="alert"><div><h3>Screenings unavailable</h3><p>{showtimeError}</p></div></div>}
          {loading && <div className="state-panel showtime-state" aria-live="polite"><div><div className="loading-dots" aria-hidden="true"><span /><span /><span /></div><p>Finding screenings for {format(selectedDate, 'EEEE, MMMM d')}…</p></div></div>}

          {!loading && !showtimeError && showtimes.length === 0 && (
            <div className="state-panel showtime-state" role="status"><div><span className="screen-empty-icon" aria-hidden="true" /><h3>No screenings on this date</h3><p>Choose another day to see available showtimes.</p></div></div>
          )}

          {!loading && !showtimeError && showtimes.length > 0 && (
            <div className="theaters-list">
              {groupByTheater().map((group) => (
                <div key={group.theater._id} className="theater-group">
                  <div className="theater-header">
                    <div className="theater-heading-main"><span className="theater-icon" aria-hidden="true">C</span><div><h3>{group.theater.name}</h3><p className="theater-address">{group.theater.address || group.theater.city}{group.theater.address && group.theater.city ? ` · ${group.theater.city}` : ''}</p></div></div>
                    <span className="theater-screening-count">{group.shows.length} {group.shows.length === 1 ? 'show' : 'shows'}</span>
                  </div>
                  {group.theater.facilities?.length > 0 && <p className="theater-facilities">{group.theater.facilities.slice(0, 3).join(' · ')}</p>}

                  <div className="shows-container">
                    {group.shows.map((show) => (
                      <div key={show._id} className="showtime-card">
                        <div className="showtime-card-top">
                          <span className="time-display">{show.time}</span>
                          <span className="format-chip">Standard</span>
                        </div>

                        <div className="show-details">
                          <p className="language">{movie.language[0]}</p>
                          {movie.language.length > 1 && <span className="language-extra">+{movie.language.length - 1} more language{movie.language.length > 2 ? 's' : ''}</span>}
                        </div>

                        <div className="show-pricing">
                          <p className="price"><span>₹</span>{show.priceStandard}<small> onwards</small></p>
                          <p className={`available ${availableSeats(show) < 15 ? 'seats-limited' : ''}`}>{availableSeats(show)} seats available</p>
                        </div>

                        <Link
                          className="book-show-btn"
                          to={`/booking/${show._id}`}
                          aria-disabled={availableSeats(show) === 0}
                          aria-label={`${availableSeats(show) === 0 ? 'House full' : 'Continue'} for ${show.time} at ${group.theater.name}`}
                          onClick={(event) => {
                            if (availableSeats(show) === 0) event.preventDefault();
                          }}
                        >
                          {availableSeats(show) === 0 ? 'House full' : <>Select seats <span aria-hidden="true">→</span></>}
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
    </main>
  );
}

export default ShowtimeSelection;
