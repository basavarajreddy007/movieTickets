import express from 'express';
import { db } from '../models/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const movies = await db.getMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, genres, duration, releaseDate, poster, director, cast, isFeatured } = req.body;
    
    if (!title || !description || !genres || !duration || !releaseDate || !poster || !director) {
      return res.status(400).json({ error: 'Missing movie details' });
    }

    const newMovie = await db.createMovie({
      title,
      description,
      genres,
      duration,
      releaseDate,
      poster,
      director,
      cast,
      isFeatured
    });

    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await db.getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/showtimes', async (req, res) => {
  try {
    const showtimes = await db.getShowtimes(req.params.id);
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
