// src/utils/apiEndpoints.js - COMPLETE VERSION
import axios from 'axios';
import { showError } from './toast';

// Base URL
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";

// --- AXIOS INSTANCES ---
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const healthApi = axios.create({ baseURL: API_BASE_URL, timeout: 5000 });

export const uploadApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'multipart/form-data' },
});

// --- JWT Interceptors ---
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.metadata = { startTime: Date.now() };
  return config;
});

uploadApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') window.location.href = '/login';
          }
          break;
        case 403:
          showError('Access denied.');
          break;
        case 404:
          if (!originalRequest.url.includes('/health')) console.warn(`Endpoint not found: ${originalRequest.url}`);
          break;
        case 500:
          showError('Server error. Try again later.');
          break;
        default:
          if (data?.message) showError(data.message);
      }
    } else if (error.request) {
      if (!navigator.onLine) {
        RequestQueue.add(originalRequest);
        showError('You are offline. Request will retry when online.');
      } else {
        showError('Network error. Check your connection.');
      }
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// --- API CACHE & ENHANCED GET ---
class ApiCache {
  constructor(ttl = 300000) {
    this.cache = new Map();
    this.ttl = ttl;
  }
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
  set(key, data) {
    this.cache.set(key, { data, expiry: Date.now() + this.ttl });
  }
  delete(key) { this.cache.delete(key); }
  clear() { this.cache.clear(); }
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) this.cache.delete(key);
    }
  }
}

export const apiCache = new ApiCache();
const pendingRequests = new Map();

export const enhancedGet = async (url, options = {}) => {
  const { useCache = true, cacheKey = url, instance = api, ...axiosOptions } = options;

  if (useCache) {
    const cached = apiCache.get(cacheKey);
    if (cached) return { data: cached, fromCache: true };
  }

  if (pendingRequests.has(cacheKey)) return pendingRequests.get(cacheKey);

  const requestPromise = instance.get(url, axiosOptions)
    .then(response => {
      if (useCache) apiCache.set(cacheKey, response.data);
      pendingRequests.delete(cacheKey);
      return { data: response.data, fromCache: false };
    })
    .catch(error => {
      pendingRequests.delete(cacheKey);
      throw error;
    });

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
};

// --- OFFLINE REQUEST QUEUE ---
class RequestQueueClass {
  constructor() {
    this.queue = [];
    window.addEventListener('online', () => this.retryAll());
  }

  add(config) {
    this.queue.push(config);
    console.log('[RequestQueue] Request queued. Will retry when back online.');
  }

  async retryAll() {
    console.log('[RequestQueue] Back online. Retrying queued requests...');
    while (this.queue.length) {
      const config = this.queue.shift();
      try {
        await api(config);
        console.log('[RequestQueue] Request succeeded:', config.url);
      } catch (err) {
        console.error('[RequestQueue] Retry failed:', config.url, err);
        this.queue.push(config);
      }
    }
  }
}

export const RequestQueue = new RequestQueueClass();

// --- MIGRATION SERVICE ---
export const migrationService = {
  analyzeMigrationFile: (formData) => uploadApi.post('/api/migration/analyze', formData),
  importMigrationData: (data) => api.post('/api/migration/import', data).then(res => {
    apiCache.clear();
    return res;
  }),
};

// --- MUTATE OR QUEUE HELPER ---
const mutateOrQueue = (method, url, data) => api({ method, url, data });

