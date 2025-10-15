#!/bin/bash
echo "🚗 Starting Eddie's Automotive Development Server..."

# Check if API is running
if ! curl -s http://localhost:5000/api/health > /dev/null; then
    echo "⚠️  Backend API not detected at localhost:5000"
    echo "   Make sure your backend is running first!"
fi

# Start the frontend
npm run dev
