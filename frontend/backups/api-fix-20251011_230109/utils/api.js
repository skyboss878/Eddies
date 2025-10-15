// src/utils/api.js - Fixed version
import axios from 'axios';
import { showError } from './toast';

// Use environment variable with fallback
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://192.168.1.85:5000";

// Main API instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Health check API
export const healthApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Upload API for file uploads
export const uploadApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "multipart/form-data" },
});

// Request interceptor - add JWT token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add interceptors to uploadApi
uploadApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

uploadApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Default export for backward compatibility
export default api;
