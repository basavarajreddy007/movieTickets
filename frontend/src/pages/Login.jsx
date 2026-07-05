import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext.jsx';
import { User, Lock, LogIn, UserPlus, Smile, Eye, EyeOff } from 'lucide-react';
import '../styles/login.css';

const Login = () => {
  const { login, register, error } = useBooking();
  const [activeTab, setActiveTab] = useState('login');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');

    if (activeTab === 'login') {
      if (!username || !password) {
        setLocalError('Please fill out all fields.');
        return;
      }
      const success = await login(username, password);
      if (!success) {
        setLocalError(error || 'Invalid credentials. Use user/user123 or admin/admin123.');
      }
    } else {
      if (!username || !password || !name) {
        setLocalError('Please fill out all fields.');
        return;
      }
      const success = await register(username, password, name);
      if (success) {
        setSuccessMsg('Registration successful! Please log in.');
        setActiveTab('login');
        setPassword('');
      } else {
        setLocalError(error || 'Registration failed. Try a different username.');
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLocalError('');
    setSuccessMsg('');
    setUsername('');
    setPassword('');
    setName('');
    setShowPassword(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-card glass-panel">
        <div className="login-tabs">
          <button
            className={`login-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
          >
            Sign In
          </button>
          <button
            className={`login-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabChange('register')}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form-body">
          <div className="login-form-header">
            <h2>{activeTab === 'login' ? 'Welcome Back' : 'Join CinePass'}</h2>
            <p>
              {activeTab === 'login'
                ? 'Sign in to book premium movie tickets instantly.'
                : 'Create an account to browse showtimes and buy tickets.'}
            </p>
          </div>

          {localError && <div className="login-error-alert">{localError}</div>}
          {successMsg && <div className="login-success-alert">{successMsg}</div>}

          {activeTab === 'register' && (
            <div className="login-input-group">
              <label className="login-input-label">Your Name</label>
              <div className="login-input-wrapper">
                <Smile className="login-input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="login-input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="login-input-group">
            <label className="login-input-label">Username</label>
            <div className="login-input-wrapper">
              <User className="login-input-icon" size={18} />
              <input
                type="text"
                placeholder="Username (e.g. user, admin)"
                className="login-input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="login-input-group">
            <label className="login-input-label">Password</label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="login-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            {activeTab === 'login' ? (
              <>
                <LogIn size={18} /> Sign In
              </>
            ) : (
              <>
                <UserPlus size={18} /> Register Now
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
