#!/bin/bash

# Fixed Endpoint Checker Script for Eddie's Askan Automotive
# Works from frontend or root directory

echo "🔍 EDDIE'S ASKAN AUTOMOTIVE - ENDPOINT ANALYSIS"
echo "================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Find backend file
find_backend() {
    if [ -f "backend/app.py" ]; then
        echo "backend/app.py"
    elif [ -f "../backend/app.py" ]; then
        echo "../backend/app.py"
    elif [ -f "app.py" ]; then
        echo "app.py"
    else
        return 1
    fi
}

# Extract Flask routes
extract_flask_routes() {
    echo -e "${BLUE}📋 BACKEND ROUTES${NC}"
    echo "=================="
    
    backend_file=$(find_backend)
    if [ $? -eq 0 ]; then
        echo "✅ Found: $backend_file"
        echo
        
        # Extract all @app.route patterns with methods
        echo "Flask Routes:"
        grep -n "@app\.route" "$backend_file" | while read line; do
            line_num=$(echo "$line" | cut -d: -f1)
            route=$(echo "$line" | grep -o "'[^']*'" | head -1 | tr -d "'")
            methods=$(echo "$line" | grep -o "methods=\[[^]]*\]" | sed 's/methods=\[//; s/\]//' | tr -d "'" | tr -d '"')
            
            if [ -n "$methods" ]; then
                echo -e "  ${GREEN}$route${NC} [$methods] (line $line_num)"
            else
                echo -e "  ${GREEN}$route${NC} [GET] (line $line_num)"
            fi
        done
        
        echo
        echo "Summary of backend routes:"
        grep -o "@app\.route('[^']*'" "$backend_file" | sed "s/@app\.route('//; s/'$//)" | sort | while read route; do
            echo "  $route"
        done
        
    else
        echo "❌ Backend file not found"
        echo "   Searched: backend/app.py, ../backend/app.py, app.py"
    fi
    echo
}

# Extract critical frontend calls
extract_critical_calls() {
    echo -e "${GREEN}🎯 CRITICAL FRONTEND API CALLS${NC}"
    echo "==============================="
    
    # Focus on the most important API calls from your logs
    critical_endpoints=(
        "/api/health"
        "/api/auth/login"
        "/api/auth/register" 
        "/api/customers"
        "/api/vehicles"
        "/api/jobs"
        "/api/estimates"
        "/ai/diagnosis"
        "/ai/generate-estimate"
    )
    
    echo "Checking if these critical endpoints exist in frontend:"
    for endpoint in "${critical_endpoints[@]}"; do
        if find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -q "$endpoint" 2>/dev/null; then
            echo -e "✅ ${endpoint} - ${GREEN}Called by frontend${NC}"
        else
            echo -e "❌ ${endpoint} - ${RED}Not found in frontend${NC}"
        fi
    done
    echo
}

# Check route mismatches based on your logs
check_log_mismatches() {
    echo -e "${YELLOW}🚨 FIXING YOUR SPECIFIC LOG ERRORS${NC}"
    echo "==================================="
    
    backend_file=$(find_backend)
    if [ $? -ne 0 ]; then
        echo "❌ Cannot check backend - file not found"
        return
    fi
    
    echo "From your logs, these routes are problematic:"
    echo
    
    # Check /api/health vs /health
    if grep -q "/api/health" "$backend_file"; then
        echo -e "✅ /api/health - ${GREEN}Found in backend${NC}"
    elif grep -q "/health" "$backend_file"; then
        echo -e "⚠️  /health found in backend, but frontend calls /api/health - ${YELLOW}MISMATCH${NC}"
    else
        echo -e "❌ Neither /api/health nor /health - ${RED}Missing${NC}"
    fi
    
    # Check auth routes
    if grep -q "/api/auth/login" "$backend_file"; then
        echo -e "✅ /api/auth/login - ${GREEN}Found in backend${NC}"
    else
        echo -e "❌ /api/auth/login - ${RED}Missing from backend${NC}"
    fi
    
    # Check double /api issue
    echo
    echo "Double /api prefix issue (from your logs):"
    echo "  Frontend calling: /api/api/auth/login"
    echo "  Should be:       /api/auth/login"
    echo "  Check your API_BASE_URL configuration!"
    echo
}

# Create missing routes list
create_missing_routes() {
    echo -e "${RED}📝 MISSING ROUTES TO ADD${NC}"
    echo "==========================="
    
    missing_routes=(
        "@app.route('/api/health', methods=['GET'])"
        "@app.route('/api/auth/login', methods=['POST'])"
        "@app.route('/api/auth/register', methods=['POST'])"
        "@app.route('/api/auth/logout', methods=['POST'])"
        "@app.route('/api/customers', methods=['GET', 'POST'])"
        "@app.route('/api/customers/<int:customer_id>', methods=['GET', 'PUT', 'DELETE'])"
        "@app.route('/api/vehicles', methods=['GET', 'POST'])"
        "@app.route('/api/vehicles/<int:vehicle_id>', methods=['GET', 'PUT', 'DELETE'])"
        "@app.route('/api/jobs', methods=['GET', 'POST'])"
        "@app.route('/api/estimates', methods=['GET', 'POST'])"
        "@app.route('/ai/diagnosis', methods=['POST'])"
        "@app.route('/ai/generate-estimate', methods=['POST'])"
    )
    
    echo "Add these routes to your backend/app.py:"
    for route in "${missing_routes[@]}"; do
        echo "  $route"
    done
    echo
}

# Main execution
main() {
    extract_flask_routes
    extract_critical_calls
    check_log_mismatches
    create_missing_routes
    
    echo -e "${GREEN}🎯 NEXT STEPS:${NC}"
    echo "=============="
    echo "1. Navigate to your backend directory: cd ../backend"
    echo "2. Add the missing routes listed above to app.py"
    echo "3. Fix the double /api prefix issue in frontend"
    echo "4. Restart your Flask server"
    echo "5. Test the problematic endpoints"
}

main
