// src/components/TimeClockNavbar.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts";
import { Clock, Play, Square } from 'lucide-react';

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
    // TODO: Fetch clock status from API
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
    // TODO: Send to API
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setClockInTime(null);
    localStorage.removeItem('clockInTime');
    // TODO: Send to API
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

// ---

// src/components/AppointmentBar.jsx

const AppointmentBar = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    // TODO: Fetch today's appointments from API
    const mockAppointments = [
      {
        id: 1,
        time: '09:00',
        customerName: 'John Smith',
        phone: '(555) 123-4567',
        service: 'Oil Change',
        vehicle: '2020 Honda Civic'
      },
      {
        id: 2,
        time: '11:30',
        customerName: 'Sarah Johnson',
        phone: '(555) 234-5678',
        service: 'Brake Service',
        vehicle: '2019 Toyota Camry'
      },
      {
        id: 3,
        time: '14:00',
        customerName: 'Mike Wilson',
        phone: '(555) 345-6789',
        service: 'Engine Diagnostic',
        vehicle: '2021 Ford F-150'
      }
    ];
    
    setTodayAppointments(mockAppointments);
    
    // Find current appointment based on time
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    
    const current = mockAppointments.find(apt => {
      const [hours, minutes] = apt.time.split(':').map(Number);
      const aptTimeMinutes = hours * 60 + minutes;
      // Show appointment if it's within 30 minutes before or after
      return Math.abs(currentTimeMinutes - aptTimeMinutes) <= 30;
    });
    
    setCurrentAppointment(current);
  }, []);

  const getUpcomingAppointment = () => {
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    
    return todayAppointments.find(apt => {
      const [hours, minutes] = apt.time.split(':').map(Number);
      const aptTimeMinutes = hours * 60 + minutes;
      return aptTimeMinutes > currentTimeMinutes;
    });
  };

  const upcomingAppointment = getUpcomingAppointment();

  if (!todayAppointments.length && !currentAppointment) {
    return null; // Don't show if no appointments
  }

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Today's Schedule ({todayAppointments.length} appointments)
            </span>
          </div>

          {/* Current/Next Appointment */}
          {currentAppointment && (
            <div className="flex items-center space-x-4 bg-green-100 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Current: {currentAppointment.time}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">
                  {currentAppointment.customerName}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">
                  {currentAppointment.phone}
                </span>
              </div>
            </div>
          )}

          {!currentAppointment && upcomingAppointment && (
            <div className="flex items-center space-x-4 bg-yellow-100 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Next: {upcomingAppointment.time}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  {upcomingAppointment.customerName}
                </span>
              </div>
            </div>
          )}

          <div className="text-xs text-blue-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

