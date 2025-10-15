// Updated TimeClockNavbar.jsx for your Axios-based API
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Square, 
  Coffee, 
  CoffeeIcon, 
  Users, 
  FileText, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';

// Import your existing API services
import { timeClockService, handleApiError, utilityService, timeClockUtils } from '../utils/api.js';

const TimeClockDashboard = () => {
  const [timeStatus, setTimeStatus] = useState({
    is_clocked_in: false,
    current_entry: null,
    on_break: false,
    employee_name: '',
    total_hours_today: 0
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load initial status and check connection
  useEffect(() => {
    checkConnection();
    loadTimeStatus();
    
    // Refresh status every 30 seconds
    const statusRefresh = setInterval(loadTimeStatus, 30000);
    return () => clearInterval(statusRefresh);
  }, []);

  // Check backend connection
  const checkConnection = async () => {
    try {
      await utilityService.healthCheck();
      setConnectionStatus('connected');
      setError(null);
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('Connection check failed:', error);
    }
  };

  const loadTimeStatus = async () => {
    try {
      setError(null);
      const response = await timeClockService.getStatus();
      
      // Your API returns data in response.data with Axios
      const data = response.data;
      setTimeStatus(data);
      setConnectionStatus('connected');
      
      // Cache status for offline use
      localStorage.setItem('timeClockStatus', JSON.stringify(data));
      
    } catch (error) {
      console.error('Error loading time status:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      setConnectionStatus('disconnected');
      
      // Load cached data if available
      try {
        const cachedStatus = localStorage.getItem('timeClockStatus');
        if (cachedStatus) {
          setTimeStatus(JSON.parse(cachedStatus));
        }
      } catch (cacheError) {
        console.error('Error loading cached status:', cacheError);
      }
    }
  };

  const handleClockIn = async () => {
    if (!timeClockUtils.canClockIn(timeStatus)) {
      alert('You are already clocked in');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await timeClockService.clockIn();
      const data = response.data;
      
      // Show success message
      const message = data.message || response.message || 'Clocked in successfully';
      alert(message);
      
      // Refresh status
      await loadTimeStatus();
      
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      alert(`Error clocking in: ${errorMessage}`);
      console.error('Clock in error:', error);
    }
    
    setIsLoading(false);
  };

  const handleClockOut = async () => {
    if (!timeClockUtils.canClockOut(timeStatus)) {
      alert('You are not clocked in');
      return;
    }

    if (!confirm('Are you sure you want to clock out?')) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await timeClockService.clockOut();
      const data = response.data;
      
      // Build success message with hours worked
      let message = data.message || response.message || 'Clocked out successfully';
      
      if (data.total_hours) {
        message += `\nTotal Hours Today: ${data.total_hours}`;
      }
      if (data.overtime_hours && parseFloat(data.overtime_hours) > 0) {
        message += `\nOvertime: ${data.overtime_hours}`;
      }
      
      alert(message);
      
      // Refresh status
      await loadTimeStatus();
      
      // Clear cached status since we're clocked out
      localStorage.removeItem('timeClockStatus');
      
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      alert(`Error clocking out: ${errorMessage}`);
      console.error('Clock out error:', error);
    }
    
    setIsLoading(false);
  };

  const handleBreakToggle = async () => {
    const isOnBreak = timeStatus.on_break;
    
    if (isOnBreak && !timeClockUtils.canEndBreak(timeStatus)) {
      alert('Cannot end break at this time');
      return;
    }
    
    if (!isOnBreak && !timeClockUtils.canStartBreak(timeStatus)) {
      alert('Cannot start break. Make sure you are clocked in and not already on break');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (isOnBreak) {
        response = await timeClockService.endBreak();
      } else {
        response = await timeClockService.startBreak();
      }
      
      const data = response.data;
      const message = data.message || response.message || 
        (isOnBreak ? 'Break ended successfully' : 'Break started successfully');
      
      alert(message);
      
      // Refresh status
      await loadTimeStatus();
      
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      alert(`Error with break: ${errorMessage}`);
      console.error('Break toggle error:', error);
    }
    
    setIsLoading(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getHoursWorked = () => {
    if (timeStatus.current_entry?.hours_worked) {
      return timeStatus.current_entry.hours_worked;
    }
    if (timeStatus.total_hours_today) {
      return timeStatus.total_hours_today;
    }
    return '0.00';
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-3 h-3 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-3 h-3 text-red-500" />;
      default:
        return <RefreshCw className="w-3 h-3 text-yellow-500 animate-spin" />;
    }
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="relative">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-800 font-medium">Connection Error</p>
            <p className="text-sm text-red-700 break-words">{error}</p>
            <div className="flex space-x-3 mt-2">
              <button
                onClick={() => {
                  setError(null);
                  checkConnection();
                  loadTimeStatus();
                }}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Retry Connection
              </button>
              {connectionStatus === 'disconnected' && (
                <span className="text-xs text-red-500">
                  Using cached data
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Time Clock Interface */}
      <div className="flex items-center space-x-4 bg-white rounded-lg shadow-md p-3 border border-gray-200">
        {/* Connection Status */}
        <div className="flex flex-col items-center">
          {getConnectionIcon()}
          <div className="text-xs text-gray-500 mt-1" title={`Backend: ${connectionStatus}`}>
            API
          </div>
        </div>

        {/* Current Time Display */}
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">{formatTime(currentTime)}</div>
          <div className="text-xs text-gray-500">{formatDate(currentTime)}</div>
        </div>

        {/* Divider */}
        <div className="h-12 w-px bg-gray-200"></div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${timeStatus.is_clocked_in ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <div className="text-sm">
            <div className="font-medium text-gray-800">
              {timeStatus.is_clocked_in ? 'Clocked In' : 'Clocked Out'}
            </div>
            {timeStatus.is_clocked_in && (
              <div className="text-xs text-gray-500">
                {timeStatus.on_break ? (
                  <span className="text-orange-600 font-medium">On Break</span>
                ) : (
                  `${getHoursWorked()} hrs`
                )}
              </div>
            )}
            {timeStatus.employee_name && (
              <div className="text-xs text-gray-500">{timeStatus.employee_name}</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {!timeStatus.is_clocked_in ? (
            <button
              onClick={handleClockIn}
              disabled={isLoading || connectionStatus === 'disconnected'}
              className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={connectionStatus === 'disconnected' ? 'Backend disconnected - cannot clock in' : 'Clock In'}
            >
              <Play className="w-4 h-4" />
              <span>Clock In</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              {!timeStatus.on_break && (
                <button
                  onClick={handleBreakToggle}
                  disabled={isLoading || connectionStatus === 'disconnected'}
                  className="flex items-center space-x-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Break</span>
                </button>
              )}

              {timeStatus.on_break && (
                <button
                  onClick={handleBreakToggle}
                  disabled={isLoading || connectionStatus === 'disconnected'}
                  className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50 animate-pulse disabled:cursor-not-allowed transition-colors"
                >
                  <CoffeeIcon className="w-4 h-4" />
                  <span>End Break</span>
                </button>
              )}

              <button
                onClick={handleClockOut}
                disabled={isLoading || connectionStatus === 'disconnected'}
                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Square className="w-4 h-4" />
                <span>Clock Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Menu Toggle */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
          title="Time Clock Management"
        >
          <Clock className="w-5 h-5" />
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Processing...</span>
          </div>
        </div>
      )}

      {/* Management Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Time Clock Management
            </h3>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <div className={`w-2 h-2 rounded-full ${getConnectionColor()} mr-2`}></div>
              Status: {connectionStatus}
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                setShowMenu(false);
                window.location.href = '/timeclock/dashboard';
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Clock className="w-4 h-4 mr-3 text-gray-400" />
              My Timesheet
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                window.location.href = '/employees';
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Users className="w-4 h-4 mr-3 text-gray-400" />
              Employee Management
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                window.location.href = '/payroll/periods';
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-3 text-gray-400" />
              Pay Periods
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                window.location.href = '/payroll/reports';
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4 mr-3 text-gray-400" />
              Payroll Reports
            </button>

            <hr className="my-2" />

            <button
              onClick={() => {
                setShowMenu(false);
                window.location.href = '/payroll/export';
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
            >
              <DollarSign className="w-4 h-4 mr-3" />
              Export Payroll
            </button>

            <hr className="my-2" />

            {/* Admin/Debug Actions */}
            <button
              onClick={async () => {
                setShowMenu(false);
                await checkConnection();
                await loadTimeStatus();
              }}
              disabled={isLoading}
              className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-3 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Status
            </button>

            {import.meta.env.DEV && (
              <button
                onClick={() => {
                  setShowMenu(false);
                  console.log('Time Clock Debug Info:', {
                    timeStatus,
                    connectionStatus,
                    error,
                    apiBaseUrl: import.meta.env.VITE_API_BASE_URL
                  });
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <AlertCircle className="w-4 h-4 mr-3" />
                Debug Info
              </button>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default TimeClockDashboard;
