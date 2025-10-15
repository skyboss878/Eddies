// src/layouts/Layout.jsx - Full Dashboard Layout with complete navbar
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useData } from "../contexts/DataContext";
import ErrorBoundaryWithAuth from "../components/ErrorBoundaryWithAuth";

// Import full navbar components
//import CompleteNavigationMenu from "../components/CompleteNavigationMenu";
import Navbar from "../components/TimeClockNavbar";

export default function Layout() {
  const { refreshData, loading } = useData();

  useEffect(() => {
  }, []);

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <ErrorBoundaryWithAuth>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Navigation / Main Navbar */}
        {/* <CompleteNavigationMenu /> */}

        {/* Optional Time Clock Navbar for live employee tracking */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <Navbar />
          </div>
        </div>

        {/* Optional loading indicator */}
        {loading?.initialData && (
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
