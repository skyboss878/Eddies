// src/components/TimeClockNavbar.jsx - FIXED VERSION

import React, { useState, useEffect } from 'react';
import { Clock, Play, Square } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";
// FIX: Import the API endpoints
import apiEndpoints from "../utils/api";

const TimeClockNavbar = ({ settings }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // FIX: Check time status using API
  useEffect(() => {
    const checkTimeStatus = async () => {
      try {
        const response = await apiEndpoints.timeclock.status();
        const status = response.data;
        setIsClockedIn(status.is_clocked_in || false);
        if (status.current_entry?.clock_in) {
          setClockInTime(new Date(status.current_entry.clock_in));
        }
      } catch (error) {
        // Fallback to localStorage if API fails
        const savedClockIn = localStorage.getItem('clockInTime');
        if (savedClockIn) {
          setIsClockedIn(true);
          setClockInTime(new Date(savedClockIn));
        }
      }
    };

    checkTimeStatus();
  }, []);

  // FIX: Use API for clock in/out
  const handleClockIn = async () => {
    setLoading(true);
    try {
      await apiEndpoints.timeclock.clockIn();
      const now = new Date();
      setIsClockedIn(true);
      setClockInTime(now);
      localStorage.setItem('clockInTime', now.toISOString());
    } catch (error) {
      console.error('Clock in failed:', error);
      // Fallback to local storage
      const now = new Date();
      setIsClockedIn(true);
      setClockInTime(now);
      localStorage.setItem('clockInTime', now.toISOString());
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await apiEndpoints.timeclock.clockOut();
      setIsClockedIn(false);
      setClockInTime(null);
      localStorage.removeItem('clockInTime');
    } catch (error) {
      console.error('Clock out failed:', error);
      // Fallback to local storage
      setIsClockedIn(false);
      setClockInTime(null);
      localStorage.removeItem('clockInTime');
    } finally {
      setLoading(false);
    }
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
                  disabled={loading}
                  className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 px-3 py-1 rounded text-xs transition-colors"
                >
                  <Square className="w-3 h-3" />
                  <span>{loading ? 'Clocking Out...' : 'Clock Out'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleClockIn}
                disabled={loading}
                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 px-3 py-1 rounded text-xs transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>{loading ? 'Clocking In...' : 'Clock In'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeClockNavbar;
