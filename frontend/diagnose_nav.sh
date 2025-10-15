#!/bin/bash

# Navigation & Protected Routes Diagnosis Script
# This script diagnoses authentication and navigation layout issues

echo "================================================"
echo "Navigation & Auth Diagnosis Tool"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $1"
        return 1
    fi
}

# Function to search for pattern in file
search_pattern() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if [ -f "$file" ]; then
        if grep -q "$pattern" "$file"; then
            echo -e "${GREEN}✓${NC} $description found in $file"
            return 0
        else
            echo -e "${RED}✗${NC} $description NOT found in $file"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠${NC} Cannot check $file (file not found)"
        return 2
    fi
}

echo -e "${BLUE}[1] Checking Project Structure...${NC}"
echo "-------------------------------------------"

# Check for common layout files
check_file "src/layouts/ProtectedDashboardLayout.jsx"
check_file "src/contexts/AuthContext.jsx"
check_file "src/contexts/CombinedProviders.jsx"
check_file "src/App.jsx"

echo ""
echo -e "${BLUE}[2] Checking AuthContext Implementation...${NC}"
echo "-------------------------------------------"

# Check AuthContext structure
if [ -f "src/contexts/AuthContext.jsx" ]; then
    echo "Analyzing AuthContext.jsx..."
    search_pattern "src/contexts/AuthContext.jsx" "createContext" "createContext"
    search_pattern "src/contexts/AuthContext.jsx" "AuthProvider" "AuthProvider component"
    search_pattern "src/contexts/AuthContext.jsx" "useAuth" "useAuth hook"
    search_pattern "src/contexts/AuthContext.jsx" "token" "Token management"
    search_pattern "src/contexts/AuthContext.jsx" "localStorage\|sessionStorage" "Storage usage"
fi

echo ""
echo -e "${BLUE}[3] Checking Provider Hierarchy...${NC}"
echo "-------------------------------------------"

# Check CombinedProviders
if [ -f "src/contexts/CombinedProviders.jsx" ]; then
    echo "Analyzing CombinedProviders.jsx..."
    search_pattern "src/contexts/CombinedProviders.jsx" "AuthProvider" "AuthProvider wrapper"
    search_pattern "src/contexts/CombinedProviders.jsx" "ShopProvider" "ShopProvider wrapper"
    search_pattern "src/contexts/CombinedProviders.jsx" "DataProvider" "DataProvider wrapper"
    search_pattern "src/contexts/CombinedProviders.jsx" "SettingsProvider" "SettingsProvider wrapper"
    
    # Check provider order
    echo ""
    echo "Provider nesting order:"
    grep -n "Provider" "src/contexts/CombinedProviders.jsx" | head -10
fi

echo ""
echo -e "${BLUE}[4] Checking Protected Layout...${NC}"
echo "-------------------------------------------"

if [ -f "src/layouts/ProtectedDashboardLayout.jsx" ]; then
    echo "Analyzing ProtectedDashboardLayout.jsx..."
    search_pattern "src/layouts/ProtectedDashboardLayout.jsx" "useAuth" "useAuth hook usage"
    search_pattern "src/layouts/ProtectedDashboardLayout.jsx" "token\|user" "Auth state checking"
    search_pattern "src/layouts/ProtectedDashboardLayout.jsx" "Navigate\|redirect" "Redirect logic"
    search_pattern "src/layouts/ProtectedDashboardLayout.jsx" "Outlet" "React Router Outlet"
fi

echo ""
echo -e "${BLUE}[5] Checking Route Configuration...${NC}"
echo "-------------------------------------------"

if [ -f "src/App.jsx" ]; then
    echo "Analyzing App.jsx..."
    search_pattern "src/App.jsx" "BrowserRouter\|Router" "Router setup"
    search_pattern "src/App.jsx" "Routes" "Routes component"
    search_pattern "src/App.jsx" "ProtectedDashboardLayout" "Protected layout usage"
    search_pattern "src/App.jsx" "AuthProvider\|CombinedProviders" "Provider wrapper"
    
    echo ""
    echo "Route structure:"
    grep -n "Route\|element=" "src/App.jsx" | head -15
fi

echo ""
echo -e "${BLUE}[6] Checking API/Fetch Calls...${NC}"
echo "-------------------------------------------"

# Find files with API calls
echo "Searching for API calls with authentication..."
if [ -f "src/contexts/DataContext.jsx" ]; then
    search_pattern "src/contexts/DataContext.jsx" "fetch\|axios" "API calls"
    search_pattern "src/contexts/DataContext.jsx" "Authorization\|Bearer" "Auth headers"
fi

# Check for customer loading specifically
echo ""
echo "Checking customer loading logic..."
customer_files=$(find src -name "*.jsx" -o -name "*.js" | xargs grep -l "load.*customer\|fetch.*customer" 2>/dev/null)
if [ ! -z "$customer_files" ]; then
    echo "Files with customer loading:"
    echo "$customer_files"
fi

echo ""
echo -e "${BLUE}[7] Common Issues Detection...${NC}"
echo "-------------------------------------------"

issues_found=0

# Check if AuthProvider is outside protected routes
if [ -f "src/App.jsx" ]; then
    # Check for common anti-patterns
    if grep -q "ProtectedDashboardLayout" "src/App.jsx"; then
        if ! grep -B20 "ProtectedDashboardLayout" "src/App.jsx" | grep -q "AuthProvider\|CombinedProviders"; then
            echo -e "${RED}⚠ WARNING:${NC} Protected routes might be outside AuthProvider!"
            issues_found=$((issues_found + 1))
        fi
    fi
fi

# Check for token in localStorage vs sessionStorage
echo ""
echo "Checking storage usage patterns..."
storage_files=$(find src -name "*.jsx" -o -name "*.js" | xargs grep -l "localStorage.*token\|sessionStorage.*token" 2>/dev/null)
if [ ! -z "$storage_files" ]; then
    echo "Files using token storage:"
    echo "$storage_files"
fi

echo ""
echo -e "${BLUE}[8] Environment Check...${NC}"
echo "-------------------------------------------"

# Check if backend is running
if command -v curl &> /dev/null; then
    echo "Testing backend connection..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓${NC} Server responding at localhost:5173"
    else
        echo -e "${RED}✗${NC} Server not responding at localhost:5173"
    fi
else
    echo -e "${YELLOW}⚠${NC} curl not available, skipping backend test"
fi

echo ""
echo "================================================"
echo -e "${BLUE}DIAGNOSIS COMPLETE${NC}"
echo "================================================"

if [ $issues_found -gt 0 ]; then
    echo -e "${RED}Found $issues_found potential issues${NC}"
else
    echo -e "${GREEN}No critical issues detected${NC}"
fi

echo ""
echo "Next Steps:"
echo "1. Review the output above for any missing files or patterns"
echo "2. Check that AuthProvider wraps all protected routes"
echo "3. Verify token is being stored and retrieved correctly"
echo "4. Ensure API calls include Authorization headers"
echo ""
echo "For detailed file inspection, run:"
echo "  cat src/layouts/ProtectedDashboardLayout.jsx"
echo "  cat src/contexts/AuthContext.jsx"
echo ""
