import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import moviesRouter from './routes/movies.js';
import bookingsRouter from './routes/bookings.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/bookings', bookingsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CinePass API Server is running smoothly.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`CinePass Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
