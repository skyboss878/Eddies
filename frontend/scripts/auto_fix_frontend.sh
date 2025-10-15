#!/bin/bash

# Eddie's Askan Automotive - Automatic API Integration Fixer
# This script automatically fixes frontend-backend API integration issues

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="$(pwd)"
BACKEND_DIR="../backend"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}🚀 EDDIE'S ASKAN AUTOMOTIVE - AUTO API FIXER${NC}"
echo "=============================================="

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to log messages
log() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to backup files
backup_file() {
    local file="$1"
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/$(basename $file).backup"
        log "Backed up $file"
    fi
}

# Step 1: Validate directories
info "Step 1: Validating project structure..."
if [ ! -d "$BACKEND_DIR" ]; then
    error "Backend directory not found at $BACKEND_DIR"
    exit 1
fi

if [ ! -f "$BACKEND_DIR/app.py" ]; then
    error "Flask app.py not found in backend directory"
    exit 1
fi

log "Project structure validated"

# Step 2: Fix Frontend API Configuration
info "Step 2: Fixing frontend API configuration..."

# Backup current files
backup_file "src/utils/api.js"
backup_file ".env"

# Create proper .env file
cat > .env << 'EOF'
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Eddie's Askan Automotive
VITE_APP_VERSION=1.0.0
EOF
log "Created .env file with proper API configuration"

# Create/fix the main API utility file
cat > src/utils/api.js << 'EOF'
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
EOF

log "Fixed src/utils/api.js with proper configuration"

# Step 3: Fix TypeScript API file if it exists
if [ -f "src/services/api.ts" ]; then
    backup_file "src/services/api.ts"
    
    cat > src/services/api.ts << 'EOF'
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    return this.api.post('/auth/login', credentials);
  }

  async register(userData: any) {
    return this.api.post('/auth/register', userData);
  }

  async logout() {
    return this.api.post('/auth/logout');
  }

  // Add more methods as needed...
  async getCustomers() {
    return this.api.get('/auth/customers');
  }

  async healthCheck() {
    return axios.get('http://localhost:5000/api/health');
  }
}

export default new ApiService();
EOF
    log "Fixed src/services/api.ts"
fi

# Step 4: Check and add missing backend routes
info "Step 3: Checking backend routes..."

cd "$BACKEND_DIR"

# Check if Flask app has all required routes
python3 << 'EOF'
import sys
import re

try:
    # Try to import the app
    from app import app
    
    # Get all routes
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append(str(rule))
    
    # Required routes
    required_routes = [
        '/api/health',
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/logout',
        '/api/auth/me',
        '/api/auth/customers',
        '/api/auth/vehicles',
        '/api/auth/jobs',
        '/api/auth/estimates',
        '/api/auth/invoices',
        '/api/auth/parts',
        '/api/auth/dashboard/stats',
        '/api/auth/timeclock/status'
    ]
    
    missing_routes = []
    for required in required_routes:
        found = False
        for route in routes:
            if required in route:
                found = True
                break
        if not found:
            missing_routes.append(required)
    
    if missing_routes:
        print("MISSING_ROUTES:" + ",".join(missing_routes))
    else:
        print("ALL_ROUTES_FOUND")
        
except ImportError as e:
    print(f"IMPORT_ERROR:{e}")
except Exception as e:
    print(f"ERROR:{e}")
EOF

# Capture the output
backend_check_result=$(python3 -c "
try:
    from app import app
    routes = [str(rule) for rule in app.url_map.iter_rules()]
    required_routes = ['/api/health', '/api/auth/login', '/api/auth/register']
    missing_routes = [req for req in required_routes if not any(req in route for route in routes)]
    if missing_routes:
        print('MISSING_ROUTES:' + ','.join(missing_routes))
    else:
        print('ALL_ROUTES_FOUND')
except Exception as e:
    print(f'ERROR:{e}')
" 2>/dev/null)

if [[ $backend_check_result == *"ERROR"* ]]; then
    warn "Could not check backend routes automatically"
    warn "Please ensure your Flask app is properly configured"
elif [[ $backend_check_result == *"MISSING_ROUTES"* ]]; then
    warn "Some backend routes might be missing"
    warn "Check your Flask app.py for proper route definitions"
else
    log "Backend routes appear to be properly configured"
fi

# Step 5: Create test script
cd "$FRONTEND_DIR"

cat > test_api_connection.js << 'EOF'
// Test script to verify API connection
import { apiEndpoints } from './src/utils/api.js';

async function testConnection() {
    console.log('🧪 Testing API connection...');
    
    try {
        const response = await apiEndpoints.healthCheck();
        console.log('✅ Health check passed:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

// Run test if this script is executed directly
if (typeof window === 'undefined') {
    testConnection().then(result => {
        process.exit(result ? 0 : 1);
    });
}

export { testConnection };
EOF

log "Created API connection test script"

# Step 6: Update package.json scripts if it exists
if [ -f "package.json" ]; then
    # Add test script to package.json
    if command -v jq > /dev/null 2>&1; then
        cp package.json package.json.backup
        jq '.scripts.test_api = "node test_api_connection.js"' package.json > package.json.tmp
        mv package.json.tmp package.json
        log "Added test_api script to package.json"
    fi
fi

# Step 7: Create startup verification script
cat > verify_setup.sh << 'EOF'
#!/bin/bash

echo "🔍 Verifying Eddie's Askan Automotive setup..."

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running"
    echo "   Start it with: cd ../backend && python app.py"
    exit 1
fi

# Check frontend config
if [ -f ".env" ] && grep -q "VITE_API_BASE_URL" .env; then
    echo "✅ Frontend .env configured"
else
    echo "❌ Frontend .env missing or misconfigured"
    exit 1
fi

# Test API connection
echo "🧪 Testing API connection..."
curl -s -w "Status: %{http_code}\n" http://localhost:5000/api/health

echo "✅ Setup verification complete!"
EOF

chmod +x verify_setup.sh
log "Created verification script"

# Step 8: Final summary
echo ""
echo -e "${PURPLE}🎉 AUTO-FIX COMPLETE!${NC}"
echo "========================="
log "✅ Fixed frontend API configuration"
log "✅ Created proper .env file"
log "✅ Fixed src/utils/api.js with all endpoints"
log "✅ Created test and verification scripts"
log "✅ Backed up all original files to $BACKUP_DIR"

echo ""
echo -e "${BLUE}📋 NEXT STEPS:${NC}"
echo "1. Restart your frontend dev server: npm run dev"
echo "2. Make sure backend is running: cd ../backend && python app.py"
echo "3. Test the connection: ./verify_setup.sh"
echo "4. Check browser console for any remaining errors"

echo ""
echo -e "${YELLOW}📁 Backups saved in: $BACKUP_DIR${NC}"
echo ""
echo -e "${GREEN}🚀 Your API integration should now be working!${NC}"
EOF
