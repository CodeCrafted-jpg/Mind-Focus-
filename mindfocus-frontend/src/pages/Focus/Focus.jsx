import './focus.css';
import React, { useState, useEffect, useCallback } from 'react';
import { studySession } from '../../service/studySession';
import { blockSiteService } from '../../service/blockSitesService';
import SessionTimer from '../../components/sessionTimer/SessionTimer';
import PomodoroTimer from '../../components/pomodoro/Pomodoro';
import { authService } from '../../service/authService';
import { Link } from 'react-router-dom';

const FocusPage = ({ setIsFocusRunning }) => {
  const [sessionId, setSessionId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [user, setUser] = useState(authService.getUser());
  const [siteInput, setSiteInput] = useState('');
  const [blockedSites, setBlockedSites] = useState([]);
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);
  const [pomodoroConfig, setPomodoroConfig] = useState(null);
  const [readyToRenderPomodoro, setReadyToRenderPomodoro] = useState(false);

  const fetchBlockedSites = useCallback(async () => {
    if (!user) {
      setBlockedSites([]);
      return;
    }
    try {
      const res = await blockSiteService.getSites();
      if (res.success) {
        setBlockedSites(res.allSites);
        await authService.syncBlockedSites();
      } else {
        console.error('Error fetching sites from backend:', res.message);
      }
    } catch (err) {
      console.error('Error fetching sites:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchBlockedSites();
  }, [fetchBlockedSites]);

  const handleBlockSite = async () => {
    if (!siteInput.trim()) return;
    try {
      const res = await blockSiteService.addSite(siteInput);
      if (res.success) {
        setSiteInput('');
        await fetchBlockedSites();
      } else {
        console.error(res.message || 'Failed to block site');
        alert(res.message || 'Failed to block site');
      }
    } catch (err) {
      console.error('Error adding site:', err);
      alert(err?.response?.data?.message || 'Failed to block site');
    }
  };

  const handleUnblockSite = async (id) => {
    try {
      const res = await blockSiteService.removeSite(id);
      if (res.success) {
        await fetchBlockedSites();
      } else {
        console.error('Error unblocking site from backend:', res.message);
      }
    } catch (err) {
      console.error('Error unblocking site:', err);
    }
  };

  const start = async () => {
    try {
      if (!user) {
        alert('Please log in to start a session.');
        return;
      }

      let config = { isPomodoro: false };

      if (isPomodoroMode) {
        const focusTime = parseInt(prompt("Focus time in minutes:", 25));
        const shortBreak = parseInt(prompt("Short break in minutes:", 5));
        const longBreak = parseInt(prompt("Long break in minutes:", 15));
        const totalDuration = parseInt(prompt("Total Pomodoro session duration (in minutes):", 60));

        if (isNaN(focusTime) || isNaN(shortBreak) || isNaN(longBreak) || isNaN(totalDuration) ||
          focusTime <= 0 || shortBreak <= 0 || longBreak <= 0 || totalDuration <= 0) {
          alert("All values must be valid positive numbers.");
          return;
        }

        const newConfig = {
          sessionLength: focusTime,
          shortBreak,
          longBreak,
          totalRounds: 4,
        };

        setPomodoroConfig(newConfig);
        config = { isPomodoro: true, customPomodoroConfig: newConfig };

        setReadyToRenderPomodoro(true);
      }

      const res = await studySession.startSession(config);
      setSessionId(res.session._id);
      setIsRunning(true);
      setIsFocusRunning(true);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to start session');
    }
  };

  const end = async () => {
    try {
      if (!sessionId) return;
      await studySession.endSession(sessionId);
      setIsRunning(false);
      setSessionId(null);
      setIsFocusRunning(false);
      setReadyToRenderPomodoro(false);
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="focus-page-unauthenticated">
        <h1>🔒 Focus Mode</h1>
        <p>You must <strong>log in</strong> to use Focus Mode.</p>
      </div>
    );
  }

  return (
    <div className="focus-page-container">
      <h1 className="focus-page-title">📚 Focus Mode</h1>

      <div className="mode-toggle">
        <button
          onClick={() => setIsPomodoroMode(!isPomodoroMode)}
          disabled={isRunning}
          style={{
            opacity: isRunning ? 0.5 : 1,
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          {isPomodoroMode ? '🔁 Switch to Normal Timer' : '🍅 Switch to Pomodoro Mode'}
        </button>
      </div>

      <p className="focus-mode-label">
        {isPomodoroMode ? 'Pomodoro Mode Active 🍅' : 'Normal Mode Active ⏱️'}
      </p>

      <div className="session-controls-card">
        {isPomodoroMode ? (
          readyToRenderPomodoro && pomodoroConfig ? (
            <PomodoroTimer
              key={JSON.stringify(pomodoroConfig)}
              sessionLength={pomodoroConfig.sessionLength}
              shortBreak={pomodoroConfig.shortBreak}
              longBreak={pomodoroConfig.longBreak}
              totalRounds={pomodoroConfig.totalRounds}
              sessionId={sessionId}
            />
          ) : (
            <p style={{ textAlign: "center", fontWeight: 500, color: "#555" }}>
              Click start to begin your custom Pomodoro session 🍅
            </p>
          )
        ) : (
          <SessionTimer isRunning={isRunning} />
        )}

        <div className="session-buttons">
          <button onClick={start} disabled={isRunning}>Start Session</button>
          <button onClick={end} disabled={!isRunning}>End Session</button>
        </div>
      </div>

      <div className="site-blocker-card">
        <h2 className='Bloker'>Block sites 🚫</h2>
        <div className="block-input-area">
          <input
            type='url'
            placeholder='www.instagram.com'
            className='input'
            value={siteInput}
            onChange={(e) => setSiteInput(e.target.value)}
          />
          <button onClick={handleBlockSite}>Block</button>
        </div>
        <div className="blocked-sites-list">
          {blockedSites.map(site => (
            <div key={site._id} className="blocked-site-entry">
              <span>{site.url}</span>
              <button onClick={() => handleUnblockSite(site._id)} style={{ color: 'red' }}>Unblock</button>
            </div>
          ))}
        </div>
      </div>

      <div className='ai-assistant-card'>
        <h2 className='assistant-title'>AI Study Assistant 🤖</h2>
        <p className='assistant-desc'>Stuck? Get help with doubts, study plans, or productivity tips.</p>
        <Link
          to={"/ai-assistant"}
          target="_blank"
          rel="noopener noreferrer"
          className="assistant-button"
        >
          Open AI Assistant
        </Link>
      </div>
    </div>
  );
};

export default FocusPage;