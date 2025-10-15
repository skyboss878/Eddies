// src/layouts/ProtectedDashboardLayout.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundaryWithAuth from "../components/ErrorBoundaryWithAuth";

// Full Dashboard components
import CompleteNavigationMenu from "../components/CompleteNavigationMenu";
import TimeClockNavbar from "../components/TimeClockNavbar";
import { useData } from "../contexts/DataContext";

export default function ProtectedDashboardLayout() {
  const { user, loading: authLoading, initialized } = useAuth();
  const { refreshData, loading: dataLoading } = useData();

  // Show loading while checking auth status
  if (!initialized || authLoading) {
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Navigation / Main Navbar */}
//         <CompleteNavigationMenu />

        {/* Optional Time Clock Navbar */}
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
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4">
            <Outlet />
          </div>
        </main>

        {/* Optional debug/refresh button for development */}
        {import.meta.env.MODE === 'development' && (
          <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
            <button
              onClick={handleRefresh}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
              title="Refresh all data"
            >
              🔄 Refresh Data
            </button>
            <a
              href="/guide.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 text-center"
            >
              View Implementation Guide
            </a>
          </div>
        )}
      </div>
    </ErrorBoundaryWithAuth>
  );
}
