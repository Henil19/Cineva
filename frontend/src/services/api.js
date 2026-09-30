import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const AUTH_TOKEN_KEY = 'cinevaToken';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  const requestUrl = error.config?.url || '';
  if (error.response?.status === 401 && !requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/register')) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    window.dispatchEvent(new Event('cineva:unauthorized'));
  }
  return Promise.reject(error);
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

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
  getShowtimeById: (id) => api.get(`/showtimes/id/${id}`),
  getShowtimesByQuery: (params) => api.get('/showtimes', { params }),
  addShowtime: (showtimeData) => api.post('/showtimes', showtimeData),
};

export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getBookingByReference: (bookingReference) => api.get(`/bookings/${bookingReference}`),
  getMyBookings: () => api.get('/bookings/my'),
};

export default api;
