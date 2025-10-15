// src/components/TimeClockWidget.jsx
import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  PlayIcon, 
  StopIcon, 
  PauseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { apiEndpoints } from "../utils";
import { useAuth } from "../contexts";

const TimeClockWidget = () => {
  const { user } = useAuth();
  const [timeStatus, setTimeStatus] = useState({
    is_clocked_in: false,
    current_entry: null,
    today_hours: 0,
    status: 'clocked_out'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load time status on mount and every 30 seconds
  useEffect(() => {
    loadTimeStatus();
    const interval = setInterval(loadTimeStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadTimeStatus = async () => {
    try {
      setError(null);
      const response = await timeClockService.status();
      setTimeStatus(response.data || {
        is_clocked_in: false,
        current_entry: null,
        today_hours: 0,
        status: 'clocked_out'
      });
    } catch (error) {
      setError('Unable to load time status');
      // Don't clear existing status on error
    }
  };

  const handleClockIn = async () => {
    if (timeStatus.is_clocked_in) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await timeClockService.clockIn();
      await loadTimeStatus();
      // Show success message
      alert('Successfully clocked in!');
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      alert(`Failed to clock in: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!timeStatus.is_clocked_in) return;
    
    if (!confirm('Are you sure you want to clock out?')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await timeClockService.clockOut();
      await loadTimeStatus();
      alert('Successfully clocked out!');
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      alert(`Failed to clock out: ${errorMessage}`);
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

  const formatHours = (hours) => {
    return typeof hours === 'number' ? hours.toFixed(2) : '0.00';
  };

  const getStatusColor = () => {
    if (timeStatus.is_clocked_in) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (timeStatus.is_clocked_in) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Current Time */}
      <div className="text-center">
        <div className="text-2xl font-mono font-bold text-gray-900">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-500">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          {getStatusIcon()}
          <span className={`font-semibold ${getStatusColor()}`}>
            {timeStatus.is_clocked_in ? 'Clocked In' : 'Clocked Out'}
          </span>
        </div>
        
        {timeStatus.is_clocked_in && timeStatus.current_entry && (
          <div className="text-sm text-gray-600">
            Started: {new Date(timeStatus.current_entry.clock_in).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>

      {/* Today's Hours */}
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <div className="text-sm text-gray-600">Today's Hours</div>
        <div className="text-xl font-bold text-gray-900">
          {formatHours(timeStatus.today_hours)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {!timeStatus.is_clocked_in ? (
          <button
            onClick={handleClockIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            <PlayIcon className="h-4 w-4" />
            <span>{loading ? 'Clocking In...' : 'Clock In'}</span>
          </button>
        ) : (
          <button
            onClick={handleClockOut}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            <StopIcon className="h-4 w-4" />
            <span>{loading ? 'Clocking Out...' : 'Clock Out'}</span>
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-xs text-red-600 text-center bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* User Info */}
      {user && (
        <div className="text-center text-xs text-gray-500 border-t pt-2">
          {user.first_name} {user.last_name}
        </div>
      )}
    </div>
  );
};

export default TimeClockWidget;
