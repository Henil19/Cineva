import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const movieService = {
  getAllMovies: () => api.get('/movies'),
  getMovieById: (id) => api.get(`/movies/${id}`),
  addMovie: (movieData) => api.post('/movies', movieData),
};

export const theaterService = {
  getAllTheaters: () => api.get('/theaters'),
  addTheater: (theaterData) => api.post('/theaters', theaterData),
};

export const showtimeService = {
  getShowtimes: (movieId, date) => api.get(`/showtimes/${movieId}/${date}`),
  getShowtimesByQuery: (params) => api.get('/showtimes', { params }),
  addShowtime: (showtimeData) => api.post('/showtimes', showtimeData),
};

export default api;
