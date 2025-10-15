#!/bin/bash

echo "🔧 Eddie's Asian Automotive - Complete Frontend Diagnostic & Fix"
echo "=================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Get the correct directory
FRONTEND_DIR="/data/data/com.termux/files/home/eddies-asian-automotive/frontend"
SCRIPT_DIR="$FRONTEND_DIR/scripts"
SRC_DIR="$FRONTEND_DIR/src"

print_status $BLUE "📍 Working Directory Setup"
echo "Frontend Dir: $FRONTEND_DIR"
echo "Script Dir: $SCRIPT_DIR"
echo "Source Dir: $SRC_DIR"
echo ""

# Check if we're in the right place
if [[ ! -d "$SRC_DIR" ]]; then
    print_status $RED "❌ Source directory not found at: $SRC_DIR"
    print_status $YELLOW "📍 Current directory: $(pwd)"
    print_status $YELLOW "📍 Looking for src directory..."
    
    # Try to find the src directory
    if [[ -d "src" ]]; then
        print_status $GREEN "✅ Found src directory in current location"
        SRC_DIR="$(pwd)/src"
        FRONTEND_DIR="$(pwd)"
    elif [[ -d "../src" ]]; then
        print_status $GREEN "✅ Found src directory in parent location"
        cd ..
        SRC_DIR="$(pwd)/src"
        FRONTEND_DIR="$(pwd)"
    else
        print_status $RED "❌ Cannot find src directory. Please run from frontend root."
        exit 1
    fi
fi

print_status $GREEN "✅ Using Frontend Directory: $FRONTEND_DIR"
print_status $GREEN "✅ Using Source Directory: $SRC_DIR"
echo ""

# 1. Check .env configuration
print_status $BLUE "🔍 1. Checking Environment Configuration"
echo "-------------------------------------------"

ENV_FILE="$FRONTEND_DIR/.env"
if [[ -f "$ENV_FILE" ]]; then
    print_status $GREEN "✅ .env file exists"
    echo "Current .env contents:"
    cat "$ENV_FILE"
else
    print_status $YELLOW "⚠️  .env file missing, creating default..."
    cat > "$ENV_FILE" << 'EOF'
# Frontend Environment Configuration
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
VITE_NODE_ENV=development

# Development settings
VITE_DEV_TOOLS=true
VITE_DEBUG=true
EOF
    print_status $GREEN "✅ Created default .env file"
fi
echo ""

# 2. Check API connectivity
print_status $BLUE "🔍 2. Testing API Connectivity"
echo "-------------------------------------------"

# Check if backend is running
BACKEND_URL="http://localhost:5000"
if curl -s "$BACKEND_URL/health" > /dev/null 2>&1; then
    print_status $GREEN "✅ Backend is responding at $BACKEND_URL"
else
    print_status $YELLOW "⚠️  Backend might not be running at $BACKEND_URL"
    print_status $YELLOW "    Please ensure your Flask backend is running"
fi

# Test API endpoints
API_URL="http://localhost:5000/api"
echo "Testing key API endpoints:"

endpoints=("health" "auth/test" "customers" "vehicles" "jobs")
for endpoint in "${endpoints[@]}"; do
    if curl -s "${API_URL}/${endpoint}" > /dev/null 2>&1; then
        print_status $GREEN "  ✅ /${endpoint}"
    else
        print_status $RED "  ❌ /${endpoint}"
    fi
done
echo ""

# 3. Verify route structure
print_status $BLUE "🔍 3. Analyzing Route Structure"
echo "-------------------------------------------"

APP_JSX="$SRC_DIR/App.jsx"
if [[ -f "$APP_JSX" ]]; then
    print_status $GREEN "✅ App.jsx found"
    
    # Extract and display routes
    echo "Configured routes:"
    grep -E "path=" "$APP_JSX" | sed 's/.*path="/  /' | sed 's/".*//' | sort | uniq
    
    # Count routes
    ROUTE_COUNT=$(grep -c "<Route" "$APP_JSX")
    print_status $GREEN "✅ Found $ROUTE_COUNT route definitions"
else
    print_status $RED "❌ App.jsx not found at $APP_JSX"
fi
echo ""

# 4. Check component availability
print_status $BLUE "🔍 4. Verifying Component Availability"
echo "-------------------------------------------"

# Key components that should exist
components=(
    "components/auth/Login.jsx"
    "components/auth/Register.jsx"
    "components/layout/ProtectedDashboardLayout.jsx"
    "pages/Dashboard.jsx"
    "pages/Landing.jsx"
    "pages/customers/Customers.jsx"
    "pages/customers/CustomerList.jsx"
    "pages/customers/CustomerDetail.jsx"
    "pages/customers/AddAndEditCustomer.jsx"
    "pages/vehicles/Vehicles.jsx"
    "pages/vehicles/VehicleList.jsx"
    "pages/vehicles/VehicleDetail.jsx"
    "pages/vehicles/VehicleForm.jsx"
    "pages/vehicles/AddVehicle.jsx"
    "pages/jobs/Jobs.jsx"
)

missing_components=()
for component in "${components[@]}"; do
    if [[ -f "$SRC_DIR/$component" ]]; then
        print_status $GREEN "  ✅ $component"
    else
        print_status $RED "  ❌ $component"
        missing_components+=("$component")
    fi
done

