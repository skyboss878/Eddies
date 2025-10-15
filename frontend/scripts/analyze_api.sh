#!/bin/bash

# API Endpoint Analysis Script for Eddie's Auto Repair System
# This script analyzes both backend and frontend to map all API endpoints

echo "🔍 EDDIE'S AUTO REPAIR - API ENDPOINT ANALYSIS"
echo "================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [[ ! -f "backend/app.py" ]] || [[ ! -d "frontend/src" ]]; then
    echo -e "${RED}❌ Please run this script from the eddies-askan-automotive root directory${NC}"
    echo "Expected structure:"
    echo "  eddies-askan-automotive/"
    echo "  ├── backend/app.py"
    echo "  └── frontend/src/"
    exit 1
fi

echo -e "${BLUE}📊 ANALYZING BACKEND ENDPOINTS...${NC}"
echo "=================================="

# Create temporary files for analysis
BACKEND_ENDPOINTS=$(mktemp)
FRONTEND_ENDPOINTS=$(mktemp)
BACKEND_DETAILS=$(mktemp)

# Extract backend endpoints from app.py and route files
echo -e "${CYAN}🔍 Scanning backend routes...${NC}"

# Function to analyze Python files for routes
analyze_python_routes() {
    local file="$1"
    local prefix="$2"
    
    if [[ -f "$file" ]]; then
        echo -e "${YELLOW}Analyzing: $file${NC}"
        
        # Extract route decorators and their methods
        grep -n "@.*\.route\|@.*_required\|def.*(" "$file" | while IFS= read -r line; do
            line_num=$(echo "$line" | cut -d: -f1)
            content=$(echo "$line" | cut -d: -f2-)
            
            if [[ "$content" =~ @.*\.route ]]; then
                # Extract route path and methods
                route_path=$(echo "$content" | sed -n "s/.*route(['\"][^'\"]*\([^'\"]*\)['\"].*methods=\[\([^]]*\)\].*/\1|\2/p")
                if [[ -z "$route_path" ]]; then
                    route_path=$(echo "$content" | sed -n "s/.*route(['\"][^'\"]*\([^'\"]*\)['\"].*/\1|GET/p")
                fi
                
                if [[ -n "$route_path" ]]; then
                    path=$(echo "$route_path" | cut -d'|' -f1)
                    methods=$(echo "$route_path" | cut -d'|' -f2 | tr -d "'" | tr -d '"' | tr ',' ' ')
                    
                    # Check if route is protected
                    protected="PUBLIC"
                    next_lines=$(sed -n "$((line_num+1)),$((line_num+5))p" "$file")
                    if echo "$next_lines" | grep -q "jwt_required\|token_required\|auth_required"; then
                        protected="PROTECTED"
                    fi
                    
                    # Get function name
                    func_name=$(echo "$next_lines" | grep "def " | head -1 | sed 's/def \([^(]*\).*/\1/')
                    
                    echo "$file:$line_num|$prefix$path|$methods|$protected|$func_name"
                fi
            fi
        done
    fi
}

# Analyze main app.py
analyze_python_routes "backend/app.py" "" >> "$BACKEND_DETAILS"

