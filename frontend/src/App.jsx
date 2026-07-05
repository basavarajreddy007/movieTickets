import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import SeatSelection from './pages/SeatSelection.jsx';
import TicketConfirmation from './pages/TicketConfirmation.jsx';
import BookingHistory from './pages/BookingHistory.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { Film, History, User, LockKeyhole, Search } from 'lucide-react';

const AppContent = () => {
  const { 
    currentUser, 
    currentPage, 
    setCurrentPage, 
    goHome, 
    goHistory, 
    logout,
    searchQuery,
    setSearchQuery
  } = useBooking();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (currentPage !== 'home' && val.trim() !== '') {
      setCurrentPage('home');
    }
  };

  if (!currentUser) {
    return (
      <div className="app-container">
        <header className="app-header">
          <nav className="navbar">
            <div className="logo-link">
              <Film className="logo-icon" size={28} />
              <span className="logo-text">CINEPASS</span>
            </div>
          </nav>
        </header>
        <main className="main-content">
          <Login />
        </main>
        <footer className="app-footer">
          <div className="footer-bottom">
            <p>&copy; 2026 CinePass Entertainment. All rights reserved.</p>
            <p>Created by Antigravity Duo</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="navbar">
          <a href="#" className="logo-link" onClick={(e) => { e.preventDefault(); goHome(); }}>
            <Film className="logo-icon" size={28} />
            <span className="logo-text">CINEPASS</span>
          </a>
          
          <div className="navbar-search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              
              className="navbar-search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="nav-links">
            <a 
              href="#" 
              className={`nav-item ${currentPage === 'home' || currentPage === 'details' || currentPage === 'seats' || currentPage === 'confirmation' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); goHome(); }}
            >
              <Film size={18} />
              <span>Movies</span>
            </a>
            <a 
              href="#" 
              className={`nav-item ${currentPage === 'history' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); goHistory(); }}
            >
              <History size={18} />
              <span>My Tickets</span>
            </a>
            {currentUser.role === 'admin' && (
              <a 
                href="#" 
                className={`nav-item ${currentPage === 'admin' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setCurrentPage('admin'); }}
              >
                <LockKeyhole size={18} />
                <span>Admin Panel</span>
              </a>
            )}
          </div>

          <div className="user-profile">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop" 
              alt="User profile avatar" 
              className="user-avatar" 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="user-name">{currentUser.name}</span>
              <button 
                onClick={logout} 
                style={{ fontSize: '0.75rem', color: 'var(--color-danger)', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="main-content">
        {currentPage === 'home' && <Home />}
        {currentPage === 'details' && <MovieDetails />}
        {currentPage === 'seats' && <SeatSelection />}
        {currentPage === 'confirmation' && <TicketConfirmation />}
        {currentPage === 'history' && <BookingHistory />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Film size={22} className="logo-icon" />
              <span>CINEPASS</span>
            </div>
            <p className="footer-tagline">Next-generation cinematic experiences. Immersive, beautiful, instant.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Explore</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); goHome(); }}>Now Playing</a>
              <a href="#" onClick={(e) => { e.preventDefault(); goHome(); }}>Coming Soon</a>
              <a href="#">IMAX Experience</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Terms of Use</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 CinePass Entertainment. All rights reserved.</p>
          <p>Created by Antigravity Duo</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}

export default App;
