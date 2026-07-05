import React from 'react';
import { useBooking } from '../context/BookingContext.jsx';
import { Ticket, Film, Calendar, Armchair } from 'lucide-react';
import '../styles/history.css';

const BookingHistory = () => {
  const { bookingHistory, goHome } = useBooking();

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

  const barcodeBars = [
    'thick', 'thin', 'space', 'med', 'thin', 'space', 'thick', 'thin', 'med', 
    'thin', 'space', 'thick', 'space', 'thin', 'thick', 'space', 'med', 'thin'
  ];

  return (
    <div className="history-page">
      <h2 className="section-title">My Tickets History</h2>

      {bookingHistory.length === 0 ? (
        <div className="empty-state">
          <Ticket size={48} className="empty-icon" />
          <h3>No bookings found</h3>
          <p>You haven't booked any movie tickets yet. Start browsing now!</p>
          <button className="hero-btn" style={{ margin: '1rem auto 0 auto' }} onClick={goHome}>
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {bookingHistory.map((booking) => (
            <div key={booking.id} className="history-ticket-card glass-panel">
              <div className="history-ticket-left">
                <div className="history-ticket-header">
                  <h3 className="history-ticket-title">{booking.movieTitle}</h3>
                  <span className="history-ticket-ref">{booking.id}</span>
                </div>

                <div className="history-ticket-details">
                  <div className="history-detail">
                    <span className="history-detail-lbl">Date & Time</span>
                    <span className="history-detail-val">{formatDateForDisplay(booking.date)} &bull; {booking.time}</span>
                  </div>

                  <div className="history-detail">
                    <span className="history-detail-lbl">Cinema Hall</span>
                    <span className="history-detail-val">{booking.hall}</span>
                  </div>

                  <div className="history-detail">
                    <span className="history-detail-lbl">Seats Booked</span>
                    <span className="history-detail-val">{booking.seats.join(', ')}</span>
                  </div>

                  <div className="history-detail">
                    <span className="history-detail-lbl">Total Paid</span>
                    <span className="history-detail-val">₹{booking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="history-ticket-right">
                <div className="history-barcode-sim">
                  {barcodeBars.map((bar, idx) => (
                    <div 
                      key={idx} 
                      className={`history-barcode-bar ${bar}`}
                    ></div>
                  ))}
                </div>
                <span className="history-barcode-text">{booking.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
