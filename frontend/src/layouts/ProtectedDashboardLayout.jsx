// src/layouts/ProtectedDashboardLayout.jsx
import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundaryWithAuth from "../components/ErrorBoundaryWithAuth";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// Full Dashboard components
import Navigation from "../components/Navigation";
import TimeClockNavbar from "../components/TimeClockNavbar";
import { useData } from "../contexts/DataContext";

export default function ProtectedDashboardLayout() {
  const { user, loading: authLoading, initialized } = useAuth();
  const { refreshData, loading: dataLoading } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <ErrorBoundaryWithAuth>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar Navigation */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-white border-r border-gray-200 flex flex-col
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:block">
            <h1 className="text-xl font-bold text-gray-800">Eddie's Asian Auto</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <Navigation onNavigate={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header with hamburger */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="ml-3 text-lg font-semibold text-gray-800">Eddie's Asian Auto</h1>
          </div>

          {/* Time Clock Navbar */}
          <div className="bg-gray-100 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-2">
              <TimeClockNavbar />
            </div>
          </div>

          {/* Optional loading indicator */}
          {dataLoading?.initialData && (
            <div className="bg-blue-500 text-white text-center py-2 px-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading shop data...</span>
              </div>
            </div>
          )}

          {/* Main page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4">
              <Outlet />
            </div>
          </main>

          {/* Optional debug/refresh button for development */}
          {import.meta.env.MODE === 'development' && (
            <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
              <button
                onClick={handleRefresh}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors shadow-lg"
                title="Refresh all data"
              >
                🔄 Refresh Data
              </button>
              <a
                href="/guide.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 text-center shadow-lg"
              >
                View Implementation Guide
              </a>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundaryWithAuth>
  );
}
