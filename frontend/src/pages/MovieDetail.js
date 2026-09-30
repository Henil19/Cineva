import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieService } from '../services/api';
import MoviePoster from '../components/MoviePoster';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovieDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await movieService.getMovieById(id);
      setMovie(response.data);
    } catch (err) {
      setError('Failed to load movie details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  if (loading) return <main className="detail-loading"><div className="container"><div className="detail-loading-card" aria-label="Loading movie details" /></div></main>;
  if (error) return <main className="detail-loading container"><div className="state-panel" role="alert"><div><h2>Movie details unavailable</h2><p>{error}</p></div></div></main>;
  if (!movie) return <main className="detail-loading container"><div className="state-panel"><h2>Movie not found</h2></div></main>;

  const releaseDate = new Date(movie.releaseDate);

  return (
    <main className="movie-detail-page">
      <div className="detail-stage">
        <div className="container detail-content">
          <Link className="detail-back-link" to="/">← <span>All movies</span></Link>
          <section className="movie-detail-container" aria-labelledby="movie-title">
            <div className="movie-poster-section">
              <div className="poster-frame">
                <MoviePoster src={movie.posterUrl} title={movie.title} className="detail-poster" loading="eager" />
                <span className="poster-frame-label">CINEVA · FEATURE</span>
              </div>
            </div>

            <div className="movie-details-section">
              <span className="detail-eyebrow">THE FEATURE PRESENTATION</span>
              <h1 id="movie-title">{movie.title}</h1>
              <div className="detail-genre-list" aria-label="Genres">
                {movie.genre.map((genre) => <span key={genre}>{genre}</span>)}
              </div>

              <div className="detail-highlights">
                {movie.rating > 0 && <div className="detail-rating"><span aria-hidden="true">★</span><strong>{movie.rating.toFixed(1)}</strong><small>/ 10</small></div>}
                <span>{movie.duration} min</span>
                <span>{releaseDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>

              {movie.description && (
                <div className="description-section">
                  <h2>About the film</h2>
                  <p>{movie.description}</p>
                </div>
              )}

              <div className="detail-languages">
                <span className="detail-label">Available languages</span>
                <div>{movie.language.map((language) => <span className="language-chip" key={language}>{language}</span>)}</div>
              </div>

              <Link className="book-button" to={`/showtimes/${id}`}>
                Find showtimes <span aria-hidden="true">→</span>
              </Link>
              <p className="detail-cta-note">Choose a theater and screening that works for you.</p>
            </div>
          </section>
        </div>
      </div>
      <div className="detail-footer-space" aria-hidden="true" />
    </main>
  );
}

export default MovieDetail;
