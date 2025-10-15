#!/bin/bash
# Complete API Test Script for Eddie's Asian Automotive

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# API Configuration
API_BASE="http://192.168.1.85:5000"
TOKEN=""

# Counters
PASSED=0
FAILED=0

# ==============================================================================
# Helper Functions
# ==============================================================================

print_header() {
  echo -e "\n${MAGENTA}╔══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${MAGENTA}║  $1${NC}"
  echo -e "${MAGENTA}╚══════════════════════════════════════════════════════════╝${NC}\n"
}

print_test() {
  echo -e "${BLUE}📝 Testing: $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ PASS: $1${NC}"
  PASSED=$((PASSED + 1))
}

print_fail() {
  echo -e "${RED}✗ FAIL: $1${NC}"
  FAILED=$((FAILED + 1))
}

print_info() {
  echo -e "${CYAN}ℹ $1${NC}"
}

test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  local data=$4
  local expect_code=${5:-200}
  
  print_test "$description"
  
  local response
  local http_code
  
  if [ -n "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$data" \
      "${API_BASE}${endpoint}" 2>/dev/null)
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      -H "Authorization: Bearer $TOKEN" \
      "${API_BASE}${endpoint}" 2>/dev/null)
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -eq "$expect_code" ]; then
    print_success "$description (HTTP $http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body" | head -c 200
  else
    print_fail "$description (Expected $expect_code, got $http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body" | head -c 200
  fi
  
  echo ""
}

# ==============================================================================
# Main Script
# ==============================================================================

clear
echo -e "${CYAN}"
cat << "LOGO"
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║     Eddie's Asian Automotive - API Test Suite           ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
LOGO
echo -e "${NC}"

print_info "API Base URL: $API_BASE"
echo ""

# ==============================================================================
# Test 1: Health Check
# ==============================================================================
print_header "1. Health Check"

print_test "Basic connectivity"
if curl -s "${API_BASE}/" > /dev/null 2>&1; then
  print_success "Server is reachable"
else
  print_fail "Server is not reachable"
  exit 1
fi

test_endpoint "GET" "/health" "Health endpoint" "" 200

# ==============================================================================
# Test 2: Authentication
# ==============================================================================
print_header "2. Authentication Tests"

# Register a test user
TEST_EMAIL="test_$(date +%s)@test.com"
TEST_PASSWORD="TestPass123!"

print_test "Register new user"
REGISTER_DATA=$(cat <<EOF
{
  "email": "$TEST_EMAIL",
  "password": "$TEST_PASSWORD",
  "name": "Test User",
  "phone": "555-0100"
}
EOF
)

REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$REGISTER_DATA" \
  "${API_BASE}/api/auth/register" 2>/dev/null)

REGISTER_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

if [ "$REGISTER_CODE" -eq 201 ] || [ "$REGISTER_CODE" -eq 200 ]; then
  print_success "User registration (HTTP $REGISTER_CODE)"
  echo "$REGISTER_BODY" | jq '.' 2>/dev/null || echo "$REGISTER_BODY"
else
  print_info "Registration may have failed, trying login instead"
fi
echo ""

# Login
print_test "User login"
LOGIN_DATA=$(cat <<EOF
{
  "email": "$TEST_EMAIL",
  "password": "$TEST_PASSWORD"
}
EOF
)

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA" \
  "${API_BASE}/api/auth/login" 2>/dev/null)

LOGIN_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$LOGIN_CODE" -eq 200 ]; then
  print_success "User login (HTTP $LOGIN_CODE)"
  TOKEN=$(echo "$LOGIN_BODY" | jq -r '.token // .access_token // empty' 2>/dev/null)
  
  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    print_info "Token obtained: ${TOKEN:0:20}..."
  else
    print_fail "No token in response"
    echo "$LOGIN_BODY" | jq '.' 2>/dev/null || echo "$LOGIN_BODY"
  fi
else
  print_fail "User login (HTTP $LOGIN_CODE)"
  echo "$LOGIN_BODY" | jq '.' 2>/dev/null || echo "$LOGIN_BODY"
fi
echo ""

# ==============================================================================
# Test 3: Customers
# ==============================================================================
print_header "3. Customer Management"

test_endpoint "GET" "/api/auth/customers" "Get all customers" "" 200

# Create customer
CUSTOMER_DATA=$(cat <<EOF
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-0101",
  "address": "123 Main St"
}
EOF
)

print_test "Create customer"
CREATE_CUSTOMER=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$CUSTOMER_DATA" \
  "${API_BASE}/api/auth/customers" 2>/dev/null)

CREATE_CODE=$(echo "$CREATE_CUSTOMER" | tail -n1)
CREATE_BODY=$(echo "$CREATE_CUSTOMER" | sed '$d')

if [ "$CREATE_CODE" -eq 201 ] || [ "$CREATE_CODE" -eq 200 ]; then
  print_success "Create customer (HTTP $CREATE_CODE)"
  CUSTOMER_ID=$(echo "$CREATE_BODY" | jq -r '.id // .customer_id // .data.id // empty' 2>/dev/null)
  echo "$CREATE_BODY" | jq '.' 2>/dev/null || echo "$CREATE_BODY"
else
  print_fail "Create customer (HTTP $CREATE_CODE)"
  echo "$CREATE_BODY" | jq '.' 2>/dev/null || echo "$CREATE_BODY"
fi
echo ""

# Get customer by ID
if [ -n "$CUSTOMER_ID" ] && [ "$CUSTOMER_ID" != "null" ]; then
  test_endpoint "GET" "/api/auth/customers/$CUSTOMER_ID" "Get customer by ID" "" 200
