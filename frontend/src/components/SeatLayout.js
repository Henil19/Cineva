import React from 'react';
import './SeatLayout.css';

const seatRows = Array.from({ length: 10 }, (_, index) => String.fromCharCode(65 + index));
const seatNumbers = Array.from({ length: 15 }, (_, index) => index + 1);

function SeatLayout({ bookedSeats = [], selectedSeats = [], onToggleSeat, disabled = false }) {
  const booked = new Set(bookedSeats);
  const selected = new Set(selectedSeats);

  return (
    <section className="seat-map-panel" aria-labelledby="seat-map-title">
      <div className="seat-map-heading">
        <div><span className="section-kicker">Your view from the room</span><h2 id="seat-map-title">Choose your seats</h2></div>
        <span className="seat-map-count">150 seats · 10 rows</span>
      </div>

      <div className="cinema-screen" aria-label="Screen at the front of the cinema"><span>SCREEN</span></div>

      <div className="seat-map-scroll" role="group" aria-label="Cinema seats, rows A to J">
        {seatRows.map((row) => (
          <div className={`seat-row ${row >= 'I' ? 'seat-row-premium' : ''}`} key={row} aria-label={`Row ${row}, ${row >= 'I' ? 'premium' : 'standard'} seats`}>
            <span className="seat-row-label" aria-hidden="true">{row}</span>
            <div className="seat-row-seats">
              {seatNumbers.map((number) => {
                const seatId = `${row}${number}`;
                const isBooked = booked.has(seatId);
                const isSelected = selected.has(seatId);
                const category = row >= 'I' ? 'premium' : 'standard';
                const state = isBooked ? 'unavailable' : isSelected ? 'selected' : 'available';
                return (
                  <button
                    className={`seat-button seat-${state} seat-${category}`}
                    type="button"
                    key={seatId}
                    aria-label={`Seat ${seatId}, ${category}, ${state}`}
                    aria-pressed={isSelected}
                    disabled={isBooked || disabled}
                    onClick={() => onToggleSeat(seatId)}
                  >
                    {number}
                  </button>
                );
              })}
            </div>
            <span className="seat-row-label" aria-hidden="true">{row}</span>
          </div>
        ))}
      </div>

      <ul className="seat-legend" aria-label="Seat legend">
        <li><span className="legend-seat legend-available" /> Available</li>
        <li><span className="legend-seat legend-selected" /> Selected</li>
        <li><span className="legend-seat legend-booked" /> Booked</li>
        <li><span className="legend-seat legend-premium" /> Premium</li>
      </ul>
      <p className="seat-map-note">Rows A–H are standard. Rows I–J are premium. A center aisle separates seats 7 and 8.</p>
    </section>
  );
}

export default SeatLayout;
