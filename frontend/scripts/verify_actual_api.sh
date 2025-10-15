#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://127.0.0.1:5000"

echo -e "${BLUE}🔐 Getting auth token...${NC}"

# Register or login to get token
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User", 
    "email": "test@example.com",
    "password": "123456"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo -e "${YELLOW}Registration failed, trying login...${NC}"
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "123456"
    }')
  TOKEN=$(echo $RESPONSE | jq -r '.token // empty')
fi

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Could not get auth token${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Token obtained${NC}"

# Function to test endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local expected_auth=$4
  
  echo -n "Testing $method $endpoint... "
  
  if [ "$expected_auth" = "true" ]; then
    headers="-H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json'"
  else
    headers="-H 'Content-Type: application/json'"
  fi
  
  if [ -n "$data" ]; then
    response=$(eval "curl -s -X $method '$BASE_URL$endpoint' $headers -d '$data'")
  else
    response=$(eval "curl -s -X $method '$BASE_URL$endpoint' $headers")
  fi
  
  # Check if response contains error
  if echo "$response" | grep -q "Resource not found\|404\|500\|Internal Server Error"; then
    echo -e "${RED}❌ Not Found/Error${NC}"
  elif echo "$response" | grep -q "Unauthorized\|401"; then
    echo -e "${YELLOW}⚠️ Unauthorized${NC}"
  else
    echo -e "${GREEN}✅ Success${NC}"
  fi
}

echo -e "\n${BLUE}🚀 Testing Authentication Endpoints...${NC}"
test_endpoint "POST" "/api/auth/login" '{"email":"test@example.com","password":"123456"}' false
test_endpoint "GET" "/api/auth/me" "" true

echo -e "\n${BLUE}🚀 Testing Customer Endpoints...${NC}"
test_endpoint "GET" "/api/auth/customers" "" true
test_endpoint "POST" "/api/auth/customers" '{"first_name":"John","last_name":"Doe","email":"john@example.com","phone":"555-1234"}' true
test_endpoint "GET" "/api/auth/customers/search?q=test" "" true

echo -e "\n${BLUE}🚀 Testing Vehicle Endpoints...${NC}"
test_endpoint "GET" "/api/auth/vehicles" "" true
test_endpoint "POST" "/api/auth/vehicles" '{"customer_id":1,"year":"2020","make":"Toyota","model":"Camry","vin":"1234567890"}' true

echo -e "\n${BLUE}🚀 Testing Job Endpoints...${NC}"
test_endpoint "GET" "/api/auth/jobs" "" true
test_endpoint "POST" "/api/auth/jobs" '{"customer_id":1,"vehicle_id":1,"description":"Oil change","status":"pending"}' true

echo -e "\n${BLUE}🚀 Testing Estimate Endpoints...${NC}"
test_endpoint "GET" "/api/auth/estimates" "" true
test_endpoint "POST" "/api/auth/estimates" '{"customer_id":1,"vehicle_id":1,"description":"Brake repair","labor_hours":2}' true

echo -e "\n${BLUE}🚀 Testing Invoice Endpoints...${NC}"
test_endpoint "GET" "/api/auth/invoices" "" true
test_endpoint "POST" "/api/auth/invoices" '{"customer_id":1,"total_amount":100.00,"status":"pending"}' true

echo -e "\n${BLUE}🚀 Testing Dashboard Endpoints...${NC}"
test_endpoint "GET" "/api/auth/dashboard/stats" "" true
test_endpoint "GET" "/api/auth/dashboard/recent-activity" "" true

echo -e "\n${BLUE}🚀 Testing Settings Endpoints...${NC}"
test_endpoint "GET" "/api/auth/settings" "" true
test_endpoint "GET" "/api/auth/settings/shop" "" true

echo -e "\n${BLUE}🚀 Testing Time Clock Endpoints...${NC}"
test_endpoint "GET" "/api/auth/timeclock/status" "" true
test_endpoint "POST" "/api/auth/timeclock/clock-in" "" true
test_endpoint "GET" "/api/auth/timeclock/history" "" true

echo -e "\n${BLUE}🚀 Testing Health Endpoints...${NC}"
test_endpoint "GET" "/api/auth/health" "" true
test_endpoint "GET" "/api/auth/health/status" "" true

echo -e "\n${GREEN}🎉 API verification complete!${NC}"
