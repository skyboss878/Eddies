// src/utils/apiEndpoints.js - API Service with actual functions
import api from './api';

// URL constants
const URLS = {
  root: '/',
  health: '/api/health',
  settings: '/api/settings',

  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    registerWithCode: '/api/auth/register-with-code',
    me: '/api/auth/me',
    changePassword: '/api/auth/change-password',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    verify: '/api/auth/me'
  },

  customers: {
    list: '/api/auth/customers',
    create: '/api/auth/customers',
    get: (id) => `/api/auth/customers/${id}`,
    update: (id) => `/api/auth/customers/${id}`,
    delete: (id) => `/api/auth/customers/${id}`,
    vehicles: (id) => `/api/auth/customers/${id}/vehicles`,
    search: '/api/auth/customers/search'
  },

  vehicles: {
    list: '/api/auth/vehicles',
    create: '/api/auth/vehicles',
    get: (id) => `/api/auth/vehicles/${id}`,
    update: (id) => `/api/auth/vehicles/${id}`,
    delete: (id) => `/api/auth/vehicles/${id}`,
    vinLookup: (vin) => `/api/auth/vehicles/vin-lookup/${vin}`
  },

  jobs: {
    list: '/api/auth/jobs',
    create: '/api/auth/jobs',
    get: (id) => `/api/auth/jobs/${id}`,
    updateStatus: (id) => `/api/auth/jobs/${id}/status`,
    addParts: (id) => `/api/auth/jobs/${id}/parts`,
    addLabor: (id) => `/api/auth/jobs/${id}/labor`
  },

  estimates: {
    list: '/api/auth/estimates',
    create: '/api/auth/estimates',
    get: (id) => `/api/auth/estimates/${id}`,
    update: (id) => `/api/auth/estimates/${id}`,
    convertToJob: (id) => `/api/auth/estimates/${id}/convert-to-job`,
    generateNumber: '/api/auth/estimates/generate-number'
  },

  invoices: {
    list: '/api/auth/invoices',
    create: '/api/auth/invoices',
    get: (id) => `/api/auth/invoices/${id}`,
    update: (id) => `/api/auth/invoices/${id}`,
    markPaid: (id) => `/api/auth/invoices/${id}/mark-paid`,
    generateNumber: '/api/auth/invoices/generate-number'
  },

  inventory: {
    list: '/api/auth/parts',
    lowStock: '/api/auth/inventory/low-stock'
  },

  parts: {
    list: '/api/auth/parts'
  },

  labor: {
    list: '/api/auth/labor'
  },

  dashboard: {
    stats: '/api/auth/dashboard/stats',
    recentActivity: '/api/auth/dashboard/recent-activity'
  },

  reports: {
    sales: '/api/auth/reports/sales'
  },

  timeclock: {
    clockIn: '/api/auth/timeclock/clock-in',
    clockOut: '/api/auth/timeclock/clock-out',
    entries: '/api/auth/timeclock/entries',
    status: '/api/auth/timeclock/status'
  },

  ai: {
    diagnostics: '/api/ai/diagnostics',
    history: '/api/auth/ai/diagnostics/history'
  },

  obd2: {
    lookup: '/api/obd2/lookup',
    getCode: (code) => `/api/obd2/codes/${code}`
  },

  appointments: {
    list: '/api/auth/appointments',
    create: '/api/auth/appointments',
    get: (id) => `/api/auth/appointments/${id}`,
    update: (id) => `/api/auth/appointments/${id}`,
    delete: (id) => `/api/auth/appointments/${id}`
  },

  migration: {
    analyze: '/api/migration/analyze',
    import: '/api/migration/import'
  }
};

