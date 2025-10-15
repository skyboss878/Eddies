// src/utils/api.js
import axios from 'axios';
import { showError } from './toast';

// --- BASE URL ---
export const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";

// --- AXIOS INSTANCES ---

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

// --- JWT INTERCEPTORS ---
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
export class ApiCache {
  constructor(ttl = 300000) { // 5 min default
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
    .then(res => {
      if (useCache) apiCache.set(cacheKey, res.data);
      pendingRequests.delete(cacheKey);
      return { data: res.data, fromCache: false };
    })
    .catch(err => {
      pendingRequests.delete(cacheKey);
      throw err;
    });

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
};

// --- OFFLINE REQUEST QUEUE ---
export class RequestQueueClass {
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
        break; // stop retrying to avoid infinite loop
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

// --- FULL API ENDPOINTS ---
export const apiEndpoints = {
  healthCheck: () => healthApi.get('/api/health'),
  testEndpoint: () => api.get('/api/test'),

  auth: {
    register: (data) => mutateOrQueue('post', '/api/auth/register', data),
    login: (data) => mutateOrQueue('post', '/api/auth/login', data),
    registerWithCode: (data) => mutateOrQueue('post', '/api/auth/register-with-code', data),
    me: () => api.get('/api/auth/me'),
    changePassword: (data) => mutateOrQueue('put', '/api/auth/change-password', data),
    logout: () => mutateOrQueue('post', '/api/auth/logout', {}),
    refresh: () => mutateOrQueue('post', '/api/auth/refresh', {}),
  },

  customers: {
    getAll: (params) => api.get('/api/auth/customers', { params }),
    create: (data) => mutateOrQueue('post', '/api/auth/customers', data),
    getById: (id) => api.get(`/api/auth/customers/${id}`),
    update: (id, data) => mutateOrQueue('put', `/api/auth/customers/${id}`, data),
    delete: (id) => mutateOrQueue('delete', `/api/auth/customers/${id}`),
    getVehicles: (id) => api.get(`/api/auth/customers/${id}/vehicles`),
    search: (query) => api.get('/api/auth/customers/search', { params: { q: query } }),
  },

  vehicles: {
    getAll: (params) => api.get('/api/auth/vehicles', { params }),
    create: (data) => mutateOrQueue('post', '/api/auth/vehicles', data),
    getById: (id) => api.get(`/api/auth/vehicles/${id}`),
    update: (id, data) => mutateOrQueue('put', `/api/auth/vehicles/${id}`, data),
    delete: (id) => mutateOrQueue('delete', `/api/auth/vehicles/${id}`),
    vinLookup: (vin) => api.get(`/api/auth/vehicles/vin-lookup/${vin}`),
  },

  jobs: {
    getAll: (params) => api.get('/api/auth/jobs', { params }),
    create: (data) => mutateOrQueue('post', '/api/auth/jobs', data),
    getById: (id) => api.get(`/api/auth/jobs/${id}`),
    updateStatus: (id, data) => mutateOrQueue('patch', `/api/auth/jobs/${id}/status`, data),
    addParts: (id, data) => mutateOrQueue('post', `/api/auth/jobs/${id}/parts`, data),
    addLabor: (id, data) => mutateOrQueue('post', `/api/auth/jobs/${id}/labor`, data),
  },

  estimates: {
    getAll: (params) => api.get("/api/auth/estimates", { params }),
    create: (data) => mutateOrQueue("post", "/api/auth/estimates", data),
    getById: (id) => api.get(`/api/auth/estimates/${id}`),
    update: (id, data) => mutateOrQueue("put", `/api/auth/estimates/${id}`, data),
    delete: (id) => mutateOrQueue("delete", `/api/auth/estimates/${id}`),
  },

  invoices: {
    getAll: (params) => api.get("/api/auth/invoices", { params }),
    create: (data) => mutateOrQueue("post", "/api/auth/invoices", data),
    getById: (id) => api.get(`/api/auth/invoices/${id}`),
    update: (id, data) => mutateOrQueue("put", `/api/auth/invoices/${id}`, data),
    delete: (id) => mutateOrQueue("delete", `/api/auth/invoices/${id}`),
  },

  appointments: {
    getAll: (params) => api.get("/api/auth/appointments", { params }),
    create: (data) => mutateOrQueue("post", "/api/auth/appointments", data),
    getById: (id) => api.get(`/api/auth/appointments/${id}`),
    update: (id, data) => mutateOrQueue("put", `/api/auth/appointments/${id}`, data),
    delete: (id) => mutateOrQueue("delete", `/api/auth/appointments/${id}`),
  },

  ai: {
    chat: (data) => mutateOrQueue("post", "/api/ai/chat", data),
    diagnostics: (data) => mutateOrQueue("post", "/api/ai/diagnostics", data),
    getDiagnosticsHistory: () => api.get("/api/auth/ai/diagnostics/history"),
    createEstimateFromDiagnosis: (data) => mutateOrQueue("post", "/api/auth/estimates", data),
  },

  obd2: {
    lookup: (data) => mutateOrQueue("post", "/api/obd2/lookup", data),
    validateCode: (code) => {
      const obdPattern = /^[PBCU]\d{4}$/;
      return obdPattern.test(code.toUpperCase());
    },
    parseCodes: (input) => {
      if (!input) return [];
      const pattern = /[PBCU]\d{4}/gi;
      const matches = input.match(pattern);
      return matches ? [...new Set(matches.map(code => code.toUpperCase()))] : [];
    }
  },

  // TODO: Add timeclock, parts, inventory
};

// --- SERVICE OBJECTS FOR CONTEXT / DIRECT USAGE ---
export const customerService = apiEndpoints.customers;
export const vehicleService = apiEndpoints.vehicles;
export const jobService = apiEndpoints.jobs;
export const estimateService = apiEndpoints.estimates;
export const invoiceService = apiEndpoints.invoices;
export const appointmentService = apiEndpoints.appointments;
export const aiService = apiEndpoints.ai;
export const obd2Service = apiEndpoints.obd2;

// --- DEFAULT EXPORT ---
export default api;

// --- DEV HELPERS ---
if (import.meta.env.DEV) {
  window.apiDebug = {
    cache: apiCache,
    queue: RequestQueue,
    endpoints: apiEndpoints,
    clearCache: () => apiCache.clear(),
  };
}
