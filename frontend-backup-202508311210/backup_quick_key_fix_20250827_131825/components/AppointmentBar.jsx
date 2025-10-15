// src/components/AppointmentBar.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone } from 'lucide-react';

const AppointmentBar = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // Mock data - replace with actual API call
  useEffect(() => {
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
      }
    ];
    setTodayAppointments(mockAppointments);
    setCurrentAppointment(mockAppointments[0]);
  }, []);

  return (
    <div className="bg-gray-700 text-white px-4 py-2 border-b border-gray-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-yellow-400" />
          <span className="font-semibold text-sm">Today's Appointments</span>
        </div>

        {currentAppointment ? (
          <div className="flex items-center space-x-4 text-xs">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{currentAppointment.time}</span>
            <User className="w-4 h-4 text-green-400" />
            <span>{currentAppointment.customerName}</span>
            <Phone className="w-4 h-4 text-gray-300" />
            <span>{currentAppointment.phone}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">No appointments today</span>
        )}
      </div>
    </div>
  );
};

export default AppointmentBar;