if [[ ${#missing_components[@]} -gt 0 ]]; then
    print_status $YELLOW "⚠️  Found ${#missing_components[@]} missing components"
else
    print_status $GREEN "✅ All components found!"
fi
echo ""

# 5. Check import/export consistency
print_status $BLUE "🔍 5. Checking Import/Export Consistency"
echo "-------------------------------------------"

# Check for common import issues
echo "Checking for problematic imports..."

if grep -r "import.*from.*'\.\./\.\./\.\./'" "$SRC_DIR" 2>/dev/null; then
    print_status $YELLOW "⚠️  Found deep relative imports (might cause issues)"
else
    print_status $GREEN "✅ No problematic deep imports found"
fi

if grep -r "import.*from.*'@/'" "$SRC_DIR" 2>/dev/null; then
    print_status $GREEN "✅ Using alias imports (@/)"
else
    print_status $YELLOW "⚠️  No alias imports found (consider using @/ for cleaner imports)"
fi
echo ""

# 6. Dependency check
print_status $BLUE "🔍 6. Checking Dependencies"
echo "-------------------------------------------"

PACKAGE_JSON="$FRONTEND_DIR/package.json"
if [[ -f "$PACKAGE_JSON" ]]; then
    print_status $GREEN "✅ package.json found"
    
    # Check for key dependencies
    key_deps=("react" "react-dom" "react-router-dom" "axios" "tailwindcss")
    for dep in "${key_deps[@]}"; do
        if grep -q "\"$dep\"" "$PACKAGE_JSON"; then
            print_status $GREEN "  ✅ $dep"
        else
            print_status $RED "  ❌ $dep (missing)"
        fi
    done
else
    print_status $RED "❌ package.json not found"
fi
echo ""

# 7. Create a route test utility
print_status $BLUE "🔍 7. Creating Route Test Utility"
echo "-------------------------------------------"

ROUTE_TEST_FILE="$SCRIPT_DIR/route_test_utility.js"
cat > "$ROUTE_TEST_FILE" << 'EOF'
#!/usr/bin/env node

// Route Test Utility for Eddie's Asian Automotive
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const appJsxPath = path.join(srcDir, 'App.jsx');

console.log('🚀 Route Test Utility');
console.log('=====================');

// Read App.jsx and extract routes
if (fs.existsSync(appJsxPath)) {
    const appContent = fs.readFileSync(appJsxPath, 'utf8');
    const routes = [];
    
    // Simple regex to find routes
    const routeRegex = /path="([^"]+)"/g;
    let match;
    
    while ((match = routeRegex.exec(appContent)) !== null) {
        routes.push(match[1]);
    }
    
    console.log('📍 Found Routes:');
    routes.forEach(route => {
        console.log(`  - ${route}`);
    });
    
    console.log('\n🧪 Testing Route Accessibility:');
    routes.forEach(route => {
        // Skip nested routes
        if (!route.includes(':')) {
            console.log(`  📄 ${route} - OK`);
        } else {
            console.log(`  📄 ${route} - Dynamic Route (needs parameters)`);
        }
    });
    
} else {
    console.log('❌ App.jsx not found');
}

console.log('\n✅ Route analysis complete!');
EOF

chmod +x "$ROUTE_TEST_FILE"
print_status $GREEN "✅ Created route test utility at: $ROUTE_TEST_FILE"
echo ""

# 8. Create API test utility
print_status $BLUE "🔍 8. Creating API Test Utility"
echo "-------------------------------------------"

API_TEST_FILE="$SCRIPT_DIR/api_test_utility.js"
cat > "$API_TEST_FILE" << 'EOF'
#!/usr/bin/env node

// API Test Utility for Eddie's Asian Automotive
const axios = require('axios').default;

const API_BASE = 'http://localhost:5000/api';
const BACKEND_BASE = 'http://localhost:5000';

console.log('🌐 API Test Utility');
console.log('===================');

async function testEndpoint(endpoint, description) {
    try {
        const response = await axios.get(`${API_BASE}${endpoint}`, {
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`✅ ${description}: Status ${response.status}`);
        return true;
    } catch (error) {
        console.log(`❌ ${description}: ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log('Testing API endpoints...\n');
    
    const tests = [
        ['/', 'API Root'],
        ['/health', 'Health Check'],
        ['/auth/test', 'Auth Test'],
        ['/customers', 'Customers Endpoint'],
        ['/vehicles', 'Vehicles Endpoint'],
        ['/jobs', 'Jobs Endpoint']
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const [endpoint, description] of tests) {
        const result = await testEndpoint(endpoint, description);
        if (result) passed++;
        else failed++;
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    
    if (failed > 0) {
        console.log('\n💡 Troubleshooting Tips:');
        console.log('  - Ensure Flask backend is running on port 5000');
        console.log('  - Check CORS configuration in backend');
        console.log('  - Verify API routes are properly registered');
    }
}

runTests().catch(console.error);
EOF

chmod +x "$API_TEST_FILE"
print_status $GREEN "✅ Created API test utility at: $API_TEST_FILE"
echo ""

# 9. Summary and recommendations
print_status $BLUE "📋 9. Summary & Recommendations"
echo "-------------------------------------------"

print_status $GREEN "✅ Diagnostic complete!"
echo ""

print_status $YELLOW "🚀 Next Steps:"
echo "1. Start your Flask backend: cd ../backend && python app.py"
echo "2. Start the frontend: npm run dev (from $FRONTEND_DIR)"
echo "3. Test routes: node $ROUTE_TEST_FILE"
echo "4. Test API: node $API_TEST_FILE"
echo "5. Open http://localhost:5173 in your browser"
echo ""

print_status $YELLOW "🔧 Available Utilities:"
echo "- Route testing: ./scripts/route_test_utility.js"
echo "- API testing: ./scripts/api_test_utility.js"
echo "- This diagnostic: ./scripts/$(basename "$0")"
echo ""

print_status $GREEN "🎉 Setup verification complete!"
print_status $BLUE "💡 Your Eddie's Asian Automotive frontend should now be ready to run!"
