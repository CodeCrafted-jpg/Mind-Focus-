import React, { useState } from 'react';
import { authService } from '../../service/authService';
import './loginpopup.css';

const LoginPopup = ({ onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      if (isRegister) {
        await authService.register(username, email, password); 
        setSuccessMessage('Registration successful! You can now log in.');
        setIsRegister(false);
        setUsername('');
      } else {
        await authService.login(email, password);
        onSuccess(); 
        onClose();
        // window.location.reload()
      }
    } catch (err) {
      setError(err.message || (isRegister ? 'Registration failed' : 'Login failed'));
    }
  };

  return (
    <div className="login-overlay" id='login'>
      <div className="login-popup">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="login-input"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccessMessage('');
            }}
            className="toggle-link"
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>

        <button onClick={onClose} className="close-button">✕</button>
      </div>
    </div>
  );
};

export default LoginPopup;
