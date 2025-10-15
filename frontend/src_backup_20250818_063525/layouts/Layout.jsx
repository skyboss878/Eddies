// src/layouts/Layout.jsx - Updated to use unified DataContext
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useData } from '../contexts/DataContext'; // CHANGED: Use DataContext instead of ShopContext
import ErrorBoundaryWithAuth from '../components/ErrorBoundary';

export default function Layout() {
  const { refreshData, loading } = useData(); // CHANGED: Use refreshData instead of loadData

  useEffect(() => {
    // Data is automatically loaded when user is authenticated via DataContext
    // This useEffect is now optional, but kept for manual refresh capability
    console.log('🏗️ Layout mounted - data will load automatically when authenticated');
  }, []);

  // Optional: Add a manual refresh button for debugging
  const handleRefresh = () => {
    console.log('🔄 Manual data refresh triggered');
    refreshData();
  };

  return (
    <ErrorBoundaryWithAuth>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Optional: Show loading indicator at the top level */}
        {loading?.initialData && (
          <div className="bg-blue-500 text-white text-center py-2 px-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading shop data...</span>
            </div>
          </div>
        )}
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Optional: Debug panel in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={handleRefresh}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
              title="Refresh all data"
            >
              🔄 Refresh Data
            </button>
          </div>
        )}
      </div>
    </ErrorBoundaryWithAuth>
  );
}
