// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiEndpoints } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token is still valid by getting user profile
          const response = await apiEndpoints.auth.me();
          setUser(response.data.user);
        } catch (error) {
          // Clear invalid token
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiEndpoints.auth.login({
        email,
        password
      });

      const { token, user: userData, message } = response.data;

      // Store token
      localStorage.setItem('token', token);

      // Update user state
      setUser(userData);

      return { success: true, user: userData };

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiEndpoints.auth.register(userData);

      const { token, user: newUser, message } = response.data;

      // Store token
      localStorage.setItem('token', token);

      // Update user state
      setUser(newUser);

      return { success: true, user: newUser };

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await apiEndpoints.auth.logout();
    } catch (error) {
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || isAdmin;
  const isTechnician = user?.role === 'technician';

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    isManager,
    isTechnician,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
