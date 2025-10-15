#!/bin/bash

# Find where the "missing" components actually are

echo "🔍 LOCATING MISSING COMPONENTS"
echo "==============================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FRONTEND_DIR="$(pwd)"
SRC_DIR="$FRONTEND_DIR/src"

# List of "missing" components
missing_components=(
    "EstimateAI"
    "AddVehicle"
    "VehicleList"
    "CreateJob"
    "CreateEditEstimate"
    "CreateInvoice"
    "VehicleForm"
    "InvoiceDetail"
    "Invoice"
    "CustomerDetail"
    "CustomerList"
    "AddAndEditCustomer"
    "VehicleDetail"
    "ViewJobs"
    "EstimateDetail"
    "JobDetail"
    "EstimatesList"
)

echo "Searching for component files in src/..."
echo ""

for component in "${missing_components[@]}"; do
    echo -e "${BLUE}Looking for: ${component}${NC}"
    
    # Search for .jsx and .js files
    found_files=$(find "$SRC_DIR" -type f \( -name "${component}.jsx" -o -name "${component}.js" \) 2>/dev/null)
    
    if [ -n "$found_files" ]; then
        echo -e "${GREEN}✅ FOUND:${NC}"
        echo "$found_files" | while read -r file; do
            rel_path="${file#$SRC_DIR/}"
            echo "   📁 src/$rel_path"
        done
    else
        echo -e "${RED}❌ NOT FOUND anywhere in src/${NC}"
        
        # Try fuzzy search
        fuzzy=$(find "$SRC_DIR" -type f -iname "*${component}*" 2>/dev/null | head -3)
        if [ -n "$fuzzy" ]; then
            echo -e "${YELLOW}   Similar files found:${NC}"
            echo "$fuzzy" | while read -r file; do
                rel_path="${file#$SRC_DIR/}"
                echo "   📁 src/$rel_path"
            done
        fi
    fi
    echo ""
done

echo ""
echo "================================"
echo "📊 SUMMARY"
echo "================================"
echo ""

# Now check App.jsx imports
APP_FILE="$SRC_DIR/App.jsx"

echo "Checking import paths in App.jsx..."
echo ""

for component in "${missing_components[@]}"; do
    import_line=$(grep "import.*${component}.*from" "$APP_FILE" 2>/dev/null)
    
    if [ -n "$import_line" ]; then
        echo -e "${BLUE}$component${NC}"
        echo "   Import: $import_line"
        
        # Extract the path from import
        import_path=$(echo "$import_line" | sed -n "s/.*from ['\"]\\(.*\\)['\"].*/\\1/p")
        
        # Convert import path to file path
        if [[ "$import_path" == ./* ]]; then
            # Relative path from App.jsx
            file_path="$SRC_DIR/${import_path#./}"
        elif [[ "$import_path" == @/* ]]; then
            # Alias path (@ usually means src/)
            file_path="$SRC_DIR/${import_path#@/}"
        else
            file_path="$import_path"
        fi
        
        # Add .jsx if no extension
        if [[ "$file_path" != *.jsx ]] && [[ "$file_path" != *.js ]]; then
            file_path="${file_path}.jsx"
        fi
        
        # Check if file exists
        if [ -f "$file_path" ]; then
            echo -e "   ${GREEN}✅ File exists at import path${NC}"
        else
            echo -e "   ${RED}❌ File does NOT exist at: $file_path${NC}"
            
            # Try with .js extension
            file_path_js="${file_path%.jsx}.js"
            if [ -f "$file_path_js" ]; then
                echo -e "   ${GREEN}✅ But found with .js extension: $file_path_js${NC}"
            fi
        fi
        echo ""
    fi
done

echo ""
echo "================================"
echo "🔧 NEXT STEPS"
echo "================================"
echo ""
echo "Run this to see all .jsx files in your src/ directory:"
echo "  find src -name '*.jsx' -type f | sort"
echo ""
echo "To view App.jsx imports:"
echo "  grep 'import.*from' src/App.jsx | grep -E '(Customer|Vehicle|Job|Estimate|Invoice)'"
echo ""
