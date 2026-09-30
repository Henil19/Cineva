import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
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
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!movie) return <div className="container"><p>Movie not found</p></div>;

  const releaseDate = new Date(movie.releaseDate);

  return (
    <div className="movie-detail-page">
      <div className="container">
        <div className="movie-detail-container">
          <div className="movie-poster-section">
            <img src={movie.posterUrl} alt={movie.title} className="detail-poster" />
          </div>

          <div className="movie-details-section">
            <h1>{movie.title}</h1>

            <div className="detail-info">
              <div className="info-item">
                <span className="label">Genre:</span>
                <span>{movie.genre.join(', ')}</span>
              </div>

              <div className="info-item">
                <span className="label">Language:</span>
                <span>{movie.language.join(', ')}</span>
              </div>

              <div className="info-item">
                <span className="label">Duration:</span>
                <span>⏱️ {movie.duration} minutes</span>
              </div>

              <div className="info-item">
                <span className="label">Release Date:</span>
                <span>{releaseDate.toLocaleDateString()}</span>
              </div>

              {movie.rating > 0 && (
                <div className="info-item">
                  <span className="label">Rating:</span>
                  <span className="rating">⭐ {movie.rating.toFixed(1)}/10</span>
                </div>
              )}
            </div>

            {movie.description && (
              <div className="description-section">
                <h3>Synopsis</h3>
                <p>{movie.description}</p>
              </div>
            )}

            <button
              className="book-button"
              onClick={() => navigate(`/showtimes/${id}`)}
            >
              Book Tickets Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
