#!/bin/bash

echo "🚀 Starting Eddie's Askan Automotive Development Environment"
echo "==========================================================="

# Check if backend is running
if ! curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "Starting backend..."
    cd ../backend
    python app.py &
    BACKEND_PID=$!
    cd - > /dev/null
    
    # Wait a moment for backend to start
    sleep 3
    
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        echo "✅ Backend started successfully"
    else
        echo "❌ Backend failed to start"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
else
    echo "✅ Backend already running"
fi

# Start frontend
echo "Starting frontend..."
npm run dev

