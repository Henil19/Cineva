const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true, // HH:MM format
  },
  priceStandard: {
    type: Number,
    required: true,
  },
  premiumPrice: {
    type: Number,
    required: true,
  },
  totalSeats: {
    type: Number,
    default: 150,
  },
  bookedSeats: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Showtime', showtimeSchema);
