import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext.jsx';
import { Star, Play, Clapperboard, HelpCircle } from 'lucide-react';
import '../styles/home.css';

const Home = () => {
  const {
    movies,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    selectMovie
  } = useBooking();

  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
  const [shineStyle, setShineStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    const xPercent = (x / box.width) * 100;
    const yPercent = (y / box.height) * 100;

    const degX = -((y - box.height / 2) / (box.height / 2)) * 12;
    const degY = ((x - box.width / 2) / (box.width / 2)) * 12;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${degX}deg) rotateY(${degY}deg) scale3d(1.06, 1.06, 1.06)`
    });

    setShineStyle({
      background: `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 80%)`,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease, box-shadow 0.5s ease'
    });
    setShineStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease'
    });
  };

  const featuredMovie = movies.find(m => m.isFeatured) || movies[0];
  const genres = ['All', 'Sci-Fi', 'Action', 'Cyberpunk', 'Fantasy', 'Adventure', 'Thriller', 'Drama'];

  const filteredMovies = movies.filter(movie => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
                          movie.title.toLowerCase().includes(query) || 
                          movie.description.toLowerCase().includes(query) ||
                          (movie.director && movie.director.toLowerCase().includes(query)) ||
                          movie.genres.some(g => g.toLowerCase().includes(query)) ||
                          (movie.cast && movie.cast.some(actor => actor.name.toLowerCase().includes(query)));
    const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  if (loading && movies.length === 0) {
    return (
      <div className="empty-state">
        <Clapperboard className="empty-icon animate-pulse" size={48} />
        <h2>Loading CinePass Blockbusters...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {featuredMovie && (
        <div className="hero-banner">
          <img 
            src={featuredMovie.poster} 
            alt={featuredMovie.title} 
            className="hero-backdrop" 
          />
          <div className="hero-overlay"></div>
          
          <div className="hero-content">
            <span className="featured-badge">FEATURED BLOCKBUSTER</span>
            <h1 className="hero-title">{featuredMovie.title}</h1>
            
            <div className="hero-meta">
              <span className="hero-rating">
                <Star size={16} fill="currentColor" /> {featuredMovie.rating}
              </span>
              <span>&bull;</span>
              <span>{featuredMovie.duration} mins</span>
              <span>&bull;</span>
              <span>{featuredMovie.releaseDate}</span>
            </div>
            
            <p className="hero-description">{featuredMovie.description}</p>
            
            <div className="hero-poster-url-row">
              <span className="hero-url-label">Poster URL:</span>
              <a href={featuredMovie.poster} target="_blank" rel="noopener noreferrer" className="hero-url-link">
                {featuredMovie.poster}
              </a>
            </div>
            
            <button className="hero-btn" onClick={() => selectMovie(featuredMovie)}>
              <Play size={18} fill="currentColor" /> Book Tickets Now
            </button>
          </div>

          <div className="hero-visual">
            <div 
              className="three-d-poster-wrapper"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => selectMovie(featuredMovie)}
              style={tiltStyle}
            >
              <img 
                src={featuredMovie.poster} 
                alt={featuredMovie.title} 
                className="three-d-poster-image" 
              />
              <div className="three-d-poster-shine" style={shineStyle}></div>
              <div className="three-d-poster-shadow"></div>
            </div>
          </div>
        </div>
      )}

      <section className="search-filter-section">
        <div className="genre-filters">
          {genres.map(genre => (
            <button
              key={genre}
              className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      <section className="movie-grid-container">
        <h2 className="section-title">Now Playing</h2>
        
        {filteredMovies.length === 0 ? (
          <div className="empty-state">
            <HelpCircle size={48} className="empty-icon" />
            <h3>No movies found</h3>
            <p>Try searching for a different keyword or category.</p>
          </div>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map(movie => (
              <div 
                key={movie.id} 
                className="movie-card"
                onClick={() => selectMovie(movie)}
              >
                <div className="card-poster-wrapper">
                  <span className="card-rating-badge">
                    <Star size={12} fill="currentColor" /> {movie.rating}
                  </span>
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="card-poster" 
                    loading="lazy"
                  />
                  <div className="card-overlay">
                    <button className="card-action-btn">
                      Get Showtimes
                    </button>
                  </div>
                </div>
                
                <div className="card-info">
                  <div className="card-genres">
                    {movie.genres.slice(0, 2).map((g, idx) => (
                      <span key={idx} className="card-genre-tag">{g}</span>
                    ))}
                  </div>
                  <h3 className="card-title">{movie.title}</h3>
                  <div className="card-meta">
                    <span>{movie.duration}</span>
                    <span>{movie.releaseDate.split(',')[1] || movie.releaseDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
