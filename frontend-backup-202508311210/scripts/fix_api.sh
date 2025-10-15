#!/bin/bash

echo "🔧 Fixing API Error Handling"
cd ~/eddies-askan-automotive/frontend

# Backup
cp src/utils/api.js src/utils/api.js.backup

# Create the fixed version
cat > src/utils/api_fixed.js << 'APIEOF'
// src/utils/api.js - Updated for session-based authentication

// --- Case Conversion Helpers ---
const toSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const toCamelCase = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const convertKeys = (obj, converter) => {
  if (Array.isArray(obj)) return obj.map((v) => convertKeys(v, converter));
  if (obj === null || typeof obj !== 'object') return obj;
  return Object.keys(obj).reduce((acc, key) => {
    acc[converter(key)] = convertKeys(obj[key], converter);
    return acc;
  }, {});
};

// --- API Base URL ---
const API_BASE = 'http://localhost:5000/api';

// --- Complete API Endpoints ---
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    logout: `${API_BASE}/auth/logout`,
    me: `${API_BASE}/auth/me`,
    check: `${API_BASE}/auth/check`,
  },
  initialData: {
    get: `${API_BASE}/initial-data`,
  },
  customers: {
    list: `${API_BASE}/customers`,
    create: `${API_BASE}/customers`,
    get: (id) => `${API_BASE}/customers/${id}`,
    update: (id) => `${API_BASE}/customers/${id}`,
    delete: (id) => `${API_BASE}/customers/${id}`,
    search: `${API_BASE}/customers/search`,
  },
  vehicles: {
    list: `${API_BASE}/vehicles`,
    create: `${API_BASE}/vehicles`,
    get: (id) => `${API_BASE}/vehicles/${id}`,
    update: (id) => `${API_BASE}/vehicles/${id}`,
    delete: (id) => `${API_BASE}/vehicles/${id}`,
    byCustomer: (customerId) => `${API_BASE}/customers/${customerId}/vehicles`,
    search: `${API_BASE}/vehicles/search`,
  },
  jobs: {
    list: `${API_BASE}/jobs`,
    create: `${API_BASE}/jobs`,
    get: (id) => `${API_BASE}/jobs/${id}`,
    update: (id) => `${API_BASE}/jobs/${id}`,
    delete: (id) => `${API_BASE}/jobs/${id}`,
    updateStatus: (id) => `${API_BASE}/jobs/${id}/status`,
    addNote: (id) => `${API_BASE}/jobs/${id}/notes`,
    timeline: (id) => `${API_BASE}/jobs/${id}/timeline`,
  },
  parts: {
    list: `${API_BASE}/parts`,
    create: `${API_BASE}/parts`,
    get: (id) => `${API_BASE}/parts/${id}`,
    update: (id) => `${API_BASE}/parts/${id}`,
    delete: (id) => `${API_BASE}/parts/${id}`,
    search: `${API_BASE}/parts/search`,
    inventory: `${API_BASE}/parts/inventory`,
  },
  laborRates: {
    list: `${API_BASE}/labor-rates`,
    create: `${API_BASE}/labor-rates`,
    get: (id) => `${API_BASE}/labor-rates/${id}`,
    update: (id) => `${API_BASE}/labor-rates/${id}`,
    delete: (id) => `${API_BASE}/labor-rates/${id}`,
  }
};

