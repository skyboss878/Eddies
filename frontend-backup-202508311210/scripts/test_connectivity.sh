#!/bin/bash

# Simple Frontend-Backend Test Script
# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:5173"

echo -e "${BLUE}🚀 Eddie's Automotive - Simple Connectivity Test${NC}"
echo "================================================="

# Test 1: Backend Health
echo -e "\n${YELLOW}1. Testing Backend Health${NC}"
if curl -s "$BACKEND_URL/health" >/dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not running${NC}"
    exit 1
fi

# Test 2: Frontend
echo -e "\n${YELLOW}2. Testing Frontend${NC}"
if curl -s "$FRONTEND_URL" >/dev/null; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend not responding (start with: npm run dev)${NC}"
fi

# Test 3: Login
echo -e "\n${YELLOW}3. Testing Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"admin123"}' \
    "$BACKEND_URL/api/auth/login")

echo "Login Response: $LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Login successful${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}❌ Login failed${NC}"
    exit 1
fi

# Test 4: Protected Endpoints
echo -e "\n${YELLOW}4. Testing Protected Endpoints${NC}"

endpoints=("customers" "vehicles" "jobs" "estimates" "parts")

for endpoint in "${endpoints[@]}"; do
    echo -n "Testing /api/$endpoint: "
    response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        "$BACKEND_URL/api/$endpoint")
    
    status_code="${response: -3}"
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${RED}❌ Status: $status_code${NC}"
    fi
done

# Test 5: CORS
echo -e "\n${YELLOW}5. Testing CORS${NC}"
cors_response=$(curl -s -w "%{http_code}" \
    -X OPTIONS \
    -H "Origin: $FRONTEND_URL" \
    "$BACKEND_URL/api/customers")

cors_status="${cors_response: -3}"
if [ "$cors_status" = "200" ]; then
    echo -e "${GREEN}✅ CORS working${NC}"
else
    echo -e "${RED}❌ CORS Status: $cors_status${NC}"
fi

# Test 6: Check Frontend API Configuration
echo -e "\n${YELLOW}6. Frontend API Configuration${NC}"

if [ -f "src/utils/api.js" ]; then
    echo -e "${GREEN}✅ Found src/utils/api.js${NC}"
    if grep -q "localhost:5000" src/utils/api.js; then
        echo -e "${GREEN}✅ API base URL configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Check API base URL in src/utils/api.js${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  src/utils/api.js not found${NC}"
fi

# Test 7: Environment Variables
echo -e "\n${YELLOW}7. Environment Variables${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Found .env file${NC}"
    if grep -q "VITE_API_BASE_URL" .env; then
        echo -e "${GREEN}✅ VITE_API_BASE_URL configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Add VITE_API_BASE_URL to .env${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No .env file found${NC}"
    echo "Create with: echo 'VITE_API_BASE_URL=http://localhost:5000/api' > .env"
fi

# Summary
echo -e "\n${BLUE}=== SUMMARY ===${NC}"
echo -e "${GREEN}✅ Basic connectivity test completed${NC}"
echo -e "\n${YELLOW}Quick Commands:${NC}"
echo "Start frontend: npm run dev"
echo "Test login: curl -X POST -H 'Content-Type: application/json' -d '{\"email\":\"admin@example.com\",\"password\":\"admin123\"}' http://localhost:5000/api/auth/login"
echo "Create .env: echo 'VITE_API_BASE_URL=http://localhost:5000/api' > .env"
