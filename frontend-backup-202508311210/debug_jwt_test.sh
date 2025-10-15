#!/bin/bash

echo "🔧 TESTING JWT FIX"
echo "=================="

# Generate unique user for this test
TIMESTAMP=$(date +%s)
USERNAME="testuser_$TIMESTAMP"
EMAIL="test_$TIMESTAMP@example.com"
PASSWORD="testpass123"

echo "1. Testing registration with JWT fix..."
REGISTER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}" \
  http://localhost:5000/api/auth/register)

echo "Registration response:"
echo "$REGISTER_RESPONSE" | jq .

# Extract token
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.access_token // empty')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "✅ Token extracted successfully"
    
    echo ""
    echo "2. Testing auth/check endpoint..."
    CHECK_RESPONSE=$(curl -s -X GET \
      -H "Authorization: Bearer $TOKEN" \
      http://localhost:5000/api/auth/check)
    
    echo "Auth check response:"
    echo "$CHECK_RESPONSE" | jq .
    
    # Check if we get a 200 status instead of 422
    CHECK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -H "Authorization: Bearer $TOKEN" \
      http://localhost:5000/api/auth/check)
    
    echo "Status: $CHECK_STATUS"
    
    if [ "$CHECK_STATUS" = "200" ]; then
        echo "✅ JWT fix successful!"
    else
        echo "❌ Still having JWT issues"
    fi
    
    echo ""
    echo "3. Testing protected endpoint (customers)..."
    CUSTOMERS_RESPONSE=$(curl -s -X GET \
      -H "Authorization: Bearer $TOKEN" \
      http://localhost:5000/api/v1/customers)
    
    echo "Customers response:"
    echo "$CUSTOMERS_RESPONSE" | jq .
    
else
    echo "❌ Failed to get token from registration"
fi

echo ""
echo "=================="
echo "Fix Applied: Convert user.id to string in JWT tokens"
echo "Remember to restart your Flask server after making changes!"
