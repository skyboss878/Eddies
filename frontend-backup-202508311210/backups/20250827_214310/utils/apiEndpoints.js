// API endpoints configuration - Updated to match Flask backend
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiEndpoints = {
  // Health (no auth required)
  health: '/api/health',

  // Authentication
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
    changePassword: '/api/auth/change-password',
    registerWithCode: '/api/auth/register-with-code'
  },

  // Customers
  customers: {
    list: '/api/auth/customers',
    create: '/api/auth/customers',
    get: (id) => `/api/auth/customers/${id}`,
    update: (id) => `/api/auth/customers/${id}`,
    delete: (id) => `/api/auth/customers/${id}`,
    vehicles: (id) => `/api/auth/customers/${id}/vehicles`,
    search: '/api/auth/customers/search'
  },

  // Vehicles
  vehicles: {
    list: '/api/auth/vehicles',
    create: '/api/auth/vehicles',
    get: (id) => `/api/auth/vehicles/${id}`,
    update: (id) => `/api/auth/vehicles/${id}`,
    delete: (id) => `/api/auth/vehicles/${id}`,
    vinLookup: (vin) => `/api/auth/vehicles/vin-lookup/${vin}`
  },

  // Jobs
  jobs: {
    list: '/api/auth/jobs',
    create: '/api/auth/jobs',
    get: (id) => `/api/auth/jobs/${id}`,
    updateStatus: (id) => `/api/auth/jobs/${id}/status`,
    addParts: (id) => `/api/auth/jobs/${id}/parts`,
    addLabor: (id) => `/api/auth/jobs/${id}/labor`
  },

  // Appointments
  appointments: {
    list: '/api/auth/appointments',
    create: '/api/auth/appointments',
    get: (id) => `/api/auth/appointments/${id}`,
    update: (id) => `/api/auth/appointments/${id}`,
    delete: (id) => `/api/auth/appointments/${id}`
  },

  // Parts & Inventory
  parts: {
    list: '/api/auth/parts',
    create: '/api/auth/parts'
  },

  inventory: {
    lowStock: '/api/auth/inventory/low-stock'
  },

  // Estimates
  estimates: {
    list: '/api/auth/estimates',
    create: '/api/auth/estimates',
    get: (id) => `/api/auth/estimates/${id}`,
    update: (id) => `/api/auth/estimates/${id}`,
    convertToJob: (id) => `/api/auth/estimates/${id}/convert-to-job`
  },

  // Invoices
  invoices: {
    list: '/api/auth/invoices',
    create: '/api/auth/invoices',
    get: (id) => `/api/auth/invoices/${id}`,
    update: (id) => `/api/auth/invoices/${id}`,
    markPaid: (id) => `/api/auth/invoices/${id}/mark-paid`
  },

  // Dashboard
  dashboard: {
    stats: '/api/auth/dashboard/stats',
    recentActivity: '/api/auth/dashboard/recent-activity'
  },

  // Reports
  reports: {
    sales: '/api/auth/reports/sales'
  },

  // Settings
  settings: {
    get: '/api/auth/settings',
    shop: {
      get: '/api/auth/settings/shop',
      update: '/api/auth/settings/shop'
    }
  },

  // Timeclock
  timeclock: {
    clockIn: '/api/auth/timeclock/clock-in',
    clockOut: '/api/auth/timeclock/clock-out',
    status: '/api/auth/timeclock/status',
    history: '/api/auth/timeclock/history'
  }
};

export default apiEndpoints;
