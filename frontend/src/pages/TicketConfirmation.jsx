import React, { useEffect } from 'react';
import { useBooking } from '../context/BookingContext.jsx';
import { Check, Calendar, Film, ArrowRight, History } from 'lucide-react';
import confetti from 'canvas-confetti';
import '../styles/ticket.css';

const TicketConfirmation = () => {
  const { lastBooking, goHome, goHistory } = useBooking();

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
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

  useEffect(() => {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!lastBooking) {
    return (
      <div className="no-showtimes">
        <h3>No active booking details</h3>
        <button className="back-btn" onClick={goHome}>Return Home</button>
      </div>
    );
  }

  const barcodeBars = [
    'thick', 'thin', 'space', 'med', 'thick', 'thin', 'space', 'med', 'thin', 
    'thick', 'space', 'thin', 'thick', 'med', 'space', 'thick', 'thin', 'med', 
    'thin', 'space', 'thick', 'space', 'thin', 'med', 'thick', 'space', 'med', 
    'thin', 'thick', 'space', 'thin', 'med', 'thick', 'thin', 'space', 'thick'
  ];

  return (
    <div className="ticket-page">
      <div className="success-header animate-fade-in">
        <div className="success-icon-badge">
          <Check size={28} strokeWidth={3} />
        </div>
        <h2>Booking Confirmed!</h2>
        <p>Your digital tickets are ready. Show this screen at the entry gate.</p>
      </div>

      <div className="ticket-wrapper animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="ticket-card">
          <div className="ticket-hologram"></div>
          
          <div className="ticket-body">
            <div className="ticket-header-row">
              <div className="ticket-brand">
                <span className="ticket-logo">CINEPASS ENTRY</span>
                <span className="ticket-booking-ref">Ref: {lastBooking.id}</span>
              </div>
              <span className="ticket-status-badge">Confirmed</span>
            </div>

            <h2 className="ticket-movie-title">{lastBooking.movieTitle}</h2>

            <div className="ticket-details-grid">
              <div className="detail-block">
                <span className="detail-lbl">Showtime Date</span>
                <span className="detail-val">{formatDateForDisplay(lastBooking.date)}</span>
              </div>
              <div className="detail-block">
                <span className="detail-lbl">Time / Hall</span>
                <span className="detail-val">{lastBooking.time} &bull; {lastBooking.hall}</span>
              </div>
              <div className="detail-block">
                <span className="detail-lbl">Selected Seats</span>
                <span className="detail-val">{lastBooking.seats.join(', ')}</span>
              </div>
              <div className="detail-block">
                <span className="detail-lbl">Amount Paid</span>
                <span className="detail-val">₹{lastBooking.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="ticket-divider">
            <div className="divider-line"></div>
          </div>

          <div className="ticket-barcode-section">
            <div className="barcode-container">
              <div className="simulated-barcode">
                {barcodeBars.map((bar, idx) => (
                  <div 
                    key={idx} 
                    className={`barcode-bar ${bar}`}
                  ></div>
                ))}
              </div>
            </div>
            <span className="barcode-text">{lastBooking.id}</span>
          </div>
        </div>
      </div>

      <div className="ticket-actions animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <button className="ticket-action-btn primary" onClick={goHome}>
          Book Another Movie <ArrowRight size={16} />
        </button>
        <button className="ticket-action-btn secondary" onClick={goHistory}>
          <History size={16} /> Booking History
        </button>
      </div>
    </div>
  );
};

export default TicketConfirmation;
