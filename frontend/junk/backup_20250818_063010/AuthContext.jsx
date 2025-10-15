// src/components/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Token expiry checker
  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }, []);

  // Load and validate token from localStorage on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
          // Check if token is expired
          if (isTokenExpired(savedToken)) {
            console.log('Token expired, clearing auth');
            clearAuth();
          } else {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            
            // Set up axios interceptor for this token
            setupAxiosInterceptor(savedToken);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isTokenExpired]);

  // Setup axios interceptor for automatic token attachment
  const setupAxiosInterceptor = useCallback((authToken) => {
    // Request interceptor - attach token
    api.interceptors.request.use(
      (config) => {
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle 401s
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && authToken && !isRefreshing) {
          console.log('401 detected, attempting token refresh');
          const refreshResult = await refreshToken();
          
          if (refreshResult) {
            // Retry the original request with new token
            error.config.headers.Authorization = `Bearer ${token}`;
            return api.request(error.config);
          } else {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
  }, [token, isRefreshing]);

  // Save token & user to localStorage
  const saveAuth = useCallback((jwt, userData) => {
    try {
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      setupAxiosInterceptor(jwt);
    } catch (error) {
      console.error('Error saving auth:', error);
    }
  }, [setupAxiosInterceptor]);

  // Clear auth info
  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Optional: notify backend of logout
      if (token) {
        await api.post('/auth/logout').catch(() => {
          // Ignore logout API errors
        });
      }
    } finally {
      clearAuth();
    }
  }, [token, clearAuth]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token && response.data.user) {
        saveAuth(response.data.token, response.data.user);
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      console.error('Login error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      
      if (response.data.token && response.data.user) {
        saveAuth(response.data.token, response.data.user);
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      console.error('Register error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    if (!token || isRefreshing) return false;
    
    try {
      setIsRefreshing(true);
      const response = await api.post('/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.token) {
        saveAuth(response.data.token, user);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Refresh token failed:', err);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update user profile
  const updateUser = useCallback((updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, [user]);

  // Role checking utility
  const hasRole = useCallback((requiredRole) => {
    if (!user) return false;
    
    // Support both array of roles and single role
    if (Array.isArray(user.roles)) {
      return user.roles.includes(requiredRole);
    }
    
    return user.role === requiredRole;
  }, [user]);

  // Permission checking utility  
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    return user.permissions?.includes(permission) || false;
  }, [user]);

  const value = {
    // State
    token,
    user,
    loading,
    isRefreshing,
    
    // Actions
    login,
    register,
    logout,
    refreshToken,
    updateUser,
    
    // Utilities
    hasRole,
    hasPermission,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
