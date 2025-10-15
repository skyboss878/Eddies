#!/bin/bash

echo "🔧 FRESH TOKEN TEST"
echo "==================="

# Get a fresh token by logging in again
echo "1. Getting fresh JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "test_1754673307@example.com", "password": "testpass123"}' \
  http://localhost:5000/api/auth/login)

echo "Login response:"
echo "$LOGIN_RESPONSE"

# Extract the new token using a more robust method
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token": *"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "\n✅ Fresh token extracted: ${TOKEN:0:50}..."
    
    # Test with the fresh token
    echo -e "\n2. Testing /api/auth/me with fresh token..."
    ME_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
                 -w "\nSTATUS:%{http_code}" \
                 http://localhost:5000/api/auth/me)
    
    echo "$ME_RESPONSE"
    
    if echo "$ME_RESPONSE" | grep -q "STATUS:200"; then
        echo -e "\n✅ SUCCESS! Fresh token works!"
        
        echo -e "\n3. Testing customers endpoint..."
        curl -s -H "Authorization: Bearer $TOKEN" \
             -w "\nStatus: %{http_code}\n" \
             http://localhost:5000/api/v1/customers/
             
    elif echo "$ME_RESPONSE" | grep -q "Subject must be a string"; then
        echo -e "\n🔧 Still getting 'Subject must be a string' error."
        echo "This is a JWT configuration issue in your Flask app."
        echo "The fix is simple - we need to modify how JWT tokens are created."
        
        echo -e "\nDebugging JWT token content..."
        # Decode JWT payload (base64 decode the middle part)
        PAYLOAD=$(echo "$TOKEN" | cut -d'.' -f2)
        # Add padding if needed
        case $((${#PAYLOAD} % 4)) in
            2) PAYLOAD="${PAYLOAD}==";;
            3) PAYLOAD="${PAYLOAD}=";;
        esac
        echo "JWT Payload (base64 decoded):"
        echo "$PAYLOAD" | base64 -d 2>/dev/null || echo "Could not decode payload"
    fi
    
else
    echo -e "\n❌ Could not extract fresh token"
    echo "Login response was: $LOGIN_RESPONSE"
fi

echo -e "\n==================="
echo "Next Steps:"
echo "==================="
echo "If you're still getting 'Subject must be a string' errors,"
echo "we need to fix the JWT configuration in your Flask app."
echo "The issue is in how the user ID is stored in the JWT token."
