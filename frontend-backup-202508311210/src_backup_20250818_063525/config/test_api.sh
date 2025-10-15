#!/bin/bash
# Quick test to create a user and test APIs

echo "🚀 Testing Eddie's Automotive API..."
echo

# Step 1: Create a test user
echo "Creating test user..."
REGISTER_RESPONSE=$(curl -s -X POST http://127.0.0.1:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "eddie", "email": "eddie@fasteddies.com", "password": "automotive123"}')

echo "Register response: $REGISTER_RESPONSE"
echo

# Step 2: Login to get token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername": "eddie", "password": "automotive123"}')

echo "Login response: $LOGIN_RESPONSE"

# Extract token (you'll need jq for this, or do it manually)
if command -v jq &> /dev/null; then
    TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
    echo "Token: $TOKEN"
    echo
    
    # Step 3: Test authenticated endpoints
    echo "Testing settings endpoint..."
    curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:5000/api/settings
    echo
    echo
    
    echo "Testing initial data endpoint..."
    curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:5000/api/initial-data
    echo
else
    echo "Install jq to automatically extract token, or copy it manually from the login response above"
fi
