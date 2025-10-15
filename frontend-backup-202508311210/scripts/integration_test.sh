#!/bin/bash

# Frontend-Backend Integration Test
# Tests both directions: backend->frontend and frontend->backend

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:5173"

echo -e "${BLUE}🔄 Frontend ↔ Backend Integration Test${NC}"
echo "=============================================="

# Function to test endpoint
test_endpoint() {
    local url=$1
    local description=$2
    local expected_content=$3
    
    echo -n "Testing $description: "
    response=$(curl -s -w "%{http_code}" "$url" 2>/dev/null)
    status_code="${response: -3}"
    body="${response%???}"
    
    if [ "$status_code" = "200" ]; then
        if [ ! -z "$expected_content" ] && echo "$body" | grep -q "$expected_content"; then
            echo -e "${GREEN}✅ OK (Content Found)${NC}"
            return 0
        elif [ -z "$expected_content" ]; then
            echo -e "${GREEN}✅ OK${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  OK but missing expected content${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Status: $status_code${NC}"
        return 1
    fi
}

# Test 1: Backend Health
echo -e "\n${PURPLE}=== BACKEND TESTS ===${NC}"
test_endpoint "$BACKEND_URL/health" "Backend Health" "ok"

# Test 2: Frontend Accessibility
echo -e "\n${PURPLE}=== FRONTEND TESTS ===${NC}"
test_endpoint "$FRONTEND_URL" "Frontend Root" ""

# Test 3: Frontend API Configuration Check
echo -e "\n${PURPLE}=== FRONTEND API CONFIGURATION ===${NC}"

if [ -f "src/utils/api.js" ]; then
    echo -e "${GREEN}✅ API configuration file exists${NC}"
    
    # Check API base URL
    if grep -q "localhost:5000" src/utils/api.js; then
        echo -e "${GREEN}✅ Backend URL configured correctly${NC}"
    else
        echo -e "${RED}❌ Backend URL not found in API config${NC}"
    fi
else
    echo -e "${RED}❌ API configuration file not found${NC}"
fi

# Test 4: CORS Integration Test
echo -e "\n${PURPLE}=== CORS INTEGRATION TEST ===${NC}"

echo "Testing CORS from frontend origin..."
cors_response=$(curl -s -w "%{http_code}" \
    -X OPTIONS \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: authorization,content-type" \
    "$BACKEND_URL/api/customers" 2>/dev/null)

cors_status="${cors_response: -3}"

if [ "$cors_status" = "200" ]; then
    echo -e "${GREEN}✅ CORS preflight successful${NC}"
else
    echo -e "${RED}❌ CORS preflight failed: $cors_status${NC}"
fi

# Test 5: Authentication Integration
echo -e "\n${PURPLE}=== AUTHENTICATION INTEGRATION ===${NC}"

echo "Testing full authentication flow..."

TOKEN=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"admin123"}' \
    "$BACKEND_URL/api/auth/login" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

if [ ! -z "$TOKEN" ]; then
    echo -e "${GREEN}✅ Backend authentication successful${NC}"
    
    # Test protected endpoint
    auth_test=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        "$BACKEND_URL/api/auth/me")
    
    auth_status="${auth_test: -3}"
    if [ "$auth_status" = "200" ]; then
        echo -e "${GREEN}✅ Token validation successful${NC}"
    else
        echo -e "${RED}❌ Token validation failed: $auth_status${NC}"
    fi
else
    echo -e "${RED}❌ Authentication failed${NC}"
fi

# Test 6: Browser Simulation
echo -e "\n${PURPLE}=== BROWSER SIMULATION TEST ===${NC}"

main_html=$(curl -s "$FRONTEND_URL" 2>/dev/null)
if echo "$main_html" | grep -q "<!DOCTYPE html"; then
    echo -e "${GREEN}✅ HTML page loads correctly${NC}"
    
    if echo "$main_html" | grep -q "root"; then
        echo -e "${GREEN}✅ React root element found${NC}"
    fi
    
    # Show a snippet of the HTML
    echo -e "${YELLOW}HTML Preview:${NC}"
    echo "$main_html" | head -10 | sed 's/^/  /'
else
    echo -e "${RED}❌ Invalid HTML response${NC}"
fi

# Final Summary
echo -e "\n${BLUE}=== INTEGRATION TEST SUMMARY ===${NC}"
echo -e "${GREEN}Backend: $BACKEND_URL${NC}"
echo -e "${GREEN}Frontend: $FRONTEND_URL${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Open browser: $FRONTEND_URL"
echo "2. Try logging in with admin@example.com / admin123"
echo "3. Check browser console for any JavaScript errors"
echo "4. Verify API calls in Network tab (F12)"

echo -e "\n${BLUE}🎯 Integration test complete!${NC}"
