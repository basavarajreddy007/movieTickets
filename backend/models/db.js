import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../db.json');

async function getDb() {
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading db.json, returning empty template:', error);
    return { users: [], movies: [], showtimes: [], bookings: [] };
  }
}

async function saveDb(data) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing db.json:', error);
    return false;
  }
}

export const db = {
  getUsers: async () => {
    const data = await getDb();
    return data.users || [];
  },

  getUserByUsername: async (username) => {
    const data = await getDb();
    return (data.users || []).find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  createUser: async (userData) => {
    const data = await getDb();
    data.users = data.users || [];
    if (data.users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
      throw new Error('Username is already taken');
    }
    const newUser = {
      id: `u-${Math.floor(1000 + Math.random() * 9000)}`,
      username: userData.username,
      password: userData.password,
      role: userData.role || 'user',
      name: userData.name
    };
    data.users.push(newUser);
    const success = await saveDb(data);
    if (!success) {
      throw new Error('Failed to register user to database');
    }
    return { id: newUser.id, username: newUser.username, role: newUser.role, name: newUser.name };
  },

  getMovies: async () => {
    const data = await getDb();
    return data.movies || [];
  },

  getMovieById: async (id) => {
    const data = await getDb();
    return (data.movies || []).find(m => m.id === id);
  },

  createMovie: async (movieData) => {
    const data = await getDb();
    data.movies = data.movies || [];
    const newMovie = {
      id: `m-${Math.floor(1000 + Math.random() * 9000)}`,
      title: movieData.title,
      description: movieData.description,
      genres: movieData.genres,
      rating: movieData.rating || '5.0',
      duration: movieData.duration,
      releaseDate: movieData.releaseDate,
      poster: movieData.poster,
      director: movieData.director,
      cast: movieData.cast || [],
      isFeatured: movieData.isFeatured || false
    };
    data.movies.push(newMovie);
    const success = await saveDb(data);
    if (!success) {
      throw new Error('Failed to create movie in database');
    }
    return newMovie;
  },

  getShowtimes: async (movieId) => {
    const data = await getDb();
    const showtimes = data.showtimes || [];
    if (movieId) {
      return showtimes.filter(s => s.movieId === movieId);
    }
    return showtimes;
  },

  getShowtimeById: async (id) => {
    const data = await getDb();
    return (data.showtimes || []).find(s => s.id === id);
  },

  createShowtime: async (showtimeData) => {
    const data = await getDb();
    data.showtimes = data.showtimes || [];
    const newShowtime = {
      id: `st-${Math.floor(1000 + Math.random() * 9000)}`,
      movieId: showtimeData.movieId,
      time: showtimeData.time,
      date: showtimeData.date,
      hall: showtimeData.hall,
      price: parseFloat(showtimeData.price),
      vipPrice: parseFloat(showtimeData.vipPrice),
      bookedSeats: []
    };
    data.showtimes.push(newShowtime);
    const success = await saveDb(data);
    if (!success) {
      throw new Error('Failed to create showtime in database');
    }
    return newShowtime;
  },

  createBooking: async (bookingData) => {
    const data = await getDb();
    
    const showtimeIndex = data.showtimes.findIndex(s => s.id === bookingData.showtimeId);
    if (showtimeIndex === -1) {
      throw new Error('Showtime not found');
    }

    const showtime = data.showtimes[showtimeIndex];
    
    const alreadyBooked = bookingData.seats.filter(seat => showtime.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      throw new Error(`Seats ${alreadyBooked.join(', ')} are already booked!`);
    }

    showtime.bookedSeats.push(...bookingData.seats);
    
    const newBooking = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      movieId: bookingData.movieId,
      movieTitle: bookingData.movieTitle,
      showtimeId: bookingData.showtimeId,
      userId: bookingData.userId,
      userName: bookingData.userName,
      time: showtime.time,
      date: showtime.date,
      hall: showtime.hall,
      seats: bookingData.seats,
      totalPrice: bookingData.totalPrice,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    data.bookings = data.bookings || [];
    data.bookings.push(newBooking);

    const success = await saveDb(data);
    if (!success) {
      throw new Error('Failed to save booking to database');
    }

    return newBooking;
  },

  getBookings: async () => {
    const data = await getDb();
    return data.bookings || [];
  },

  getBookingByReference: async (ref) => {
    const data = await getDb();
    return (data.bookings || []).find(b => b.id === ref);
  }
};
