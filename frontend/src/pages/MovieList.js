import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/api';
import MovieCard from '../components/MovieCard';
import MoviePoster from '../components/MoviePoster';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await movieService.getAllMovies();
      setMovies(response.data);
    } catch (err) {
      setError('We could not load the film collection. Check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const filteredMovies = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return movies;
    return movies.filter((movie) => movie.title.toLowerCase().includes(normalizedSearch));
  }, [movies, searchTerm]);

  const featuredMovie = movies[0];

  return (
    <div className="movie-list-page">
      <section className="discovery-hero" aria-labelledby="discovery-title">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="container discovery-hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow"><span /> Your next great night out</span>
            <h1 id="discovery-title">Stories worth seeing <em>on the big screen.</em></h1>
            <p>Find the films you love, discover something new, and see what’s playing near you.</p>
            <label className="hero-search">
              <span className="search-icon" aria-hidden="true" />
              <span className="visually-hidden">Search films</span>
              <input
                type="search"
                placeholder="Search by movie title"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <button type="button" className="search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
                  ×
                </button>
              )}
            </label>
            <div className="hero-note"><span className="hero-note-dot" /> Discover movies. Find your show.</div>
          </div>

          {featuredMovie && (
            <Link to={`/movie/${featuredMovie._id}`} className="featured-film" aria-label={`Featured film: ${featuredMovie.title}`}>
              <div className="featured-film-image">
                <MoviePoster src={featuredMovie.posterUrl} title={featuredMovie.title} className="featured-poster" loading="eager" />
                <span className="featured-stamp">IN THE SPOTLIGHT</span>
              </div>
              <div className="featured-film-caption">
                <div>
                  <span className="featured-label">FEATURED FILM</span>
                  <h2>{featuredMovie.title}</h2>
                </div>
                <span className="featured-arrow" aria-hidden="true">↗</span>
              </div>
            </Link>
          )}
          {!featuredMovie && !loading && !error && <div className="hero-poster-empty" aria-hidden="true" />}
          {loading && <div className="hero-poster-loading" aria-hidden="true" />}
        </div>
        <div className="hero-bottom-line" aria-hidden="true"><span /></div>
      </section>

      <section className="page-section movie-discovery" id="movies" aria-labelledby="movies-title">
        <div className="container">
          <div className="section-heading movie-section-heading">
            <div>
              <span className="section-kicker">Find your next favorite</span>
              <h2 id="movies-title">Now showing</h2>
            </div>
            {!loading && !error && <span className="movie-count">{filteredMovies.length} {filteredMovies.length === 1 ? 'film' : 'films'}</span>}
          </div>

          {loading && (
            <div className="movies-grid" aria-label="Loading movies" aria-busy="true">
              {Array.from({ length: 5 }, (_, index) => <div className="movie-skeleton" key={index} />)}
            </div>
          )}

          {error && (
            <div className="state-panel movie-state" role="alert">
              <div><span className="state-icon" aria-hidden="true">!</span><h3>Something went wrong</h3><p>{error}</p></div>
              <button className="button-secondary" type="button" onClick={fetchMovies}>Try again</button>
            </div>
          )}

          {!loading && !error && filteredMovies.length === 0 && (
            <div className="state-panel movie-state" role="status">
              <div><span className="state-icon search-state-icon" aria-hidden="true" /><h3>No films found</h3><p>Try another title or clear your search to see all movies.</p></div>
              {searchTerm && <button className="button-secondary" type="button" onClick={() => setSearchTerm('')}>Clear search</button>}
            </div>
          )}

          {!loading && !error && filteredMovies.length > 0 && (
            <div className="movies-grid">
              {filteredMovies.map((movie) => <MovieCard movie={movie} key={movie._id} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MovieList;
