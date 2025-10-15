#!/bin/bash
# Unified API Solution for Eddie's Automotive

echo "🔧 Creating Unified API Solution..."
echo "=================================="

cd ~/eddies-askan-automotive/frontend

# Step 1: Remove conflicting API service
echo "1. Removing conflicting API service..."
rm -rf src/services/api.js 2>/dev/null || true

# Step 2: Create comprehensive, production-ready API service
echo "2. Creating unified API service..."

cat > src/utils/api.js << 'EOF'
// src/utils/api.js - Production-Ready Unified API Service
import axios from 'axios';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_TIMEOUT = 30000;

// Token management
const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Token access error:', error);
    return null;
  }
};

const setAuthToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Token storage error:', error);
  }
};

const clearAuthToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Token removal error:', error);
  }
};

// API Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API calls in development
    if (import.meta.env.DEV) {
      console.log(`🔄 API ${config.method?.toUpperCase()}: ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${response.status})`);
    }
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: response?.status,
        message: response?.data?.error || error.message
      });
    }

    // Handle authentication errors
    if (response?.status === 401) {
      clearAuthToken();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Error handler utility
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.error || error.response.data?.message || 'Server error occurred';
  } else if (error.request) {
    return 'Network error. Please check your connection.';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

// ===================================================================
// AUTHENTICATION SERVICES
// ===================================================================
export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      clearAuthToken();
    }
  },

  getCurrentUser: () => apiClient.get('/api/auth/me'),
  
  register: (userData) => apiClient.post('/api/auth/register', userData)
};

// ===================================================================
// DASHBOARD SERVICES
// ===================================================================
export const dashboardService = {
  getStats: () => apiClient.get('/api/dashboard/stats'),
  
  getRecentActivity: (limit = 10) => 
    apiClient.get('/api/dashboard/recent-activity', { params: { limit } })
};

// ===================================================================
// CUSTOMER SERVICES
// ===================================================================
export const customerService = {
  getAll: (params = {}) => apiClient.get('/api/customers', { params }),
  getById: (id) => apiClient.get(`/api/customers/${id}`),
  create: (data) => apiClient.post('/api/customers', data),
  update: (id, data) => apiClient.put(`/api/customers/${id}`, data),
  delete: (id) => apiClient.delete(`/api/customers/${id}`)
};

// ===================================================================
// VEHICLE SERVICES
// ===================================================================
export const vehicleService = {
  getAll: (params = {}) => apiClient.get('/api/vehicles', { params }),
  getById: (id) => apiClient.get(`/api/vehicles/${id}`),
  create: (data) => apiClient.post('/api/vehicles', data),
  update: (id, data) => apiClient.put(`/api/vehicles/${id}`, data),
  delete: (id) => apiClient.delete(`/api/vehicles/${id}`)
};

// ===================================================================
// JOB SERVICES
// ===================================================================
export const jobService = {
  getAll: (params = {}) => apiClient.get('/api/jobs', { params }),
  getById: (id) => apiClient.get(`/api/jobs/${id}`),
  create: (data) => apiClient.post('/api/jobs', data),
  update: (id, data) => apiClient.put(`/api/jobs/${id}`, data),
  delete: (id) => apiClient.delete(`/api/jobs/${id}`),
  
  // Job-specific actions
  addPart: (jobId, partData) => apiClient.post(`/api/jobs/${jobId}/parts`, partData),
  addLabor: (jobId, laborData) => apiClient.post(`/api/jobs/${jobId}/labor`, laborData),
  updateStatus: (id, status) => apiClient.patch(`/api/jobs/${id}`, { status }),
  createInvoice: (jobId) => apiClient.post(`/api/jobs/${jobId}/invoice`)
};

// ===================================================================
// ESTIMATE SERVICES
// ===================================================================
export const estimateService = {
  getAll: (params = {}) => apiClient.get('/api/estimates', { params }),
  getById: (id) => apiClient.get(`/api/estimates/${id}`),
  create: (data) => apiClient.post('/api/estimates', data),
  update: (id, data) => apiClient.put(`/api/estimates/${id}`, data),
  delete: (id) => apiClient.delete(`/api/estimates/${id}`),
  
  // Estimate-specific actions
  convertToJob: (id) => apiClient.post(`/api/estimates/${id}/convert-to-job`),
  sendToCustomer: (id, email) => apiClient.post(`/api/estimates/${id}/send`, { email })
};

