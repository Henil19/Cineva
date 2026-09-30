const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURL = process.env.MONGO_URI || 'mongodb://localhost:27017/bookmyshow';
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Import Models
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Showtime = require('./models/Showtime');

// Calendar dates are interpreted as UTC day boundaries, independent of server timezone.
const calendarDayRange = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const start = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== value) return null;
  return { $gte: start, $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
};

// ==================== ROUTES ====================

// GET all movies
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseDate: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET movie by ID
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all theaters
app.get('/api/theaters', async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a showtime for the seat-selection placeholder page.
app.get('/api/showtimes/id/:showtimeId', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.showtimeId)
      .populate('theaterId').populate('movieId');
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET showtimes for a specific movie and date
app.get('/api/showtimes/:movieId/:date', async (req, res) => {
  try {
    const { movieId, date } = req.params;
    const dateRange = calendarDayRange(date);
    if (!dateRange) return res.status(400).json({ error: 'date must be a valid YYYY-MM-DD calendar date' });
    const showtimes = await Showtime.find({
      movieId,
      date: dateRange,
    }).populate('theaterId').populate('movieId');
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET showtimes by date and movie
app.get('/api/showtimes', async (req, res) => {
  try {
    const { movieId, date } = req.query;
    let query = {};
    if (movieId) query.movieId = movieId;
    if (date) {
      const dateRange = calendarDayRange(date);
      if (!dateRange) return res.status(400).json({ error: 'date must be a valid YYYY-MM-DD calendar date' });
      query.date = dateRange;
    }
    
    const showtimes = await Showtime.find(query)
      .populate('theaterId')
      .populate('movieId');
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN ROUTES ARE CURRENTLY UNPROTECTED. Do not expose these endpoints publicly without authentication.
// POST add a new movie (Admin)
app.post('/api/movies', async (req, res) => {
  try {
    const { title, genre, duration, language, releaseDate, posterUrl, description } = req.body;
    const movie = new Movie({
      title,
      genre,
      duration,
      language,
      releaseDate,
      posterUrl,
      description,
    });
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add a new theater (Admin)
app.post('/api/theaters', async (req, res) => {
  try {
    const { name, city, address } = req.body;
    const theater = new Theater({ name, city, address });
    await theater.save();
    res.status(201).json(theater);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add a new showtime (Admin)
app.post('/api/showtimes', async (req, res) => {
  try {
    const { movieId, theaterId, date, time, priceStandard, premiumPrice } = req.body;
    const showtime = new Showtime({
      movieId,
      theaterId,
      date: new Date(date),
      time,
      priceStandard,
      premiumPrice,
    });
    await showtime.save();
    res.status(201).json(showtime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
