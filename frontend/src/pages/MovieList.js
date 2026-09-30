import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAllMovies();
      setMovies(response.data);
    } catch (err) {
      setError('Failed to load movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container"><p>Loading movies...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="movie-list-page">
      <div className="container">
        <h1>Now Showing</h1>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredMovies.length === 0 ? (
          <p className="no-movies">No movies found</p>
        ) : (
          <div className="movies-grid">
            {filteredMovies.map(movie => (
              <Link
                to={`/movie/${movie._id}`}
                key={movie._id}
                className="movie-card-link"
              >
                <div className="movie-card">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p className="genre">{movie.genre.join(', ')}</p>
                    <p className="language">{movie.language.join(', ')}</p>
                    <p className="duration">⏱️ {movie.duration} mins</p>
                    {movie.rating > 0 && (
                      <p className="rating">⭐ {movie.rating.toFixed(1)}/10</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieList;
