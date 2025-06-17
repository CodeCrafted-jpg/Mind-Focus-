
import React from 'react';
import './profileStats.css';

const ProfileStats = ({ todayDuration, weekDuration }) => {
  return (
    <div className="profile-stats-container">
      <div className="stat-card">
        <h2>Today's Focus Time</h2>
        <p className="stat-value">{todayDuration}</p>
      </div>

      <div className="stat-card">
        <h2>This Week's Total</h2>
        <p className="stat-value">{weekDuration}</p>
      </div>
    </div>
  );
};

export default ProfileStats;
