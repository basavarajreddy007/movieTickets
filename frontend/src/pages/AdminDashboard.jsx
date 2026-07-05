import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext.jsx';
import { Film, Calendar, ListOrdered, DollarSign, CheckCircle2, Plus, Trash2, Heart, Armchair, HelpCircle } from 'lucide-react';
import '../styles/admin.css';

const AdminDashboard = () => {
  const { movies, addMovie, addShowtime, bookingHistory } = useBooking();
  const [activeTab, setActiveTab] = useState('add_movie');

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

  const getLocalDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayStr = getLocalDateString(new Date());

  const [movieTitle, setMovieTitle] = useState('');
  const [movieDesc, setMovieDesc] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [movieDuration, setMovieDuration] = useState('');
  const [movieRelease, setMovieRelease] = useState('');
  const [moviePoster, setMoviePoster] = useState('');
  const [movieDirector, setMovieDirector] = useState('');
  const [castMembers, setCastMembers] = useState([{ name: '', role: '' }]);
  const [movieFeatured, setMovieFeatured] = useState(false);

  const [showtimeMovieId, setShowtimeMovieId] = useState('');
  const [showtimeTime, setShowtimeTime] = useState('');
  const [showtimeDate, setShowtimeDate] = useState(todayStr);
  const [showtimeHall, setShowtimeHall] = useState('IMAX Screen 1');
  const [showtimePrice, setShowtimePrice] = useState('250.00');
  const [showtimeVipPrice, setShowtimeVipPrice] = useState('500.00');

  const genrePresets = ['Sci-Fi', 'Action', 'Adventure', 'Thriller', 'Drama', 'Fantasy', 'Cyberpunk', 'Comedy', 'Horror'];
  
  const hallPresets = [
    { title: 'IMAX Screen 1', desc: 'Premium format, laser projection' },
    { title: 'Dolby Atmos Hall 2', desc: 'Immersive sound & premium seats' },
    { title: 'Standard Screen 3', desc: 'Comfortable standard experience' }
  ];

  const standardPricePresets = ['150.00', '200.00', '250.00', '350.00'];
  const vipPricePresets = ['350.00', '450.00', '550.00', '650.00'];

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleCastChange = (index, field, value) => {
    setCastMembers(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addCastRow = () => {
    setCastMembers(prev => [...prev, { name: '', role: '' }]);
  };

  const removeCastRow = (index) => {
    if (castMembers.length === 1) {
      setCastMembers([{ name: '', role: '' }]);
      return;
    }
    setCastMembers(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    if (!movieTitle || !movieDesc || selectedGenres.length === 0 || !movieDuration || !movieRelease || !moviePoster || !movieDirector) {
      alert('Please fill out all movie fields and select at least one genre.');
      return;
    }

    const cleanedCast = castMembers
      .filter(member => member.name.trim() !== '')
      .map(member => ({
        name: member.name.trim(),
        role: member.role.trim() || 'Cast member',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'
      }));

    const success = await addMovie({
      title: movieTitle,
      description: movieDesc,
      genres: selectedGenres,
      duration: movieDuration,
      releaseDate: movieRelease,
      poster: moviePoster,
      director: movieDirector,
      cast: cleanedCast,
      isFeatured: movieFeatured
    });

    if (success) {
      alert('Movie profile successfully saved!');
      setMovieTitle('');
      setMovieDesc('');
      setSelectedGenres([]);
      setMovieDuration('');
      setMovieRelease('');
      setMoviePoster('');
      setMovieDirector('');
      setCastMembers([{ name: '', role: '' }]);
      setMovieFeatured(false);
    }
  };

  const handleShowtimeSubmit = async (e) => {
    e.preventDefault();
    if (!showtimeMovieId || !showtimeTime || !showtimeDate || !showtimeHall || !showtimePrice || !showtimeVipPrice) {
      alert('Please fill out all fields.');
      return;
    }

    const success = await addShowtime({
      movieId: showtimeMovieId,
      time: showtimeTime,
      date: showtimeDate,
      hall: showtimeHall,
      price: parseFloat(showtimePrice),
      vipPrice: parseFloat(showtimeVipPrice)
    });

    if (success) {
      alert('Showtime successfully scheduled!');
      setShowtimeTime('');
    }
  };

  const selectedMovieData = movies.find(m => m.id === showtimeMovieId);

  return (
    <div className="admin-page">
      <div className="admin-header-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'add_movie' ? 'active' : ''}`}
          onClick={() => setActiveTab('add_movie')}
        >
          <Film size={18} /> Create Movie
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'add_showtime' ? 'active' : ''}`}
          onClick={() => setActiveTab('add_showtime')}
        >
          <Calendar size={18} /> Schedule Showtime
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          <ListOrdered size={18} /> Global Sales Report
        </button>
      </div>

      {activeTab === 'add_movie' && (
        <div className="admin-panel-card glass-panel">
          <h2 className="admin-panel-title">
            <Film size={22} className="logo-icon" /> Add Movie Profile
          </h2>
          
          <form onSubmit={handleMovieSubmit} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-input-group">
                <label className="admin-label">Movie Title</label>
                <input
                  type="text"
                  placeholder="e.g. Interstellar"
                  className="admin-input"
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Director</label>
                <input
                  type="text"
                  placeholder="e.g. Christopher Nolan"
                  className="admin-input"
                  value={movieDirector}
                  onChange={(e) => setMovieDirector(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label className="admin-label">Synopsis</label>
              <textarea
                placeholder="Enter full movie synopsis details..."
                className="admin-input admin-textarea"
                value={movieDesc}
                onChange={(e) => setMovieDesc(e.target.value)}
              />
            </div>

            <div className="admin-input-group">
              <label className="admin-label">Select Genres</label>
              <div className="admin-genre-pills">
                {genrePresets.map(genre => {
                  const isActive = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      className={`admin-genre-pill ${isActive ? 'active' : ''}`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-input-group">
                <label className="admin-label">Duration (e.g. 148 mins)</label>
                <input
                  type="text"
                  placeholder="e.g. 142 mins"
                  className="admin-input"
                  value={movieDuration}
                  onChange={(e) => setMovieDuration(e.target.value)}
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Release Date</label>
                <input
                  type="text"
                  placeholder="e.g. July 12, 2026"
                  className="admin-input"
                  value={movieRelease}
                  onChange={(e) => setMovieRelease(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-input-group admin-image-preview-group">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                <label className="admin-label">Poster URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... (vertical link)"
                  className="admin-input"
                  value={moviePoster}
                  onChange={(e) => setMoviePoster(e.target.value)}
                />
              </div>
              <div className="admin-preview-img-container">
                {moviePoster ? (
                  <img src={moviePoster} alt="Poster preview" className="admin-preview-img" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="admin-preview-placeholder">Poster Preview</div>
                )}
              </div>
            </div>

            <div className="admin-input-group">
              <label className="admin-label">Starring Cast</label>
              <div className="admin-cast-builder">
                {castMembers.map((member, index) => (
                  <div key={index} className="admin-cast-builder-row">
                    <input
                      type="text"
                      placeholder="Actor Name (e.g. Matthew McConaughey)"
                      className="admin-input"
                      value={member.name}
                      onChange={(e) => handleCastChange(index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Role Name (e.g. Cooper)"
                      className="admin-input"
                      value={member.role}
                      onChange={(e) => handleCastChange(index, 'role', e.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-cast-del-btn"
                      onClick={() => removeCastRow(index)}
                      title="Remove actor"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="admin-cast-add-btn"
                  onClick={addCastRow}
                >
                  <Plus size={16} /> Add Actor Row
                </button>
              </div>
            </div>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                className="admin-checkbox"
                checked={movieFeatured}
                onChange={(e) => setMovieFeatured(e.target.checked)}
              />
              <span>Set as Featured Blockbuster (Hero Banner)</span>
            </label>

            <button type="submit" className="admin-submit-btn">
              <CheckCircle2 size={18} /> Save Movie Profile
            </button>
          </form>
        </div>
      )}

      {activeTab === 'add_showtime' && (
        <div className="admin-panel-card glass-panel">
          <h2 className="admin-panel-title">
            <Calendar size={22} className="logo-icon" /> Schedule Movie Showtime
          </h2>

          <form onSubmit={handleShowtimeSubmit} className="admin-form">
            <div className="admin-form-row">
              <div className="admin-input-group">
                <label className="admin-label">Select Movie</label>
                <select
                  className="admin-input admin-select"
                  value={showtimeMovieId}
                  onChange={(e) => setShowtimeMovieId(e.target.value)}
                >
                  <option value="">-- Choose Movie --</option>
                  {movies.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Showtime Date</label>
                <input
                  type="date"
                  className="admin-input"
                  value={showtimeDate}
                  onChange={(e) => setShowtimeDate(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-row">
              {showtimeMovieId && selectedMovieData && (
                <div className="admin-input-group admin-image-preview-group">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span className="admin-label">Selected Movie Details</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', fontWeight: '600' }}>{selectedMovieData.title}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{selectedMovieData.duration} &bull; {selectedMovieData.genres.join('/')}</span>
                  </div>
                  <div className="admin-preview-img-container" style={{ width: '70px', height: '90px' }}>
                    <img src={selectedMovieData.poster} alt="Poster" className="admin-preview-img" />
                  </div>
                </div>
              )}

              <div className="admin-input-group">
                <label className="admin-label">Time (Format HH:MM)</label>
                <input
                  type="text"
                  placeholder="e.g. 18:30"
                  className="admin-input"
                  value={showtimeTime}
                  onChange={(e) => setShowtimeTime(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label className="admin-label">Select Cinema Screen</label>
              <div className="admin-hall-cards-grid">
                {hallPresets.map(hall => {
                  const isSelected = showtimeHall === hall.title;
                  return (
                    <div
                      key={hall.title}
                      className={`admin-hall-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setShowtimeHall(hall.title)}
                    >
                      <span className="admin-hall-card-title">{hall.title}</span>
                      <span className="admin-hall-card-desc">{hall.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-input-group">
                <label className="admin-label">Standard Ticket Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  className="admin-input"
                  value={showtimePrice}
                  onChange={(e) => setShowtimePrice(e.target.value)}
                />
                <div className="admin-price-presets">
                  {standardPricePresets.map(price => (
                    <button
                      key={price}
                      type="button"
                      className="preset-price-btn"
                      onClick={() => setShowtimePrice(price)}
                    >
                      ₹{price}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-label">VIP Premium Ticket Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  className="admin-input"
                  value={showtimeVipPrice}
                  onChange={(e) => setShowtimeVipPrice(e.target.value)}
                />
                <div className="admin-price-presets">
                  {vipPricePresets.map(price => (
                    <button
                      key={price}
                      type="button"
                      className="preset-price-btn"
                      onClick={() => setShowtimeVipPrice(price)}
                    >
                      ₹{price}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="admin-submit-btn">
              <CheckCircle2 size={18} /> Schedule Showtime
            </button>
          </form>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="admin-panel-card glass-panel">
          <h2 className="admin-panel-title">
            <DollarSign size={22} className="logo-icon" /> Global Booking & Sales Report
          </h2>

          {bookingHistory.length === 0 ? (
            <div className="empty-state">
              <h3>No bookings recorded</h3>
              <p>Tickets booked by users will appear here in real-time.</p>
            </div>
          ) : (
            <div className="sales-report-table-wrapper">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Movie</th>
                    <th>User Account</th>
                    <th>Date / Time</th>
                    <th>Hall</th>
                    <th>Seats Booked</th>
                    <th>Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingHistory.map(b => (
                    <tr key={b.id}>
                      <td className="sales-ref">{b.id}</td>
                      <td>{b.movieTitle}</td>
                      <td className="sales-user">{b.userName}</td>
                      <td>{formatDateForDisplay(b.date)} &bull; {b.time}</td>
                      <td>{b.hall}</td>
                      <td>
                        <div className="sales-seats">
                          {b.seats.map(s => (
                            <span key={s} className="sales-seat-tag">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="sales-amount">₹{b.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
