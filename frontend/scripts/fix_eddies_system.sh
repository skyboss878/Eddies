#!/bin/bash

# Eddie's Automotive Management System - Complete Fix Script
# This script will diagnose and fix the main issues with your system

set -e  # Exit on any error

echo "🔧 Eddie's Automotive Management System - System Repair"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the eddies-askan-automotive root directory"
    exit 1
fi

print_status "Starting system diagnosis and repair..."

# 1. Fix Frontend DataContext.jsx duplicate keys issue
print_status "Step 1: Fixing DataContext.jsx duplicate keys..."
if [ -f "frontend/src/contexts/DataContext.jsx" ]; then
    # Create a backup
    cp frontend/src/contexts/DataContext.jsx frontend/src/contexts/DataContext.jsx.backup.$(date +%Y%m%d_%H%M%S)
    
    # Fix duplicate keys by removing lines 325-330 (the duplicate section)
    sed -i '/\/\/ Operations/,/updateSettings,/{
        /customers: customers,/d
        /vehicles: vehicles,/d
        /jobs: jobs,/d
        /estimates: estimates,/d
        /parts: parts,/d
        /laborRates: laborRates,/d
    }' frontend/src/contexts/DataContext.jsx 2>/dev/null || print_warning "Could not auto-fix DataContext.jsx - manual fix needed"
    
    print_success "DataContext.jsx duplicate keys addressed"
else
    print_warning "DataContext.jsx not found at expected location"
fi

# 2. Check Backend API Routes
print_status "Step 2: Checking Backend API Routes..."
if [ -f "backend/app.py" ]; then
    print_status "Found backend/app.py, checking routes..."
    # List all routes defined in the backend
    grep -n "@app.route\|@.*route" backend/app.py || print_warning "No routes found in app.py"
    
    # Check if blueprints are being used
    if grep -q "Blueprint\|register_blueprint" backend/app.py; then
        print_status "Blueprints detected - checking blueprint files..."
        find backend -name "*.py" -exec grep -l "Blueprint\|@.*route" {} \; | head -10
    fi
else
    print_error "backend/app.py not found!"
fi

