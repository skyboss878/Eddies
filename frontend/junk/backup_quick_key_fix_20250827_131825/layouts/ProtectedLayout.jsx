// src/layouts/ProtectedLayout.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../contexts";
import LoadingSpinner from "../components";

export default function ProtectedLayout() {
  const { user, loading, initialized } = useAuth();

  // Show loading while checking auth status
  if (!initialized || loading) {
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

  return <Outlet />;
}
