import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import ShowtimeSelection from './pages/ShowtimeSelection';
import About from './pages/About';
import BookingPlaceholder from './pages/BookingPlaceholder';
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
        <Route path="/booking/:showtimeId" element={<BookingPlaceholder />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
