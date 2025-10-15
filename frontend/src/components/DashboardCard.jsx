// src/components/DashboardCard.jsx - ENHANCED VERSION

import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'bg-blue-500', 
  href, 
  trend, 
  children, 
  className = '', 
  headerActions = null 
}) => {
  const CardContent = () => (
    <div className={`bg-white shadow-lg rounded-xl border border-gray-100 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-sm text-gray-500 mt-1">{trend}</p>
            )}
          </div>
          {Icon && (
            <div className={`${color} p-3 rounded-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
        
        {headerActions && (
          <div className="mt-4 flex justify-end">
            {headerActions}
          </div>
        )}
      </div>
    </div>
  );

  // If href is provided, wrap in Link
  if (href) {
    return (
      <Link to={href} className="block hover:transform hover:scale-105 transition-transform duration-200">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default DashboardCard;
