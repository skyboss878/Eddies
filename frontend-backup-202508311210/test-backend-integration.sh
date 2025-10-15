#!/bin/bash

# Test frontend-backend integration
echo "🔗 Testing Frontend-Backend Integration..."

# Check if backend is running
echo "1️⃣ Checking if backend is running..."

BACKEND_URL="http://localhost:5000"
API_URL="$BACKEND_URL/api"

# Test basic connectivity
if curl -s --connect-timeout 5 "$BACKEND_URL/health" > /dev/null 2>&1; then
    echo "✅ Backend is running at $BACKEND_URL"
else
    echo "❌ Backend not responding at $BACKEND_URL"
    echo "💡 Make sure to start your backend first:"
    echo "   cd ~/eddies-asian-automotive/backend"
    echo "   python app.py"
    echo ""
    echo "🔄 Continuing with other checks..."
fi

# Check API endpoints match
echo ""
echo "2️⃣ Checking API endpoint compatibility..."

# Test some common endpoints
endpoints=(
    "/api/vehicles"
    "/api/work-orders"
    "/api/customers"
    "/api/estimates"
    "/api/auth/verify"
)

for endpoint in "${endpoints[@]}"; do
    url="$BACKEND_URL$endpoint"
    if curl -s --connect-timeout 3 "$url" > /dev/null 2>&1; then
        echo "✅ $endpoint - accessible"
    else
        echo "❓ $endpoint - check if implemented in app.py"
    fi
done

echo ""
echo "3️⃣ Checking frontend API configuration..."

# Check if apiEndpoints.js has correct base URL
if [ -f "src/utils/apiEndpoints.js" ]; then
    base_url=$(grep "BASE_URL" src/utils/apiEndpoints.js | head -1)
    echo "📋 Frontend API base URL configuration:"
    echo "   $base_url"
    
    # Check for environment variable usage
    if grep -q "process.env.REACT_APP_API_URL" src/utils/apiEndpoints.js; then
        echo "✅ Uses environment variable for API URL"
        if [ -f ".env" ]; then
            if grep -q "REACT_APP_API_URL" .env; then
                env_url=$(grep "REACT_APP_API_URL" .env)
                echo "📋 Environment configuration: $env_url"
            else
                echo "⚠️ .env file exists but no REACT_APP_API_URL found"
            fi
        else
            echo "⚠️ No .env file found, using default localhost:5000"
        fi
    fi
else
    echo "❌ apiEndpoints.js not found"
fi

echo ""
echo "4️⃣ Testing API utility functions..."

# Create a simple test script to verify API calls work
cat > test-api.js << 'EOF'
// Simple API test script
import { apiEndpoints } from './src/utils/apiEndpoints.js';

const testEndpoints = async () => {
  console.log('🧪 Testing API endpoints...');
  
  // Test basic fetch to health endpoint
  try {
    const response = await fetch('http://localhost:5000/health');
    if (response.ok) {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
  }
  
  // Test vehicles endpoint
  try {
    const response = await fetch(apiEndpoints.vehicles.list);
    console.log('📋 Vehicles endpoint status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Vehicles data received:', Array.isArray(data) ? `${data.length} items` : 'object');
    }
  } catch (error) {
    console.log('❌ Vehicles endpoint error:', error.message);
  }
};

// Run if this is called directly with node
if (typeof window === 'undefined') {
  testEndpoints();
}
EOF

# Try to run the API test (if Node.js supports ES modules)
echo "🧪 Testing API connectivity..."
if command -v node >/dev/null 2>&1; then
    # Simple connectivity test instead of ES modules
    node -e "
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/health',
      method: 'GET',
      timeout: 3000
    };
    
    const req = http.request(options, (res) => {
      console.log('✅ Backend responding with status:', res.statusCode);
      if (res.statusCode === 200) {
        console.log('✅ Health endpoint working');
      }
    });
    
    req.on('error', (err) => {
      console.log('❌ Backend connection failed:', err.message);
    });
    
    req.on('timeout', () => {
      console.log('❌ Backend connection timed out');
      req.destroy();
    });
    
    req.setTimeout(3000);
    req.end();
    " 2>/dev/null || echo "⚠️ Could not test API connectivity directly"
else
    echo "⚠️ Node.js not available for testing"
fi

echo ""
echo "5️⃣ Checking socket.io configuration..."

if [ -f "src/utils/socketUtils.js" ]; then
    socket_url=$(grep "serverUrl.*=" src/utils/socketUtils.js | head -1)
    echo "📋 Socket.IO configuration:"
    echo "   $socket_url"
    
    # Check if backend has socket.io
    if curl -s --connect-timeout 3 "$BACKEND_URL/socket.io/" | grep -q "socket.io"; then
        echo "✅ Backend has Socket.IO enabled"
    else
        echo "❓ Backend Socket.IO status unclear"
        echo "💡 Check if your app.py includes Socket.IO setup"
    fi
else
    echo "❌ socketUtils.js not found"
fi

echo ""
echo "6️⃣ Frontend build test..."

# Test if frontend builds without errors
echo "🏗️ Testing frontend build..."
if npm run build --silent > build.log 2>&1; then
    echo "✅ Frontend builds successfully"
    if [ -f "dist/index.html" ] || [ -f "build/index.html" ]; then
        echo "✅ Build artifacts created"
    fi
else
    echo "❌ Frontend build failed"
    echo "📋 Build errors:"
    tail -10 build.log
fi

echo ""
echo "7️⃣ Integration checklist..."
echo "=========================================="

checklist=(
    "Backend running on localhost:5000"
    "Frontend API endpoints match backend routes"
    "CORS enabled in backend for frontend origin"
    "Socket.IO configured (if using real-time features)"
    "Environment variables set correctly"
    "Frontend builds without import errors"
    "API error handling implemented"
)

echo "📋 Manual verification needed:"
for item in "${checklist[@]}"; do
    echo "  [ ] $item"
done

echo ""
echo "8️⃣ Next steps for full integration testing..."
echo "============================================="

echo "🚀 Start both services:"
echo "   Terminal 1: cd ~/eddies-asian-automotive/backend && python app.py"
echo "   Terminal 2: cd ~/eddies-asian-automotive/frontend && npm start"
echo ""

echo "🧪 Test these features in the browser:"
echo "   1. Login/Authentication"
echo "   2. Vehicle CRUD operations"  
echo "   3. Work order management"
echo "   4. Real-time updates (if using Socket.IO)"
echo "   5. API error handling"
echo ""

echo "🔍 Monitor browser console and network tab for:"
echo "   - API request/response cycles"
echo "   - WebSocket connections (if applicable)"
echo "   - CORS errors"
echo "   - Authentication token handling"
echo ""

echo "📊 Check backend logs for:"
echo "   - Incoming API requests"
echo "   - Database operations"
echo "   - Error responses"
echo "   - Socket.IO connections"

# Cleanup
rm -f test-api.js build.log

echo ""
echo "✨ Integration check complete!"
echo "💡 Run this script while both frontend and backend are running for best results"
