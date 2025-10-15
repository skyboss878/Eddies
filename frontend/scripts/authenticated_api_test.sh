#!/bin/bash

# Authenticated API Testing Script for Eddie's Askan Automotive
# This script registers a user, logs in, and then tests protected endpoints

echo "=================================================="
echo "AUTHENTICATED API TESTING"
echo "=================================================="

API_BASE="http://localhost:5000/api"
AUTH_BASE="http://localhost:5000/api/auth"

# Test 1: Register a new user
echo -e "\n1. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "role": "user"
  }' \
  -w "\nSTATUS:%{http_code}" \
  $AUTH_BASE/register)

echo "Registration response:"
echo "$REGISTER_RESPONSE"
echo ""

# Test 2: Login and get JWT token
echo -e "\n2. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }' \
  -w "\nSTATUS:%{http_code}" \
  $AUTH_BASE/login)

echo "Login response:"
echo "$LOGIN_RESPONSE"

# Extract the access token (this is a simple extraction, might need adjustment)
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "\n✅ Successfully obtained JWT token: ${TOKEN:0:20}..."
    
    # Test 3: Access protected endpoints with token
    echo -e "\n3. Testing authenticated endpoints..."
    
    echo -e "\n3a. Testing /api/auth/me..."
    curl -s -H "Authorization: Bearer $TOKEN" \
         -w "\nStatus: %{http_code}\n" \
         $AUTH_BASE/me
    
    echo -e "\n3b. Testing /api/v1/customers/..."
    curl -s -H "Authorization: Bearer $TOKEN" \
         -w "\nStatus: %{http_code}\n" \
         $API_BASE/v1/customers/
    
    echo -e "\n3c. Testing /api/v1/vehicles/..."
    curl -s -H "Authorization: Bearer $TOKEN" \
         -w "\nStatus: %{http_code}\n" \
         $API_BASE/v1/vehicles/
    
    # Test 4: Create a new customer
    echo -e "\n4. Testing customer creation..."
    curl -s -X POST \
         -H "Authorization: Bearer $TOKEN" \
         -H "Content-Type: application/json" \
         -d '{
           "first_name": "John",
           "last_name": "Doe",
           "email": "john.doe@email.com",
           "phone": "555-0123"
         }' \
         -w "\nStatus: %{http_code}\n" \
         $API_BASE/v1/customers/
    
    # Test 5: Create a new vehicle
    echo -e "\n5. Testing vehicle creation..."
    curl -s -X POST \
         -H "Authorization: Bearer $TOKEN" \
         -H "Content-Type: application/json" \
         -d '{
           "customer_id": 1,
           "make": "Toyota",
           "model": "Camry",
           "year": 2020,
           "license_plate": "ABC123",
           "vin": "1234567890ABCDEFG"
         }' \
         -w "\nStatus: %{http_code}\n" \
         $API_BASE/v1/vehicles/
    
else
    echo -e "\n❌ Failed to extract JWT token from login response"
    echo "This could mean:"
    echo "- User registration failed"
    echo "- Login credentials are incorrect"
    echo "- Response format is different than expected"
fi

echo -e "\n=================================================="
echo "TESTING COMPLETE"
echo "=================================================="
echo -e "\nWhat the results mean:"
echo "- 200/201 status codes = Success! ✅"
echo "- 401 status codes = Authentication required (expected for unprotected tests) ✅"
echo "- 404 status codes = Route not found ❌"
echo "- 500 status codes = Server error ❌"
echo ""
echo "If you see JSON data and 200/201 status codes above,"
echo "your API is fully functional and ready for frontend integration!"
