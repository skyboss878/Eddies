#!/bin/bash

echo "🔍 Verifying Eddie's Askan Automotive setup..."

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running"
    echo "   Start it with: cd ../backend && python app.py"
    exit 1
fi

# Check frontend config
if [ -f ".env" ] && grep -q "VITE_API_BASE_URL" .env; then
    echo "✅ Frontend .env configured"
else
    echo "❌ Frontend .env missing or misconfigured"
    exit 1
fi

# Test API connection
echo "🧪 Testing API connection..."
curl -s -w "Status: %{http_code}\n" http://localhost:5000/api/health

echo "✅ Setup verification complete!"
