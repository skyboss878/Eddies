// src/components/TimeClockNavbar.jsx - Using error utilities
import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, AlertCircle } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";
import { apiEndpoints } from "../utils/apiEndpoints";
import { handleApiError, retryOperation } from "../utils/errorUtils";

const TimeClockNavbar = ({ settings }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    checkTimeStatus();
  }, []);

  const checkTimeStatus = async () => {
    try {
      setConnectionError(null);
      
      // Use retry operation from error utils
      const response = await retryOperation(
        () => apiEndpoints.timeclock.getStatus(),
        2, // Max 2 retries
        1000 // 1 second delay
      );
      
      if (response.data) {
        setIsClockedIn(response.data.is_clocked_in || false);
        if (response.data.is_clocked_in && response.data.clock_in_time) {
          const clockInTime = new Date(response.data.clock_in_time);
          setClockInTime(clockInTime);
          localStorage.setItem('clockInTime', clockInTime.toISOString());
        }
      }
    } catch (error) {
      const errorInfo = handleApiError(error, 'TimeClockNavbar.checkTimeStatus');
      console.error('Failed to check time status:', errorInfo);
      setConnectionError(errorInfo.message);
      
      // Fallback to local storage
      const savedTime = localStorage.getItem('clockInTime');
      if (savedTime) {
        try {
          setClockInTime(new Date(savedTime));
          setIsClockedIn(true);
        } catch (parseError) {
          console.error('Invalid saved time:', parseError);
          localStorage.removeItem('clockInTime');
        }
      }
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      setConnectionError(null);
      
      await retryOperation(
        () => apiEndpoints.timeclock.clockIn(),
        2,
        1000
      );
      
      const now = new Date();
      setIsClockedIn(true);
      setClockInTime(now);
      localStorage.setItem('clockInTime', now.toISOString());
      
    } catch (error) {
      const errorInfo = handleApiError(error, 'TimeClockNavbar.clockIn');
      console.error('Clock in failed:', errorInfo);
      setConnectionError(errorInfo.message);
      
      // Fallback for offline functionality
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
      setConnectionError(null);
      
      // First check status
      const statusResponse = await retryOperation(
        () => apiEndpoints.timeclock.getStatus(),
        1,
        500
      );

      if (!statusResponse.data?.is_clocked_in) {
        // Not clocked in on server, sync state
        setIsClockedIn(false);
        setClockInTime(null);
        localStorage.removeItem('clockInTime');
        return;
      }

      // Clock out
      await retryOperation(
        () => apiEndpoints.timeclock.clockOut(),
        2,
        1000
      );

      setIsClockedIn(false);
      setClockInTime(null);
      localStorage.removeItem('clockInTime');

    } catch (error) {
      const errorInfo = handleApiError(error, 'TimeClockNavbar.clockOut');
      console.error('Clock out failed:', errorInfo);
      setConnectionError(errorInfo.message);

      if (errorInfo.statusCode === 400) {
        // Assume not clocked in and sync state
        setIsClockedIn(false);
        setClockInTime(null);
        localStorage.removeItem('clockInTime');
      } else {
        // For network errors, still update local state
        setIsClockedIn(false);
        setClockInTime(null);
        localStorage.removeItem('clockInTime');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    try {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      return '00:00:00';
    }
  };

  const getElapsedTime = () => {
    if (!clockInTime) return '00:00:00';
    
    try {
      const now = new Date();
      const diff = Math.floor((now - clockInTime) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch (error) {
      return '00:00:00';
    }
  };

  return (
    <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-sm">{formatTime(currentTime)}</span>
          {connectionError && (
            <AlertCircle 
              className="w-4 h-4 text-amber-400" 
              title={`Connection issue: ${connectionError}`}
            />
          )}
        </div>

        {settings?.shop?.name && (
          <span className="text-sm text-gray-300 border-l border-gray-600 pl-4">
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
  );
};

export default TimeClockNavbar;
