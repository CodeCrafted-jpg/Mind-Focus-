import React, { useEffect, useState, useRef } from 'react';
import './sessionTimer.css';

const SessionTimer = ({ isRunning, pomodoroConfig, onTick }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [phase, setPhase] = useState('Focus'); // 'Focus', 'Short Break', 'Long Break'
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const intervalRef = useRef(null);

  // Convert minutes to seconds
  const toSeconds = (min) => min * 60;

  const startPhase = (type) => {
    let duration = 0;
    switch (type) {
      case 'Focus':
        duration = toSeconds(pomodoroConfig.focusTime);
        break;
      case 'Short Break':
        duration = toSeconds(pomodoroConfig.shortBreak);
        break;
      case 'Long Break':
        duration = toSeconds(pomodoroConfig.longBreak);
        break;
      default:
        duration = 0;
    }
    setPhase(type);
    setSecondsLeft(duration);
  };

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    if (pomodoroConfig) {
      // Start initial focus phase
      startPhase('Focus');
    } else {
      // Normal mode (count up)
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          const next = prev + 1;
          if (onTick) onTick(next);
          return next;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Timer countdown for Pomodoro
  useEffect(() => {
    if (!isRunning || !pomodoroConfig || secondsLeft <= 0) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);

          if (phase === 'Focus') {
            const nextCycle = cyclesCompleted + 1;
            setCyclesCompleted(nextCycle);
            if (nextCycle % 4 === 0) {
              startPhase('Long Break');
            } else {
              startPhase('Short Break');
            }
          } else {
            startPhase('Focus');
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [secondsLeft, isRunning, phase]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="timer-box">
      <h3>{pomodoroConfig ? `🧠 ${phase} Time` : '⏱ Focus Timer'}</h3>
      <p className="digital-timer">
        {pomodoroConfig ? formatTime(secondsLeft) : formatTime(secondsLeft)}
      </p>
    </div>
  );
};

export default SessionTimer;
