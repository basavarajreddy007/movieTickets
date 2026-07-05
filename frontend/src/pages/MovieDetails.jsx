import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext.jsx';
import { ArrowLeft, Clock, Calendar, Star, Armchair } from 'lucide-react';
import '../styles/details.css';

const MovieDetails = () => {
  const { selectedMovie, selectShowtime, goHome, fetchShowtimes } = useBooking();
  const [showtimes, setShowtimes] = useState([]);
  
  const getLocalDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayStr = getLocalDateString(new Date());

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);

  const TOTAL_SEATS = 72;

  useEffect(() => {
    if (!selectedMovie) return;
    
    const fetchMovieShowtimes = async () => {
      setLoadingShowtimes(true);
      try {
        const data = await fetchShowtimes(selectedMovie.id);
        setShowtimes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingShowtimes(false);
      }
    };

    fetchMovieShowtimes();
  }, [selectedMovie, fetchShowtimes]);

  if (!selectedMovie) {
    return (
      <div className="no-showtimes">
        <h3>No Movie Selected</h3>
        <button className="back-btn" onClick={goHome}>Return Home</button>
      </div>
    );
  }

  const isDateMatch = (stDate, selDate) => {
    if (stDate === selDate) return true;
    const today = new Date();
    const todayStr = getLocalDateString(today);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = getLocalDateString(tomorrow);
    
    if (stDate === 'Today' && selDate === todayStr) return true;
    if (stDate === 'Tomorrow' && selDate === tomorrowStr) return true;
    if (selDate === 'Today' && stDate === todayStr) return true;
    if (selDate === 'Tomorrow' && stDate === tomorrowStr) return true;
    return false;
  };

  const filteredShowtimes = showtimes.filter(st => isDateMatch(st.date, selectedDate));

  const tomorrowStr = getLocalDateString(new Date(new Date().setDate(new Date().getDate() + 1)));

  

  const formatDateLabel = (dateStr) => {
    if (dateStr === 'Today') return 'Today';
    if (dateStr === 'Tomorrow') return 'Tomorrow';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  

  const formatDayName = (dateStr) => {
    if (dateStr === todayStr || dateStr === 'Today') return 'Today';
    if (dateStr === tomorrowStr || dateStr === 'Tomorrow') return 'Tomorrow';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { weekday: 'long' });
      }
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const uniqueShowtimeDates = Array.from(new Set(showtimes.map(st => st.date)));
  const normalizedDatesSet = new Set([todayStr, tomorrowStr]);
  uniqueShowtimeDates.forEach(d => {
    if (d === 'Today') normalizedDatesSet.add(todayStr);
    else if (d === 'Tomorrow') normalizedDatesSet.add(tomorrowStr);
    else normalizedDatesSet.add(d);
  });
  
  const sortedDates = Array.from(normalizedDatesSet).sort();
  
  const dateOptions = sortedDates.map(dateVal => ({
    dayName: formatDayName(dateVal),
    dateLabel: formatDateLabel(dateVal),
    id: dateVal
  }));

  return (
    <div className="details-page">
      <div className="back-btn-container">
        <button className="back-btn" onClick={goHome}>
          <ArrowLeft size={16} /> Back to Movies
        </button>
      </div>

      <div className="movie-header-panel">
        <img 
          src={selectedMovie.poster} 
          alt={selectedMovie.title} 
          className="movie-header-backdrop" 
          style={{ filter: 'blur(25px)', opacity: '0.15' }}
        />
        
        <div className="movie-poster-box">
          <img 
            src={selectedMovie.poster} 
            alt={selectedMovie.title} 
            className="movie-poster-img" 
          />
        </div>

        <div className="movie-details-content">
          <div className="movie-title-box">
            <h1 className="hero-title">{selectedMovie.title}</h1>
            <div className="movie-meta-row">
              <span className="movie-rating-badge">
                <Star size={14} fill="currentColor" /> {selectedMovie.rating}
              </span>
              <span>&bull;</span>
              <span><Clock size={14} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> {selectedMovie.duration}</span>
              <span>&bull;</span>
              <span>Released: {selectedMovie.releaseDate}</span>
            </div>
          </div>

          <p className="movie-synopsis">{selectedMovie.description}</p>
          
          <div className="movie-credits">
            <p><strong>Director:</strong> {selectedMovie.director}</p>
            <p><strong>Genres:</strong> {selectedMovie.genres.join(', ')}</p>
          </div>

          <div className="cast-section">
            <h3 className="cast-title">Starring Cast</h3>
            <div className="cast-grid">
              {selectedMovie.cast && selectedMovie.cast.map((actor, idx) => (
                <div key={idx} className="cast-member">
                  <span className="cast-name">{actor.name}</span>
                  <span className="cast-role">{actor.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="showtimes-panel">
        <div className="showtimes-header">
          <h2 className="section-title">Select Date & Showtime</h2>
          
          <div className="date-tabs">
            {dateOptions.map(option => (
              <button
                key={option.id}
                className={`date-tab ${selectedDate === option.id ? 'active' : ''}`}
                onClick={() => setSelectedDate(option.id)}
              >
                <span className="date-tab-day">{option.dayName}</span>
                <span className="date-tab-date">{option.dateLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {loadingShowtimes ? (
          <div className="no-showtimes">
            <p>Scanning cinema halls for tickets...</p>
          </div>
        ) : filteredShowtimes.length === 0 ? (
          <div className="no-showtimes">
            <p>No showtimes available for {selectedDate}. Try selecting another date above.</p>
          </div>
        ) : (
          <div className="showtimes-grid">
            {filteredShowtimes.map(st => {
              const bookedCount = st.bookedSeats ? st.bookedSeats.length : 0;
              const remaining = TOTAL_SEATS - bookedCount;
              const isLow = remaining < 10;
              
              return (
                <div 
                  key={st.id} 
                  className="showtime-card"
                  onClick={() => selectShowtime(st)}
                >
                  <div className="showtime-card-header">
                    <span className="showtime-hall">{st.hall}</span>
                    <span className="showtime-price">From ₹{st.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="showtime-time">{st.time}</div>
                  
                  <div className={`showtime-seats-avail ${isLow ? 'low-avail' : ''}`}>
                    <span className="avail-dot"></span>
                    <span>{remaining} seats available</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
