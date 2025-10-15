// src/components/DashboardCard.jsx
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral', 
  onClick, 
  className = '',
  subtitle = '',
  loading = false 
}) => {
  const getChangeIcon = () => {
    if (changeType === 'increase') {
      return <ArrowUpIcon className="w-4 h-4 text-green-600" />;
    } else if (changeType === 'decrease') {
      return <ArrowDownIcon className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className} animate-pulse`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:bg-gray-50 transform hover:-translate-y-1' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          
          {subtitle && (
            <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
          )}
          
          {change && (
            <div className="flex items-center">
              {getChangeIcon()}
              <span className={`text-sm font-medium ml-1 ${getChangeColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="ml-4 flex-shrink-0">
            <div className="p-3 bg-gray-50 rounded-full">
              {React.cloneElement(icon, {
                className: `${icon.props.className || 'w-6 h-6 text-gray-600'}`
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