# Analyze route files
for route_file in backend/routes/*.py; do
    if [[ -f "$route_file" ]]; then
        filename=$(basename "$route_file" .py)
        case "$filename" in
            "auth_routes") prefix="/api/auth" ;;
            "customer_routes") prefix="/api" ;;
            "vehicle_routes") prefix="/api" ;;
            "job_routes") prefix="/api" ;;
            "parts_routes") prefix="/api" ;;
            "labor_routes") prefix="/api" ;;
            "estimate_routes") prefix="/api" ;;
            *) prefix="/api" ;;
        esac
        analyze_python_routes "$route_file" "$prefix" >> "$BACKEND_DETAILS"
    fi
done

# Process and display backend endpoints
echo ""
echo -e "${GREEN}🎯 BACKEND ENDPOINTS FOUND:${NC}"
echo "=============================="
printf "%-50s %-15s %-10s %-15s %s\n" "ENDPOINT" "METHODS" "ACCESS" "FUNCTION" "FILE"
echo "$(printf '%*s' 120 '' | tr ' ' '-')"

sort "$BACKEND_DETAILS" | while IFS='|' read -r file_info endpoint methods access func_name; do
    file_name=$(echo "$file_info" | cut -d':' -f1 | xargs basename)
    line_num=$(echo "$file_info" | cut -d':' -f2)
    
    # Color code by access level
    if [[ "$access" == "PROTECTED" ]]; then
        access_color="${RED}🔒 $access${NC}"
    else
        access_color="${GREEN}🔓 $access${NC}"
    fi
    
    printf "%-50s %-15s %-20s %-15s %s:%s\n" "$endpoint" "$methods" "$access_color" "$func_name" "$file_name" "$line_num"
    
    # Save to summary file
    echo "$endpoint|$methods|$access" >> "$BACKEND_ENDPOINTS"
done

echo ""
echo -e "${BLUE}📱 ANALYZING FRONTEND API CALLS...${NC}"
echo "==================================="

# Extract frontend API calls
echo -e "${CYAN}🔍 Scanning frontend API calls...${NC}"

# Function to analyze JavaScript/JSX files for API calls
analyze_frontend_calls() {
    local search_dir="$1"
    
    find "$search_dir" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
        if [[ -f "$file" ]]; then
            # Look for various API call patterns
            grep -n -E "(apiClient\.|api\.|fetch\(|axios\.|\.get\(|\.post\(|\.put\(|\.delete\(|\.patch\()" "$file" | while IFS= read -r line; do
                line_num=$(echo "$line" | cut -d: -f1)
                content=$(echo "$line" | cut -d: -f2-)
                
                # Extract endpoint patterns
                endpoint=""
                method="GET"
                
                # Pattern matching for different API call styles
                if [[ "$content" =~ apiClient\.(get|post|put|delete|patch)\(['\"]([^'\"]*)['\"] ]]; then
                    method="${BASH_REMATCH[1]}"
                    endpoint="${BASH_REMATCH[2]}"
                elif [[ "$content" =~ fetch\(['\"]([^'\"]*)['\"] ]]; then
                    endpoint="${BASH_REMATCH[1]}"
                    # Check next few lines for method
                    next_lines=$(sed -n "$((line_num)),$((line_num+3))p" "$file")
                    if echo "$next_lines" | grep -q "method.*POST"; then method="POST"; fi
                    if echo "$next_lines" | grep -q "method.*PUT"; then method="PUT"; fi
                    if echo "$next_lines" | grep -q "method.*DELETE"; then method="DELETE"; fi
                    if echo "$next_lines" | grep -q "method.*PATCH"; then method="PATCH"; fi
                elif [[ "$content" =~ \.(get|post|put|delete|patch)\(['\"]([^'\"]*)['\"] ]]; then
                    method="${BASH_REMATCH[1]}"
                    endpoint="${BASH_REMATCH[2]}"
                fi
                
                if [[ -n "$endpoint" ]]; then
                    # Clean up the endpoint
                    endpoint=$(echo "$endpoint" | sed 's/\${[^}]*}/:id/g' | sed 's/\$[a-zA-Z_][a-zA-Z0-9_]*/:id/g')
                    
                    # Add /api prefix if not present and it looks like an API call
                    if [[ ! "$endpoint" =~ ^/api ]] && [[ ! "$endpoint" =~ ^http ]] && [[ "$endpoint" =~ ^/ ]]; then
                        endpoint="/api$endpoint"
                    fi
                    
                    echo "$file:$line_num|$endpoint|${method^^}|$content"
                fi
            done
        fi
    done
}

# Analyze all frontend directories
echo -e "${YELLOW}Scanning src/components...${NC}"
analyze_frontend_calls "frontend/src/components" >> "$FRONTEND_ENDPOINTS"

echo -e "${YELLOW}Scanning src/pages...${NC}"
analyze_frontend_calls "frontend/src/pages" >> "$FRONTEND_ENDPOINTS"

echo -e "${YELLOW}Scanning src/layout...${NC}"
analyze_frontend_calls "frontend/src/layout" >> "$FRONTEND_ENDPOINTS"

echo -e "${YELLOW}Scanning src/ai...${NC}"
analyze_frontend_calls "frontend/src/ai" >> "$FRONTEND_ENDPOINTS"

echo -e "${YELLOW}Scanning src/utils...${NC}"
analyze_frontend_calls "frontend/src/utils" >> "$FRONTEND_ENDPOINTS"

echo -e "${YELLOW}Scanning src/contexts...${NC}"
analyze_frontend_calls "frontend/src/contexts" >> "$FRONTEND_ENDPOINTS"

echo -e "${YELLOW}Scanning src/hooks...${NC}"
analyze_frontend_calls "frontend/src/hooks" >> "$FRONTEND_ENDPOINTS"

echo ""
echo -e "${GREEN}🎯 FRONTEND API CALLS FOUND:${NC}"
echo "=============================="
printf "%-50s %-10s %-60s %s\n" "ENDPOINT" "METHOD" "CODE SNIPPET" "FILE:LINE"
echo "$(printf '%*s' 140 '' | tr ' ' '-')"

