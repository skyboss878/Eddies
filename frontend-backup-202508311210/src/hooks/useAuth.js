// src/hooks/useAuth.js - Improved authentication hook
import { useState, useEffect, useCallback } from 'react';
import { apiEndpoints, handleApiError } from '../utils/errorUtils';
import { tokenManager } from '../utils/tokenManager';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return tokenManager.isAuthenticated() && !tokenManager.isTokenExpired();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiEndpoints.auth.login(credentials);
      const { token, user: userData } = response.data;
      
      tokenManager.setToken(token);
      tokenManager.setUserData(userData);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiEndpoints.auth.register(userData);
      const { token, user: newUser } = response.data;
      
      tokenManager.setToken(token);
      tokenManager.setUserData(newUser);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      await apiEndpoints.auth.logout();
    } catch (error) {
      console.warn('Logout request failed:', error.message);
    } finally {
      tokenManager.clearAllAuthData();
      setUser(null);
      setError(null);
      setLoading(false);
      
      // Redirect to login
      window.location.href = '/login';
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const response = await apiEndpoints.auth.refresh();
      const { token } = response.data;
      
      tokenManager.setToken(token);
      return true;
    } catch (error) {
      console.warn('Token refresh failed:', error.message);
      await logout();
      return false;
    }
  }, [logout]);

  // Get current user profile
  const getCurrentUser = useCallback(async () => {
    if (!isAuthenticated()) {
      return null;
    }

    try {
      const response = await apiEndpoints.auth.me();
      const userData = response.data;
      
      setUser(userData);
      tokenManager.setUserData(userData);
      
      return userData;
    } catch (error) {
      console.warn('Failed to get current user:', error.message);
      if (error.response?.status === 401) {
        await logout();
      }
      return null;
    }
  }, [isAuthenticated, logout]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      if (isAuthenticated()) {
        // Try to get current user data
        const userData = tokenManager.getUserData();
        
        if (userData) {
          setUser(userData);
          // Verify token is still valid by fetching fresh user data
          await getCurrentUser();
        } else {
          await getCurrentUser();
        }
      } else {
        // Check if we have a token but it's expired
        if (tokenManager.getToken() && tokenManager.isTokenExpired()) {
          tokenManager.clearAllAuthData();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, [isAuthenticated, getCurrentUser]);

  // Auto refresh token before expiration
  useEffect(() => {
    if (!isAuthenticated()) return;

    const token = tokenManager.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;
      
      // Refresh token 5 minutes before expiration
      const refreshTime = timeUntilExpiration - (5 * 60 * 1000);
      
      if (refreshTime > 0) {
        const refreshTimer = setTimeout(() => {
          refreshToken();
        }, refreshTime);
        
        return () => clearTimeout(refreshTimer);
      }
    } catch (error) {
      console.warn('Error parsing token for auto-refresh:', error.message);
    }
  }, [user, isAuthenticated, refreshToken]);

  // Change password function
  const changePassword = useCallback(async (passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiEndpoints.auth.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: isAuthenticated(),
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
    changePassword,
    clearError: () => setError(null)
  };
};
