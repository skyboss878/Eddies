// API endpoints configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const apiEndpoints = {
  // Authentication
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    changePassword: '/auth/change-password'
  },
  
  // Customers
  customers: {
    list: '/customers',
    create: '/customers',
    get: (id) => `/customers/${id}`,
    update: (id) => `/customers/${id}`,
    delete: (id) => `/customers/${id}`,
    vehicles: (id) => `/customers/${id}/vehicles`,
    search: '/customers/search'
  },
  
  // Vehicles
  vehicles: {
    list: '/vehicles',
    create: '/vehicles',
    get: (id) => `/vehicles/${id}`,
    vinLookup: (vin) => `/vehicles/vin-lookup/${vin}`
  },
  
  // Jobs
  jobs: {
    list: '/jobs',
    create: '/jobs',
    get: (id) => `/jobs/${id}`,
    updateStatus: (id) => `/jobs/${id}/status`,
    addParts: (id) => `/jobs/${id}/parts`,
    addLabor: (id) => `/jobs/${id}/labor`
  },
  
  // Appointments
  appointments: {
    list: '/appointments',
    create: '/appointments',
    get: (id) => `/appointments/${id}`,
    update: (id) => `/appointments/${id}`,
    delete: (id) => `/appointments/${id}`
  },
  
  // Parts & Inventory
  parts: {
    list: '/parts',
    create: '/parts'
  },
  
  inventory: {
    lowStock: '/inventory/low-stock'
  },
  
  // Estimates
  estimates: {
    list: '/estimates',
    create: '/estimates',
    convertToJob: (id) => `/estimates/${id}/convert-to-job`
  },
  
  // Invoices
  invoices: {
    list: '/invoices',
    create: '/invoices',
    get: (id) => `/invoices/${id}`,
    update: (id) => `/invoices/${id}`,
    markPaid: (id) => `/invoices/${id}/mark-paid`
  },
  
  // Dashboard
  dashboard: {
    stats: '/dashboard/stats',
    recentActivity: '/dashboard/recent-activity'
  },
  
  // Reports
  reports: {
    sales: '/reports/sales'
  },
  
  // Settings
  settings: {
    get: '/settings',
    shop: '/settings/shop'
  },
  
  // Timeclock
  timeclock: {
    clockIn: '/timeclock/clock-in',
    clockOut: '/timeclock/clock-out',
    status: '/timeclock/status',
    history: '/timeclock/history'
  }
};

export default apiEndpoints;
