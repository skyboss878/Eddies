#!/bin/bash
# API Import Fix Implementation Script
# This script will backup your files and implement all the fixes

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   API Import Fix Implementation Script                 ║${NC}"
echo -e "${BLUE}║   Eddie's Asian Automotive                             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Navigate to project root
cd ~/eddies-asian-automotive/frontend || { echo -e "${RED}Error: Cannot find project directory${NC}"; exit 1; }

# Create backup directory with timestamp
BACKUP_DIR="backups/api-fix-$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}📦 Creating backup directory: $BACKUP_DIR${NC}"
mkdir -p "$BACKUP_DIR"

# Backup files
echo -e "${YELLOW}📋 Backing up files...${NC}"
cp src/utils/api.js "$BACKUP_DIR/" 2>/dev/null || echo "  ⚠️  api.js not found"
cp src/utils/apiEndpoints.js "$BACKUP_DIR/" 2>/dev/null || echo "  ⚠️  apiEndpoints.js not found"
cp -r src/utils/services "$BACKUP_DIR/" 2>/dev/null || echo "  ⚠️  services not found"
echo -e "${GREEN}✓ Backup completed: $BACKUP_DIR${NC}"
echo ""

# ==============================================================================
# FIX 1: Update api.js - Add default export
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  FIX 1: Updating api.js${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cat > src/utils/api.js << 'EOF'
// src/utils/api.js - Fixed version
import axios from 'axios';
import { showError } from './toast';

// Use environment variable with fallback
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://192.168.1.85:5000";

// Main API instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Health check API
export const healthApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Upload API for file uploads
export const uploadApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "multipart/form-data" },
});

// Request interceptor - add JWT token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add interceptors to uploadApi
uploadApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

uploadApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Default export for backward compatibility
export default api;
EOF

echo -e "${GREEN}✓ api.js updated${NC}"
echo ""

# ==============================================================================
# FIX 2: Update apiEndpoints.js - Remove duplicate axios instances
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  FIX 2: Updating apiEndpoints.js${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cat > src/utils/apiEndpoints.js << 'EOF'
// src/utils/apiEndpoints.js - Fixed version
// Centralized API endpoint definitions

export const apiEndpoints = {
  // Auth
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    verify: '/api/auth/verify'
  },
  
  // Customers
  customers: {
    list: '/api/auth/customers',
    create: '/api/auth/customers',
    get: (id) => `/api/auth/customers/${id}`,
    update: (id) => `/api/auth/customers/${id}`,
    delete: (id) => `/api/auth/customers/${id}`,
    search: '/api/auth/customers/search'
  },
  
  // Vehicles
  vehicles: {
    list: '/api/auth/vehicles',
    create: '/api/auth/vehicles',
    get: (id) => `/api/auth/vehicles/${id}`,
    update: (id) => `/api/auth/vehicles/${id}`,
    delete: (id) => `/api/auth/vehicles/${id}`,
    byCustomer: (customerId) => `/api/auth/customers/${customerId}/vehicles`
  },
  
  // Jobs
  jobs: {
    list: '/api/auth/jobs',
    create: '/api/auth/jobs',
    get: (id) => `/api/auth/jobs/${id}`,
    update: (id) => `/api/auth/jobs/${id}`,
    delete: (id) => `/api/auth/jobs/${id}`,
    updateStatus: (id) => `/api/auth/jobs/${id}/status`
  },
  
  // Estimates
  estimates: {
    list: '/api/auth/estimates',
    create: '/api/auth/estimates',
    get: (id) => `/api/auth/estimates/${id}`,
    update: (id) => `/api/auth/estimates/${id}`,
    delete: (id) => `/api/auth/estimates/${id}`,
    ai: '/api/auth/estimates/ai',
    convert: (id) => `/api/auth/estimates/${id}/convert`
  },
  
  // Invoices
  invoices: {
    list: '/api/auth/invoices',
    create: '/api/auth/invoices',
    get: (id) => `/api/auth/invoices/${id}`,
    update: (id) => `/api/auth/invoices/${id}`,
    delete: (id) => `/api/auth/invoices/${id}`,
    pdf: (id) => `/api/auth/invoices/${id}/pdf`,
    send: (id) => `/api/auth/invoices/${id}/send`
  },
  
  // Inventory
  inventory: {
    list: '/api/auth/inventory',
    create: '/api/auth/inventory',
    get: (id) => `/api/auth/inventory/${id}`,
    update: (id) => `/api/auth/inventory/${id}`,
    delete: (id) => `/api/auth/inventory/${id}`,
    search: '/api/auth/inventory/search',
    lowStock: '/api/auth/inventory/low-stock'
  },
  
  // Reports
  reports: {
    dashboard: '/api/auth/reports/dashboard',
    revenue: '/api/auth/reports/revenue',
    jobs: '/api/auth/reports/jobs',
    customers: '/api/auth/reports/customers',
    inventory: '/api/auth/reports/inventory'
  },
  
  // Time Clock
  timeclock: {
    clockIn: '/api/auth/timeclock/clock-in',
    clockOut: '/api/auth/timeclock/clock-out',
    entries: '/api/auth/timeclock/entries',
    current: '/api/auth/timeclock/current',
    summary: '/api/auth/timeclock/summary'
  },
  
  // AI & Diagnostics
  ai: {
    chat: '/api/ai/chat',
    diagnostics: '/api/ai/diagnostics',
    estimate: '/api/ai/estimate',
    history: '/api/auth/ai/diagnostics/history'
  },
  
  // OBD2
  obd2: {
    lookup: '/api/obd2/lookup',
    scan: '/api/obd2/scan'
  },
  
  // Migration
  migration: {
    upload: '/api/migration/upload',
    analyze: '/api/migration/analyze',
    import: '/api/migration/import',
    status: '/api/migration/status'
  },
  
  // Appointments
  appointments: {
    list: '/api/auth/appointments',
    create: '/api/auth/appointments',
    get: (id) => `/api/auth/appointments/${id}`,
    update: (id) => `/api/auth/appointments/${id}`,
    delete: (id) => `/api/auth/appointments/${id}`,
    available: '/api/auth/appointments/available'
  },
  
  // Settings
  settings: {
    get: '/api/auth/settings',
    update: '/api/auth/settings',
    laborRates: '/api/auth/settings/labor-rates',
    shopInfo: '/api/auth/settings/shop-info'
  }
};

