#!/bin/bash

# API Data Flow Analyzer
# Traces connections between App.jsx, API endpoints, and all components

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Check if src directory exists
if [ ! -d "src" ]; then
    echo -e "${RED}Error: 'src' directory not found${NC}"
    exit 1
fi

# Create output
OUTPUT_DIR="api_analysis"
mkdir -p "$OUTPUT_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FLOW_REPORT="$OUTPUT_DIR/dataflow_analysis_$TIMESTAMP.txt"
ENDPOINTS_REPORT="$OUTPUT_DIR/endpoints_map_$TIMESTAMP.txt"
MISSING_REPORT="$OUTPUT_DIR/missing_connections_$TIMESTAMP.txt"

echo -e "${BLUE}API Data Flow Analysis${NC}"
echo ""

# Initialize reports
cat > "$FLOW_REPORT" << EOF
API Data Flow Analysis
Generated: $(date)
Project: $(pwd)
=====================================

EOF

cat > "$ENDPOINTS_REPORT" << EOF
API Endpoints Mapping
Generated: $(date)
=====================================

EOF

cat > "$MISSING_REPORT" << EOF
Missing Connections Report
Generated: $(date)
=====================================

EOF

echo -e "${YELLOW}Step 1: Analyzing API endpoints...${NC}"

