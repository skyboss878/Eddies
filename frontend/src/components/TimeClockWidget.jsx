// src/components/TimeClockWidget.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Play, Square } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";
import apiEndpoints from "../utils/api";

const TimeClockWidget = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial clock status and poll every 30s
  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const res = await apiEndpoints.timeclock.status();
        if (!mounted) return;
        const status = res.data;
        setIsClockedIn(status.is_clocked_in || false);
        if (status.current_entry?.clock_in) {
          setClockInTime(new Date(status.current_entry.clock_in));
        }
      } catch (err) {
        console.error('Failed to fetch time status:', err);
        setError('Unable to load time status');
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleClockIn = async () => {
    if (isClockedIn) return;
    setLoading(true);
    setError(null);
    try {
      await apiEndpoints.timeclock.clockIn();
      const now = new Date();
      setIsClockedIn(true);
      setClockInTime(now);
      localStorage.setItem('clockInTime', now.toISOString());
    } catch (err) {
      console.error('Clock in failed:', err);
      setError('Clock in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!isClockedIn) return;
    setLoading(true);
    setError(null);
    try {
      // Confirm server-side status first
      const statusRes = await apiEndpoints.timeclock.status();
      if (!statusRes.data.is_clocked_in) {
        setIsClockedIn(false);
        setClockInTime(null);
        localStorage.removeItem('clockInTime');
        setLoading(false);
        return;
      }

      await apiEndpoints.timeclock.clockOut();
      setIsClockedIn(false);
      setClockInTime(null);
      localStorage.removeItem('clockInTime');
    } catch (err) {
      console.error('Clock out failed:', err);
      setError('Clock out failed');
      setIsClockedIn(false);
      setClockInTime(null);
      localStorage.removeItem('clockInTime');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const getElapsedTime = () => {
    if (!clockInTime) return '0:00:00';
    const elapsed = Math.floor((currentTime - clockInTime) / 1000);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md w-full max-w-sm mx-auto">
      <div className="flex items-center space-x-3 mb-2">
        <Clock className="w-5 h-5 text-blue-400" />
        <span className="font-mono">{formatTime(currentTime)}</span>
      </div>

      {isClockedIn && (
        <div className="text-sm text-green-400 mb-2 font-mono">
          Clocked In: {getElapsedTime()}
        </div>
      )}

      {error && <div className="text-xs text-red-400 mb-2">{error}</div>}

      <button
        onClick={isClockedIn ? handleClockOut : handleClockIn}
        disabled={loading}
        className={`w-full flex justify-center items-center space-x-2 py-2 px-4 rounded ${
          isClockedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } disabled:bg-gray-500 transition-colors`}
      >
        {isClockedIn ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        <span>{loading ? (isClockedIn ? 'Clocking Out...' : 'Clocking In...') : isClockedIn ? 'Clock Out' : 'Clock In'}</span>
      </button>
    </div>
  );
};

export default TimeClockWidget;