// --- COMPLETE API ENDPOINTS ---
export const apiEndpoints = {
  // Health & Test
  healthCheck: () => healthApi.get('/api/health'),
  testEndpoint: () => api.get('/api/test'),

  // Authentication
  auth: {
    register: (data) => mutateOrQueue('post', '/api/auth/register', data),
    login: (data) => mutateOrQueue('post', '/api/auth/login', data),
    registerWithCode: (data) => mutateOrQueue('post', '/api/auth/register-with-code', data),
    me: () => api.get('/api/auth/me'),
    changePassword: (data) => mutateOrQueue('put', '/api/auth/change-password', data),
    logout: () => mutateOrQueue('post', '/api/auth/logout', {}),
    refresh: () => mutateOrQueue('post', '/api/auth/refresh', {}),
    verify: () => api.get('/api/auth/verify'),
  },

  // Customers
  customers: {
    getAll: (params) => api.get('/api/auth/customers', { params }),
    create: (data) => mutateOrQueue('post', '/api/auth/customers', data),
    getById: (id) => api.get(`/api/auth/customers/${id}`),
    update: (id, data) => mutateOrQueue('put', `/api/auth/customers/${id}`, data),
    delete: (id) => mutateOrQueue('delete', `/api/auth/customers/${id}`),
    getVehicles: (id) => api.get(`/api/auth/customers/${id}/vehicles`),
    search: (query) => api.get('/api/auth/customers/search', { params: { q: query } }),
    list: '/api/auth/customers', // for testing
  },

  // Vehicles
  vehicles: {
    getAll: (params) => api.get('/api/auth/vehicles', { params }),
    create: (data) => mutateOrQueue('post', '/api/auth/vehicles', data),
    getById: (id) => api.get(`/api/auth/vehicles/${id}`),
    update: (id, data) => mutateOrQueue('put', `/api/auth/vehicles/${id}`, data),
    delete: (id) => mutateOrQueue('delete', `/api/auth/vehicles/${id}`),
    vinLookup: (vin) => api.get(`/api/auth/vehicles/vin-lookup/${vin}`),
    list: '/api/auth/vehicles', // for testing
  },

  // Jobs/Work Orders
  jobs: {
    getAll: (params) => api.get('/api/auth/jobs', { params }),
    create: (data) => mutateOrQueue('post', '/api/auth/jobs', data),
    getById: (id) => api.get(`/api/auth/jobs/${id}`),
    update: (id, data) => mutateOrQueue('put', `/api/auth/jobs/${id}`, data),
    updateStatus: (id, data) => mutateOrQueue('patch', `/api/auth/jobs/${id}/status`, data),
    delete: (id) => mutateOrQueue('delete', `/api/auth/jobs/${id}`),
    addParts: (id, data) => mutateOrQueue('post', `/api/auth/jobs/${id}/parts`, data),
    addLabor: (id, data) => mutateOrQueue('post', `/api/auth/jobs/${id}/labor`, data),
    emailInvoice: (id) => mutateOrQueue('post', `/api/auth/jobs/${id}/email`, {}),
    list: '/api/auth/jobs', // for testing
  },

  // Work Orders (alias for jobs)
  workOrders: {
    getAll: (params) => api.get('/api/auth/jobs', { params }),
    create: (data) => mutateOrQueue('post', '/api/auth/jobs', data),
    getById: (id) => api.get(`/api/auth/jobs/${id}`),
    update: (id, data) => mutateOrQueue('put', `/api/auth/jobs/${id}`, data),
    delete: (id) => mutateOrQueue('delete', `/api/auth/jobs/${id}`),
    list: '/api/auth/jobs', // for testing
  },

  // Estimates
  estimates: {
    getAll: (params) => api.get("/api/auth/estimates", { params }),
    create: (data) => mutateOrQueue("post", "/api/auth/estimates", data),
    getById: (id) => api.get(`/api/auth/estimates/${id}`),
    update: (id, data) => mutateOrQueue("put", `/api/auth/estimates/${id}`, data),
    delete: (id) => mutateOrQueue("delete", `/api/auth/estimates/${id}`),
    generateNumber: () => api.get('/api/auth/estimates/generate-number'),
    list: '/api/auth/estimates', // for testing
  },

  // Invoices
  invoices: {
    getAll: (params) => api.get("/api/auth/invoices", { params }),
    create: (data) => mutateOrQueue("post", "/api/auth/invoices", data),
    getById: (id) => api.get(`/api/auth/invoices/${id}`),
    update: (id, data) => mutateOrQueue("put", `/api/auth/invoices/${id}`, data),
    delete: (id) => mutateOrQueue("delete", `/api/auth/invoices/${id}`),
    generateNumber: () => api.get('/api/auth/invoices/generate-number'),
    list: '/api/auth/invoices',
  },

  // Appointments
  appointments: {
    getAll: (params) => api.get("/api/auth/appointments", { params }),
    create: (data) => mutateOrQueue("post", "/api/auth/appointments", data),
    getById: (id) => api.get(`/api/auth/appointments/${id}`),
    update: (id, data) => mutateOrQueue("put", `/api/auth/appointments/${id}`, data),
    delete: (id) => mutateOrQueue("delete", `/api/auth/appointments/${id}`),
    list: '/api/auth/appointments',
  },

  // Parts & Inventory
  parts: {
    getAll: (params) => api.get('/api/auth/parts', { params }),
    create: (data) => mutateOrQueue('post', '/api/auth/parts', data),
    getById: (id) => api.get(`/api/auth/parts/${id}`),
    update: (id, data) => mutateOrQueue('put', `/api/auth/parts/${id}`, data),
    delete: (id) => mutateOrQueue('delete', `/api/auth/parts/${id}`),
    search: (query) => api.get('/api/auth/parts/search', { params: { q: query } }),
  },

  // Labor
  labor: {
    getAll: (params) => api.get('/api/auth/labor', { params }),
    create: (data) => mutateOrQueue('post', '/api/auth/labor', data),
    getById: (id) => api.get(`/api/auth/labor/${id}`),
    update: (id, data) => mutateOrQueue('put', `/api/auth/labor/${id}`, data),
    delete: (id) => mutateOrQueue('delete', `/api/auth/labor/${id}`),
  },

  // Inventory
  inventory: {
    getAll: (params) => api.get('/api/auth/inventory', { params }),
    create: (data) => mutateOrQueue('post', '/api/auth/inventory', data),
    getById: (id) => api.get(`/api/auth/inventory/${id}`),
    update: (id, data) => mutateOrQueue('put', `/api/auth/inventory/${id}`, data),
    delete: (id) => mutateOrQueue('delete', `/api/auth/inventory/${id}`),
    updateStock: (id, data) => mutateOrQueue('patch', `/api/auth/inventory/${id}/stock`, data),
  },

  // Time Clock
  timeclock: {
    getStatus: () => api.get('/api/timeclock/status'),
    getHistory: (params) => api.get('/api/timeclock/history', { params }),
    clockIn: () => mutateOrQueue('post', '/api/timeclock/clock-in', {}),
    clockOut: () => mutateOrQueue('post', '/api/timeclock/clock-out', {}),
    getEntries: (params) => api.get('/api/timeclock/entries', { params }),
  },

  // Dashboard
  dashboard: {
    stats: () => api.get('/api/dashboard/stats'),
    getRecentActivity: () => api.get('/api/dashboard/activity'),
    getOverview: () => api.get('/api/dashboard/overview'),
  },

  // Settings
  settings: {
    get: () => api.get('/api/settings'),
    update: (data) => mutateOrQueue('put', '/api/settings', data),
    getShop: () => api.get('/api/settings'), // Use same endpoint as get()
    updateShop: (data) => mutateOrQueue('put', '/api/settings', data),
  },

  // Reports
  reports: {
    getAll: (params) => api.get('/api/reports', { params }),
    generate: (type, params) => api.get(`/api/reports/${type}`, { params }),
    createCustom: (data) => mutateOrQueue('post', '/api/reports/custom', data),
  },

  // AI Services
  ai: {
    diagnostics: (data) => mutateOrQueue('post', '/api/ai/diagnostics', data),
    estimate: (data) => mutateOrQueue('post', '/api/ai/estimate', data),
    chat: (data) => mutateOrQueue('post', '/api/ai/chat', data),
    status: () => api.get('/api/ai/status'),
    diagnosis: (data) => mutateOrQueue('post', '/api/ai/diagnostics', data), // alias
  },

  // OBD2 Services
  obd2: {
    lookup: (code) => api.get(`/api/obd2/lookup/${code.toUpperCase()}`),
    lookupMultiple: (codes) => mutateOrQueue('post', '/api/obd2/lookup', { codes }),
  },

  // CarFax & Vehicle Reports
  carfax: {
    getReport: (vin) => mutateOrQueue('post', '/api/carfax/report', { vin }),
  },

  // Wiring Diagrams
  wiringDiagrams: {
    get: (data) => mutateOrQueue('post', '/api/wiring-diagrams', data),
  },

  // Technicians/Users
  technicians: {
    getAll: () => api.get('/api/technicians'),
    getById: (id) => api.get(`/api/technicians/${id}`),
  },

  users: {
    getAll: (params) => api.get('/api/users', { params }),
    getById: (id) => api.get(`/api/users/${id}`),
  },

  // Migration
  migration: migrationService,
};

// --- SERVICE OBJECTS FOR CONTEXT / DIRECT USAGE ---
export const customerService = apiEndpoints.customers;
export const vehicleService = apiEndpoints.vehicles;
export const jobService = apiEndpoints.jobs;
export const estimateService = apiEndpoints.estimates;
export const invoiceService = apiEndpoints.invoices;
export const dashboardService = apiEndpoints.dashboard;
export const settingsService = apiEndpoints.settings;
export const partsService = apiEndpoints.parts;
export const inventoryService = apiEndpoints.inventory;
export const timeclockService = apiEndpoints.timeclock;
export const reportsService = apiEndpoints.reports;
export const appointmentService = apiEndpoints.appointments;
export const aiService = apiEndpoints.ai;

// --- DEFAULT EXPORT ---
export default api;

// Debug helper for development
if (import.meta.env.DEV) {
  window.apiDebug = {
    cache: apiCache,
    endpoints: apiEndpoints,
    clearCache: () => apiCache.clear(),
    api,
  };
}
