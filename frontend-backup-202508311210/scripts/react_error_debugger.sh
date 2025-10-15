#!/bin/bash

# React Router Error Debugger
echo "⚛️  Debugging React Router Error"
echo "================================"

# Navigate to frontend directory
if [ -d "frontend" ]; then
    cd frontend
elif [ -d "client" ]; then
    cd client
else
    echo "🔍 Looking for frontend directory..."
    find .. -name "package.json" -path "*/node_modules" -prune -o -print | grep -v node_modules | head -5
    echo "Please navigate to your frontend directory first"
    exit 1
fi

echo "📁 Current directory: $(pwd)"

echo ""
echo "🔍 Checking key files mentioned in the error..."

# Check App component
if [ -f "src/App.jsx" ] || [ -f "src/App.js" ]; then
    APP_FILE=$(find src -name "App.jsx" -o -name "App.js" | head -1)
    echo "📄 Found App component: $APP_FILE"
    echo "📋 App.jsx/js content (first 30 lines):"
    head -30 "$APP_FILE"
else
    echo "❌ App component not found"
fi

echo ""
echo "🔍 Checking Context files..."

# Check AuthContext
if [ -f "src/contexts/AuthContext.jsx" ]; then
    echo "📄 AuthContext.jsx (first 25 lines):"
    head -25 src/contexts/AuthContext.jsx
else
    echo "❌ AuthContext.jsx not found"
fi

echo ""
# Check ShopContext
if [ -f "src/contexts/ShopContext.jsx" ]; then
    echo "📄 ShopContext.jsx (first 25 lines):"
    head -25 src/contexts/ShopContext.jsx
else
    echo "❌ ShopContext.jsx not found"
fi

echo ""
echo "🔍 Checking for common issues..."

# Check for duplicate Router components
echo "🔎 Looking for Router usage in files:"
grep -rn "BrowserRouter\|Router" src/ --include="*.jsx" --include="*.js" | head -10

echo ""
echo "🔎 Checking for missing imports:"
grep -rn "import.*Router" src/ --include="*.jsx" --include="*.js"

echo ""
echo "📦 Checking package.json dependencies:"
if [ -f "package.json" ]; then
    echo "React Router version:"
    grep -E "(react-router|react-router-dom)" package.json
    
    echo ""
    echo "React version:"
    grep -E '"react"' package.json
fi

echo ""
echo "💡 Common solutions:"
echo "1. Check for nested/duplicate BrowserRouter components"
echo "2. Verify all imports are correct"
echo "3. Make sure components are properly exported/imported"
echo "4. Check that all routes have valid components"
echo "5. Ensure context providers are properly structured"

echo ""
echo "🛠️  Suggested fixes to try:"
echo "1. Remove duplicate BrowserRouter if any exist"
echo "2. Add error boundary component"
echo "3. Simplify component structure temporarily"
