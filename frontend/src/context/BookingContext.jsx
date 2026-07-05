import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cinepass_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lastBooking, setLastBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const API_BASE = ''; 

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/movies`);
      if (!response.ok) throw new Error('Failed to load movies');
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingHistory = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`${API_BASE}/api/bookings/history`);
      if (!response.ok) throw new Error('Failed to load booking history');
      const data = await response.json();
      
      const sortedData = data.reverse();
      if (currentUser.role === 'admin') {
        setBookingHistory(sortedData);
      } else {
        setBookingHistory(sortedData.filter(b => b.userId === currentUser.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchBookingHistory();
  }, [currentUser]);

  const login = async (username, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Login failed');
      }

      const userData = await response.json();
      setCurrentUser(userData);
      localStorage.setItem('cinepass_user', JSON.stringify(userData));
      setCurrentPage('home');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cinepass_user');
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setBookingHistory([]);
    setCurrentPage('home');
  };

  const register = async (username, password, name) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Registration failed');
      }

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const addMovie = async (movieData) => {
    try {
      const response = await fetch(`${API_BASE}/api/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to add movie');
      }

      await fetchMovies();
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  const addShowtime = async (showtimeData) => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings/showtime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(showtimeData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to add showtime');
      }

      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  const selectMovie = (movie) => {
    setSelectedMovie(movie);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    setCurrentPage('seats');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSeatSelection = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const confirmBooking = async (totalPrice) => {
    if (!selectedMovie || !selectedShowtime || selectedSeats.length === 0 || !currentUser) {
      setError('Invalid booking state');
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/bookings/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: selectedMovie.id,
          movieTitle: selectedMovie.title,
          showtimeId: selectedShowtime.id,
          seats: selectedSeats,
          totalPrice,
          userId: currentUser.id,
          userName: currentUser.name
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to process booking');
      }

      const booking = await response.json();
      setLastBooking(booking);
      await fetchMovies();
      await fetchBookingHistory();
      setCurrentPage('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } catch (err) {
      alert(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHistory = () => {
    fetchBookingHistory();
    setCurrentPage('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BookingContext.Provider
      value={{
        movies,
        loading,
        error,
        currentPage,
        setCurrentPage,
        currentUser,
        login,
        logout,
        register,
        addMovie,
        addShowtime,
        selectedMovie,
        selectedShowtime,
        selectedSeats,
        lastBooking,
        bookingHistory,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        selectMovie,
        selectShowtime,
        toggleSeatSelection,
        confirmBooking,
        goHome,
        goHistory
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
