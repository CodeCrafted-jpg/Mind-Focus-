import React, { useState, useEffect, useRef } from 'react';
import './pomodoro.css';
import { studySession } from '../../service/studySession';
import dingSound from '../../audio/bell.mp3';

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
  const focusTickRef = useRef(0);

  // 🎵 Play ding
  const playDing = () => {
    const audio = new Audio(dingSound);
    audio.play().catch(console.error);
  };

  useEffect(() => {
    if (parentIsRunning) {
      setIsRunning(true);
    }
  }, [parentIsRunning]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current);
            handlePhaseSwitch();
            return 0;
          }

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

  const handlePhaseSwitch = () => {
    playDing(); // 🔔

    if (!isBreak) {
      if (round >= totalRounds) {
        setIsRunning(false);
        setIsBreak(false);
        setTimeLeft(0);
        return;
      }

      setTimeLeft(round % totalRounds === 0 ? longBreak * 60 : shortBreak * 60);
      setIsBreak(true);
    } else {
      setIsBreak(false);
      setTimeLeft(sessionLength * 60);
      setRound((prev) => prev + 1);
    }
  };

  const toggleTimer = () => setIsRunning((prev) => !prev);

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
