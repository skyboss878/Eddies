// src/utils/tokenManager.js - Consistent with main api.js

const TOKEN_KEY = 'token'; // Changed from 'eddies_token' to match main api.js
const USER_KEY = 'user';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserData = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setUserData = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const removeUserData = () => {
  localStorage.removeItem(USER_KEY);
};

export const clearAllAuthData = () => {
  removeToken();
  removeUserData();
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Check if token is expired (if it's a JWT)
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    // If token is not a valid JWT, assume it's not expired
    return false;
  }
};

export default {
  getToken,
  setToken,
  removeToken,
  getUserData,
  setUserData,
  removeUserData,
  clearAllAuthData,
  isAuthenticated,
  isTokenExpired
};
