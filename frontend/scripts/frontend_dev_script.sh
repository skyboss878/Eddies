#!/bin/bash

# Frontend Development Script
# This script starts your Vite React frontend with enhanced debugging

echo "🚀 Starting Vite React Frontend..."
echo "=================================="

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the frontend directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Display current directory and key config files
echo "📍 Current directory: $(pwd)"
echo "📋 Package.json scripts:"
npm run --silent 2>/dev/null || echo "No scripts found"

# Check for vite.config.js/ts
if [ -f "vite.config.js" ] || [ -f "vite.config.ts" ]; then
    echo "✅ Vite config found"
    echo "🔧 Vite config contents:"
    cat vite.config.* 2>/dev/null | head -20
else
    echo "⚠️  No vite.config.js/ts found - using default settings"
fi

# Check for .env files
if [ -f ".env" ] || [ -f ".env.local" ] || [ -f ".env.development" ]; then
    echo "🔐 Environment files found:"
    ls -la .env* 2>/dev/null
    echo "Environment variables (showing non-sensitive ones):"
    grep -E "^VITE_|^REACT_APP_" .env* 2>/dev/null || echo "No VITE_ or REACT_APP_ variables found"
else
    echo "⚠️  No .env files found"
fi

# Start the development server with verbose output
echo ""
echo "🏁 Starting development server..."
echo "Default URL will be: http://localhost:5173"
echo "Press Ctrl+C to stop the server"
echo "=================================="

# Run with host flag to allow external connections and show network info
npm run dev -- --host --port 5173
