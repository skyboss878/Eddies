import axios from 'axios';

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.26:5000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

// Create main axios instance
const api = axios.create({
  baseURL: "http://192.168.1.26:5000",
  baseURL: "http://192.168.1.26:5000"
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Health check API (no auth required)
const healthApi = axios.create({
  baseURL: "http://192.168.1.26:5000",
  baseURL: "http://192.168.1.26:5000"
  timeout: 5000,
});

// API endpoints object
export const apiEndpoints = {
  // System Health
  healthCheck: () => healthApi.get('/health'),
  
  // Authentication Endpoints
  auth: {
    login: (credentials) => api.post('/api/auth/login', credentials),
    register: (userData) => api.post('/api/auth/register', userData),
    registerWithCode: (data) => api.post('/api/auth/register-with-code', data),
    logout: () => api.post('/api/auth/logout'),
    refreshToken: () => api.post('/api/auth/refresh'),
    getCurrentUser: () => api.get('/api/auth/me'),
    changePassword: (data) => api.put('/api/auth/change-password', data),
  },
  
  // Customer Management
  customers: {
    getAll: (params) => api.get('/api/auth/customers', { params }),
    create: (data) => api.post('/api/auth/customers', data),
    getById: (id) => api.get(`/auth/customers/${id}`),
    update: (id, data) => api.put(`/auth/customers/${id}`, data),
    delete: (id) => api.delete(`/auth/customers/${id}`),
    search: (query) => api.get('/api/auth/customers/search', { params: { q: query } }),
    getVehicles: (customerId) => api.get(`/auth/customers/${customerId}/vehicles`),
  },
  
  // Vehicle Management
  vehicles: {
    getAll: (params) => api.get('/api/auth/vehicles', { params }),
    create: (data) => api.post('/api/auth/vehicles', data),
    getById: (id) => api.get(`/auth/vehicles/${id}`),
    update: (id, data) => api.put(`/auth/vehicles/${id}`, data),
    delete: (id) => api.delete(`/auth/vehicles/${id}`),
    vinLookup: (vin) => api.get(`/auth/vehicles/vin-lookup/${vin}`),
  },
  
  // Job Management
  jobs: {
    getAll: (params) => api.get('/api/auth/jobs', { params }),
    create: (data) => api.post('/api/auth/jobs', data),
    getById: (id) => api.get(`/auth/jobs/${id}`),
    update: (id, data) => api.put(`/auth/jobs/${id}`, data),
    updateStatus: (id, status) => api.patch(`/auth/jobs/${id}/status`, { status }),
    addParts: (id, parts) => api.post(`/auth/jobs/${id}/parts`, parts),
    addLabor: (id, labor) => api.post(`/auth/jobs/${id}/labor`, labor),
  },
  
  // Estimate Management
  estimates: {
    getAll: (params) => api.get('/api/auth/estimates', { params }),
    create: (data) => api.post('/api/auth/estimates', data),
    getById: (id) => api.get(`/auth/estimates/${id}`),
    update: (id, data) => api.put(`/auth/estimates/${id}`, data),
    convertToJob: (id) => api.post(`/auth/estimates/${id}/convert-to-job`),
  },
  
  // Invoice Management
  invoices: {
    getAll: (params) => api.get('/api/auth/invoices', { params }),
    create: (data) => api.post('/api/auth/invoices', data),
    getById: (id) => api.get(`/auth/invoices/${id}`),
    update: (id, data) => api.put(`/auth/invoices/${id}`, data),
    markPaid: (id) => api.post(`/auth/invoices/${id}/mark-paid`),
  },
  
  // Parts & Inventory
  parts: {
    getAll: (params) => api.get('/api/auth/parts', { params }),
    create: (data) => api.post('/api/auth/parts', data),
    getById: (id) => api.get(`/auth/parts/${id}`),
    update: (id, data) => api.put(`/auth/parts/${id}`, data),
    delete: (id) => api.delete(`/auth/parts/${id}`),
  },
  
  inventory: {
    getLowStock: () => api.get('/api/auth/inventory/low-stock'),
  },
  
  // Time Clock
  timeclock: {
    clockIn: () => api.post('/api/auth/timeclock/clock-in'),
    clockOut: () => api.post('/api/auth/timeclock/clock-out'),
    getStatus: () => api.get('/api/auth/timeclock/status'),
    getHistory: (params) => api.get('/api/auth/timeclock/history', { params }),
  },
  
  // Dashboard & Reports
  dashboard: {
    getStats: () => api.get('/api/auth/dashboard/stats'),
    getRecentActivity: () => api.get('/api/auth/dashboard/recent-activity'),
  },
  
  reports: {
    getSales: (params) => api.get('/api/auth/reports/sales', { params }),
  },
  
  // Settings
  settings: {
    get: () => api.get('/api/auth/settings'),
    update: (data) => api.put('/api/auth/settings', data),
    getShop: () => api.get('/api/auth/settings/shop'),
    updateShop: (data) => api.put('/api/auth/settings/shop', data),
  },
  
  // AI Features (if implemented)
  ai: {
    diagnosis: (data) => api.post('/ai/diagnosis', data),
    generateEstimate: (data) => api.post('/ai/generate-estimate', data),
  },
};

// Legacy compatibility - flatten some common endpoints
export const legacyApiEndpoints = {
  healthCheck: apiEndpoints.healthCheck,
  login: apiEndpoints.auth.login,
  register: apiEndpoints.auth.register,
  logout: apiEndpoints.auth.logout,
  getCurrentUser: apiEndpoints.auth.getCurrentUser,
  getCustomers: apiEndpoints.customers.getAll,
  createCustomer: apiEndpoints.customers.create,
  getCustomer: apiEndpoints.customers.getById,
  getJobs: apiEndpoints.jobs.getAll,
  createJob: apiEndpoints.jobs.create,
  getDashboardStats: apiEndpoints.dashboard.getStats,
  clockIn: apiEndpoints.timeclock.clockIn,
  clockOut: apiEndpoints.timeclock.clockOut,
  getTimeClockStatus: apiEndpoints.timeclock.getStatus,
};

// Export everything
export default api;
export { API_BASE_URL, apiEndpoints as api };

// For backward compatibility, also export the legacy endpoints
Object.assign(apiEndpoints, legacyApiEndpoints);
