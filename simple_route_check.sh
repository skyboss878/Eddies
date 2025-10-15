#!/bin/bash

echo "🚀 Eddie's Asian Automotive - Route Verification"
echo "================================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Find the correct frontend directory
FRONTEND_DIR=""
if [[ -f "src/App.jsx" ]]; then
    FRONTEND_DIR="$(pwd)"
elif [[ -f "../src/App.jsx" ]]; then
    FRONTEND_DIR="$(cd .. && pwd)"
elif [[ -f "/data/data/com.termux/files/home/eddies-asian-automotive/frontend/src/App.jsx" ]]; then
    FRONTEND_DIR="/data/data/com.termux/files/home/eddies-asian-automotive/frontend"
else
    echo -e "${RED}❌ Cannot find App.jsx. Please run from frontend directory.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found frontend at: $FRONTEND_DIR${NC}"
cd "$FRONTEND_DIR"

# Extract routes from App.jsx
echo -e "${BLUE}📍 Extracting routes from App.jsx...${NC}"
APP_JSX="src/App.jsx"

if [[ -f "$APP_JSX" ]]; then
    echo -e "${GREEN}✅ App.jsx found${NC}"
    echo ""
    echo "🛣️  Configured Routes:"
    echo "====================="
    
    # Extract routes with better formatting
    grep -n "path=" "$APP_JSX" | while IFS=: read -r line_num line_content; do
        path=$(echo "$line_content" | sed -n 's/.*path="\([^"]*\)".*/\1/p')
        element=$(echo "$line_content" | sed -n 's/.*element={\([^}]*\)}.*/\1/p')
        
        if [[ -n "$path" ]]; then
            printf "%-3s %-25s %s\n" "$line_num:" "$path" "$element"
        fi
    done
    
    echo ""
    echo "📊 Route Statistics:"
    echo "==================="
    
    total_routes=$(grep -c "<Route" "$APP_JSX")
    protected_routes=$(grep -A 20 "ProtectedDashboardLayout" "$APP_JSX" | grep -c "<Route")
    public_routes=$((total_routes - protected_routes))
    
    echo "Total routes: $total_routes"
    echo "Public routes: $public_routes"
    echo "Protected routes: $protected_routes"
    
    echo ""
    echo "🔍 Component Verification:"
    echo "=========================="
    
    # Check if components exist
    components=(
        "components/auth/Login"
        "components/auth/Register"
        "components/layout/ProtectedDashboardLayout"
        "pages/Dashboard"
        "pages/Landing"
        "pages/customers/Customers"
        "pages/customers/CustomerList"
        "pages/customers/CustomerDetail"
        "pages/customers/AddAndEditCustomer"
        "pages/vehicles/Vehicles"
        "pages/vehicles/VehicleList"
        "pages/vehicles/VehicleDetail"
        "pages/vehicles/VehicleForm"
        "pages/vehicles/AddVehicle"
        "pages/jobs/Jobs"
    )
    
    missing_count=0
    for component in "${components[@]}"; do
        if [[ -f "src/${component}.jsx" ]]; then
            echo -e "${GREEN}✅${NC} $component.jsx"
        else
            echo -e "${RED}❌${NC} $component.jsx (missing)"
            ((missing_count++))
        fi
    done
    
    echo ""
    if [[ $missing_count -eq 0 ]]; then
        echo -e "${GREEN}🎉 All components are present!${NC}"
    else
        echo -e "${YELLOW}⚠️  $missing_count components are missing${NC}"
    fi
    
    echo ""
    echo "🚀 Test Your Routes:"
    echo "==================="
    echo "1. Start the development server: npm run dev"
    echo "2. Open http://localhost:5173 in your browser"
    echo "3. Test these key routes:"
    echo "   • http://localhost:5173/landing (Landing page)"
    echo "   • http://localhost:5173/login (Login)"
    echo "   • http://localhost:5173/register (Register)"
    echo "   • http://localhost:5173/ (Dashboard - requires login)"
    echo "   • http://localhost:5173/customers (Customer management)"
    echo "   • http://localhost:5173/vehicles (Vehicle management)"
    echo ""
    echo -e "${GREEN}✅ Route verification complete!${NC}"
    
else
    echo -e "${RED}❌ App.jsx not found at $APP_JSX${NC}"
    exit 1
fi
