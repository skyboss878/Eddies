// src/pages/AppointmentCalendar/helpers.js
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

export const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'confirmed': return <CheckCircle className="w-4 h-4" />;
    case 'pending': return <AlertCircle className="w-4 h-4" />;
    case 'cancelled': return <XCircle className="w-4 h-4" />;
    case 'completed': return <CheckCircle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

export const formatTime = (timeString) =>
  new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });
