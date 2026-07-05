import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

const INITIAL_USERS = [
  {
    id: "u-1",
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "System Administrator"
  },
  {
    id: "u-2",
    username: "user",
    password: "user123",
    role: "user",
    name: "Val Vex"
  },
  {
    id: "u-3240",
    username: "Basavarajreddy000@gmail.com",
    password: "123456",
    role: "admin",
    name: "basavaraj"
  }
];

const INITIAL_MOVIES = [
  {
    id: "m-5167",
    title: "Spider-Man: Brand New Day",
    description: "Four years have passed since the events of No Way Home, and Peter is now an adult living entirely alone, having voluntarily erased himself from the lives and memories of those he loves. Crime-fighting in a New York that no longer knows his name, he's devoted himself entirely to protecting his city - a full-time Spider-Man - but as the demands on him intensify, the pressure sparks a surprising physical evolution that threatens his existence, even as a strange new pattern of crimes gives rise to one of the most powerful threats he has ever faced.",
    genres: ["Sci-Fi", "Action"],
    rating: "5.0",
    duration: "120",
    releaseDate: "30 july 2026",
    poster: "https://upload.wikimedia.org/wikipedia/en/9/9a/Spider-Man_Brand_New_Day_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    director: "Destin Daniel Cretton",
    cast: [
      {
        name: "Peter Parker",
        role: "Spider-Man",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
      }
    ],
    isFeatured: true
  }
];

const INITIAL_SHOWTIMES = [
  {
    id: "st-5031",
    movieId: "m-5167",
    time: "125",
    date: "2026-07-06",
    hall: "IMAX Screen 1",
    price: 200,
    vipPrice: 450,
    bookedSeats: ["B8", "B7"]
  }
];

const initLocalStorage = () => {
  if (!localStorage.getItem('cinepass_users')) {
    localStorage.setItem('cinepass_users', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('cinepass_movies')) {
    localStorage.setItem('cinepass_movies', JSON.stringify(INITIAL_MOVIES));
  }
  if (!localStorage.getItem('cinepass_showtimes')) {
    localStorage.setItem('cinepass_showtimes', JSON.stringify(INITIAL_SHOWTIMES));
  }
  if (!localStorage.getItem('cinepass_bookings')) {
    localStorage.setItem('cinepass_bookings', JSON.stringify([]));
  }
};

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
      localStorage.setItem('cinepass_movies', JSON.stringify(data));
    } catch (err) {
      console.warn('API fetchMovies failed, using localStorage fallback:', err);
      initLocalStorage();
      const localMovies = JSON.parse(localStorage.getItem('cinepass_movies') || '[]');
      setMovies(localMovies);
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
      localStorage.setItem('cinepass_bookings', JSON.stringify(data));
    } catch (err) {
      console.warn('API fetchBookingHistory failed, using localStorage fallback:', err);
      initLocalStorage();
      const localBookings = JSON.parse(localStorage.getItem('cinepass_bookings') || '[]');
      const sortedData = localBookings.slice().reverse();
      if (currentUser.role === 'admin') {
        setBookingHistory(sortedData);
      } else {
        setBookingHistory(sortedData.filter(b => b.userId === currentUser.id));
      }
    }
  };

  const fetchShowtimes = async (movieId) => {
    try {
      const response = await fetch(`${API_BASE}/api/movies/${movieId}/showtimes`);
      if (!response.ok) throw new Error('Failed to load showtimes');
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('API fetchShowtimes failed, using localStorage fallback:', err);
      initLocalStorage();
      const localShowtimes = JSON.parse(localStorage.getItem('cinepass_showtimes') || '[]');
      return localShowtimes.filter(st => st.movieId === movieId);
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
      console.warn('API login failed, using localStorage fallback:', err);
      initLocalStorage();
      const localUsers = JSON.parse(localStorage.getItem('cinepass_users') || '[]');
      const user = localUsers.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('cinepass_user', JSON.stringify(user));
        setCurrentPage('home');
        return true;
      } else {
        setError('Invalid username or password');
        return false;
      }
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
      console.warn('API register failed, using localStorage fallback:', err);
      initLocalStorage();
      const localUsers = JSON.parse(localStorage.getItem('cinepass_users') || '[]');
      const exists = localUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        setError('Username already exists');
        return false;
      }
      const newUser = {
        id: 'u-' + Math.floor(Math.random() * 10000),
        username,
        password,
        role: 'user',
        name
      };
      localUsers.push(newUser);
      localStorage.setItem('cinepass_users', JSON.stringify(localUsers));
      return true;
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
      console.warn('API addMovie failed, using localStorage fallback:', err);
      initLocalStorage();
      const localMovies = JSON.parse(localStorage.getItem('cinepass_movies') || '[]');
      const newMovie = {
        ...movieData,
        id: 'm-' + Math.floor(Math.random() * 10000)
      };
      localMovies.push(newMovie);
      localStorage.setItem('cinepass_movies', JSON.stringify(localMovies));
      setMovies(localMovies);
      return true;
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
      console.warn('API addShowtime failed, using localStorage fallback:', err);
      initLocalStorage();
      const localShowtimes = JSON.parse(localStorage.getItem('cinepass_showtimes') || '[]');
      const newShowtime = {
        ...showtimeData,
        id: 'st-' + Math.floor(Math.random() * 10000),
        bookedSeats: showtimeData.bookedSeats || []
      };
      localShowtimes.push(newShowtime);
      localStorage.setItem('cinepass_showtimes', JSON.stringify(localShowtimes));
      return true;
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
      console.warn('API confirmBooking failed, using localStorage fallback:', err);
      initLocalStorage();
      
      const localShowtimes = JSON.parse(localStorage.getItem('cinepass_showtimes') || '[]');
      const stIdx = localShowtimes.findIndex(st => st.id === selectedShowtime.id);
      if (stIdx !== -1) {
        localShowtimes[stIdx].bookedSeats = [...(localShowtimes[stIdx].bookedSeats || []), ...selectedSeats];
        localStorage.setItem('cinepass_showtimes', JSON.stringify(localShowtimes));
      }
      
      const newBooking = {
        id: 'BK-' + Math.floor(Math.random() * 900000 + 100000),
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        showtimeId: selectedShowtime.id,
        userId: currentUser.id,
        userName: currentUser.name,
        time: selectedShowtime.time,
        date: selectedShowtime.date,
        hall: selectedShowtime.hall,
        seats: selectedSeats,
        totalPrice,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      const localBookings = JSON.parse(localStorage.getItem('cinepass_bookings') || '[]');
      localBookings.push(newBooking);
      localStorage.setItem('cinepass_bookings', JSON.stringify(localBookings));
      
      setLastBooking(newBooking);
      
      const localMovies = JSON.parse(localStorage.getItem('cinepass_movies') || '[]');
      setMovies(localMovies);
      
      const sortedData = localBookings.slice().reverse();
      if (currentUser.role === 'admin') {
        setBookingHistory(sortedData);
      } else {
        setBookingHistory(sortedData.filter(b => b.userId === currentUser.id));
      }
      
      setCurrentPage('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
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
        goHistory,
        fetchShowtimes
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
