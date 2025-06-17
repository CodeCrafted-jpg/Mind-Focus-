import React, { useState, useEffect } from 'react';
import LoginPopup from '../loginpopup/loginpopup';
import { authService } from '../../service/authService.js';
import './navbar.css';
import Logo from '../logo.jsx';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

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
    // window.location.reload()
  };

  return (
    <>
      <nav className="navbar">
        <Link to={'/'} className="navbar-brand">
        <div >
          <Logo />
         Mind-Focus+ 
        </div>
</Link>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#">Join</a></li>
          {user && (
            <>
              <li><Link to={"/focus"}>Focus</Link></li>
              <li><Link to={"/groups"}>Groups</Link></li>
            </>
          )}
        </ul>
        <div className="navbar-auth">
          {user ? (
            <>
            <Link to={'/profile'} > <button className="profile-button">👤 {user.username}</button></Link>
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
