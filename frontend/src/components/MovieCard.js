import React from 'react';
import { Link } from 'react-router-dom';
import MoviePoster from './MoviePoster';
import './MovieCard.css';

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie._id}`} className="movie-card" aria-label={`View details for ${movie.title}`}>
      <div className="movie-card-art">
        <MoviePoster src={movie.posterUrl} title={movie.title} className="movie-card-poster" />
        {movie.rating > 0 && (
          <span className="movie-rating" aria-label={`Rated ${movie.rating.toFixed(1)} out of 10`}>
            <span aria-hidden="true">★</span> {movie.rating.toFixed(1)}
          </span>
        )}
        <span className="movie-card-action" aria-hidden="true">View film <span>↗</span></span>
      </div>
      <div className="movie-card-info">
        <h3>{movie.title}</h3>
        <p className="movie-card-genre">{movie.genre?.slice(0, 2).join(' · ')}</p>
        <div className="movie-card-meta">
          <span>{movie.duration} min</span>
          <span className="meta-divider" aria-hidden="true" />
          <span>{movie.language?.slice(0, 2).join(', ')}</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
