// src/components/ProtectedRoute.jsx - Authentication guard component
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    // If user doesn't have required role, redirect to dashboard with error
    return <Navigate to="/app/dashboard" replace state={{ 
      error: `Access denied. ${requiredRole} role required.` 
    }} />;
  }

  // User is authenticated (and authorized if role check passed)
  return children;
};

export default ProtectedRoute;
