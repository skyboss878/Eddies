#!/bin/bash

echo "Quick Authentication Test"
echo "========================="

# Try logging in with existing user using email
echo "Trying login with email..."
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}' \
  http://localhost:5000/api/auth/login)

echo "Response: $LOGIN_RESPONSE"

# Extract token if successful
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ Got token: ${TOKEN:0:20}..."
    
    # Test protected endpoint
    echo -e "\nTesting protected endpoint..."
    curl -s -H "Authorization: Bearer $TOKEN" \
         http://localhost:5000/api/v1/customers/ | head -c 200
    echo "..."
else
    echo "❌ No token received"
    echo "Let's try with username instead..."
    
    LOGIN_RESPONSE2=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d '{"username": "testuser", "password": "testpass123"}' \
      http://localhost:5000/api/auth/login)
    
    echo "Response with username: $LOGIN_RESPONSE2"
fi
