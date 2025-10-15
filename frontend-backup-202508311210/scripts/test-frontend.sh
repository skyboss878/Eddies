#!/bin/bash

FRONTEND_BASE="http://localhost:5173"

# List of frontend routes to test
ROUTES=(
    "/"
    "/login"
    "/register"
    "/dashboard"
    "/customers"
    "/vehicles"
    "/jobs"
    "/estimates"
    "/settings"
)

echo "🔍 Testing frontend routes on $FRONTEND_BASE"
echo "==================================================="

i=1
for ROUTE in "${ROUTES[@]}"; do
    echo -n "$i. Testing $ROUTE... "
    CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_BASE$ROUTE")
    if [ "$CODE" -eq 200 ]; then
        echo "✅ OK"
    elif [ "$CODE" -eq 404 ]; then
        echo "❌ Not found (HTTP 404)"
    else
        echo "⚠️ HTTP $CODE"
    fi
    ((i++))
done

echo "🎉 Frontend route tests complete!"
