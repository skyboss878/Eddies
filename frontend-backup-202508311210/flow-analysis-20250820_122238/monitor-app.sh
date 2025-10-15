#!/bin/bash

# App Monitoring Script
# Monitors your app's health and performance

BASE_URL="${APP_URL:-http://localhost:3000}"
API_URL="${API_URL:-http://localhost:3001}"

echo "🔍 Monitoring App Health..."

# Check if app is running
echo "Checking app availability..."
if curl -s "$BASE_URL" > /dev/null; then
    echo "✅ App is running at $BASE_URL"
else
    echo "❌ App is not accessible at $BASE_URL"
fi

# Check API health
echo "Checking API availability..."
if curl -s "$API_URL/health" > /dev/null 2>&1; then
    echo "✅ API is running at $API_URL"
else
    echo "❌ API is not accessible at $API_URL"
fi

# Monitor network requests (requires browser dev tools or network monitoring)
echo "📊 To monitor real-time API calls:"
echo "1. Open browser dev tools (F12)"
echo "2. Go to Network tab"
echo "3. Navigate through your app"
echo "4. Filter by XHR/Fetch to see API calls"

# Performance monitoring suggestions
echo "🚀 Performance monitoring suggestions:"
echo "1. Use Lighthouse: lighthouse $BASE_URL --output html --output-path ./lighthouse-report.html"
echo "2. Use browser dev tools Performance tab"
echo "3. Monitor bundle size with webpack-bundle-analyzer"
