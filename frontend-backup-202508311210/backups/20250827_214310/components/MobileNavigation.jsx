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
    { name: 'Inventory', href: '/inventory', icon: '📦' },
    { name: 'Reports', href: '/reports', icon: '📈' },
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

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile menu */}
      <div className={`md:hidden fixed top-0 left-0 z-40 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800">Eddie's Auto</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom navigation for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-4 py-2">
          {navigation.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-1 text-xs transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
