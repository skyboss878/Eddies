import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiEndpoints } from '../utils/apiEndpoints';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ REMOVED the problematic useEffect - initial state handles it

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiEndpoints.auth.login({ email, password });
      
      // ✅ Add console.log to debug
      console.log('Login response:', response);
      console.log('Login response data:', response.data);
      
      const { token, user: userData } = response.data;

      // ✅ Verify token exists
      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);

      // ✅ Verify it was saved
      console.log('Token saved:', localStorage.getItem('token'));
      console.log('User saved:', localStorage.getItem('user'));

      return { success: true, user: userData };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const apiData = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        registration_code: userData.registrationCode
      };
      const response = await apiEndpoints.auth.register(apiData);
      const { token, user: newUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setLoading(false);

      return { success: true, user: newUser };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
