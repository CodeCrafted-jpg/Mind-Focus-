import React, { useState, useEffect, useRef } from 'react';
import './pomodoro.css';
import { studySession } from '../../service/studySession';

const PomodoroTimer = ({
  sessionLength = 25,
  shortBreak = 5,
  longBreak = 15,
  totalRounds = 4,
  isRunning: parentIsRunning,
  sessionId
}) => {
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [round, setRound] = useState(1);

  const timerRef = useRef(null);
  const focusTickRef = useRef(0); // Tracks seconds during focus phase

  // Sync with parent state (e.g., Focus Mode Start)
  useEffect(() => {
    if (parentIsRunning) {
      setIsRunning(true);
    }
  }, [parentIsRunning]);

  // Timer Logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(async () => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current);
            handlePhaseSwitch();
            return 0;
          }

          // ⏱️ Count focus time only
          if (!isBreak && sessionId) {
            focusTickRef.current += 1;
            if (focusTickRef.current >= 60) {
              focusTickRef.current = 0;
              studySession.tickFocusTime(sessionId).catch(console.error);
            }
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, isBreak, sessionId]);

  // Handle switch between focus ↔ break
  const handlePhaseSwitch = () => {
    if (isBreak) {
      if (round >= totalRounds) {
        // ✅ End of all rounds
        setIsRunning(false);
        setIsBreak(false);
        setTimeLeft(0);
        return;
      }
      // Start new focus round
      setIsBreak(false);
      setTimeLeft(sessionLength * 60);
      setRound((prev) => prev + 1);
    } else {
      // Start break (short or long)
      if (round % totalRounds === 0) {
        setTimeLeft(longBreak * 60);
      } else {
        setTimeLeft(shortBreak * 60);
      }
      setIsBreak(true);
    }
  };

  // Pause/Resume
  const toggleTimer = () => setIsRunning((prev) => !prev);

  // Reset everything
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setTimeLeft(sessionLength * 60);
    setIsBreak(false);
    setRound(1);
    focusTickRef.current = 0;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-container">
      <h2>{isBreak ? 'Break Time 💤' : 'Focus Time 🚀'}</h2>
      <div className="pomodoro-timer">{formatTime(timeLeft)}</div>
      <div className="pomodoro-controls">
        <button onClick={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      <p>Round: {round} / {totalRounds}</p>
    </div>
  );
};

export default PomodoroTimer;