export default apiEndpoints;
EOF

echo -e "${GREEN}✓ apiEndpoints.js updated${NC}"
echo ""

# ==============================================================================
# FIX 3: Update customerService.js
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  FIX 3: Updating customerService.js${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cat > src/utils/services/customerService.js << 'EOF'
// src/utils/services/customerService.js - Fixed version
import { api } from '../api';
import { apiEndpoints } from '../apiEndpoints';
import { showError } from '../toast';

const handleError = (error, fallbackMessage = 'Customer request failed') => {
  console.error(fallbackMessage, error);
  const message = error.response?.data?.message || fallbackMessage;
  showError(message);
  throw error;
};

export const customerService = {
  // Get all customers
  getAll: async () => {
    try {
      const response = await api.get(apiEndpoints.customers.list);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch customers');
    }
  },

  // Get customer by ID
  getById: async (id) => {
    try {
      const response = await api.get(apiEndpoints.customers.get(id));
      return response.data;
    } catch (error) {
      handleError(error, `Failed to fetch customer ${id}`);
    }
  },

  // Create customer
  create: async (customerData) => {
    try {
      const response = await api.post(apiEndpoints.customers.create, customerData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to create customer');
    }
  },

  // Update customer
  update: async (id, customerData) => {
    try {
      const response = await api.put(apiEndpoints.customers.update(id), customerData);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to update customer ${id}`);
    }
  },

  // Delete customer
  delete: async (id) => {
    try {
      const response = await api.delete(apiEndpoints.customers.delete(id));
      return response.data;
    } catch (error) {
      handleError(error, `Failed to delete customer ${id}`);
    }
  },

  // Search customers
  search: async (query) => {
    try {
      const response = await api.get(apiEndpoints.customers.search, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to search customers');
    }
  }
};

export default customerService;
EOF

echo -e "${GREEN}✓ customerService.js updated${NC}"
echo ""

# ==============================================================================
# FIX 4: Update timeclockService.js
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  FIX 4: Updating timeclockService.js${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cat > src/utils/services/timeclockService.js << 'EOF'
// src/utils/services/timeclockService.js - Fixed version
import { api } from '../api';
import { apiEndpoints } from '../apiEndpoints';
import { showError } from '../toast';

const handleError = (error, fallbackMessage = 'Time clock request failed') => {
  console.error(fallbackMessage, error);
  const message = error.response?.data?.message || fallbackMessage;
  showError(message);
  throw error;
};

export const timeclockService = {
  // Clock in
  clockIn: async (employeeId) => {
    try {
      const response = await api.post(apiEndpoints.timeclock.clockIn, {
        employee_id: employeeId,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to clock in');
    }
  },

  // Clock out
  clockOut: async (employeeId) => {
    try {
      const response = await api.post(apiEndpoints.timeclock.clockOut, {
        employee_id: employeeId,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to clock out');
    }
  },

  // Get entries
  getEntries: async (startDate, endDate) => {
    try {
      const response = await api.get(apiEndpoints.timeclock.entries, {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch time entries');
    }
  },

  // Get current status
  getCurrentStatus: async (employeeId) => {
    try {
      const response = await api.get(apiEndpoints.timeclock.current, {
        params: { employee_id: employeeId }
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch current status');
    }
  },

  // Get summary
  getSummary: async (employeeId, startDate, endDate) => {
    try {
      const response = await api.get(apiEndpoints.timeclock.summary, {
        params: {
          employee_id: employeeId,
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch time summary');
    }
  }
};

export default timeclockService;
EOF

echo -e "${GREEN}✓ timeclockService.js updated${NC}"
echo ""

# ==============================================================================
# FIX 5: Update migrationServices.js
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  FIX 5: Updating migrationServices.js${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cat > src/utils/services/migrationServices.js << 'EOF'
// src/utils/services/migrationServices.js - Fixed version
import { api, uploadApi } from '../api';
import { apiEndpoints } from '../apiEndpoints';
import { showError } from '../toast';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5000; // 5 seconds

export const migrationService = {
  /**
   * Analyze a file for migration
   * @param {FormData} formData - File to analyze
   * @returns {Promise<{success: boolean, data: object}>}
   */
  analyzeFile: async (formData) => {
    try {
      const response = await uploadApi.post(apiEndpoints.migration.analyze, formData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('File analysis failed:', error);
      const message = error.response?.data?.message || 'Failed to analyze file';
      showError(message);
      return {
        success: false,
        error: message
      };
    }
  },

  /**
   * Upload file for migration
   * @param {FormData} formData - File to upload
   * @param {Function} onProgress - Progress callback
   */
  uploadFile: async (formData, onProgress = null) => {
    try {
      const response = await uploadApi.post(apiEndpoints.migration.upload, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
          if (onProgress) {
            onProgress(percentCompleted);
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('File upload failed:', error);
      const message = error.response?.data?.message || 'Failed to upload file';
      showError(message);
      throw error;
    }
  },

  /**
   * Import analyzed data
   * @param {Object} importConfig - Import configuration
   */
  importData: async (importConfig) => {
    try {
      const response = await api.post(apiEndpoints.migration.import, importConfig);
      return response.data;
    } catch (error) {
      console.error('Data import failed:', error);
      const message = error.response?.data?.message || 'Failed to import data';
      showError(message);
      throw error;
    }
  },

  /**
   * Get migration status
   * @param {string} migrationId - Migration ID
   */
  getStatus: async (migrationId) => {
    try {
      // Check cache first
      const cacheKey = `migration_status_${migrationId}`;
      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
          return cached.data;
        }
      }

      const response = await api.get(`${apiEndpoints.migration.status}/${migrationId}`);
      
      // Update cache
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get migration status:', error);
      throw error;
    }
  },

  /**
   * Clear cache
   */
  clearCache: () => {
    cache.clear();
  },

  /**
   * Get cached data
   */
  getCache: (key) => {
    if (cache.has(key)) {
      const cached = cache.get(key);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
      cache.delete(key);
    }
    return null;
  },

  /**
   * Set cache data
   */
  setCache: (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
};

export default migrationService;
EOF

echo -e "${GREEN}✓ migrationServices.js updated${NC}"
echo ""

# ==============================================================================
# VERIFICATION
# ==============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  VERIFICATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}Checking imports...${NC}"
echo ""

echo "1. Checking for apiCache (should be NONE):"
if grep -q "apiCache" src/utils/services/*.js 2>/dev/null; then
  echo -e "${RED}   ✗ Found apiCache references${NC}"
  grep -n "apiCache" src/utils/services/*.js
else
  echo -e "${GREEN}   ✓ No apiCache references found${NC}"
fi
echo ""

echo "2. Checking for wrong apiEndpoints imports (should be NONE):"
if grep -q "apiEndpoints.*from.*'\.\.\/api'" src/utils/services/*.js 2>/dev/null; then
  echo -e "${RED}   ✗ Found wrong apiEndpoints imports${NC}"
  grep -n "apiEndpoints.*from.*'\.\.\/api'" src/utils/services/*.js
else
  echo -e "${GREEN}   ✓ All apiEndpoints imports are correct${NC}"
fi
echo ""

echo "3. Checking service imports:"
echo -e "${YELLOW}   From '../api':${NC}"
grep "import.*from.*'\.\.\/api'" src/utils/services/*.js | head -5
echo ""
echo -e "${YELLOW}   From '../apiEndpoints':${NC}"
grep "import.*from.*'\.\.\/apiEndpoints'" src/utils/services/*.js | head -5
echo ""

# ==============================================================================
# SUMMARY
# ==============================================================================
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    ✓ ALL FIXES APPLIED                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Files Updated:${NC}"
echo "  ✓ src/utils/api.js"
echo "  ✓ src/utils/apiEndpoints.js"
echo "  ✓ src/utils/services/customerService.js"
echo "  ✓ src/utils/services/timeclockService.js"
echo "  ✓ src/utils/services/migrationServices.js"
echo ""
echo -e "${BLUE}Backup Location:${NC}"
echo "  📦 $BACKUP_DIR"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Test the application: npm run dev"
echo "  2. Check browser console for any errors"
echo "  3. If issues occur, restore from backup:"
echo "     cp -r $BACKUP_DIR/* src/utils/"
echo ""
echo -e "${GREEN}Done! 🎉${NC}"
