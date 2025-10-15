// src/utils/apiEndpoints.js
export const API_BASE_URL = "http://192.168.1.85:5000";

export const apiEndpoints = {
  auth: { login: '/api/auth/login', register: '/api/auth/register', logout: '/api/auth/logout', refresh: '/api/auth/refresh', verify: '/api/auth/verify' },
  customers: { list: '/api/auth/customers', create: '/api/auth/customers', get: (id) => `/api/auth/customers/${id}`, update: (id) => `/api/auth/customers/${id}`, delete: (id) => `/api/auth/customers/${id}`, search: '/api/auth/customers/search' },
  vehicles: { list: '/api/auth/vehicles', create: '/api/auth/vehicles', get: (id) => `/api/auth/vehicles/${id}`, update: (id) => `/api/auth/vehicles/${id}`, delete: (id) => `/api/auth/vehicles/${id}`, byCustomer: (customerId) => `/api/auth/customers/${customerId}/vehicles` },
  jobs: { list: '/api/auth/jobs', create: '/api/auth/jobs', get: (id) => `/api/auth/jobs/${id}`, update: (id) => `/api/auth/jobs/${id}`, delete: (id) => `/api/auth/jobs/${id}`, updateStatus: (id) => `/api/auth/jobs/${id}/status` },
  estimates: { list: '/api/auth/estimates', create: '/api/auth/estimates', get: (id) => `/api/auth/estimates/${id}`, update: (id) => `/api/auth/estimates/${id}`, delete: (id) => `/api/auth/estimates/${id}`, ai: '/api/auth/estimates/ai', convert: (id) => `/api/auth/estimates/${id}/convert` },
  invoices: { list: '/api/auth/invoices', create: '/api/auth/invoices', get: (id) => `/api/auth/invoices/${id}`, update: (id) => `/api/auth/invoices/${id}`, delete: (id) => `/api/auth/invoices/${id}`, pdf: (id) => `/api/auth/invoices/${id}/pdf`, send: (id) => `/api/auth/invoices/${id}/send` },
  inventory: { list: '/api/auth/inventory', create: '/api/auth/inventory', get: (id) => `/api/auth/inventory/${id}`, update: (id) => `/api/auth/inventory/${id}`, delete: (id) => `/api/auth/inventory/${id}`, search: '/api/auth/inventory/search', lowStock: '/api/auth/inventory/low-stock' },
  reports: { dashboard: '/api/auth/reports/dashboard', revenue: '/api/auth/reports/revenue', jobs: '/api/auth/reports/jobs', customers: '/api/auth/reports/customers', inventory: '/api/auth/reports/inventory' },
  timeclock: { clockIn: '/api/auth/timeclock/clock-in', clockOut: '/api/auth/timeclock/clock-out', entries: '/api/auth/timeclock/entries', current: '/api/auth/timeclock/current', summary: '/api/auth/timeclock/summary' },
  ai: { chat: '/api/ai/chat', diagnostics: '/api/ai/diagnostics', estimate: '/api/ai/estimate', history: '/api/auth/ai/diagnostics/history' },
  obd2: { lookup: '/api/obd2/lookup', scan: '/api/obd2/scan' },
  migration: { upload: '/api/migration/upload', analyze: '/api/migration/analyze', import: '/api/migration/import', status: '/api/migration/status' },
  appointments: { list: '/api/auth/appointments', create: '/api/auth/appointments', get: (id) => `/api/auth/appointments/${id}`, update: (id) => `/api/auth/appointments/${id}`, delete: (id) => `/api/auth/appointments/${id}`, available: '/api/auth/appointments/available' },
  settings: { get: '/api/auth/settings', update: '/api/auth/settings', laborRates: '/api/auth/settings/labor-rates', shopInfo: '/api/auth/settings/shop-info' }
};

export default apiEndpoints;
