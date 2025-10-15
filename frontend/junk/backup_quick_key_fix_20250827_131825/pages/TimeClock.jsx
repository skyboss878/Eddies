import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts";
import { ClockIcon, PlayIcon, StopIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const TimeClock = () => {
  const { user } = useAuth();
  const [clockedIn, setClockedIn] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeClockStatus();
    fetchTimeEntries();
  }, []);

  const fetchTimeClockStatus = async () => {
    try {
      const response = await fetch('/api/timeclock/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setClockedIn(data.clocked_in);
      setCurrentSession(data.current_session);
    } catch (error) {
    }
  };

  const fetchTimeEntries = async () => {
    try {
      const response = await fetch('/api/timeclock/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTimeEntries(data.entries || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      const response = await fetch('/api/timeclock/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setClockedIn(true);
        toast.success('Clocked in successfully!');
        fetchTimeClockStatus();
        fetchTimeEntries();
      } else {
        toast.error('Failed to clock in');
      }
    } catch (error) {
      toast.error('Error clocking in');
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await fetch('/api/timeclock/clock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setClockedIn(false);
        setCurrentSession(null);
        toast.success('Clocked out successfully!');
        fetchTimeEntries();
      } else {
        toast.error('Failed to clock out');
      }
    } catch (error) {
      toast.error('Error clocking out');
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Clock</h1>
        <p className="text-gray-600">
          Track your work hours - {user?.name || 'Technician'}
        </p>
      </div>

      {/* Clock In/Out Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="mb-6">
            <ClockIcon className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <div className="text-2xl font-bold text-gray-900">
              {new Date().toLocaleTimeString()}
            </div>
            <div className="text-lg text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {clockedIn ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium">Currently Clocked In</div>
                {currentSession && (
                  <div className="text-green-600 text-sm">
                    Since: {formatTime(currentSession.clock_in_time)}
                  </div>
                )}
              </div>
              <button
                onClick={handleClockOut}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                <StopIcon className="w-5 h-5 mr-2" />
                Clock Out
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-gray-600 font-medium">Currently Clocked Out</div>
              </div>
              <button
                onClick={handleClockIn}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Clock In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Time Entries */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Time Entries
          </h3>
          
          {timeEntries.length > 0 ? (
            <div className="overflow-hidden">
              <div className="space-y-3">
                {timeEntries.slice(0, 10).map((entry, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(entry.date)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatTime(entry.clock_in)} - {entry.clock_out ? formatTime(entry.clock_out) : 'In Progress'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {entry.duration ? formatDuration(entry.duration) : 'In Progress'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No time entries</h3>
              <p className="mt-1 text-sm text-gray-500">
                Clock in to start tracking your work hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeClock;