# Process frontend calls
sort "$FRONTEND_ENDPOINTS" | while IFS='|' read -r file_info endpoint method code_snippet; do
    file_name=$(echo "$file_info" | cut -d':' -f1 | sed 's|frontend/src/||')
    line_num=$(echo "$file_info" | cut -d':' -f2)
    
    # Truncate long code snippets
    short_code=$(echo "$code_snippet" | cut -c1-60 | sed 's/^[[:space:]]*//')
    if [[ ${#code_snippet} -gt 60 ]]; then
        short_code="$short_code..."
    fi
    
    printf "%-50s %-10s %-60s %s:%s\n" "$endpoint" "$method" "$short_code" "$file_name" "$line_num"
done

echo ""
echo -e "${PURPLE}🔄 ENDPOINT MATCHING ANALYSIS${NC}"
echo "=============================="

# Create sorted lists for comparison
sort "$BACKEND_ENDPOINTS" | cut -d'|' -f1 > /tmp/backend_paths
sort "$FRONTEND_ENDPOINTS" | cut -d'|' -f1 | sort -u > /tmp/frontend_paths

echo -e "${GREEN}✅ MATCHED ENDPOINTS:${NC}"
echo "====================="
comm -12 /tmp/backend_paths /tmp/frontend_paths | while read -r endpoint; do
    backend_info=$(grep "^$endpoint|" "$BACKEND_ENDPOINTS" | head -1)
    backend_methods=$(echo "$backend_info" | cut -d'|' -f2)
    backend_access=$(echo "$backend_info" | cut -d'|' -f3)
    
    frontend_methods=$(grep "^[^|]*|$endpoint|" "$FRONTEND_ENDPOINTS" | cut -d'|' -f3 | sort -u | tr '\n' ',' | sed 's/,$//')
    
    access_icon="🔓"
    if [[ "$backend_access" == "PROTECTED" ]]; then
        access_icon="🔒"
    fi
    
    printf "  %s %-45s Backend:[%-10s] Frontend:[%-10s]\n" "$access_icon" "$endpoint" "$backend_methods" "$frontend_methods"
done

echo ""
echo -e "${YELLOW}⚠️  BACKEND ONLY (Not called by frontend):${NC}"
echo "=============================================="
comm -23 /tmp/backend_paths /tmp/frontend_paths | while read -r endpoint; do
    backend_info=$(grep "^$endpoint|" "$BACKEND_ENDPOINTS" | head -1)
    backend_methods=$(echo "$backend_info" | cut -d'|' -f2)
    backend_access=$(echo "$backend_info" | cut -d'|' -f3)
    
    access_icon="🔓"
    if [[ "$backend_access" == "PROTECTED" ]]; then
        access_icon="🔒"
    fi
    
    printf "  %s %-45s [%s]\n" "$access_icon" "$endpoint" "$backend_methods"
done

echo ""
echo -e "${RED}❌ FRONTEND ONLY (No backend endpoint):${NC}"
echo "========================================"
comm -13 /tmp/backend_paths /tmp/frontend_paths | while read -r endpoint; do
    frontend_methods=$(grep "^[^|]*|$endpoint|" "$FRONTEND_ENDPOINTS" | cut -d'|' -f3 | sort -u | tr '\n' ',' | sed 's/,$//')
    printf "  🚫 %-45s [%s]\n" "$endpoint" "$frontend_methods"
done

echo ""
echo -e "${BLUE}📊 SUMMARY STATISTICS${NC}"
echo "===================="
backend_count=$(sort "$BACKEND_ENDPOINTS" | cut -d'|' -f1 | uniq | wc -l)
frontend_count=$(sort "$FRONTEND_ENDPOINTS" | cut -d'|' -f1 | uniq | wc -l)
matched_count=$(comm -12 /tmp/backend_paths /tmp/frontend_paths | wc -l)
backend_only=$(comm -23 /tmp/backend_paths /tmp/frontend_paths | wc -l)
frontend_only=$(comm -13 /tmp/backend_paths /tmp/frontend_paths | wc -l)
protected_count=$(grep "|PROTECTED" "$BACKEND_ENDPOINTS" | wc -l)
public_count=$(grep "|PUBLIC" "$BACKEND_ENDPOINTS" | wc -l)

echo "📈 Total Backend Endpoints:    $backend_count"
echo "📱 Total Frontend API Calls:   $frontend_count"
echo "✅ Matched Endpoints:          $matched_count"
echo "⚠️  Backend Only:              $backend_only"
echo "❌ Frontend Only:              $frontend_only"
echo "🔒 Protected Endpoints:        $protected_count"
echo "🔓 Public Endpoints:           $public_count"

echo ""
echo -e "${CYAN}🔧 RECOMMENDATIONS${NC}"
echo "=================="

if [[ $frontend_only -gt 0 ]]; then
    echo "• ${RED}Fix missing backend endpoints${NC} - Frontend is calling endpoints that don't exist"
fi

if [[ $backend_only -gt 5 ]]; then
    echo "• ${YELLOW}Consider cleanup${NC} - Many backend endpoints aren't being used by frontend"
fi

if [[ $matched_count -gt 0 ]]; then
    echo "• ${GREEN}Good coverage${NC} - $matched_count endpoints are properly connected"
fi

echo ""
echo -e "${PURPLE}🚀 TO RUN THE ANALYSIS:${NC}"
echo "======================="
echo "1. Save this script as 'analyze_api.sh'"
echo "2. Make it executable: chmod +x analyze_api.sh"
echo "3. Run from project root: ./analyze_api.sh"

# Clean up temporary files
rm -f "$BACKEND_ENDPOINTS" "$FRONTEND_ENDPOINTS" "$BACKEND_DETAILS" /tmp/backend_paths /tmp/frontend_paths

echo ""
echo -e "${GREEN}✨ Analysis complete!${NC}"