fi

# Search customers
test_endpoint "GET" "/api/auth/customers/search?q=John" "Search customers" "" 200

# ==============================================================================
# Test 4: Vehicles
# ==============================================================================
print_header "4. Vehicle Management"

test_endpoint "GET" "/api/auth/vehicles" "Get all vehicles" "" 200

if [ -n "$CUSTOMER_ID" ] && [ "$CUSTOMER_ID" != "null" ]; then
  # Create vehicle
  VEHICLE_DATA=$(cat <<EOF
{
  "customer_id": "$CUSTOMER_ID",
  "year": 2020,
  "make": "Toyota",
  "model": "Camry",
  "vin": "1HGBH41JXMN109186",
  "license_plate": "ABC123",
  "color": "Silver"
}
EOF
)

  print_test "Create vehicle"
  CREATE_VEHICLE=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$VEHICLE_DATA" \
    "${API_BASE}/api/auth/vehicles" 2>/dev/null)
  
  CREATE_VEH_CODE=$(echo "$CREATE_VEHICLE" | tail -n1)
  CREATE_VEH_BODY=$(echo "$CREATE_VEHICLE" | sed '$d')
  
  if [ "$CREATE_VEH_CODE" -eq 201 ] || [ "$CREATE_VEH_CODE" -eq 200 ]; then
    print_success "Create vehicle (HTTP $CREATE_VEH_CODE)"
    VEHICLE_ID=$(echo "$CREATE_VEH_BODY" | jq -r '.id // .vehicle_id // .data.id // empty' 2>/dev/null)
    echo "$CREATE_VEH_BODY" | jq '.' 2>/dev/null || echo "$CREATE_VEH_BODY"
  else
    print_fail "Create vehicle (HTTP $CREATE_VEH_CODE)"
    echo "$CREATE_VEH_BODY" | jq '.' 2>/dev/null || echo "$CREATE_VEH_BODY"
  fi
  echo ""
fi

# ==============================================================================
# Test 5: Jobs
# ==============================================================================
print_header "5. Job Management"

test_endpoint "GET" "/api/auth/jobs" "Get all jobs" "" 200

if [ -n "$CUSTOMER_ID" ] && [ "$CUSTOMER_ID" != "null" ] && [ -n "$VEHICLE_ID" ] && [ "$VEHICLE_ID" != "null" ]; then
  # Create job
  JOB_DATA=$(cat <<EOF
{
  "customer_id": "$CUSTOMER_ID",
  "vehicle_id": "$VEHICLE_ID",
  "description": "Oil change and tire rotation",
  "status": "pending"
}
EOF
)

  test_endpoint "POST" "/api/auth/jobs" "Create job" "$JOB_DATA" 201
fi

# ==============================================================================
# Test 6: Estimates
# ==============================================================================
print_header "6. Estimate Management"

test_endpoint "GET" "/api/auth/estimates" "Get all estimates" "" 200

if [ -n "$CUSTOMER_ID" ] && [ "$CUSTOMER_ID" != "null" ] && [ -n "$VEHICLE_ID" ] && [ "$VEHICLE_ID" != "null" ]; then
  ESTIMATE_DATA=$(cat <<EOF
{
  "customer_id": "$CUSTOMER_ID",
  "vehicle_id": "$VEHICLE_ID",
  "description": "Brake pad replacement",
  "labor_cost": 150.00,
  "parts_cost": 200.00,
  "total_cost": 350.00
}
EOF
)

  test_endpoint "POST" "/api/auth/estimates" "Create estimate" "$ESTIMATE_DATA" 201
fi

# ==============================================================================
# Test 7: Invoices
# ==============================================================================
print_header "7. Invoice Management"

test_endpoint "GET" "/api/auth/invoices" "Get all invoices" "" 200

# ==============================================================================
# Test 8: Reports
# ==============================================================================
print_header "8. Reports & Dashboard"

test_endpoint "GET" "/api/auth/reports/dashboard" "Dashboard data" "" 200
test_endpoint "GET" "/api/auth/reports/revenue" "Revenue report" "" 200

# ==============================================================================
# Test 9: AI Features
# ==============================================================================
print_header "9. AI Features"

AI_CHAT_DATA=$(cat <<EOF
{
  "message": "What could cause a car to make a squeaking noise when braking?",
  "history": []
}
EOF
)

test_endpoint "POST" "/api/ai/chat" "AI chat" "$AI_CHAT_DATA" 200

# ==============================================================================
# Test 10: Time Clock
# ==============================================================================
print_header "10. Time Clock"

test_endpoint "GET" "/api/auth/timeclock/entries" "Get time entries" "" 200

# ==============================================================================
# Test 11: Settings
# ==============================================================================
print_header "11. Settings"

test_endpoint "GET" "/api/auth/settings" "Get settings" "" 200

# ==============================================================================
# Summary
# ==============================================================================
print_header "Test Summary"

TOTAL=$((PASSED + FAILED))

echo -e "${CYAN}Total Tests: $TOTAL${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║          🎉 ALL TESTS PASSED! 🎉                      ║${NC}"
  echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
  exit 0
else
  echo -e "${YELLOW}╔═══════════════════════════════════════════════════════╗${NC}"
  echo -e "${YELLOW}║      ⚠️  SOME TESTS FAILED - Review above ⚠️          ║${NC}"
  echo -e "${YELLOW}╚═══════════════════════════════════════════════════════╝${NC}"
  exit 1
fi
