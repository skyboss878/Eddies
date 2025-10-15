#!/bin/bash

echo "=== FRONTEND API ENDPOINTS ==="
echo "Checking frontend for API calls..."

# Find all API endpoints in frontend
echo -e "\n--- POST endpoints ---"
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -h "api\.post\|\.post(" | grep -E "'/[^']*'" -o | sort | uniq

echo -e "\n--- GET endpoints ---"
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -h "api\.get\|\.get(" | grep -E "'/[^']*'" -o | sort | uniq

echo -e "\n--- PUT endpoints ---"
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -h "api\.put\|\.put(" | grep -E "'/[^']*'" -o | sort | uniq

echo -e "\n--- DELETE endpoints ---"
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -h "api\.delete\|\.delete(" | grep -E "'/[^']*'" -o | sort | uniq

echo -e "\n=== BACKEND ROUTES ==="
echo "Checking backend for route definitions..."

# Check if backend directory exists
if [ -d "../backend" ]; then
    BACKEND_DIR="../backend"
elif [ -d "../api" ]; then
    BACKEND_DIR="../api"
elif [ -d "../server" ]; then
    BACKEND_DIR="../server"
else
    echo "Backend directory not found. Please specify the path:"
    read -p "Enter backend directory path: " BACKEND_DIR
fi

if [ -d "$BACKEND_DIR" ]; then
    echo "Searching in: $BACKEND_DIR"
    
    echo -e "\n--- Flask/Python routes ---"
    find "$BACKEND_DIR" -name "*.py" | xargs grep -h "@.*\.route\|app\.route\|blueprint\.route" | grep -E "'/[^']*'" -o | sort | uniq
    
    echo -e "\n--- Express/Node routes ---"
    find "$BACKEND_DIR" -name "*.js" | xargs grep -h "router\.\|app\.\|express\." | grep -E "(get|post|put|delete|patch)" | grep -E "'/[^']*'" -o | sort | uniq
else
    echo "Backend directory not found at: $BACKEND_DIR"
fi

echo -e "\n=== SUMMARY ==="
echo "Compare the frontend API calls with backend routes above."
echo "Make sure each frontend endpoint has a corresponding backend route!"