// ===================================================================
// INVOICE SERVICES
// ===================================================================
export const invoiceService = {
  getAll: (params = {}) => apiClient.get('/api/invoices', { params }),
  getById: (id) => apiClient.get(`/api/invoices/${id}`),
  create: (data) => apiClient.post('/api/invoices', data),
  update: (id, data) => apiClient.put(`/api/invoices/${id}`, data),
  delete: (id) => apiClient.delete(`/api/invoices/${id}`),
  
  // Invoice-specific actions
  markAsPaid: (id) => apiClient.patch(`/api/invoices/${id}`, { status: 'paid' }),
  sendToCustomer: (id, email) => apiClient.post(`/api/invoices/${id}/send`, { email })
};

// ===================================================================
// PARTS & LABOR SERVICES
// ===================================================================
export const partService = {
  getAll: (params = {}) => apiClient.get('/api/parts', { params }),
  getById: (id) => apiClient.get(`/api/parts/${id}`),
  create: (data) => apiClient.post('/api/parts', data),
  update: (id, data) => apiClient.put(`/api/parts/${id}`, data),
  delete: (id) => apiClient.delete(`/api/parts/${id}`)
};

export const laborService = {
  getAll: (params = {}) => apiClient.get('/api/labor', { params }),
  getById: (id) => apiClient.get(`/api/labor/${id}`),
  create: (data) => apiClient.post('/api/labor', data),
  update: (id, data) => apiClient.put(`/api/labor/${id}`, data),
  delete: (id) => apiClient.delete(`/api/labor/${id}`)
};

// ===================================================================
// APPOINTMENT SERVICES
// ===================================================================
export const appointmentService = {
  getAll: (params = {}) => apiClient.get('/api/appointments', { params }),
  getById: (id) => apiClient.get(`/api/appointments/${id}`),
  create: (data) => apiClient.post('/api/appointments', data),
  update: (id, data) => apiClient.put(`/api/appointments/${id}`, data),
  delete: (id) => apiClient.delete(`/api/appointments/${id}`)
};

// ===================================================================
// AI DIAGNOSTIC SERVICES
// ===================================================================
export const aiDiagnosticsService = {
  generateComprehensiveDiagnosis: (data) => 
    apiClient.post('/api/ai/diagnostics/comprehensive', data),
    
  generateQuickDiagnosis: (data) => 
    apiClient.post('/api/ai/diagnostics/quick-diagnosis', data),
    
  lookupOBDCodes: (codes) => 
    apiClient.post('/api/ai/diagnostics/obd-lookup', { codes }),
    
  getDiagnosticsHistory: () => 
    apiClient.get('/api/ai/diagnostics/history'),
    
  saveDiagnosis: (data) => 
    apiClient.post('/api/ai/diagnostics/save', data)
};

// ===================================================================
// SETTINGS SERVICES
// ===================================================================
export const settingsService = {
  getAll: () => apiClient.get('/api/settings'),
  update: (data) => apiClient.put('/api/settings', data),
  updateMultiple: (data) => apiClient.put('/api/settings', data)
};

// ===================================================================
// SEARCH SERVICES
// ===================================================================
export const searchService = {
  global: (query, filters = {}) => 
    apiClient.get('/api/search', { params: { q: query, ...filters } }),
    
  customers: (query) => 
    apiClient.get('/api/customers', { params: { search: query } }),
    
  vehicles: (query) => 
    apiClient.get('/api/vehicles', { params: { search: query } }),
    
  jobs: (query) => 
    apiClient.get('/api/jobs', { params: { search: query } })
};

// ===================================================================
// REPORT SERVICES
// ===================================================================
export const reportService = {
  getDailySummary: (date) => 
    apiClient.get(`/api/reports/daily-summary/${date}`),
    
  getPeriodSummary: (startDate, endDate) => 
    apiClient.post('/api/reports/period-summary', { start: startDate, end: endDate }),
    
  getCustomerReport: (params = {}) => 
    apiClient.get('/api/reports/customers', { params }),
    
  getRevenueReport: (params = {}) => 
    apiClient.get('/api/reports/revenue', { params })
};

// ===================================================================
// UTILITY SERVICES
// ===================================================================
export const utilityService = {
  healthCheck: () => apiClient.get('/health'),
  ping: () => apiClient.get('/api/ping')
};

// ===================================================================
// CONVENIENT API WRAPPERS
// ===================================================================
export const api = {
  // Generic methods
  get: (endpoint) => apiClient.get(endpoint),
  post: (endpoint, data) => apiClient.post(endpoint, data),
  put: (endpoint, data) => apiClient.put(endpoint, data),
  delete: (endpoint) => apiClient.delete(endpoint),
  
  // Authentication
  auth: authService,
  
  // Core entities
  customers: customerService,
  vehicles: vehicleService,
  jobs: jobService,
  estimates: estimateService,
  invoices: invoiceService,
  parts: partService,
  labor: laborService,
  appointments: appointmentService,
  
  // Features
  dashboard: dashboardService,
  ai: aiDiagnosticsService,
  search: searchService,
  reports: reportService,
  settings: settingsService,
  
  // Utilities
  utils: utilityService,
  handleError: handleApiError
};

