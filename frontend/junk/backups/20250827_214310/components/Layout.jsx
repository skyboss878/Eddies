// src/components/Layout.jsx - Fixed imports and structure
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useSettings } from "../contexts/SettingsProvider";
import TimeClockNavbar from './TimeClockNavbar';
import AppointmentBar from './AppointmentBar';

const Layout = () => {
  const { user, logout } = useAuth();
  const { refreshAllData, loading } = useData();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/app/vehicles', label: 'Vehicles', icon: '🚗' },
    { path: '/app/jobs', label: 'Jobs', icon: '🔧' },
    { path: '/app/customers', label: 'Customers', icon: '👥' },
    { path: '/app/estimates', label: 'Estimates', icon: '📄' },
    { path: '/app/invoices', label: 'Invoices', icon: '💰' },
    { path: '/app/appointments', label: 'Calendar', icon: '📅' },
    { path: '/app/parts-labor', label: 'Inventory', icon: '📦' },
    { path: '/app/reports', label: 'Reports', icon: '📊' },
    { path: '/app/ai-diagnostics', label: 'AI Tools', icon: '🤖' },
    { path: '/app/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActivePath = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Manual refresh for development
  const handleRefresh = () => {
    refreshAllData();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowMobileMenu(false);
    };

    if (showUserMenu || showMobileMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu, showMobileMenu]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <button
              onClick={() => navigate('/app/dashboard')}
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Eddie's Asian Automotive
            </button>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.first_name || user?.name || 'User'}
              </span>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(user?.first_name || user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <button
                      onClick={() => { 
                        navigate('/app/settings'); 
                        setShowUserMenu(false); 
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMobileMenu(!showMobileMenu);
                }}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { 
                    navigate(item.path); 
                    setShowMobileMenu(false); 
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                    isActivePath(item.path) 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto py-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath(item.path) 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Optional Components */}
      {settings?.shop && <TimeClockNavbar settings={settings} />}
      <AppointmentBar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>

      {/* Development Tools */}
      {import.meta.env.MODE === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleRefresh}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors shadow-lg"
            title="Refresh all data"
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
