import axios from 'axios';

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

// Create main axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
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
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Health check (special case - no auth required)
const healthApi = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

// API endpoints
export const apiEndpoints = {
  // System
  healthCheck: () => healthApi.get('/health'),
  
  // Authentication
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  registerWithCode: (data) => api.post('/auth/register-with-code', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
  
  // Customers
  getCustomers: (params) => api.get('/auth/customers', { params }),
  createCustomer: (data) => api.post('/auth/customers', data),
  getCustomer: (id) => api.get(`/auth/customers/${id}`),
  updateCustomer: (id, data) => api.put(`/auth/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/auth/customers/${id}`),
  searchCustomers: (query) => api.get('/auth/customers/search', { params: { q: query } }),
  getCustomerVehicles: (customerId) => api.get(`/auth/customers/${customerId}/vehicles`),
  
  // Vehicles
  getVehicles: (params) => api.get('/auth/vehicles', { params }),
  createVehicle: (data) => api.post('/auth/vehicles', data),
  getVehicle: (id) => api.get(`/auth/vehicles/${id}`),
  updateVehicle: (id, data) => api.put(`/auth/vehicles/${id}`, data),
  deleteVehicle: (id) => api.delete(`/auth/vehicles/${id}`),
  vinLookup: (vin) => api.get(`/auth/vehicles/vin-lookup/${vin}`),
  
  // Jobs
  getJobs: (params) => api.get('/auth/jobs', { params }),
  createJob: (data) => api.post('/auth/jobs', data),
  getJob: (id) => api.get(`/auth/jobs/${id}`),
  updateJob: (id, data) => api.put(`/auth/jobs/${id}`, data),
  updateJobStatus: (id, status) => api.patch(`/auth/jobs/${id}/status`, { status }),
  addJobParts: (id, parts) => api.post(`/auth/jobs/${id}/parts`, parts),
  addJobLabor: (id, labor) => api.post(`/auth/jobs/${id}/labor`, labor),
  
  // Estimates
  getEstimates: (params) => api.get('/auth/estimates', { params }),
  createEstimate: (data) => api.post('/auth/estimates', data),
  getEstimate: (id) => api.get(`/auth/estimates/${id}`),
  updateEstimate: (id, data) => api.put(`/auth/estimates/${id}`, data),
  convertEstimateToJob: (id) => api.post(`/auth/estimates/${id}/convert-to-job`),
  
  // Invoices
  getInvoices: (params) => api.get('/auth/invoices', { params }),
  createInvoice: (data) => api.post('/auth/invoices', data),
  getInvoice: (id) => api.get(`/auth/invoices/${id}`),
  updateInvoice: (id, data) => api.put(`/auth/invoices/${id}`, data),
  markInvoicePaid: (id) => api.post(`/auth/invoices/${id}/mark-paid`),
  
  // Parts & Inventory
  getParts: (params) => api.get('/auth/parts', { params }),
  createPart: (data) => api.post('/auth/parts', data),
  getPart: (id) => api.get(`/auth/parts/${id}`),
  updatePart: (id, data) => api.put(`/auth/parts/${id}`, data),
  getLowStockItems: () => api.get('/auth/inventory/low-stock'),
  
  // Time Clock
  clockIn: () => api.post('/auth/timeclock/clock-in'),
  clockOut: () => api.post('/auth/timeclock/clock-out'),
  getTimeClockStatus: () => api.get('/auth/timeclock/status'),
  getTimeClockHistory: (params) => api.get('/auth/timeclock/history', { params }),
  
  // Dashboard & Analytics
  getDashboardStats: () => api.get('/auth/dashboard/stats'),
  getRecentActivity: () => api.get('/auth/dashboard/recent-activity'),
  getSalesReport: (params) => api.get('/auth/reports/sales', { params }),
  
  // Settings
  getSettings: () => api.get('/auth/settings'),
  updateSettings: (data) => api.put('/auth/settings', data),
  getShopSettings: () => api.get('/auth/settings/shop'),
  updateShopSettings: (data) => api.put('/auth/settings/shop', data),
  
  // AI Features (if implemented)
  aiDiagnosis: (data) => api.post('/ai/diagnosis', data),
  generateEstimate: (data) => api.post('/ai/generate-estimate', data),
};

export default api;
export { API_BASE_URL };
