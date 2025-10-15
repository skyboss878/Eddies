#!/bin/bash

echo "🔍 FRONTEND CONFIGURATION CHECKER"
echo "=================================="

# Check if we're in frontend directory or need to find it
if [ -f "package.json" ] && [ -d "src" ]; then
    echo "✅ Running from frontend directory"
    FRONTEND_DIR="."
elif [ -d "frontend" ]; then
    echo "✅ Frontend directory found"
    FRONTEND_DIR="frontend"
else
    echo "❌ Frontend directory not found!"
    echo "Current directory contents:"
    ls -la
    exit 1
fi

echo ""

# Check frontend structure
echo "📁 Frontend Directory Structure:"
echo "--------------------------------"
find $FRONTEND_DIR -type f -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.html" -o -name "*.css" | head -20

echo ""
echo "📦 Package.json Check:"
echo "----------------------"
if [ -f "$FRONTEND_DIR/package.json" ]; then
    echo "✅ package.json found"
    echo "Project type:"
    if grep -q "vite" "$FRONTEND_DIR/package.json"; then
        echo "🚀 Vite React project detected"
    elif grep -q "react-scripts" "$FRONTEND_DIR/package.json"; then
        echo "⚛️ Create React App detected"
    fi
    echo ""
    echo "Scripts:"
    cat $FRONTEND_DIR/package.json | grep -A 10 '"scripts"'
    echo ""
    echo "Dependencies:"
    cat $FRONTEND_DIR/package.json | grep -A 20 '"dependencies"'
else
    echo "❌ package.json not found!"
fi

echo ""
echo "🔧 Key Frontend Files Check:"
echo "----------------------------"

# Check critical files
files=(
    "$FRONTEND_DIR/src/App.js"
    "$FRONTEND_DIR/src/App.jsx"
    "$FRONTEND_DIR/src/main.js" 
    "$FRONTEND_DIR/src/main.jsx"
    "$FRONTEND_DIR/src/index.js"
    "$FRONTEND_DIR/src/components/Login.js"
    "$FRONTEND_DIR/src/components/Login.jsx"
    "$FRONTEND_DIR/src/components/Dashboard.js"
    "$FRONTEND_DIR/src/components/Dashboard.jsx"
    "$FRONTEND_DIR/src/services/api.js"
    "$FRONTEND_DIR/src/services/api.jsx"
    "$FRONTEND_DIR/index.html"
    "$FRONTEND_DIR/public/index.html"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
    fi
done

echo ""
echo "🌐 API Configuration Check:"
echo "---------------------------"

# Check for API endpoint configurations
echo "Searching for API configurations..."
find $FRONTEND_DIR/src -name "*.js" -o -name "*.jsx" | xargs grep -l "localhost:5000\|127.0.0.1:5000\|api" 2>/dev/null | head -5

echo ""
echo "API base URLs found:"
find $FRONTEND_DIR/src -name "*.js" -o -name "*.jsx" | xargs grep -n "baseURL\|BASE_URL\|localhost.*5000" 2>/dev/null | head -5

if [ -f "$FRONTEND_DIR/src/services/api.js" ] || [ -f "$FRONTEND_DIR/src/services/api.jsx" ]; then
    api_file=""
    [ -f "$FRONTEND_DIR/src/services/api.js" ] && api_file="$FRONTEND_DIR/src/services/api.js"
    [ -f "$FRONTEND_DIR/src/services/api.jsx" ] && api_file="$FRONTEND_DIR/src/services/api.jsx"
    
    echo ""
    echo "📄 API Service Configuration:"
    echo "Auth endpoints:"
    grep -n "login\|auth" "$api_file" || echo "No auth endpoints found"
else
    echo ""
    echo "❌ No dedicated API service file found"
fi

echo ""
echo "🔐 Authentication Check:"
echo "------------------------"

login_file=""
[ -f "$FRONTEND_DIR/src/components/Login.js" ] && login_file="$FRONTEND_DIR/src/components/Login.js"
[ -f "$FRONTEND_DIR/src/components/Login.jsx" ] && login_file="$FRONTEND_DIR/src/components/Login.jsx"

if [ -n "$login_file" ]; then
    echo "📄 Login Component: $login_file"
    echo "API calls in Login:"
    grep -n "fetch\|axios\|api\|login" "$login_file" | head -5
    echo ""
    echo "Token handling:"
    grep -n "token\|localStorage\|sessionStorage" "$login_file" | head -3
else
    echo "❌ Login component not found"
    echo "Searching for login-related files:"
    find $FRONTEND_DIR/src -name "*login*" -o -name "*Login*" -o -name "*auth*" -o -name "*Auth*" 2>/dev/null
fi

echo ""
echo "📊 Dashboard Check:"
echo "------------------"

if [ -f "frontend/src/components/Dashboard.js" ]; then
    echo "📄 Dashboard Component:"
    echo "API endpoints used:"
    grep -n "customers\|vehicles\|jobs" frontend/src/components/Dashboard.js | head -5
    echo ""
    echo "Auth header usage:"
    grep -n "Authorization\|Bearer" frontend/src/components/Dashboard.js | head -3
else
    echo "❌ Dashboard component not found"
fi

echo ""
echo "🚀 Development Server Check:"
echo "----------------------------"

if [ -f "frontend/package.json" ]; then
    echo "Available npm scripts:"
    grep -A 10 '"scripts"' frontend/package.json
    echo ""
    echo "To start frontend:"
    echo "cd frontend && npm start"
else
    echo "❌ Cannot check npm scripts - package.json missing"
fi

echo ""
echo "🔗 Backend Connection Test:"
echo "---------------------------"

echo "Testing backend connectivity..."
backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/ 2>/dev/null || echo "FAILED")
if [ "$backend_status" = "200" ] || [ "$backend_status" = "404" ]; then
    echo "✅ Backend server is running on localhost:5000"
else
    echo "❌ Backend server not responding (Status: $backend_status)"
    echo "Make sure to run: cd backend && python app.py"
fi

# Test auth endpoint
auth_status=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' 2>/dev/null || echo "FAILED")

if [ "$auth_status" = "200" ]; then
    echo "✅ Auth endpoint working (/api/auth/login)"
else
    echo "❌ Auth endpoint issue (Status: $auth_status)"
fi

echo ""
echo "📋 SUMMARY:"
echo "----------"
echo "Run this script to see your frontend configuration issues."
echo "After reviewing, we can fix any problems found!"