# Function to extract API endpoints from api.js or similar files
analyze_api_files() {
    echo "API ENDPOINTS DISCOVERED" >> "$ENDPOINTS_REPORT"
    echo "========================" >> "$ENDPOINTS_REPORT"
    echo "" >> "$ENDPOINTS_REPORT"
    
    # Find all API-related files
    api_files=$(find src -name "*api*" -o -name "*Api*" -o -name "*API*" 2>/dev/null)
    service_files=$(find src/utils/services -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" 2>/dev/null)
    
    all_api_files="$api_files $service_files"
    
    if [ -n "$all_api_files" ]; then
        echo "API Files Found:" >> "$ENDPOINTS_REPORT"
        for file in $all_api_files; do
            echo "  - $file" >> "$ENDPOINTS_REPORT"
        done
        echo "" >> "$ENDPOINTS_REPORT"
        
        # Extract endpoints from each file
        for file in $all_api_files; do
            if [ -f "$file" ]; then
                echo "Endpoints in $(basename $file):" >> "$ENDPOINTS_REPORT"
                
                # Look for axios calls, fetch calls, and URL patterns
                grep -n "axios\.\(get\|post\|put\|delete\|patch\)" "$file" 2>/dev/null | \
                sed 's/^/  Line /' >> "$ENDPOINTS_REPORT"
                
                grep -n "fetch(" "$file" 2>/dev/null | \
                sed 's/^/  Line /' >> "$ENDPOINTS_REPORT"
                
                # Look for endpoint constants or variables
                grep -n "const.*=.*['\"]\/.*['\"]" "$file" 2>/dev/null | \
                sed 's/^/  Line /' >> "$ENDPOINTS_REPORT"
                
                echo "" >> "$ENDPOINTS_REPORT"
            fi
        done
    else
        echo "No API files found" >> "$ENDPOINTS_REPORT"
    fi
}

echo -e "${YELLOW}Step 2: Analyzing App.jsx connections...${NC}"

# Function to analyze App.jsx
analyze_app_jsx() {
    echo "APP.JSX ANALYSIS" >> "$FLOW_REPORT"
    echo "================" >> "$FLOW_REPORT"
    echo "" >> "$FLOW_REPORT"
    
    if [ -f "src/App.jsx" ] || [ -f "src/App.js" ]; then
        app_file=""
        if [ -f "src/App.jsx" ]; then
            app_file="src/App.jsx"
        else
            app_file="src/App.js"
        fi
        
        echo "App file: $app_file" >> "$FLOW_REPORT"
        echo "" >> "$FLOW_REPORT"
        
        echo "Imports in App.jsx:" >> "$FLOW_REPORT"
        grep -n "^import" "$app_file" 2>/dev/null | sed 's/^/  /' >> "$FLOW_REPORT"
        echo "" >> "$FLOW_REPORT"
        
        echo "Components rendered in App.jsx:" >> "$FLOW_REPORT"
        grep -n "<[A-Z][a-zA-Z]*" "$app_file" 2>/dev/null | \
        sed -E 's/.*<([A-Z][a-zA-Z]*).*/\1/' | sort | uniq | \
        sed 's/^/  - /' >> "$FLOW_REPORT"
        echo "" >> "$FLOW_REPORT"
        
        echo "Context Providers in App.jsx:" >> "$FLOW_REPORT"
        grep -n "Provider>" "$app_file" 2>/dev/null | sed 's/^/  /' >> "$FLOW_REPORT"
        echo "" >> "$FLOW_REPORT"
        
    else
        echo "App.jsx/App.js not found!" >> "$FLOW_REPORT"
    fi
}

echo -e "${YELLOW}Step 3: Mapping component to API connections...${NC}"

# Function to analyze component connections
analyze_component_connections() {
    echo "COMPONENT TO API CONNECTIONS" >> "$FLOW_REPORT"
    echo "===========================" >> "$FLOW_REPORT"
    echo "" >> "$FLOW_REPORT"
    
    # Check each directory for API usage
    for dir in components pages hooks utils/services; do
        if [ -d "src/$dir" ]; then
            echo "=== $dir directory ===" >> "$FLOW_REPORT"
            
            find "src/$dir" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
                # Check if file uses API
                has_api=$(grep -l "axios\|fetch\|api\|Api\|API" "$file" 2>/dev/null)
                if [ -n "$has_api" ]; then
                    echo "📡 $(basename $file):" >> "$FLOW_REPORT"
                    
                    # Show API calls
                    grep -n "axios\.\|fetch(\|api\." "$file" 2>/dev/null | head -5 | \
                    sed 's/^/    /' >> "$FLOW_REPORT"
                    
                    # Show imports from services
                    grep -n "from.*service\|from.*api\|from.*Api" "$file" 2>/dev/null | \
                    sed 's/^/    Import: /' >> "$FLOW_REPORT"
                    
                    echo "" >> "$FLOW_REPORT"
                fi
            done
        fi
    done
}

echo -e "${YELLOW}Step 4: Checking context flow...${NC}"

# Function to analyze context usage
analyze_context_flow() {
    echo "CONTEXT FLOW ANALYSIS" >> "$FLOW_REPORT"
    echo "=====================" >> "$FLOW_REPORT"
    echo "" >> "$FLOW_REPORT"
    
    if [ -d "src/contexts" ]; then
        echo "Context providers found:" >> "$FLOW_REPORT"
        find src/contexts -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read context_file; do
            context_name=$(basename "$context_file" | sed 's/\.[^.]*$//')
            echo "  📁 $context_name" >> "$FLOW_REPORT"
            
            # Show what this context provides
            grep -n "createContext\|useState\|useReducer" "$context_file" 2>/dev/null | head -3 | \
            sed 's/^/    /' >> "$FLOW_REPORT"
            
            # Find components that use this context
            context_usage=$(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
            xargs grep -l "$context_name" 2>/dev/null | wc -l)
            echo "    Used in $context_usage files" >> "$FLOW_REPORT"
            echo "" >> "$FLOW_REPORT"
        done
    else
        echo "No contexts directory found" >> "$FLOW_REPORT"
    fi
}

echo -e "${YELLOW}Step 5: Identifying missing connections...${NC}"

# Function to find potential issues
find_missing_connections() {
    echo "POTENTIAL ISSUES DETECTED" >> "$MISSING_REPORT"
    echo "=========================" >> "$MISSING_REPORT"
    echo "" >> "$MISSING_REPORT"
    
    # Check for components that might need API connections
    echo "Components without API connections:" >> "$MISSING_REPORT"
    find src/components src/pages -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
        # Check if component has form inputs or data display but no API calls
        has_forms=$(grep -l "input\|form\|button\|onClick" "$file" 2>/dev/null)
        has_api=$(grep -l "axios\|fetch\|api\|Api\|API" "$file" 2>/dev/null)
        
        if [ -n "$has_forms" ] && [ -z "$has_api" ]; then
            echo "  ⚠️  $(basename $file) - has forms but no API calls" >> "$MISSING_REPORT"
        fi
        
        # Check for data display without API
        has_data_display=$(grep -l "map(\|\.length\|\.filter\|useState.*\[\]" "$file" 2>/dev/null)
        if [ -n "$has_data_display" ] && [ -z "$has_api" ]; then
            echo "  ⚠️  $(basename $file) - displays data but no API calls" >> "$MISSING_REPORT"
        fi
    done
    
    echo "" >> "$MISSING_REPORT"
    
    # Check for unused services
    echo "Potentially unused services:" >> "$MISSING_REPORT"
    if [ -d "src/utils/services" ]; then
        find src/utils/services -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read service_file; do
            service_name=$(basename "$service_file" | sed 's/\.[^.]*$//')
            usage_count=$(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
            xargs grep -l "$service_name" 2>/dev/null | wc -l)
            
            if [ "$usage_count" -eq 1 ]; then  # Only found in the service file itself
                echo "  ⚠️  $service_name - defined but not used" >> "$MISSING_REPORT"
            fi
        done
    fi
    
    echo "" >> "$MISSING_REPORT"
    
    # Check for missing error handling
    echo "Files with API calls but no error handling:" >> "$MISSING_REPORT"
    find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
        has_api=$(grep -l "axios\|fetch" "$file" 2>/dev/null)
        has_error_handling=$(grep -l "catch\|try.*catch\|\.catch\|error" "$file" 2>/dev/null)
        
        if [ -n "$has_api" ] && [ -z "$has_error_handling" ]; then
            echo "  ⚠️  $(basename $file) - API calls without error handling" >> "$MISSING_REPORT"
        fi
    done
}

echo -e "${YELLOW}Step 6: Creating import/export flow map...${NC}"

# Function to create import/export map
create_import_export_map() {
    echo "IMPORT/EXPORT FLOW MAP" >> "$FLOW_REPORT"
    echo "======================" >> "$FLOW_REPORT"
    echo "" >> "$FLOW_REPORT"
    
    # Show what each major component imports and exports
    for dir in components pages hooks utils/services contexts; do
        if [ -d "src/$dir" ]; then
            echo "=== $dir ===" >> "$FLOW_REPORT"
            find "src/$dir" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | head -10 | while read file; do
                echo "📄 $(basename $file):" >> "$FLOW_REPORT"
                
                # Show imports
                echo "  Imports:" >> "$FLOW_REPORT"
                grep "^import.*from" "$file" 2>/dev/null | head -5 | \
                sed -E 's/import.*from[[:space:]]*['\''"]([^'\''"]*).*$/    - \1/' >> "$FLOW_REPORT"
                
                # Show exports
                echo "  Exports:" >> "$FLOW_REPORT"
                grep "^export\|export default" "$file" 2>/dev/null | head -3 | \
                sed 's/^/    - /' >> "$FLOW_REPORT"
                
                echo "" >> "$FLOW_REPORT"
            done
            echo "" >> "$FLOW_REPORT"
        fi
    done
}

