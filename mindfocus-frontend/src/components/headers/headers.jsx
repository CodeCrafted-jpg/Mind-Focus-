import React from 'react';
import './headers.css';

const Headers = () => {
  return (
    <header className="header-container">
      <div className="header-content">
        <h1 className="header-title">Hello! Sayan Here,  Welcome to Mind-Focus+</h1>
        <p className="header-subtitle">
          Your all-in-one productivity companion — block distractions,study in groups, manage time, and build better habits with ease.
        </p>
        <a href="#features" className="header-cta">Explore Features</a>
      </div>
    </header>
  );
};

export default Headers;
