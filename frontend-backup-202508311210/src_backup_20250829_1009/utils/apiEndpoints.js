import axios from 'axios';

// Base URL
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// JWT request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

// Health API (no auth)
const healthApi = axios.create({ baseURL: API_BASE_URL, timeout: 5000 });

// Migration Service
const migrationService = {
  analyzeMigrationFile: (formData) =>
    api.post('/api/migration/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  importMigrationData: (data) => api.post('/api/migration/import', data),
};

// API ENDPOINTS - FULLY MATCHED TO BACKEND
const apiEndpoints = {
  // Health
  healthCheck: () => healthApi.get('/api/health'),
  testEndpoint: () => api.get('/api/test'),

  // Auth
  auth: {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
    registerWithCode: (data) => api.post('/api/auth/register-with-code', data),
    me: () => api.get('/api/auth/me'),
    changePassword: (data) => api.put('/api/auth/change-password', data),
    logout: () => api.post('/api/auth/logout'),
    refresh: () => api.post('/api/auth/refresh'),
  },

  // Customers
  customers: {
    getAll: (params) => api.get('/api/auth/customers', { params }),
    create: (data) => api.post('/api/auth/customers', data),
    getById: (id) => api.get(`/api/auth/customers/${id}`),
    update: (id, data) => api.put(`/api/auth/customers/${id}`, data),
    delete: (id) => api.delete(`/api/auth/customers/${id}`),
    getVehicles: (id) => api.get(`/api/auth/customers/${id}/vehicles`),
    search: (query) => api.get('/api/auth/customers/search', { params: { q: query } }),
  },

  // Vehicles
  vehicles: {
    getAll: (params) => api.get('/api/auth/vehicles', { params }),
    create: (data) => api.post('/api/auth/vehicles', data),
    getById: (id) => api.get(`/api/auth/vehicles/${id}`),
    update: (id, data) => api.put(`/api/auth/vehicles/${id}`, data),
    delete: (id) => api.delete(`/api/auth/vehicles/${id}`),
    vinLookup: (vin) => api.get(`/api/auth/vehicles/vin-lookup/${vin}`),
  },

  // Jobs
  jobs: {
    getAll: (params) => api.get('/api/auth/jobs', { params }),
    create: (data) => api.post('/api/auth/jobs', data),
    getById: (id) => api.get(`/api/auth/jobs/${id}`),
    updateStatus: (id, data) => api.patch(`/api/auth/jobs/${id}/status`, data),
    addParts: (id, data) => api.post(`/api/auth/jobs/${id}/parts`, data),
    addLabor: (id, data) => api.post(`/api/auth/jobs/${id}/labor`, data),
  },

  // Timeclock
  timeclock: {
    clockIn: () => api.post('/api/auth/timeclock/clock-in'),
    clockOut: () => api.post('/api/auth/timeclock/clock-out'),
    status: () => api.get('/api/auth/timeclock/status'),
    history: (params) => api.get('/api/auth/timeclock/history', { params }),
  },

  // Parts & Inventory
  parts: {
    getAll: (params) => api.get('/api/auth/parts', { params }),
    create: (data) => api.post('/api/auth/parts', data),
  },
  inventory: {
    lowStock: () => api.get('/api/auth/inventory/low-stock'),
  },

  // Estimates
  estimates: {
    getAll: (params) => api.get('/api/auth/estimates', { params }),
    create: (data) => api.post('/api/auth/estimates', data),
    getById: (id) => api.get(`/api/auth/estimates/${id}`),
    update: (id, data) => api.put(`/api/auth/estimates/${id}`, data),
    convertToJob: (id) => api.post(`/api/auth/estimates/${id}/convert-to-job`),
  },

  // Invoices
  invoices: {
    getAll: (params) => api.get('/api/auth/invoices', { params }),
    create: (data) => api.post('/api/auth/invoices', data),
    getById: (id) => api.get(`/api/auth/invoices/${id}`),
    update: (id, data) => api.put(`/api/auth/invoices/${id}`, data),
    markPaid: (id, data) => api.post(`/api/auth/invoices/${id}/mark-paid`, data),
  },

  // Appointments
  appointments: {
    getAll: (params) => api.get('/api/auth/appointments', { params }),
    create: (data) => api.post('/api/auth/appointments', data),
    getById: (id) => api.get(`/api/auth/appointments/${id}`),
    update: (id, data) => api.put(`/api/auth/appointments/${id}`, data),
    delete: (id) => api.delete(`/api/auth/appointments/${id}`),
  },

  // Dashboard & Reports
  dashboard: {
    stats: () => api.get('/api/auth/dashboard/stats'),
    recentActivity: () => api.get('/api/auth/dashboard/recent-activity'),
  },
  reports: {
    sales: (params) => api.get('/api/auth/reports/sales', { params }),
  },

  // Settings
  settings: {
    get: () => api.get('/api/auth/settings'),
    shop: {
      get: () => api.get('/api/auth/settings/shop'),
      update: (data) => api.put('/api/auth/settings/shop', data),
    },
  },

  // AI Services
  ai: {
    diagnostics: (data) => api.post('/api/ai/diagnostics', data),
    estimate: (data) => api.post('/api/ai/estimate', data),
    chat: (data) => api.post('/api/ai/chat', data),
    status: () => api.get('/api/ai/status'),
  },

  // OBD2
  obd2: {
    lookup: (code) => api.get(`/api/obd2/lookup/${code}`),
  },
};

// Export services for context / direct usage
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

// Export default axios instance
export default api;
export { API_BASE_URL, apiEndpoints, migrationService };

// API Utilities
export const apiUtils = {
  requireAuth: () => !!localStorage.getItem('token') || !!sessionStorage.getItem('token'),

  formatError: (error) => {
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
  },

  isTokenExpired: () => {
    const token = localStorage.getItem('token');
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return false;
    }
  },
};
