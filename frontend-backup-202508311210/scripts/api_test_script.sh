#!/bin/bash

# API Testing Script for Eddie's Askan Automotive
# Run this in a NEW terminal while Flask server is running

echo "=================================================="
echo "TESTING EDDIE'S ASKAN AUTOMOTIVE API"
echo "=================================================="

# Test basic connectivity
echo -e "\n1. Testing basic connectivity..."
curl -s -w "\nStatus: %{http_code}\n" http://localhost:5000/api/auth/check

# Test customers endpoint
echo -e "\n2. Testing customers endpoint..."
curl -s -w "\nStatus: %{http_code}\n" http://localhost:5000/api/v1/customers/

# Test vehicles endpoint  
echo -e "\n3. Testing vehicles endpoint..."
curl -s -w "\nStatus: %{http_code}\n" http://localhost:5000/api/v1/vehicles/

# Test authentication endpoints
echo -e "\n4. Testing auth endpoints..."
echo "Auth check:"
curl -s -w "\nStatus: %{http_code}\n" http://localhost:5000/api/auth/me

# Test if we can get a list of all routes
echo -e "\n5. Testing route discovery..."
curl -s http://localhost:5000/ 2>/dev/null || echo "Root route not available (expected)"

echo -e "\n=================================================="
echo "API TESTING COMPLETE"
echo "=================================================="
echo -e "\nIf you see JSON responses above, the API is working!"
echo "If you see 404 errors, there might still be route registration issues."
echo -e "\nNext steps:"
echo "1. Check the Flask terminal for any error messages"
echo "2. Look for actual JSON data in the responses above" 
echo "3. If working, you can now connect your frontend!"
