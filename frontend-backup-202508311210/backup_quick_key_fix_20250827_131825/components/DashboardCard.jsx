import React from 'react';

const DashboardCard = ({ title, children, className = '', headerActions = null }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl border border-gray-100 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {headerActions}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
