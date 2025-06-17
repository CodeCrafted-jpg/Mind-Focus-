import React from 'react';
import './features.css';

const Features = () => {
    return (
        <section className="features-section" id="features">
            <div className="features-container">
                <h2 className="features-heading">Powerful Features</h2>
                <p className="features-subtext">
                    Discover how MindFocus helps you stay focused, healthy, and productive.
                </p>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>🧠 Focus Sessions</h3>
                        <p>Use Pomodoro-based timers to block distractions and improve focus.</p>
                    </div>
                    <div className="feature-card">
                        <h3>📊 Progress Tracker</h3>
                        <p>Visualize your productivity trends with daily and weekly insights.</p>
                    </div>
                    <div className="feature-card">
                        <h3>👥 Groups</h3>
                        <p>Join Groups and study togather-chat with members </p>
                    </div>
                    <div className="feature-card">
                        <h3>🚫 Website Blocker</h3>
                        <p>Block time-wasting sites during deep work sessions with one click.</p>
                    </div>
                      <div className="feature-card">
                        <h3>🤖 Ai Companion</h3>
                        <p>Chat with ai study companion and get suggestion and help </p>
                    </div>
                     <div className="feature-card">
                        <h3>📈Leader Board in Group</h3>
                        <p>Graph feature in group to show leader board</p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Features;
