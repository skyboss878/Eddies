#!/bin/bash
echo "🧪 Testing all routes..."

BASE_URL="http://localhost:5173"

echo "Testing public routes:"
curl -s "$BASE_URL/" | grep -q "Professional Automotive" && echo "✅ Landing page working" || echo "❌ Landing page issue"
curl -s "$BASE_URL/login" | grep -q -i "login\|sign" && echo "✅ Login page working" || echo "❌ Login page issue"

echo
echo "Note: Protected routes require authentication to test properly"
echo "After logging in, test these URLs:"
echo "- $BASE_URL/dashboard"
echo "- $BASE_URL/customers" 
echo "- $BASE_URL/vehicles"
echo "- $BASE_URL/jobs"
echo "- $BASE_URL/estimates"
echo "- $BASE_URL/invoices"
