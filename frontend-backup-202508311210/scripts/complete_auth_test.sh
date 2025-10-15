#!/bin/bash

echo "Complete Authentication Test"
echo "============================"

API_BASE="http://localhost:5000/api"
AUTH_BASE="http://localhost:5000/api/auth"

# Generate unique user data
TIMESTAMP=$(date +%s)
USERNAME="testuser_$TIMESTAMP"
EMAIL="test_${TIMESTAMP}@example.com"
PASSWORD="testpass123"

echo "Creating user: $USERNAME with email: $EMAIL"

# Step 1: Register a completely new user
echo -e "\n1. Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"role\": \"user\"
  }" \
  -w "\nSTATUS:%{http_code}" \
  $AUTH_BASE/register)

echo "Registration response:"
echo "$REGISTER_RESPONSE"

# Check if registration was successful
if echo "$REGISTER_RESPONSE" | grep -q "STATUS:20"; then
    echo "✅ Registration successful!"
    
    # Step 2: Try different login formats
    echo -e "\n2. Testing login formats..."
    
    # Format 1: Both email and username
    echo -e "\nTrying with both email and username..."
    LOGIN1=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$EMAIL\",
        \"username\": \"$USERNAME\",
        \"password\": \"$PASSWORD\"
      }" \
      $AUTH_BASE/login)
    echo "Response: $LOGIN1"
    
    # Format 2: Just email
    echo -e "\nTrying with just email..."
    LOGIN2=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$EMAIL\",
        \"password\": \"$PASSWORD\"
      }" \
      $AUTH_BASE/login)
    echo "Response: $LOGIN2"
    
    # Format 3: Just username  
    echo -e "\nTrying with just username..."
    LOGIN3=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "{
        \"username\": \"$USERNAME\",
        \"password\": \"$PASSWORD\"
      }" \
      $AUTH_BASE/login)
    echo "Response: $LOGIN3"
    
    # Format 4: Using 'login' field (some APIs use this)
    echo -e "\nTrying with 'login' field..."
    LOGIN4=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -d "{
        \"login\": \"$EMAIL\",
        \"password\": \"$PASSWORD\"
      }" \
      $AUTH_BASE/login)
    echo "Response: $LOGIN4"
    
    # Try to extract token from any successful response
    for response in "$LOGIN1" "$LOGIN2" "$LOGIN3" "$LOGIN4"; do
        TOKEN=$(echo "$response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
        if [ -n "$TOKEN" ]; then
            echo -e "\n✅ SUCCESS! Got JWT token: ${TOKEN:0:30}..."
            
            # Test protected endpoint
            echo -e "\n3. Testing protected endpoint with token..."
            CUSTOMERS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
                               -w "\nSTATUS:%{http_code}" \
                               $API_BASE/v1/customers/)
            
            echo "Customers endpoint response:"
            echo "$CUSTOMERS_RESPONSE"
            
            if echo "$CUSTOMERS_RESPONSE" | grep -q "STATUS:20"; then
                echo -e "\n🎉 COMPLETE SUCCESS! Your API is fully functional!"
                echo "✅ User registration works"
                echo "✅ User login works" 
                echo "✅ JWT authentication works"
                echo "✅ Protected endpoints work"
                echo "✅ Database integration works"
            fi
            break
        fi
    done
    
    if [ -z "$TOKEN" ]; then
        echo -e "\n❌ None of the login formats worked."
        echo "Let's check the auth route source code..."
        echo "The API might expect a different field name."
    fi
    
else
    echo -e "\n❌ Registration failed. Let's check what went wrong:"
    echo "Response was: $REGISTER_RESPONSE"
fi

echo -e "\n============================"
echo "Test Complete"
echo "============================"
