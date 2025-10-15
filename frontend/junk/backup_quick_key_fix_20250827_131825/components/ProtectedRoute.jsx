// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts";
import LoadingSpinner from "./LoadingSpinner"; // ✅ only import spinner

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="lg" className="py-10" />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

