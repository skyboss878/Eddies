// src/utils/api.js
import axios from 'axios';
import { showError } from './toast';

export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://192.168.1.85:5000";

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

// Interceptors
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

uploadApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
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

// Enhanced GET with caching
export const apiCache = new Map();
export const enhancedGet = async (url, options = {}) => {
  const cacheKey = `${url}${JSON.stringify(options.params || {})}`;
  if (apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < 30000) return cached.data;
  }
  const response = await api.get(url, options);
  apiCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
  return response.data;
};

export default api;