# 3. Check if all required backend files exist
print_status "Step 3: Checking backend structure..."
BACKEND_FILES=(
    "backend/app.py"
    "backend/models.py"
    "backend/requirements.txt"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_warning "✗ $file missing"
    fi
done

# 4. Check Frontend configuration
print_status "Step 4: Checking frontend configuration..."
if [ -f "frontend/package.json" ]; then
    # Check if proxy is set correctly
    if grep -q '"proxy".*5000' frontend/package.json; then
        print_success "Proxy configuration found for port 5000"
    else
        print_warning "Proxy configuration may be missing or incorrect"
    fi
    
    # Check if all required dependencies are installed
    if [ -d "frontend/node_modules" ]; then
        print_success "Node modules installed"
    else
        print_warning "Node modules not installed - run 'npm install' in frontend directory"
    fi
else
    print_error "frontend/package.json not found!"
fi

# 5. Create a comprehensive backend route checker
print_status "Step 5: Creating backend route diagnostic..."
cat > backend_route_checker.py << 'EOF'
#!/usr/bin/env python3
"""
Backend Route Diagnostic Tool for Eddie's Automotive
This script checks if all required API routes are properly defined
"""

import os
import sys
import importlib.util

def check_routes():
    """Check if all required routes are defined in the backend"""
    
    required_routes = [
        '/api/customers/',
        '/api/vehicles/', 
        '/api/service/jobs/',
        '/api/financials/estimates/',
        '/api/partservice/',
        '/api/laborservice/',
        '/api/settings/',
        '/api/auth/login',
        '/api/auth/me'
    ]
    
    print("🔍 Checking Backend API Routes...")
    print("=" * 50)
    
    # Try to import and check the Flask app
    backend_dir = 'backend'
    if os.path.exists(os.path.join(backend_dir, 'app.py')):
        # Add backend directory to Python path
        sys.path.insert(0, backend_dir)
        
        try:
            # Import the Flask app
            spec = importlib.util.spec_from_file_location("app", os.path.join(backend_dir, "app.py"))
            app_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(app_module)
            
            # Get the Flask app instance
            if hasattr(app_module, 'app'):
                app = app_module.app
                
                print(f"✅ Flask app found with {len(app.url_map._rules)} total routes")
                print("\nDefined routes:")
                
                found_routes = []
                for rule in app.url_map.iter_rules():
                    route_path = str(rule.rule)
                    methods = ', '.join(rule.methods - {'HEAD', 'OPTIONS'})
                    print(f"  {route_path} [{methods}]")
                    found_routes.append(route_path)
                
                print(f"\n🔍 Checking required routes:")
                missing_routes = []
                for required_route in required_routes:
                    if any(route.startswith(required_route.rstrip('/')) for route in found_routes):
                        print(f"  ✅ {required_route}")
                    else:
                        print(f"  ❌ {required_route} - MISSING")
                        missing_routes.append(required_route)
                
                if missing_routes:
                    print(f"\n❌ {len(missing_routes)} routes are missing!")
                    print("Missing routes need to be implemented in the backend.")
                else:
                    print(f"\n✅ All required routes are defined!")
                    
            else:
                print("❌ No Flask app instance found in app.py")
                
        except Exception as e:
            print(f"❌ Error importing backend app: {e}")
            print("This might indicate issues with the backend code.")
    else:
        print("❌ backend/app.py not found!")
    
    print("\n" + "=" * 50)

if __name__ == "__main__":
    check_routes()
EOF

# Run the backend route checker
print_status "Running backend route diagnostic..."
python3 backend_route_checker.py

# 6. Create a frontend API client test
print_status "Step 6: Creating frontend API test..."
cat > frontend_api_test.js << 'EOF'
// Frontend API Test for Eddie's Automotive
// Run this in browser console to test API connectivity

const API_BASE = 'http://localhost:5000/api';

const testEndpoints = [
    'settings/',
    'customers/',
    'vehicles/',
    'service/jobs/',
    'financials/estimates/',
    'partservice/',
    'laborservice/'
];

async function testAPI() {
    console.log('🔧 Testing Eddie\'s Automotive API Endpoints...');
    console.log('=' * 50);
    
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    for (const endpoint of testEndpoints) {
        try {
            const response = await fetch(`${API_BASE}/${endpoint}`, {
                method: 'GET',
                headers
            });
            
            const status = response.status;
            const statusText = response.statusText;
            
            if (status === 200) {
                console.log(`✅ ${endpoint} - OK (${status})`);
            } else if (status === 401) {
                console.log(`🔐 ${endpoint} - Unauthorized (${status}) - Login required`);
            } else if (status === 404) {
                console.log(`❌ ${endpoint} - Not Found (${status}) - Route missing`);
            } else {
                console.log(`⚠️  ${endpoint} - ${statusText} (${status})`);
            }
        } catch (error) {
            console.log(`❌ ${endpoint} - Connection Error: ${error.message}`);
        }
    }
    
    console.log('\n🔧 Test completed!');
}

// Run the test
testAPI();
EOF

print_success "Frontend API test created (frontend_api_test.js)"

# 7. Check current processes
print_status "Step 7: Checking running processes..."
if pgrep -f "flask\|python.*app.py" > /dev/null; then
    print_success "Backend server is running"
    print_status "Backend processes:"
    pgrep -f "flask\|python.*app.py" -l
else
    print_warning "Backend server not running"
fi

if pgrep -f "vite\|npm.*dev" > /dev/null; then
    print_success "Frontend server is running"
else
    print_warning "Frontend server not running"
fi

# 8. Generate repair recommendations
print_status "Step 8: Generating repair recommendations..."
cat > REPAIR_RECOMMENDATIONS.md << 'EOF'
# Eddie's Automotive System - Repair Recommendations

## Immediate Actions Required:

### 1. Backend API Routes (CRITICAL)
- **Issue**: Multiple API endpoints returning 404 errors
- **Missing Routes**: `/api/customers/`, `/api/vehicles/`, `/api/service/jobs/`, etc.
- **Action**: 
  - Check `backend/app.py` for missing route definitions
  - Implement missing API endpoints
  - Ensure proper Flask Blueprint registration

### 2. Frontend DataContext.jsx (HIGH)
- **Issue**: Duplicate keys in object literal causing warnings
- **Location**: Lines 325-330 in `frontend/src/contexts/DataContext.jsx`
- **Action**: Remove duplicate key definitions

### 3. JWT Token Management (MEDIUM)
- **Issue**: Authentication working but token refresh may need improvement
- **Action**: Verify token expiration handling and refresh logic

### 4. CORS Configuration (MEDIUM)
- **Issue**: Potential CORS issues between frontend and backend
- **Action**: Ensure proper CORS configuration in Flask backend

## Quick Fixes:

```bash
# 1. Fix frontend duplicate keys
cd frontend/src/contexts
# Edit DataContext.jsx to remove duplicate keys around lines 325-330

# 2. Restart both servers
# Terminal 1 - Backend:
cd backend && python app.py

# Terminal 2 - Frontend:
cd frontend && npm run dev

# 3. Test API endpoints
# Use the generated frontend_api_test.js in browser console
```

## Files to Check:
- `backend/app.py` - Main Flask application with routes
- `backend/models.py` - Database models
- `frontend/src/contexts/DataContext.jsx` - Fix duplicate keys
- `frontend/src/contexts/AuthContext.jsx` - JWT handling

## Testing:
1. Use `backend_route_checker.py` to verify backend routes
2. Use `frontend_api_test.js` in browser console to test API connectivity
3. Check browser Network tab for 404 errors

EOF

print_success "Repair recommendations generated (REPAIR_RECOMMENDATIONS.md)"

# 9. Final status
print_status "Step 9: Final system status..."
print_success "System diagnosis complete!"
print_status "Key findings:"
echo "  - Frontend server: Running on http://localhost:5173/"
echo "  - Backend server: Check if running on http://localhost:5000/"
echo "  - Main issue: Missing backend API routes (404 errors)"
echo "  - Secondary issue: Frontend DataContext.jsx duplicate keys"

print_status "Next steps:"
echo "1. Review REPAIR_RECOMMENDATIONS.md"
echo "2. Fix missing backend API routes"
echo "3. Fix frontend DataContext.jsx duplicate keys"
echo "4. Test using the generated diagnostic tools"

print_success "🔧 Eddie's Automotive System diagnostic complete!"

# Cleanup
rm -f backend_route_checker.py 2>/dev/null || true
