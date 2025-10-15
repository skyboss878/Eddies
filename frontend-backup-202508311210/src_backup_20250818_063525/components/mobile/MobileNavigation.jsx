import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Customers', href: '/customers', icon: '👥' },
    { name: 'Vehicles', href: '/vehicles', icon: '🚗' },
    { name: 'Jobs', href: '/jobs', icon: '🔧' },
    { name: 'Estimates', href: '/estimates', icon: '📝' },
    { name: 'Invoices', href: '/invoices', icon: '💰' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden fixed top-0 left-0 z-40 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-8">Eddie's Auto</h2>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
