const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
  },
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
  seatNumbers: {
    type: [String],
    required: true,
    validate: {
      validator: (seatNumbers) => seatNumbers.length > 0 && seatNumbers.length <= 8,
      message: 'A booking must contain between one and eight seats.',
    },
  },
  seatBreakdown: [{
    category: { type: String, enum: ['standard', 'premium'], required: true },
    seatNumbers: { type: [String], required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  }],
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['confirmed'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
