#!/bin/bash

# Backend base URL
API_BASE="http://localhost:5000"

# Default admin credentials
EMAIL="admin@example.com"
PASSWORD="admin123"

echo "🔍 Testing full frontend connection to backend: $API_BASE"
echo "==================================================="

# 1. Health check (no /api prefix)
echo -n "1. Health check... "
HEALTH=$(curl -s -w "%{http_code}" -o health.json "$API_BASE/health")
if [ "$HEALTH" -eq 200 ]; then
    echo "✅ OK"
else
    echo "❌ Failed (HTTP $HEALTH)"
    exit 1
fi

# 2. Login and get token
echo -n "2. Logging in... "
LOGIN=$(curl -s -w "%{http_code}" -o login.json -X POST "$API_BASE/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

if [ "$LOGIN" -eq 200 ]; then
    TOKEN=$(jq -r '.token' login.json)
    echo "✅ OK (token starts: ${TOKEN:0:20}...)"
else
    echo "❌ Login failed (HTTP $LOGIN)"
    exit 1
fi

# 3. Test all main endpoints
ENDPOINTS=(
    "customers"
    "vehicles"
    "jobs"
    "estimates"
    "parts"
    "labor"
    "settings"
    "dashboard/stats"
)

i=3
for EP in "${ENDPOINTS[@]}"; do
    echo -n "$i. Testing /$EP... "
    CODE=$(curl -s -w "%{http_code}" -o temp.json "$API_BASE/api/$EP" \
        -H "Authorization: Bearer $TOKEN")
    if [ "$CODE" -eq 200 ]; then
        echo "✅ OK"
    else
        echo "❌ Failed (HTTP $CODE)"
    fi
    ((i++))
done

echo "🎉 All endpoint tests complete!"
