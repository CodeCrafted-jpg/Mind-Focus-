import React, { useState, useEffect } from 'react';
import LoginPopup from '../loginpopup/loginpopup';
import { authService } from '../../service/authService.js';
import './navbar.css';
import Logo from '../logo.jsx';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loggedInUser = authService.getUser();
    setUser(loggedInUser);
  }, []);

  const handleLoginSuccess = () => {
    const updatedUser = authService.getUser();
    setUser(updatedUser);
    setShowLoginPopup(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div>
            <Logo />
            Mind-Focus+
          </div>
        </Link>

        <div className="burger" onClick={toggleMobileMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
           

          <li><a href="/" onClick={closeMenu}>Home</a></li>
          <li><a href="#" onClick={closeMenu}>About</a></li>
          <li><a href="#features" onClick={closeMenu}>Features</a></li>
          <li><a href="#" onClick={closeMenu}>Join</a></li>
         {user  &&(
            <>
              <li><Link to="/focus" onClick={closeMenu}>Focus</Link></li>
              <li><Link to="/groups" onClick={closeMenu}>Groups</Link></li>
             
            </>
          )}
        </ul>

        <div className="navbar-auth">
          {user ? (
            <>
              <Link to="/profile"><button className="profile-button">👤 {user.username}</button></Link>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="login-button" onClick={() => setShowLoginPopup(true)}>Login</button>
          )}
        </div>
      </nav>

      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default Navbar;
