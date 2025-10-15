// src/components/AppointmentBar.jsx - FIXED VERSION

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone } from 'lucide-react';
import apiEndpoints from '../utils/api';

const AppointmentBar = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  // FIX: Load real appointments from API
  useEffect(() => {
    const loadTodayAppointments = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await apiEndpoints.appointments.getAll({
          date: today,
          status: 'confirmed'
        });
        
        const appointments = response.data || [];
        setTodayAppointments(appointments);
        
        // Set current appointment (next upcoming)
        const now = new Date();
        const upcoming = appointments.find(apt => {
          const aptTime = new Date(`${today}T${apt.scheduled_time || '00:00'}`);
          return aptTime > now;
        });
        
        setCurrentAppointment(upcoming || appointments[0] || null);
      } catch (error) {
        console.error('Failed to load appointments:', error);
        // Fallback to empty state
        setTodayAppointments([]);
        setCurrentAppointment(null);
      } finally {
        setLoading(false);
      }
    };

    loadTodayAppointments();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadTodayAppointments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-700 text-white px-4 py-2 border-b border-gray-600">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <span className="text-sm text-gray-400">Loading appointments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 text-white px-4 py-2 border-b border-gray-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-yellow-400" />
          <span className="font-semibold text-sm">
            Today's Appointments ({todayAppointments.length})
          </span>
        </div>

        {currentAppointment ? (
          <div className="flex items-center space-x-4 text-xs">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{currentAppointment.scheduled_time || 'No time set'}</span>
            <User className="w-4 h-4 text-green-400" />
            <span>{currentAppointment.customer_name || 'Unknown customer'}</span>
            <Phone className="w-4 h-4 text-gray-300" />
            <span>{currentAppointment.customer_phone || 'No phone'}</span>
            <span className="text-gray-300">•</span>
            <span>{currentAppointment.service_type || 'General service'}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">No appointments today</span>
        )}
      </div>
    </div>
  );
};

export default AppointmentBar;
