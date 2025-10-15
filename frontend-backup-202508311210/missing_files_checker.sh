#!/bin/bash
# Comprehensive checker for missing .js files, broken imports, and routes

cd ~/eddies-askan-automotive/frontend

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Checking for Missing Files and Broken Routes...${NC}"
echo "=================================================================="

# Function to check if a file exists
check_file_exists() {
    local file_path="$1"
    local reference="$2"
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}✅ Found: $file_path${NC}"
        return 0
    else
        echo -e "${RED}❌ Missing: $file_path${NC} (referenced in $reference)"
        return 1
    fi
}

echo -e "\n${BLUE}📁 1. Checking Import Statements for Missing Files...${NC}"
echo "=================================================================="

MISSING_FILES=0
TOTAL_IMPORTS=0

# Find all import statements and check if referenced files exist
find src -name "*.js" -o -name "*.jsx" | while read -r file; do
    # Skip backup files
    [[ "$file" == *backup* ]] && continue
    [[ "$file" == *\.old ]] && continue
    [[ "$file" == *\.bak ]] && continue
    
    # Extract relative imports (starting with ./ or ../)
    grep -n "import.*from ['\"]\..*['\"]" "$file" | while IFS: read -r line_num import_line; do
        # Extract the path from the import
        path=$(echo "$import_line" | sed -n "s/.*from ['\"]\..*\/\([^'\"]*\)['\"].*/\1/p")
        full_path=$(echo "$import_line" | sed -n "s/.*from ['\"]\([^'\"]*\)['\"].*/\1/p")
        
        if [[ -n "$full_path" ]]; then
            ((TOTAL_IMPORTS++))
            
            # Get directory of the current file
            current_dir=$(dirname "$file")
            
            # Resolve the imported file path
            if [[ "$full_path" == ./* ]]; then
                resolved_path="$current_dir/${full_path#./}"
            elif [[ "$full_path" == ../* ]]; then
                resolved_path=$(realpath -m "$current_dir/$full_path" 2>/dev/null || echo "$current_dir/$full_path")
            fi
            
            # Check common extensions
            found=false
            for ext in "" ".js" ".jsx" ".ts" ".tsx"; do
                test_path="${resolved_path}${ext}"
                if [ -f "$test_path" ]; then
                    found=true
                    break
                fi
                # Also check for index files
                if [ -f "${resolved_path}/index${ext}" ]; then
                    found=true
                    break
                fi
            done
            
            if ! $found; then
                echo -e "${RED}❌ Missing import: $full_path${NC} (in $file:$line_num)"
                ((MISSING_FILES++))
            fi
        fi
    done
done

echo -e "\n${BLUE}📄 2. Checking Route Definitions...${NC}"
echo "=================================================================="

# Find route definitions in App.js, Router files, etc.
echo "🔍 Looking for route definitions..."
find src -name "*.js" -o -name "*.jsx" | xargs grep -l -i "route\|router\|path.*component" | while read -r route_file; do
    echo -e "${BLUE}📝 Routes found in: $route_file${NC}"
    
    # Extract component references from routes
    grep -n "component.*=" "$route_file" | while IFS: read -r line_num route_def; do
        # Try to extract component name
        component=$(echo "$route_def" | sed -n 's/.*component.*=.*{\([^}]*\)}.*/\1/p' | tr -d ' ')
        if [[ -n "$component" ]]; then
            echo "   Route uses component: $component (line $line_num)"
        fi
    done
    
    # Also check for lazy imports
    grep -n "lazy\|import(" "$route_file" | head -5
done

echo -e "\n${BLUE}📦 3. Checking Package.json Dependencies vs Imports...${NC}"
echo "=================================================================="

# Check for imports that might need dependencies
echo "🔍 Checking for potentially missing dependencies..."
find src -name "*.js" -o -name "*.jsx" | xargs grep -h "^import.*from ['\"][a-z]" | \
    sed -n "s/.*from ['\"]\\([^'\"]*\\)['\"].*/\\1/p" | \
    sort | uniq | while read -r package; do
    
    # Skip built-in modules and relative paths
    [[ "$package" == .* ]] && continue
    [[ "$package" == react ]] && continue
    [[ "$package" == react-dom ]] && continue
    
    # Check if it exists in package.json
    if ! grep -q "\"$package\"" package.json; then
        echo -e "${YELLOW}⚠️  Potentially missing dependency: $package${NC}"
    fi
done

echo -e "\n${BLUE}🔧 4. Checking Service Files Structure...${NC}"
echo "=================================================================="

# Check if all expected utility/service files exist
expected_services=(
    "src/utils/api.js"
    "src/utils/toast.js" 
    "src/contexts/AuthContext.jsx"
    "src/contexts/DataContext.jsx"
    "src/contexts/SettingsContext.jsx"
    "src/components/ProtectedRoute.jsx"
)

for service in "${expected_services[@]}"; do
    if [ -f "$service" ]; then
        echo -e "${GREEN}✅ $service${NC}"
    else
        echo -e "${RED}❌ Missing: $service${NC}"
    fi
done

echo -e "\n${BLUE}📊 5. File Structure Overview...${NC}"
echo "=================================================================="

echo "📁 Directory structure:"
find src -type d | head -20 | while read -r dir; do
    file_count=$(find "$dir" -maxdepth 1 -name "*.js" -o -name "*.jsx" | wc -l)
    echo "   $dir ($file_count files)"
done

echo -e "\n${BLUE}🎯 6. Backup and Temporary Files...${NC}"
echo "=================================================================="

echo "🗑️  Backup/temporary files found:"
find src -name "*.backup*" -o -name "*.old" -o -name "*.bak" -o -name "*~" | head -10

echo -e "\n${GREEN}🎉 File Check Complete!${NC}"
echo "=================================================================="
echo "Total imports checked: Scanning..."
echo "Missing files found: Check above for ❌ entries"
echo ""
echo -e "${YELLOW}💡 Tip: Run this after fixing any missing files to verify all routes work${NC}"