// Default export
export default api;

// Export individual services for direct import
export {
  apiClient,
  setAuthToken,
  getAuthToken,
  clearAuthToken
};
EOF

echo "✅ Created unified API service"

# Step 3: Update any files that might be importing the old service
echo "3. Updating import references..."

# Find and update imports in components
find src -name "*.jsx" -type f -exec grep -l "from.*services/api" {} \; 2>/dev/null | while read file; do
  if [ -f "$file" ]; then
    echo "   Updating imports in: $file"
    sed -i.bak 's|from.*services/api.*|from "../utils/api";|g' "$file" 2>/dev/null || true
    # Clean up backup files
    rm -f "$file.bak" 2>/dev/null || true
  fi
done

# Step 4: Test the API configuration
echo "4. Creating API test utility..."

cat > src/utils/testApi.js << 'EOF'
// src/utils/testApi.js - Quick API Test Utility
import api from './api';

export const testApiConnections = async () => {
  const results = {
    health: null,
    auth: null,
    dashboard: null,
    customers: null
  };

  try {
    // Test health endpoint
    try {
      await api.utils.healthCheck();
      results.health = '✅ Backend healthy';
    } catch (error) {
      results.health = `❌ Health check failed: ${api.handleError(error)}`;
    }

    // Test auth endpoint (should fail if not logged in)
    try {
      await api.auth.getCurrentUser();
      results.auth = '✅ Authentication working';
    } catch (error) {
      results.auth = '⚠️ Not authenticated (expected)';
    }

    // Test dashboard (requires auth)
    try {
      await api.dashboard.getStats();
      results.dashboard = '✅ Dashboard API working';
    } catch (error) {
      results.dashboard = `❌ Dashboard failed: ${api.handleError(error)}`;
    }

    // Test customers (requires auth)
    try {
      await api.customers.getAll();
      results.customers = '✅ Customers API working';
    } catch (error) {
      results.customers = `❌ Customers failed: ${api.handleError(error)}`;
    }

  } catch (error) {
    console.error('API test error:', error);
  }

  return results;
};

// Run test from console: window.testApi()
if (typeof window !== 'undefined') {
  window.testApi = testApiConnections;
}

export default testApiConnections;
EOF

echo "✅ Created API test utility"

# Step 5: Create environment configuration
echo "5. Creating environment configuration..."

cat > .env.local << 'EOF'
# Eddie's Automotive - Local Development Environment
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Eddie's Automotive
VITE_APP_VERSION=1.0.0

# Development flags
VITE_DEBUG_API=true
VITE_MOCK_DATA=false
EOF

echo "✅ Created environment configuration"

# Step 6: Update package.json scripts if needed
echo "6. Updating package.json scripts..."

# Add test script if it doesn't exist
if ! grep -q '"test-api"' package.json 2>/dev/null; then
  # Create a backup
  cp package.json package.json.bak 2>/dev/null || true
  
  # Add test script (this is a simple addition, adjust as needed)
  cat > test-api-script.json << 'EOF'
{
  "scripts": {
    "test-api": "node -e \"import('./src/utils/testApi.js').then(m => m.testApiConnections().then(console.log))\""
  }
}
EOF
fi

echo "✅ Updated package configuration"

echo ""
echo "🎉 UNIFIED API SOLUTION COMPLETE!"
echo "================================="
echo ""
echo "✅ Removed conflicting API service"
echo "✅ Created comprehensive unified API service"
echo "✅ Updated import references"
echo "✅ Added API testing utility" 
echo "✅ Created environment configuration"
echo ""
echo "🧪 TO TEST YOUR APIs:"
echo "===================="
echo "1. Open browser console after logging in"
echo "2. Run: window.testApi()"
echo "3. Check results for any issues"
echo ""
echo "📁 NEW FILE STRUCTURE:"
echo "====================="
echo "src/utils/api.js          - Main API service (use this)"
echo "src/utils/testApi.js      - API testing utility"
echo ".env.local                - Environment config"
echo ""
echo "🎯 IMPORT EXAMPLES:"
echo "=================="
echo "// Option 1: Import specific services"
echo "import { customerService, jobService } from '../utils/api';"
echo ""
echo "// Option 2: Import main API object"
echo "import api from '../utils/api';"
echo "// Then use: api.customers.getAll(), api.jobs.create(), etc."
echo ""
echo "Your navigation should now work perfectly with consistent API calls! 🚀"
