import express from 'express';
import { db } from '../models/db.js';

const router = express.Router();

router.get('/showtime/:id', async (req, res) => {
  try {
    const showtime = await db.getShowtimeById(req.params.id);
    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }
    
    const movie = await db.getMovieById(showtime.movieId);
    
    res.json({
      ...showtime,
      movieTitle: movie ? movie.title : 'Unknown Movie',
      moviePoster: movie ? movie.poster : ''
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/showtime', async (req, res) => {
  try {
    const { movieId, time, date, hall, price, vipPrice } = req.body;
    if (!movieId || !time || !date || !hall || !price || !vipPrice) {
      return res.status(400).json({ error: 'Missing showtime details' });
    }

    const newShowtime = await db.createShowtime({
      movieId,
      time,
      date,
      hall,
      price,
      vipPrice
    });

    res.status(201).json(newShowtime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/book', async (req, res) => {
  try {
    const { movieId, movieTitle, showtimeId, seats, totalPrice, userId, userName } = req.body;
    
    if (!movieId || !movieTitle || !showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: 'Missing booking details' });
    }

    const newBooking = await db.createBooking({
      movieId,
      movieTitle,
      showtimeId,
      seats,
      totalPrice,
      userId,
      userName
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const bookings = await db.getBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reference/:ref', async (req, res) => {
  try {
    const booking = await db.getBookingByReference(req.params.ref);
    if (!booking) {
      return res.status(404).json({ error: 'Booking reference not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
