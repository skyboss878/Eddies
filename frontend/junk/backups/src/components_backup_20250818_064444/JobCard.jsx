// src/components/JobCard.jsx
import React from 'react';
import { 
  ClockIcon, 
  UserIcon, 
  WrenchScrewdriverIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PauseCircleIcon
} from '@heroicons/react/24/solid';

const JobCard = ({ 
  job, 
  onClick, 
  onStatusChange,
  onPriorityChange,
  className = '',
  showActions = true 
}) => {
  const getStatusColor = (status) => {
    const colors = {
      'in progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'waiting for parts': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'ready for pickup': 'bg-green-100 text-green-800 border-green-200',
      'completed': 'bg-gray-100 text-gray-800 border-gray-200',
      'scheduled': 'bg-purple-100 text-purple-800 border-purple-200',
      'on hold': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'text-red-600 bg-red-50 border-red-200',
      'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'normal': 'text-green-600 bg-green-50 border-green-200',
      'low': 'text-gray-600 bg-gray-50 border-gray-200',
    };
    return colors[priority?.toLowerCase()] || 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return <WrenchScrewdriverIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'on hold':
        return <PauseCircleIcon className="w-4 h-4" />;
      case 'waiting for parts':
        return <ClockIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div 
      className={`
        bg-white border rounded-lg p-4 hover:bg-gray-50 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{job.customer}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <TruckIcon className="w-4 h-4 mr-1" />
            <span>{job.vehicle}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {/* Priority Badge */}
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium border
            ${getPriorityColor(job.priority)}
          `}>
            {job.priority === 'high' && <ExclamationTriangleIcon className="w-3 h-3 inline mr-1" />}
            {job.priority}
          </span>
          
          {/* Status Badge */}
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium border flex items-center
            ${getStatusColor(job.status)}
          `}>
            {getStatusIcon(job.status)}
            <span className="ml-1">{job.status}</span>
          </span>
        </div>
      </div>

      {/* Service Description */}
      <div className="mb-3">
        <p className="text-gray-800 font-medium">{job.service}</p>
        {job.description && (
          <p className="text-sm text-gray-600 mt-1">{job.description}</p>
        )}
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        {/* Technician */}
        {job.technician && (
          <div className="flex items-center text-gray-600">
            <UserIcon className="w-4 h-4 mr-2" />
            <span>{job.technician}</span>
          </div>
        )}
        
        {/* Amount */}
        <div className="flex items-center text-gray-900 font-medium">
          <CurrencyDollarIcon className="w-4 h-4 mr-2" />
          <span>{formatCurrency(job.amount)}</span>
        </div>
        
        {/* Start Date */}
        {job.startDate && (
          <div className="flex items-center text-gray-600">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span>Started: {formatDate(job.startDate)}</span>
          </div>
        )}
        
        {/* Estimated Completion */}
        <div className="flex items-center text-gray-600">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>{job.estimatedCompletion}</span>
        </div>
      </div>

      {/* Progress Bar (for in-progress jobs) */}
      {job.status?.toLowerCase() === 'in progress' && job.progress && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{job.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(job.id, 'in progress');
              }}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              disabled={job.status?.toLowerCase() === 'in progress'}
            >
              Start
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(job.id, 'completed');
              }}
              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              disabled={job.status?.toLowerCase() === 'completed'}
            >
              Complete
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(job.id, 'on hold');
              }}
              className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
            >
              Hold
            </button>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(job);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details →
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;