# Run all analysis functions
analyze_api_files
analyze_app_jsx
analyze_component_connections
analyze_context_flow
find_missing_connections
create_import_export_map

# Generate summary
echo "" >> "$FLOW_REPORT"
echo "SUMMARY" >> "$FLOW_REPORT"
echo "=======" >> "$FLOW_REPORT"
total_files=$(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | wc -l)
api_files=$(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "axios\|fetch\|api" 2>/dev/null | wc -l)
echo "Total files analyzed: $total_files" >> "$FLOW_REPORT"
echo "Files with API connections: $api_files" >> "$FLOW_REPORT"
echo "Analysis completed at: $(date)" >> "$FLOW_REPORT"

# Display results
echo ""
echo -e "${GREEN}Analysis complete!${NC}"
echo -e "📊 Data flow report: ${YELLOW}$FLOW_REPORT${NC}"
echo -e "🔗 Endpoints map: ${YELLOW}$ENDPOINTS_REPORT${NC}"
echo -e "⚠️  Missing connections: ${YELLOW}$MISSING_REPORT${NC}"
echo ""
echo -e "${CYAN}Quick Stats:${NC}"
echo -e "  Total files: ${YELLOW}$total_files${NC}"
echo -e "  API-connected files: ${YELLOW}$api_files${NC}"
echo ""

# Show preview of missing connections
if [ -s "$MISSING_REPORT" ]; then
    echo -e "${PURPLE}Potential Issues Found:${NC}"
    head -15 "$MISSING_REPORT"
    echo "..."
    echo -e "${CYAN}(See full report in $MISSING_REPORT)${NC}"
fi
