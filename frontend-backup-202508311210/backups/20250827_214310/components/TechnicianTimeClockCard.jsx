import React, { useState, useEffect, useRef } from 'react';

const PAY_PERIOD_KEY = 'payPeriodSessions';

// Helper: returns current pay period string like "2025-08"
const getCurrentPayPeriod = () => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
};

const formatTime = (secs) => {
  const hrs = Math.floor(secs / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;
  return `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
};

const TechnicianTimeClockCard = ({ jobTitle, technicianName }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const saveSession = (duration) => {
    const payPeriod = getCurrentPayPeriod();
    const stored = localStorage.getItem(PAY_PERIOD_KEY);
    let sessions = stored ? JSON.parse(stored) : {};

    if (!sessions[payPeriod]) sessions[payPeriod] = [];

    sessions[payPeriod].push({
      technicianName,
      jobTitle,
      duration, // seconds
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(PAY_PERIOD_KEY, JSON.stringify(sessions));
    alert(`Saved ${formatTime(duration)} for ${technicianName} in pay period ${payPeriod}`);
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleStop = () => {
    setIsRunning(false);
    saveSession(secondsElapsed);
    setSecondsElapsed(0);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 text-center font-sans">
      <h2 className="text-2xl font-bold mb-4">{jobTitle}</h2>
      <p className="text-lg mb-4">Technician: <strong>{technicianName}</strong></p>
      <p className="text-5xl font-mono mb-8">{formatTime(secondsElapsed)}</p>

      {!isRunning && secondsElapsed === 0 && (
        <button
          onClick={handleStart}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Start
        </button>
      )}

      {isRunning && (
        <button
          onClick={handlePause}
          className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Pause
        </button>
      )}

      {!isRunning && secondsElapsed > 0 && (
        <div className="flex justify-center gap-4">
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Resume
          </button>
          <button
            onClick={handleStop}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Stop & Save
          </button>
        </div>
      )}
    </div>
  );
};

export default TechnicianTimeClockCard;
