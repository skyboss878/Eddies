#!/bin/bash

# API Test Script
# Run this to test your API endpoints

BASE_URL="${API_BASE_URL:-http://localhost:3001}"
TOKEN=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test authentication
echo -e "${YELLOW}Testing Authentication...${NC}"
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  | jq '.'

# Test protected endpoints (add your actual endpoints here)
echo -e "${YELLOW}Testing Protected Endpoints...${NC}"

# Example tests - modify based on your actual API
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/vehicles" | jq '.'
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/customers" | jq '.'
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/jobs" | jq '.'

echo -e "${GREEN}API tests completed${NC}"
