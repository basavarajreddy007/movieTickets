import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext.jsx';
import { ArrowLeft, Clock, Armchair, ShieldCheck, Lock } from 'lucide-react';
import '../styles/seats.css';

const SeatSelection = () => {
  const { 
    selectedMovie, 
    selectedShowtime, 
    selectedSeats, 
    toggleSeatSelection, 
    confirmBooking, 
    setCurrentPage 
  } = useBooking();

  const formatDateForDisplay = (dateStr) => {
    if (dateStr === 'Today' || dateStr === 'Tomorrow') return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert('Seating hold expired! Returning to movie details.');
      setCurrentPage('details');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, setCurrentPage]);

  if (!selectedMovie || !selectedShowtime) {
    return (
      <div className="no-showtimes">
        <h3>Booking data not initialized</h3>
        <button onClick={() => setCurrentPage('home')}>Return Home</button>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const getSeatCategory = (row) => {
    return ['E', 'F'].includes(row) ? 'VIP' : 'Standard';
  };

  const getSeatPrice = (row) => {
    return getSeatCategory(row) === 'VIP' 
      ? (selectedShowtime.vipPrice || selectedShowtime.price + 8) 
      : selectedShowtime.price;
  };

  const standardSelected = selectedSeats.filter(seat => !['E', 'F'].includes(seat.charAt(0)));
  const vipSelected = selectedSeats.filter(seat => ['E', 'F'].includes(seat.charAt(0)));

  const standardPrice = selectedShowtime.price;
  const vipPrice = selectedShowtime.vipPrice || (selectedShowtime.price + 8);

  const subtotal = (standardSelected.length * standardPrice) + (vipSelected.length * vipPrice);
  const bookingFee = selectedSeats.length > 0 ? 1.50 : 0;
  const totalPrice = subtotal + bookingFee;

  const handleCheckout = () => {
    if (selectedSeats.length === 0) return;
    confirmBooking(totalPrice);
  };

  return (
    <div className="seats-page">
      <div className="seats-page-title">
        <div className="back-btn-container">
          <button className="back-btn" onClick={() => setCurrentPage('details')}>
            <ArrowLeft size={16} /> Back to Movie Details
          </button>
        </div>

        <div className="booking-timer">
          <Clock size={16} />
          <span>Seat Hold: {formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="theater-container glass-panel animate-fade-in">
        <div className="cinema-screen-wrapper">
          <div className="cinema-screen"></div>
          <span className="screen-label">SCREEN STAGE</span>
        </div>

        <div className="seating-layout">
          {rows.map(row => {
            const isVip = ['E', 'F'].includes(row);
            return (
              <div key={row} className="seating-row">
                <span className="row-letter">{row}</span>
                
                <div className="seats-row-group">
                  {columns.slice(0, 3).map(col => {
                    const seatId = `${row}${col}`;
                    const isBooked = selectedShowtime.bookedSeats?.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    
                    return (
                      <button
                        key={seatId}
                        disabled={isBooked}
                        onClick={() => toggleSeatSelection(seatId)}
                        className={`seat ${isBooked ? 'reserved' : 'available'} ${isVip ? 'vip' : 'standard'} ${isSelected ? 'selected' : ''}`}
                        title={`${row}-${col} (${isVip ? 'VIP' : 'Standard'})`}
                      >
                        {isBooked ? <Lock size={12} /> : seatId}
                      </button>
                    );
                  })}
                </div>

                <div className="aisle-gap"></div>

                <div className="seats-row-group">
                  {columns.slice(3, 9).map(col => {
                    const seatId = `${row}${col}`;
                    const isBooked = selectedShowtime.bookedSeats?.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    
                    return (
                      <button
                        key={seatId}
                        disabled={isBooked}
                        onClick={() => toggleSeatSelection(seatId)}
                        className={`seat ${isBooked ? 'reserved' : 'available'} ${isVip ? 'vip' : 'standard'} ${isSelected ? 'selected' : ''}`}
                        title={`${row}-${col} (${isVip ? 'VIP' : 'Standard'})`}
                      >
                        {isBooked ? <Lock size={12} /> : seatId}
                      </button>
                    );
                  })}
                </div>

                <div className="aisle-gap"></div>

                <div className="seats-row-group">
                  {columns.slice(9, 12).map(col => {
                    const seatId = `${row}${col}`;
                    const isBooked = selectedShowtime.bookedSeats?.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    
                    return (
                      <button
                        key={seatId}
                        disabled={isBooked}
                        onClick={() => toggleSeatSelection(seatId)}
                        className={`seat ${isBooked ? 'reserved' : 'available'} ${isVip ? 'vip' : 'standard'} ${isSelected ? 'selected' : ''}`}
                        title={`${row}-${col} (${isVip ? 'VIP' : 'Standard'})`}
                      >
                        {isBooked ? <Lock size={12} /> : seatId}
                      </button>
                    );
                  })}
                </div>

                <span className="row-letter">{row}</span>
              </div>
            );
          })}
        </div>

        <div className="seats-legend">
          <div className="legend-item">
            <span className="legend-color standard"></span>
            <span>Standard Seat (₹{standardPrice.toFixed(2)})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color vip"></span>
            <span>VIP Premium Seat (₹{vipPrice.toFixed(2)})</span>
          </div>
          <div className="legend-item">
            <span className="legend-color selected"></span>
            <span>Your Selection</span>
          </div>
          <div className="legend-item">
            <span className="legend-color reserved"></span>
            <span>Sold Out</span>
          </div>
        </div>
      </div>

      <div className="booking-checkout-panel glass-panel animate-fade-in">
        <div className="booking-summary-left">
          <div className="checkout-movie-card">
            <img src={selectedMovie.poster} alt={selectedMovie.title} className="checkout-poster" />
            <div className="checkout-info-text">
              <h3>{selectedMovie.title}</h3>
              <p className="checkout-showtime-meta">
                {formatDateForDisplay(selectedShowtime.date)} &bull; {selectedShowtime.time} &bull; {selectedShowtime.hall}
              </p>
            </div>
          </div>

          <div className="selected-seats-badges-row">
            <span className="badge-label">Selected Seats</span>
            <div className="seats-badges-container">
              {selectedSeats.length === 0 ? (
                <span className="no-seats-selected">Please choose seats on the layout above to check out.</span>
              ) : (
                selectedSeats.map(seat => (
                  <span key={seat} className="seat-badge">
                    <Armchair size={12} />
                    {seat} ({getSeatCategory(seat.charAt(0))})
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="price-calculation-card">
          <div className="calculation-details">
            {standardSelected.length > 0 && (
              <div className="calc-row">
                <span>Standard Seat (x{standardSelected.length})</span>
                <span>₹{(standardSelected.length * standardPrice).toFixed(2)}</span>
              </div>
            )}
            {vipSelected.length > 0 && (
              <div className="calc-row">
                <span>VIP Premium Seat (x{vipSelected.length})</span>
                <span>₹{(vipSelected.length * vipPrice).toFixed(2)}</span>
              </div>
            )}
            {selectedSeats.length > 0 && (
              <div className="calc-row">
                <span>Booking Services Fee</span>
                <span>₹{bookingFee.toFixed(2)}</span>
              </div>
            )}
            <div className="calc-row total">
              <span>Total Price</span>
              <span className="total-price-text">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button 
            className="pay-btn" 
            disabled={selectedSeats.length === 0}
            onClick={handleCheckout}
          >
            <ShieldCheck size={18} /> Confirm & Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