// --- Session-Based Authentication ---
export const sessionAuth = {
  async isAuthenticated() {
    try {
      const response = await fetch(API_ENDPOINTS.auth.check, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.authenticated;
      }
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  },

  async getCurrentUser() {
    try {
      const response = await fetch(API_ENDPOINTS.auth.check, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.authenticated ? data.user : null;
      }
      return null;
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  }
};

// --- Core API Request Function ---
const apiRequest = async (url, options = {}) => {
  const config = {
    credentials: 'include',
    ...options
  };

  if (!(options.body instanceof FormData)) {
    config.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  } else {
    config.headers = {
      ...options.headers,
    };
  }

  console.log(`📡 ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // ✅ Fixed: Better error handling for HTML vs JSON responses
      let errorData = {};
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.warn('Failed to parse error response as JSON:', parseError);
        }
      } else {
        // If it's not JSON (like HTML error page), get text
        const errorText = await response.text();
        console.warn('Non-JSON error response:', errorText.substring(0, 200));
        errorData = { error: `Server error: ${response.status} ${response.statusText}` };
      }
      
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle no content responses
    if (response.status === 204) return null;

    const responseData = await response.json();
    console.log('✅ API Response received');
    return convertKeys(responseData, toCamelCase);
  } catch (error) {
    console.error('❌ API Request Error:', error.message);
    throw error;
  }
};

// --- API Methods ---
export const api = {
  get: (url, options = {}) => apiRequest(url, { method: 'GET', ...options }),
  post: (url, data, options = {}) => {
    const body = data instanceof FormData
      ? data
      : JSON.stringify(convertKeys(data, toSnakeCase));
    return apiRequest(url, { method: 'POST', body, ...options });
  },
  put: (url, data, options = {}) => {
    const body = data instanceof FormData
      ? data
      : JSON.stringify(convertKeys(data, toSnakeCase));
    return apiRequest(url, { method: 'PUT', body, ...options });
  },
  patch: (url, data, options = {}) => {
    const body = data instanceof FormData
      ? data
      : JSON.stringify(convertKeys(data, toSnakeCase));
    return apiRequest(url, { method: 'PATCH', body, ...options });
  },
  delete: (url, options = {}) => apiRequest(url, { method: 'DELETE', ...options }),
};

// --- Auth API ---
export const authAPI = {
  async login(emailOrUsername, password) {
    console.log('🔐 Attempting session-based login for:', emailOrUsername);
    try {
      const loginData = { email: emailOrUsername, password: password };
      const response = await api.post(API_ENDPOINTS.auth.login, loginData);
      console.log('✅ Session login successful');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Session login failed:', error);
      return { success: false, error: error.message };
    }
  },

  async register(username, email, password) {
    console.log('📝 Attempting registration for:', email);
    try {
      const response = await api.post(API_ENDPOINTS.auth.register, { username, email, password });
      console.log('✅ Registration successful');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return { success: false, error: error.message };
    }
  },

  async logout() {
    console.log('🚪 Logging out user');
    try {
      await api.post(API_ENDPOINTS.auth.logout);
      console.log('✅ Logout successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout failed:', error);
      return { success: true };
    }
  },

  async isAuthenticated() {
    return await sessionAuth.isAuthenticated();
  },

  async getCurrentUser() {
    return await sessionAuth.getCurrentUser();
  }
};

// --- Data API ---
export const dataAPI = {
  async getInitialData() {
    console.log('📊 Fetching initial data...');
    return api.get(API_ENDPOINTS.initialData.get);
  },
  async getCustomers() {
    return api.get(API_ENDPOINTS.customers.list);
  },
  async getCustomer(id) {
    return api.get(API_ENDPOINTS.customers.get(id));
  },
  async createCustomer(customerData) {
    return api.post(API_ENDPOINTS.customers.create, customerData);
  },
  async updateCustomer(id, customerData) {
    return api.put(API_ENDPOINTS.customers.update(id), customerData);
  },
  async deleteCustomer(id) {
    return api.delete(API_ENDPOINTS.customers.delete(id));
  },
  async getVehicles() {
    return api.get(API_ENDPOINTS.vehicles.list);
  },
  async createVehicle(vehicleData) {
    return api.post(API_ENDPOINTS.vehicles.create, vehicleData);
  },
  async getJobs() {
    return api.get(API_ENDPOINTS.jobs.list);
  },
  async createJob(jobData) {
    return api.post(API_ENDPOINTS.jobs.create, jobData);
  },
  async getParts() {
    return api.get(API_ENDPOINTS.parts.list);
  },
  async createPart(partData) {
    return api.post(API_ENDPOINTS.parts.create, partData);
  },
  async getLaborRates() {
    return api.get(API_ENDPOINTS.laborRates.list);
  },
  async createLaborRate(laborRateData) {
    return api.post(API_ENDPOINTS.laborRates.create, laborRateData);
  }
};

// --- Utility Functions ---
export const apiUtils = {
  buildQuery: (params) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        query.append(toSnakeCase(key), value);
      }
    });
    return query.toString();
  },
  buildUrl: (baseUrl, params = {}) => {
    const query = apiUtils.buildQuery(params);
    return query ? `${baseUrl}?${query}` : baseUrl;
  },
  createFormData: (data, fileFields = []) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (fileFields.includes(key) && value instanceof File) {
        formData.append(toSnakeCase(key), value);
      } else if (value !== null && value !== undefined) {
        formData.append(toSnakeCase(key),
          typeof value === 'object' ? JSON.stringify(value) : value
        );
      }
    });
    return formData;
  },
  isAuthenticated: () => sessionAuth.isAuthenticated(),
  logout: () => authAPI.logout()
};

export default { api, authAPI, dataAPI, apiUtils, API_ENDPOINTS };
APIEOF

# Replace the old file with the fixed version
mv src/utils/api_fixed.js src/utils/api.js

echo "✅ Fixed API error handling!"
echo "🚀 Restart your dev server: npm run dev"
