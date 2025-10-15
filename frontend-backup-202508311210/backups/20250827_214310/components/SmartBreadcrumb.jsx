// src/components/SmartBreadcrumb.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const SmartBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Route name mapping
  const routeNames = {
    'dashboard': 'Dashboard',
    'customers': 'Customers',
    'vehicles': 'Vehicles',
    'jobs': 'Jobs',
    'estimates': 'Estimates',
    'invoices': 'Invoices',
    'appointments': 'Appointments',
    'reports': 'Reports',
    'parts-labor': 'Parts & Labor',
    'inventory': 'Inventory',
    'settings': 'Settings',
    'ai': 'AI Dashboard',
    'ai-diagnostics': 'AI Diagnostics',
    'timeclock': 'Time Clock',
    'employees': 'Employees',
    'payroll': 'Payroll',
    'add': 'Add New',
    'new': 'Add New',
    'create': 'Create',
    'edit': 'Edit',
    'calendar': 'Calendar',
    'profile': 'Profile',
    'data': 'Data Management',
    'backup': 'Backup',
    'export': 'Export'
  };

  // Don't show breadcrumbs on login or register pages
  if (pathnames.includes('login') || pathnames.includes('register')) {
    return null;
  }

  // Don't show breadcrumbs if we're on the root dashboard
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null;
  }

  const generateBreadcrumbs = () => {
    return pathnames.map((path, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      // Get display name
      const displayName = routeNames[path] || path.charAt(0).toUpperCase() + path.slice(1);
      
      // Handle ID parameters (numbers)
      const isId = /^\d+$/.test(path);
      if (isId) {
        const parentPath = pathnames[index - 1];
        const idDisplayName = `${routeNames[parentPath] || parentPath} #${path}`;
        
        return {
          name: idDisplayName,
          path: routeTo,
          isLast,
          isId: true
        };
      }

      return {
        name: displayName,
        path: routeTo,
        isLast,
        isId: false
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
      {/* Home/Dashboard Link */}
      <Link
        to="/dashboard"
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <HomeIcon className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Dashboard</span>
      </Link>

      {/* Breadcrumb Items */}
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          
          {crumb.isLast ? (
            <span className="font-medium text-gray-900 truncate max-w-xs">
              {crumb.name}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-blue-600 transition-colors truncate max-w-xs"
            >
              {crumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default SmartBreadcrumb;
