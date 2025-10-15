#!/bin/bash

# Endpoint Checker Script
# This script extracts all API endpoints from frontend and backend files

echo "🔍 EDDIE'S ASKAN AUTOMOTIVE - ENDPOINT ANALYSIS"
echo "================================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to extract Flask routes from Python files
extract_flask_routes() {
    echo -e "${BLUE}📋 BACKEND ROUTES (Flask)${NC}"
    echo "=========================="
    
    if [ -f "backend/app.py" ]; then
        echo "From backend/app.py:"
        grep -n "@app.route\|@bp.route" backend/app.py | sed 's/@app.route(\|@bp.route(//' | sed "s/', methods=.*//" | sed "s/')$//" | sed 's/^[[:space:]]*//' | sort | uniq
    else
        echo "❌ backend/app.py not found"
    fi
    
    # Check for other Python files with routes
    find . -name "*.py" -not -path "./venv/*" -not -path "./.venv/*" -not -path "./node_modules/*" | xargs grep -l "@.*\.route" | while read file; do
        if [ "$file" != "./backend/app.py" ]; then
            echo
            echo "From $file:"
            grep -n "@.*\.route" "$file" | sed 's/@.*\.route(//' | sed "s/', methods=.*//" | sed "s/')$//" | sed 's/^[[:space:]]*//' | sort | uniq
        fi
    done
    echo
}

# Function to extract API calls from frontend files
extract_frontend_calls() {
    echo -e "${GREEN}🌐 FRONTEND API CALLS${NC}"
    echo "====================="
    
    # Look for fetch, axios, or API calls in JavaScript/React files
    echo "API calls found in frontend files:"
    
    # Search for fetch calls
    find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -E "(src/|frontend/)" | xargs grep -n "fetch\|axios\.\|api\." | grep -E "(get|post|put|delete|patch)" | sed 's/.*fetch(//' | sed 's/.*axios\.//' | sed 's/.*api\.//' | sed 's/[`'"'"']//g' | sed 's/,.*$//' | sed 's/).*$//' | sed 's/^[[:space:]]*//' | sort | uniq
    
    echo
    
    # Search for URL patterns
    echo "URL patterns in frontend:"
    find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -E "(src/|frontend/)" | xargs grep -o "/api/[^'\"]*" | sed 's/.*://' | sort | uniq
    
    echo
}

# Function to check for common API endpoints
check_common_endpoints() {
    echo -e "${YELLOW}🎯 COMMON ENDPOINTS TO CHECK${NC}"
    echo "============================="
    
    common_endpoints=(
        "/api/auth/login"
        "/api/auth/register"
        "/api/auth/logout"
        "/api/customers"
        "/api/vehicles" 
        "/api/jobs"
        "/api/estimates"
        "/api/invoices"
        "/api/health"
        "/api/dashboard/stats"
        "/ai/diagnosis"
        "/ai/generate-estimate"
    )
    
    echo "Checking if these common endpoints exist in your backend:"
    for endpoint in "${common_endpoints[@]}"; do
        if grep -q "$endpoint" backend/app.py 2>/dev/null; then
            echo -e "✅ $endpoint - ${GREEN}Found${NC}"
        else
            echo -e "❌ $endpoint - ${RED}Missing${NC}"
        fi
    done
    echo
}

# Function to test live endpoints
test_live_endpoints() {
    echo -e "${BLUE}🧪 TESTING LIVE ENDPOINTS${NC}"
    echo "========================="
    
    base_url="http://localhost:5000"
    
    echo "Testing if server is running on $base_url..."
    
    # Test basic endpoints
    endpoints_to_test=(
        "/"
        "/health"
        "/api/health"
        "/api/customers"
        "/api/vehicles"
    )
    
    for endpoint in "${endpoints_to_test[@]}"; do
        response=$(curl -s -o /dev/null -w "%{http_code}" "$base_url$endpoint" 2>/dev/null)
        if [ $? -eq 0 ]; then
            if [ "$response" = "200" ]; then
                echo -e "✅ $endpoint - ${GREEN}200 OK${NC}"
            elif [ "$response" = "404" ]; then
                echo -e "❌ $endpoint - ${RED}404 Not Found${NC}"
            else
                echo -e "⚠️  $endpoint - ${YELLOW}$response${NC}"
            fi
        else
            echo -e "❌ $endpoint - ${RED}Server not reachable${NC}"
        fi
    done
    echo
}

# Function to show file structure
show_structure() {
    echo -e "${BLUE}📁 PROJECT STRUCTURE${NC}"
    echo "===================="
    
    if command -v tree >/dev/null 2>&1; then
        tree -I 'node_modules|venv|.venv|__pycache__|.git' -L 3
    else
        echo "Frontend files:"
        find . -name "*.jsx" -o -name "*.js" | grep -E "(src/|frontend/)" | head -10
        echo
        echo "Backend files:"
        find . -name "*.py" | grep -v __pycache__ | head -10
    fi
    echo
}

# Function to create endpoint comparison
create_comparison() {
    echo -e "${YELLOW}📊 CREATING DETAILED COMPARISON${NC}"
    echo "================================"
    
    # Create temporary files for comparison
    temp_backend=$(mktemp)
    temp_frontend=$(mktemp)
    
    # Extract backend routes
    if [ -f "backend/app.py" ]; then
        grep -o "@app.route('[^']*'" backend/app.py | sed "s/@app.route('//g" | sed "s/'$//g" | sort > "$temp_backend"
        grep -o "@bp.route('[^']*'" backend/app.py | sed "s/@bp.route('//g" | sed "s/'$//g" | sort >> "$temp_backend"
    fi
    
    # Extract frontend calls
    find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -E "(src/|frontend/)" | xargs grep -o "/api/[^'\"]*" | sed 's/.*://' | sort | uniq > "$temp_frontend"
    
    echo "Backend routes found:"
    cat "$temp_backend"
    echo
    
    echo "Frontend API calls found:"
    cat "$temp_frontend"
    echo
    
    echo "Routes in backend but not called by frontend:"
    comm -23 "$temp_backend" "$temp_frontend"
    echo
    
    echo "API calls in frontend but not in backend:"
    comm -13 "$temp_backend" "$temp_frontend"
    
    # Cleanup
    rm "$temp_backend" "$temp_frontend"
}

# Main execution
main() {
    extract_flask_routes
    extract_frontend_calls
    check_common_endpoints
    test_live_endpoints
    show_structure
    create_comparison
    
    echo -e "${GREEN}✅ Analysis complete!${NC}"
    echo
    echo "💡 Tips:"
    echo "- Check for 404 errors in your server logs"
    echo "- Make sure frontend calls match backend routes exactly"
    echo "- Verify your CORS settings if having cross-origin issues"
    echo "- Check that your server is running on the expected port"
}

# Run the analysis
main
