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

echo -e "${BLUE}🚀 Eddie's Automotive - Fixed Test Script${NC}"
echo "================================================="

# Test 1: Backend Health
echo -e "\n${YELLOW}1. Testing Backend Health${NC}"
if curl -s "$BACKEND_URL/health" >/dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not running${NC}"
    exit 1
fi

# Test 2: Login and Token
echo -e "\n${YELLOW}2. Testing Login and Token Extraction${NC}"
LOGIN_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"admin123"}' \
    "$BACKEND_URL/api/auth/login")

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Login successful${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    if [ ! -z "$TOKEN" ]; then
        echo "Token extracted: ${TOKEN:0:30}..."
    else
        echo -e "${RED}❌ Token extraction failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Login failed${NC}"
    exit 1
fi

# Test 3: Protected Endpoints with proper token
echo -e "\n${YELLOW}3. Testing Protected Endpoints${NC}"

endpoints=("customers" "vehicles" "jobs" "estimates" "parts")

for endpoint in "${endpoints[@]}"; do
    echo -n "Testing /api/$endpoint: "
    response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        "$BACKEND_URL/api/$endpoint")
    
    status_code="${response: -3}"
    response_body="${response%???}"
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${RED}❌ Status: $status_code${NC}"
        if [ ! -z "$response_body" ] && [ ${#response_body} -lt 100 ]; then
            echo "    Response: $response_body"
        fi
    fi
done

# Test 4: Detailed customers test
echo -e "\n${YELLOW}4. Detailed Customers Test${NC}"
echo "Full curl command:"
echo "curl -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' $BACKEND_URL/api/customers"
echo ""
echo "Response:"
curl -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "$BACKEND_URL/api/customers"
echo ""

echo -e "\n${BLUE}=== TEST COMPLETE ===${NC}"
