const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { randomBytes } = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
const Booking = require('./models/Booking');
const User = require('./models/User');
const authenticateUser = require('./middleware/auth');

const SEAT_PATTERN = /^[A-J](?:[1-9]|1[0-5])$/;
const MAX_BOOKING_SEATS = 8;

const createBookingReference = () => {
  const year = new Date().getUTCFullYear();
  const suffix = randomBytes(4).toString('hex').toUpperCase();
  return `CV-${year}-${suffix}`;
};

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
});

const createAuthToken = (user) => jwt.sign(
  { sub: user._id.toString() },
  process.env.JWT_SECRET,
  { expiresIn: '7d', issuer: 'cineva-api' },
);

const isObjectBody = (body) => body && typeof body === 'object' && !Array.isArray(body);

// Calendar dates are interpreted as UTC day boundaries, independent of server timezone.
const calendarDayRange = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const start = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== value) return null;
  return { $gte: start, $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
};

// ==================== ROUTES ====================

// Authentication
app.post('/api/auth/register', async (req, res) => {
  if (!isObjectBody(req.body)) return res.status(400).json({ error: 'Request body must be a JSON object.' });
  const { name, email, password } = req.body;
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedName || normalizedName.length > 100) {
    return res.status(400).json({ error: 'Name is required and must be 100 characters or fewer.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and no more than 72 bytes.' });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Authentication is not configured.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: normalizedName, email: normalizedEmail, passwordHash });
    return res.status(201).json({ token: createAuthToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'An account with this email already exists.' });
    if (error.name === 'ValidationError') return res.status(400).json({ error: 'The registration details are invalid.' });
    console.error('Registration failed:', error);
    return res.status(500).json({ error: 'Registration could not be completed.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (!isObjectBody(req.body)) return res.status(400).json({ error: 'Request body must be a JSON object.' });
  const { email, password } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Enter a valid email address and password.' });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Authentication is not configured.' });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }
    return res.json({ token: createAuthToken(user), user: publicUser(user) });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ error: 'Login could not be completed.' });
  }
});

app.get('/api/auth/me', authenticateUser, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

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

// Retrieve a populated showtime for seat selection.
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

// Booking history is always scoped to the authenticated owner.
app.get('/api/bookings/my', authenticateUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('movieId')
      .populate('theaterId')
      .populate('showtimeId');
    return res.json(bookings);
  } catch (error) {
    console.error('Booking history lookup failed:', error);
    return res.status(500).json({ error: 'Booking history could not be loaded.' });
  }
});

// Create a booking for the authenticated user. Prices are calculated from the showtime.
app.post('/api/bookings', authenticateUser, async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Request body must be a JSON object.' });
  }

  const { showtimeId, seatNumbers } = body;
  if (typeof showtimeId !== 'string' || !/^[a-f\d]{24}$/i.test(showtimeId)) {
    return res.status(400).json({ error: 'A valid showtimeId is required.' });
  }
  if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    return res.status(400).json({ error: 'Choose at least one seat.' });
  }
  if (seatNumbers.length > MAX_BOOKING_SEATS) {
    return res.status(400).json({ error: `You can book up to ${MAX_BOOKING_SEATS} seats at a time.` });
  }
  if (!seatNumbers.every((seat) => typeof seat === 'string' && SEAT_PATTERN.test(seat))) {
    return res.status(400).json({ error: 'One or more seat numbers are invalid.' });
  }
  if (new Set(seatNumbers).size !== seatNumbers.length) {
    return res.status(400).json({ error: 'Duplicate seat numbers are not allowed.' });
  }

  try {
    if (!(await Showtime.exists({ _id: showtimeId }))) {
      return res.status(404).json({ error: 'Showtime not found.' });
    }

    const showtime = await Showtime.findOneAndUpdate(
      { _id: showtimeId, bookedSeats: { $nin: seatNumbers } },
      { $addToSet: { bookedSeats: { $each: seatNumbers } } },
      { new: true, runValidators: true },
    );

    if (!showtime) {
      return res.status(409).json({ error: 'One or more selected seats are no longer available.' });
    }

    const standardSeats = seatNumbers.filter((seat) => seat[0] <= 'H');
    const premiumSeats = seatNumbers.filter((seat) => seat[0] >= 'I');
    const seatBreakdown = [
      standardSeats.length > 0 && {
        category: 'standard',
        seatNumbers: standardSeats,
        unitPrice: showtime.priceStandard,
        subtotal: standardSeats.length * showtime.priceStandard,
      },
      premiumSeats.length > 0 && {
        category: 'premium',
        seatNumbers: premiumSeats,
        unitPrice: showtime.premiumPrice,
        subtotal: premiumSeats.length * showtime.premiumPrice,
      },
    ].filter(Boolean);
    const amount = seatBreakdown.reduce((total, category) => total + category.subtotal, 0);
    let seatsReserved = true;
    let booking;

    try {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          booking = await Booking.create({
            bookingReference: createBookingReference(),
            showtimeId: showtime._id,
            movieId: showtime.movieId,
            theaterId: showtime.theaterId,
            userId: req.user._id,
            seatNumbers,
            seatBreakdown,
            amount,
          });
          break;
        } catch (error) {
          if (error.code === 11000 && error.keyPattern?.bookingReference && attempt < 2) continue;
          throw error;
        }
      }

      if (!booking) throw new Error('Booking could not be created.');
      const populatedBooking = await Booking.findById(booking._id)
        .populate('movieId')
        .populate('theaterId')
        .populate('showtimeId');
      if (!populatedBooking) throw new Error('Booking could not be loaded after creation.');
      seatsReserved = false;
      return res.status(201).json(populatedBooking);
    } catch (error) {
      if (booking?._id) {
        const rollbackBooking = await Booking.deleteOne({ _id: booking._id }).catch((rollbackError) => {
          console.error('Could not remove incomplete booking:', rollbackError);
          return null;
        });
        if (!rollbackBooking) console.error('The incomplete booking cleanup must be checked manually.');
      }
      if (seatsReserved) {
        await Showtime.updateOne(
          { _id: showtime._id },
          { $pull: { bookedSeats: { $in: seatNumbers } } },
        ).catch((rollbackError) => console.error('Could not release seats after booking failure:', rollbackError));
      }
      throw error;
    }
  } catch (error) {
    console.error('Booking creation failed:', error);
    return res.status(500).json({ error: 'Booking could not be completed. Please try again.' });
  }
});

// Retrieve a booking only when its reference belongs to the authenticated user.
app.get('/api/bookings/:bookingReference', authenticateUser, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingReference: req.params.bookingReference,
      userId: req.user._id,
    })
      .populate('movieId')
      .populate('theaterId')
      .populate('showtimeId');
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    return res.json(booking);
  } catch (error) {
    console.error('Booking lookup failed:', error);
    return res.status(500).json({ error: 'Booking details could not be loaded.' });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body must be valid JSON.' });
  }
  console.error('Unhandled request error:', error);
  return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
