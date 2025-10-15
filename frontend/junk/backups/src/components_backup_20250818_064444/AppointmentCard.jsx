// src/components/AppointmentCard.jsx
import React from 'react';
import {
  ClockIcon,
  PhoneIcon,
  TruckIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

const AppointmentCard = ({ 
  appointment, 
  onClick, 
  onConfirm,
  onCancel,
  onCall,
  className = '',
  showActions = true 
}) => {
  const getTimeStatus = (time, date) => {
    const now = new Date();
    const appointmentDateTime = new Date();
    
    if (date === 'Today') {
      const [timeStr, period] = time.split(' ');
      const [hours, minutes] = timeStr.split(':');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      appointmentDateTime.setHours(hour, parseInt(minutes), 0, 0);
      
      const timeDiff = appointmentDateTime - now;
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 0) return { status: 'overdue', color: 'text-red-600' };
      if (hoursDiff < 1) return { status: 'soon', color: 'text-orange-600' };
      if (hoursDiff < 2) return { status: 'upcoming', color: 'text-yellow-600' };
      return { status: 'scheduled', color: 'text-green-600' };
    }
    
    return { status: 'future', color: 'text-blue-600' };
  };

  const formatPhoneForCall = (phone) => {
    return phone.replace(/[^\d]/g, '');
  };

  const getServiceIcon = (service) => {
    const serviceLower = service?.toLowerCase() || '';
    if (serviceLower.includes('inspection')) return <CheckCircleIcon className="w-4 h-4" />;
    if (serviceLower.includes('oil')) return <DocumentTextIcon className="w-4 h-4" />;
    if (serviceLower.includes('brake')) return <TruckIcon className="w-4 h-4" />;
    return <DocumentTextIcon className="w-4 h-4" />;
  };

  const timeStatus = getTimeStatus(appointment.time, appointment.date);

  return (
    <div 
      className={`
        bg-white border-l-4 border-blue-400 rounded-lg p-4 hover:bg-gray-50 
        transition-all duration-200 shadow-sm hover:shadow-md
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <UserIcon className="w-4 h-4 text-gray-500 mr-2" />
            <h3 className="font-semibold text-gray-900">{appointment.customer}</h3>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <TruckIcon className="w-4 h-4 mr-2" />
            <span>{appointment.vehicle}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center text-sm font-medium mb-1">
            <CalendarDaysIcon className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-gray-700">{appointment.date}</span>
          </div>
          <div className={`flex items-center text-sm font-medium ${timeStatus.color}`}>
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="mb-3">
        <div className="flex items-center mb-2">
          {getServiceIcon(appointment.service)}
          <span className="ml-2 font-medium text-gray-800">{appointment.service}</span>
        </div>
        
        {appointment.notes && (
          <div className="bg-gray-50 rounded-md p-2">
            <p className="text-sm text-gray-600 italic">"{appointment.notes}"</p>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mb-3">
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${timeStatus.status === 'overdue' ? 'bg-red-100 text-red-800' : ''}
          ${timeStatus.status === 'soon' ? 'bg-orange-100 text-orange-800' : ''}
          ${timeStatus.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${timeStatus.status === 'scheduled' ? 'bg-green-100 text-green-800' : ''}
          ${timeStatus.status === 'future' ? 'bg-blue-100 text-blue-800' : ''}
        `}>
          {timeStatus.status === 'overdue' && 'Overdue'}
          {timeStatus.status === 'soon' && 'Starting Soon'}
          {timeStatus.status === 'upcoming' && 'Upcoming'}
          {timeStatus.status === 'scheduled' && 'Scheduled'}
          {timeStatus.status === 'future' && 'Future'}
        </span>
      </div>

      {/* Contact & Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Phone Contact */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onCall) {
                onCall(appointment.phone);
              } else {
                window.open(`tel:${formatPhoneForCall(appointment.phone)}`);
              }
            }}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <PhoneIcon className="w-4 h-4 mr-1" />
            {appointment.phone}
          </button>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfirm?.(appointment.id);
              }}
              className="flex items-center text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              title="Confirm Appointment"
            >
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Confirm
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel?.(appointment.id);
              }}
              className="flex items-center text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              title="Cancel Appointment"
            >
              <XMarkIcon className="w-3 h-3 mr-1" />
              Cancel
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(appointment);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Details →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
