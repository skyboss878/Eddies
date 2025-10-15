#!/bin/bash
# Simple status check for the automotive app

cd ~/eddies-askan-automotive/frontend

echo "🔍 Eddie's Automotive App Status Check"
echo "======================================"

echo ""
echo "📦 Checking Dependencies..."
deps=("json2csv" "jspdf" "prop-types" "react-icons")
for dep in "${deps[@]}"; do
    if grep -q "\"$dep\"" package.json; then
        echo "✅ $dep"
    else
        echo "❌ Missing: $dep"
    fi
done

echo ""
echo "📄 Checking Critical Pages..."
pages=("Dashboard" "Login" "Register" "Customers" "Vehicles" "Jobs" "Estimates" "Invoices")
for page in "${pages[@]}"; do
    if [ -f "src/pages/${page}.jsx" ]; then
        echo "✅ $page.jsx"
    else
        echo "❌ Missing: $page.jsx"
    fi
done

echo ""
echo "🔧 Checking Core Services..."
services=(
    "src/utils/api.js"
    "src/contexts/AuthContext.jsx"
    "src/contexts/DataContext.jsx"
    "src/components/Layout.jsx"
    "src/components/ProtectedRoute.jsx"
)
for service in "${services[@]}"; do
    if [ -f "$service" ]; then
        echo "✅ $(basename $service)"
    else
        echo "❌ Missing: $(basename $service)"
    fi
done

echo ""
echo "🚀 Current Status:"
echo "===================="
echo "Frontend: http://localhost:3002"
echo "Backend:  http://localhost:5000"

echo ""
echo "🧹 Backup Files to Clean:"
find src -name "*.backup*" -o -name "*.old" -o -name "*.bak" | head -5

echo ""
echo "✅ Your app should be working!"
echo "💡 Open http://localhost:3002 to test all routes"
