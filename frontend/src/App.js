import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import ShowtimeSelection from './pages/ShowtimeSelection';
import About from './pages/About';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/showtimes/:movieId" element={<ShowtimeSelection />} />
        <Route path="/booking/confirmation/:bookingReference" element={<BookingConfirmation />} />
        <Route path="/booking/:showtimeId" element={<SeatSelection />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
