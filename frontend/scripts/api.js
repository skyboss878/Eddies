// src/utils/api.js
import axios from 'axios';
import { showError } from './toast';

// Base URL - FIXED to point to your backend
export const API_BASE_URL = "http://192.168.1.26:5000";

// Create axios instances
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export const healthApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const uploadApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "multipart/form-data" },
});

// Add authentication token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

uploadApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 500) {
      console.warn('Server error, using defaults');
      return Promise.resolve({ data: {} });
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  auth: {
    login: (data) => api.post('/api/auth/login', data),
    register: (data) => api.post('/api/auth/register', data),
    me: () => api.get('/api/auth/me'),
    logout: () => api.post('/api/auth/logout'),
    refresh: () => api.post('/api/auth/refresh'),
  },

  settings: {
    shop: {
      get: () => api.get('/api/auth/settings/shop'),
      update: (data) => api.put('/api/auth/settings/shop', data)
    }
  },

  timeclock: {
    getStatus: () => api.get('/api/auth/timeclock/status'),
    clockIn: () => api.post('/api/auth/timeclock/clock-in'),
    clockOut: () => api.post('/api/auth/timeclock/clock-out'),
    getEntries: (params) => api.get('/api/auth/timeclock/entries', { params })
  },

  appointments: {
    getAll: (params) => api.get('/api/auth/appointments', { params }),
    create: (data) => api.post('/api/auth/appointments', data),
    getById: (id) => api.get(`/api/auth/appointments/${id}`),
    update: (id, data) => api.put(`/api/auth/appointments/${id}`, data),
    delete: (id) => api.delete(`/api/auth/appointments/${id}`),
  },

  customers: {
    getAll: (params) => api.get('/api/auth/customers', { params }),
    create: (data) => api.post('/api/auth/customers', data),
    getById: (id) => api.get(`/api/auth/customers/${id}`),
    update: (id, data) => api.put(`/api/auth/customers/${id}`, data),
    delete: (id) => api.delete(`/api/auth/customers/${id}`),
    search: (query) => api.get('/api/auth/customers/search', { params: { q: query } }),
  },

  vehicles: {
    getAll: (params) => api.get('/api/auth/vehicles', { params }),
    create: (data) => api.post('/api/auth/vehicles', data),
    getById: (id) => api.get(`/api/auth/vehicles/${id}`),
    update: (id, data) => api.put(`/api/auth/vehicles/${id}`, data),
    delete: (id) => api.delete(`/api/auth/vehicles/${id}`),
  },

  jobs: {
    getAll: (params) => api.get('/api/auth/jobs', { params }),
    create: (data) => api.post('/api/auth/jobs', data),
    getById: (id) => api.get(`/api/auth/jobs/${id}`),
    update: (id, data) => api.put(`/api/auth/jobs/${id}`, data),
    delete: (id) => api.delete(`/api/auth/jobs/${id}`),
  },
};

export default api;

// Enhanced GET wrapper for compatibility
export const enhancedGet = async (url, options = {}) => {
  const response = await api.get(url, options);
  return response;
};

// Simple cache placeholder
export const apiCache = new Map();
