// src/components/TimeClockNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Play, Square } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";

const TimeClockNavbar = ({ settings }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if user is clocked in (would normally fetch from API)
  useEffect(() => {
    const savedClockIn = localStorage.getItem('clockInTime');
    if (savedClockIn) {
      setIsClockedIn(true);
      setClockInTime(new Date(savedClockIn));
    }
  }, []);

  const handleClockIn = () => {
    const now = new Date();
    setIsClockedIn(true);
    setClockInTime(now);
    localStorage.setItem('clockInTime', now.toISOString());
    // TODO: Send clock-in to API
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setClockInTime(null);
    localStorage.removeItem('clockInTime');
    // TODO: Send clock-out to API
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getElapsedTime = () => {
    if (!clockInTime) return '0:00:00';
    const elapsed = Math.floor((currentTime - clockInTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 text-white px-4 py-2 border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Current Time */}
        <div className="flex items-center space-x-4">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-mono">
            {formatTime(currentTime)}
          </span>
          {settings?.shop?.name && (
            <span className="text-xs text-gray-400">
              {settings.shop.name}
            </span>
          )}
        </div>

        {/* Time Clock Controls */}
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-300">
              {user.first_name || user.name || 'User'}
            </div>

            {isClockedIn ? (
              <div className="flex items-center space-x-2">
                <div className="text-xs">
                  <div className="text-green-400">Clocked In</div>
                  <div className="font-mono">{getElapsedTime()}</div>
                </div>
                <button
                  onClick={handleClockOut}
                  className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors"
                >
                  <Square className="w-3 h-3" />
                  <span>Clock Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleClockIn}
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>Clock In</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeClockNavbar;
