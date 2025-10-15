#!/bin/bash
echo "🔍 Running COMPLETE project diagnostic for Eddie's Asian Automotive..."

BASE_URL="http://localhost:5000/api"
FRONTEND_URL="http://localhost:5173"

# ---------------------------
# 1️⃣ Backend Health Check
# ---------------------------
echo -e "\n1️⃣ Backend Health Check"
curl -s -w "\nHTTP Status: %{http_code}\n" $BASE_URL/health || echo "❌ Cannot reach backend"

# ---------------------------
# 2️⃣ Full Auth Flow
# ---------------------------
EMAIL="test@example.com"
PASSWORD="password123"
FIRST_NAME="Test"
LAST_NAME="User"

echo -e "\n2️⃣ Full Auth Flow"

# Login
echo -e "\n🔹 Login user"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
-H "Content-Type: application/json" \
-d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "$LOGIN_RESPONSE"

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -oP '"token":\s*"\K[^"]+')
if [ -z "$TOKEN" ]; then
    echo "❌ Login failed, cannot proceed"
    exit 1
fi
echo "✅ Token extracted"
AUTH_HEADER="Authorization: Bearer $TOKEN"

# Refresh
echo -e "\n🔹 Refresh token"
REFRESH_RESPONSE=$(curl -s -X POST $BASE_URL/auth/refresh \
-H "$AUTH_HEADER")
echo "$REFRESH_RESPONSE"

# Logout
echo -e "\n🔹 Logout"
LOGOUT_RESPONSE=$(curl -s -X POST $BASE_URL/auth/logout \
-H "$AUTH_HEADER")
echo "$LOGOUT_RESPONSE"

# ---------------------------
# 3️⃣ Full Workflow: Customer → Vehicle → Estimate → Job → Invoice
# ---------------------------
echo -e "\n3️⃣ Full Workflow"

# Create Customer
echo -e "\n🔹 Creating customer"
CUSTOMER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/customers \
-H "Content-Type: application/json" \
-H "$AUTH_HEADER" \
-d '{
  "first_name": "John",
  "last_name": "Doe",
  "email": "johndoe@example.com",
  "phone": "555-1234"
}')
echo "$CUSTOMER_RESPONSE"

CUSTOMER_ID=$(echo "$CUSTOMER_RESPONSE" | grep -oP '"id":\s*\K[0-9]+')
if [ -z "$CUSTOMER_ID" ]; then
    echo "⚠ Using existing customer with email johndoe@example.com"
    # Fetch existing customer ID
    CUSTOMER_ID=$(curl -s -X GET $BASE_URL/auth/customers \
    -H "$AUTH_HEADER" | grep -oP '"id":\s*\K[0-9]+')
fi

# Add Vehicle
echo -e "\n🔹 Adding vehicle"
VEHICLE_RESPONSE=$(curl -s -X POST $BASE_URL/auth/vehicles \
-H "Content-Type: application/json" \
-H "$AUTH_HEADER" \
-d "{
  \"customer_id\": $CUSTOMER_ID,
  \"make\": \"Toyota\",
  \"model\": \"Camry\",
  \"year\": 2021,
  \"vin\": \"1HGCM82633A004352\"
}")
echo "$VEHICLE_RESPONSE"

VEHICLE_ID=$(echo "$VEHICLE_RESPONSE" | grep -oP '"id":\s*\K[0-9]+')

# Create Estimate
echo -e "\n🔹 Creating estimate"
ESTIMATE_RESPONSE=$(curl -s -X POST $BASE_URL/auth/estimates \
-H "Content-Type: application/json" \
-H "$AUTH_HEADER" \
-d "{
  \"customer_id\": $CUSTOMER_ID,
  \"vehicle_id\": $VEHICLE_ID,
  \"description\": \"Brake replacement\",
  \"total\": 300
}")
echo "$ESTIMATE_RESPONSE"

ESTIMATE_ID=$(echo "$ESTIMATE_RESPONSE" | grep -oP '"id":\s*\K[0-9]+')

# Convert Estimate to Job
echo -e "\n🔹 Converting estimate to job"
JOB_RESPONSE=$(curl -s -X POST $BASE_URL/auth/estimates/$ESTIMATE_ID/convert-to-job \
-H "Content-Type: application/json" \
-H "$AUTH_HEADER")
echo "$JOB_RESPONSE"

JOB_ID=$(echo "$JOB_RESPONSE" | grep -oP '"id":\s*\K[0-9]+')

# Create Invoice
echo -e "\n🔹 Creating invoice"
INVOICE_RESPONSE=$(curl -s -X POST $BASE_URL/auth/invoices \
-H "Content-Type: application/json" \
-H "$AUTH_HEADER" \
-d "{
  \"customer_id\": $CUSTOMER_ID,
  \"job_id\": $JOB_ID,
  \"amount\": 300
}")
echo "$INVOICE_RESPONSE"

# ---------------------------
# 4️⃣ Frontend Routes Check
# ---------------------------
FRONTEND_ROUTES=("dashboard" "profile" "settings")
echo -e "\n4️⃣ Frontend Routes Check"
for route in "${FRONTEND_ROUTES[@]}"; do
    echo "Checking $FRONTEND_URL/$route ..."
    curl -s -o /dev/null -w "%{url_effective} - HTTP %{http_code}\n" $FRONTEND_URL/$route || echo "❌ Failed"
done

# ---------------------------
# 5️⃣ Frontend .env and Context Check
# ---------------------------
echo -e "\n5️⃣ Frontend .env and Context Check"
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if grep -q "VITE_API_BASE_URL" .env; then
        echo "✅ API base URL configured"
    else
        echo "❌ VITE_API_BASE_URL missing in .env"
    fi
else
    echo "❌ .env file missing"
fi

echo -e "\n✅ COMPLETE project diagnostic finished!"
