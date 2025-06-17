import React from 'react';
import './footer.css';
import Logo from '../logo';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>
            <Logo/>
            Mind-Focus+</h2>
          <p>Helping you stay focused, one session at a time.</p>
        </div>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#join">Join</a>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Focus+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
