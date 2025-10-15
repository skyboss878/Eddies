// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  fallbackPath = '/login',
  showUnauthorized = false 
}) => {
  const { token, user, loading, hasRole } = useAuth();
  const location = useLocation();

  // Show spinner while auth status is being checked
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // If no token, redirect to login with return path
  if (!token) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access if required
  if (requiredRole && !hasRole(requiredRole)) {
    if (showUnauthorized) {
      return (
        <div className="unauthorized-access">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      );
    }
    
    // Redirect to dashboard or appropriate fallback
    return <Navigate to="/dashboard" replace />;
  }

  // Token exists and role check passed - render protected content
  return children;
};

export default ProtectedRoute;