// API service with actual methods
export const apiEndpoints = {
  auth: {
    register: (data) => api.post(URLS.auth.register, data),
    login: (data) => api.post(URLS.auth.login, data),
    registerWithCode: (data) => api.post(URLS.auth.registerWithCode, data),
    getMe: () => api.get(URLS.auth.me),
    changePassword: (data) => api.put(URLS.auth.changePassword, data),
    logout: () => api.post(URLS.auth.logout),
    refresh: () => api.post(URLS.auth.refresh)
  },

  customers: {
    getAll: () => api.get(URLS.customers.list),
    create: (data) => api.post(URLS.customers.create, data),
    getById: (id) => api.get(URLS.customers.get(id)),
    update: (id, data) => api.put(URLS.customers.update(id), data),
    delete: (id) => api.delete(URLS.customers.delete(id)),
    getVehicles: (id) => api.get(URLS.customers.vehicles(id)),
    search: (query) => api.get(URLS.customers.search, { params: { q: query } })
  },

  vehicles: {
    getAll: () => api.get(URLS.vehicles.list),
    create: (data) => api.post(URLS.vehicles.create, data),
    getById: (id) => api.get(URLS.vehicles.get(id)),
    update: (id, data) => api.put(URLS.vehicles.update(id), data),
    delete: (id) => api.delete(URLS.vehicles.delete(id)),
    vinLookup: (vin) => api.get(URLS.vehicles.vinLookup(vin))
  },

  jobs: {
    getAll: () => api.get(URLS.jobs.list),
    create: (data) => api.post(URLS.jobs.create, data),
    getById: (id) => api.get(URLS.jobs.get(id)),
    updateStatus: (id, data) => api.patch(URLS.jobs.updateStatus(id), data),
    addParts: (id, data) => api.post(URLS.jobs.addParts(id), data),
    addLabor: (id, data) => api.post(URLS.jobs.addLabor(id), data)
  },

  estimates: {
    getAll: () => api.get(URLS.estimates.list),
    create: (data) => api.post(URLS.estimates.create, data),
    getById: (id) => api.get(URLS.estimates.get(id)),
    update: (id, data) => api.put(URLS.estimates.update(id), data),
    convertToJob: (id) => api.post(URLS.estimates.convertToJob(id)),
    generateNumber: () => api.get(URLS.estimates.generateNumber)
  },

  invoices: {
    getAll: () => api.get(URLS.invoices.list),
    create: (data) => api.post(URLS.invoices.create, data),
    getById: (id) => api.get(URLS.invoices.get(id)),
    update: (id, data) => api.put(URLS.invoices.update(id), data),
    markPaid: (id) => api.post(URLS.invoices.markPaid(id)),
    generateNumber: () => api.get(URLS.invoices.generateNumber)
  },

  parts: {
    getAll: () => api.get(URLS.parts.list)
  },

  labor: {
    getAll: () => api.get(URLS.labor.list)
  },

  inventory: {
    getAll: () => api.get(URLS.inventory.list),
    getLowStock: () => api.get(URLS.inventory.lowStock)
  },

  dashboard: {
    getStats: () => api.get(URLS.dashboard.stats),
    getRecentActivity: () => api.get(URLS.dashboard.recentActivity)
  },

  reports: {
    getSales: (params) => api.get(URLS.reports.sales, { params })
  },

  timeclock: {
    clockIn: (data) => api.post(URLS.timeclock.clockIn, data || {}),
    clockOut: (data) => api.post(URLS.timeclock.clockOut, data || {}),
    getEntries: () => api.get(URLS.timeclock.entries),
    getStatus: () => api.get(URLS.timeclock.status),
    status: () => api.get(URLS.timeclock.status),
    entries: () => api.get(URLS.timeclock.entries)
  },

  ai: {
    getDiagnostics: (data) => api.post(URLS.ai.diagnostics, data),
    getHistory: () => api.get(URLS.ai.history)
  },

  obd2: {
    lookup: (data) => api.post(URLS.obd2.lookup, data),
    getCode: (code) => api.get(URLS.obd2.getCode(code))
  },

  appointments: {
    getAll: () => api.get(URLS.appointments.list),
    create: (data) => api.post(URLS.appointments.create, data),
    getById: (id) => api.get(URLS.appointments.get(id)),
    update: (id, data) => api.put(URLS.appointments.update(id), data),
    delete: (id) => api.delete(URLS.appointments.delete(id))
  },

  migration: {
    analyze: (data) => api.post(URLS.migration.analyze, data),
    import: (data) => api.post(URLS.migration.import, data)
  },

  health: () => api.get(URLS.health),
  getSettings: () => api.get(URLS.settings),
  updateSettings: (data) => api.put(URLS.settings, data)
};
