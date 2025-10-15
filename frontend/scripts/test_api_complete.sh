#!/bin/bash

# Comprehensive API Test Script for Eddie's Askan Automotive

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 EDDIE'S ASKAN AUTOMOTIVE - API INTEGRATION TEST${NC}"
echo "=================================================="

# Test 1: Backend Health Check
echo ""
echo -e "${BLUE}Test 1: Backend Health Check${NC}"
echo "------------------------------"

if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
    echo "Response:"
    curl -s http://localhost:5000/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:5000/api/health
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo -e "${YELLOW}   Start it with: cd ../backend && python app.py${NC}"
    echo ""
    echo "Cannot continue without backend. Exiting..."
    exit 1
fi

# Test 2: Authentication Endpoints
echo ""
echo -e "${BLUE}Test 2: Authentication Endpoints${NC}"
echo "-------------------------------"

endpoints=(
    "POST /api/auth/login"
    "POST /api/auth/register" 
    "GET /api/auth/me"
    "POST /api/auth/logout"
)

for endpoint in "${endpoints[@]}"; do
    method=$(echo $endpoint | cut -d' ' -f1)
    path=$(echo $endpoint | cut -d' ' -f2)
    
    if [ "$method" = "GET" ]; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000$path 2>/dev/null)
    else
        status_code=$(curl -s -o /dev/null -w "%{http_code}" -X $method http://localhost:5000$path 2>/dev/null)
    fi
    
    if [ "$status_code" != "404" ]; then
        echo -e "${GREEN}✅ $endpoint exists (HTTP $status_code)${NC}"
    else
        echo -e "${RED}❌ $endpoint not found (HTTP 404)${NC}"
    fi
done

# Test 3: Frontend Configuration
echo ""
echo -e "${BLUE}Test 3: Frontend Configuration${NC}"
echo "------------------------------"

if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
    if grep -q "VITE_API_BASE_URL" .env; then
        echo -e "${GREEN}✅ VITE_API_BASE_URL configured${NC}"
        echo "   $(grep VITE_API_BASE_URL .env)"
    else
        echo -e "${RED}❌ VITE_API_BASE_URL missing in .env${NC}"
    fi
else
    echo -e "${RED}❌ .env file missing${NC}"
fi

if [ -f "src/utils/api.js" ]; then
    echo -e "${GREEN}✅ API utility file exists${NC}"
    
    if grep -q "API_BASE_URL" src/utils/api.js; then
        echo -e "${GREEN}✅ API_BASE_URL configured in api.js${NC}"
    else
        echo -e "${RED}❌ API_BASE_URL missing in api.js${NC}"
    fi
    
    if grep -q "apiEndpoints" src/utils/api.js; then
        echo -e "${GREEN}✅ API endpoints defined${NC}"
    else
        echo -e "${YELLOW}⚠️  API endpoints may need updating${NC}"
    fi
else
    echo -e "${RED}❌ API utility file missing${NC}"
fi

# Test 4: CORS Configuration
echo ""
echo -e "${BLUE}Test 4: CORS Configuration${NC}"
echo "-----------------------------"

cors_test=$(curl -s -H "Origin: http://localhost:3000" \
                 -H "Access-Control-Request-Method: POST" \
                 -H "Access-Control-Request-Headers: Content-Type" \
                 -X OPTIONS \
                 http://localhost:5000/api/auth/login 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ CORS preflight request successful${NC}"
else
    echo -e "${YELLOW}⚠️  CORS preflight may need configuration${NC}"
fi

# Test 5: API Endpoint Coverage
echo ""
echo -e "${BLUE}Test 5: Critical Endpoint Coverage${NC}"
echo "------------------------------------"

critical_endpoints=(
    "/api/health"
    "/api/auth/login"
    "/api/auth/customers"
    "/api/auth/vehicles"
    "/api/auth/jobs"
    "/api/auth/dashboard/stats"
)

working_endpoints=0
total_endpoints=${#critical_endpoints[@]}

for endpoint in "${critical_endpoints[@]}"; do
    status_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000$endpoint 2>/dev/null)
    
    if [ "$status_code" != "404" ]; then
        echo -e "${GREEN}✅ $endpoint (HTTP $status_code)${NC}"
        ((working_endpoints++))
    else
        echo -e "${RED}❌ $endpoint (HTTP 404)${NC}"
    fi
done

# Final Summary
echo ""
echo -e "${BLUE}📊 TEST SUMMARY${NC}"
echo "================"
echo "Endpoints working: $working_endpoints/$total_endpoints"

if [ $working_endpoints -eq $total_endpoints ]; then
    echo -e "${GREEN}🎉 All critical endpoints are working!${NC}"
    echo -e "${GREEN}✅ Your API integration is ready!${NC}"
elif [ $working_endpoints -gt $((total_endpoints/2)) ]; then
    echo -e "${YELLOW}⚠️  Most endpoints working, some may need attention${NC}"
else
    echo -e "${RED}❌ Many endpoints missing - check backend configuration${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. If backend issues: cd ../backend && python app.py"
echo "2. If frontend issues: npm run dev"
echo "3. Check browser console for specific errors"
echo "4. Test login functionality in the UI"

