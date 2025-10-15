// src/components/TechnicianCard.jsx
import React from 'react';
import {
  UserIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  ExclamationCircleIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/solid';

const TechnicianCard = ({ 
  technician, 
  onClick, 
  onAssignJob,
  onViewSchedule,
  className = '',
  showActions = true 
}) => {
  const getStatusColor = (status) => {
    const colors = {
      'working': 'bg-green-100 text-green-800 border-green-200',
      'available': 'bg-blue-100 text-blue-800 border-blue-200',
      'on break': 'bg-gray-100 text-gray-800 border-gray-200',
      'offline': 'bg-red-100 text-red-800 border-red-200',
      'busy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'working':
        return <WrenchScrewdriverIcon className="w-4 h-4" />;
      case 'available':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'on break':
        return <PauseCircleIcon className="w-4 h-4" />;
      case 'offline':
        return <ExclamationCircleIcon className="w-4 h-4" />;
      case 'busy':
        return <ClockIcon className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyBarColor = (efficiency) => {
    if (efficiency >= 90) return 'bg-green-500';
    if (efficiency >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderSpecialties = (specialties) => {
    if (!specialties || specialties.length === 0) return null;
    
    return specialties.slice(0, 3).map((specialty, index) => (
      <span
        key={index}
        className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
      >
        {specialty}
      </span>
    ));
  };

  return (
    <div 
      className={`
        bg-white border rounded-lg p-4 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
            {technician.name ? technician.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'T'}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{technician.name}</h3>
            {technician.yearsExperience && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <AcademicCapIcon className="w-4 h-4 mr-1" />
                <span>{technician.yearsExperience} years experience</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Status Badge */}
        <span className={`
          px-3 py-1 rounded-full text-xs font-medium border flex items-center
          ${getStatusColor(technician.status)}
        `}>
          {getStatusIcon(technician.status)}
          <span className="ml-1 capitalize">{technician.status}</span>
        </span>
      </div>

      {/* Current Assignment */}
      <div className="mb-3">
        {technician.currentJob ? (
          <div className="bg-gray-50 rounded-md p-2">
            <div className="flex items-center text-sm">
              <WrenchScrewdriverIcon className="w-4 h-4 text-gray-500 mr-2" />
              <span className="font-medium text-gray-800">Current Job:</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{technician.currentJob}</p>
          </div>
        ) : (
          <div className="bg-green-50 rounded-md p-2">
            <div className="flex items-center text-sm">
              <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
              <span className="font-medium text-green-800">Available for assignment</span>
            </div>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>{technician.availability}</span>
        </div>
      </div>

      {/* Efficiency Rating */}
      {technician.efficiency && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Efficiency</span>
            <span className={`font-medium ${getEfficiencyColor(technician.efficiency)}`}>
              {technician.efficiency}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getEfficiencyBarColor(technician.efficiency)}`}
              style={{ width: `${technician.efficiency}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Specialties */}
      {technician.specialties && technician.specialties.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-1">
            {renderSpecialties(technician.specialties)}
            {technician.specialties.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{technician.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Rating */}
      {technician.rating && (
        <div className="mb-3 flex items-center">
          <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
          <span className="text-sm font-medium text-gray-900">{technician.rating}</span>
          <span className="text-sm text-gray-500 ml-1">
            ({technician.reviewCount || 0} reviews)
          </span>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex space-x-2">
            {technician.status?.toLowerCase() === 'available' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAssignJob?.(technician.id);
                }}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors font-medium"
              >
                Assign Job
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewSchedule?.(technician.id);
              }}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Schedule
            </button>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(technician);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            View Profile →
          </button>
        </div>
      )}
    </div>
  );
};

export default TechnicianCard;
