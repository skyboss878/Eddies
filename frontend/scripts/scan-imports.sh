#!/bin/bash

# React Project Import/Export Scanner
# Scans src directory for imports/exports from utils, pages, components, services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if src directory exists
if [ ! -d "src" ]; then
    echo -e "${RED}Error: 'src' directory not found in current location${NC}"
    echo "Please run this script from your project root directory"
    exit 1
fi

# Create output directory
OUTPUT_DIR="scan_results"
mkdir -p "$OUTPUT_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="$OUTPUT_DIR/import_export_analysis_$TIMESTAMP.txt"

echo -e "${BLUE}🔍 Starting React Project Import/Export Analysis...${NC}"
echo "Results will be saved to: $REPORT_FILE"
echo ""

# Initialize report
cat > "$REPORT_FILE" << EOF
React Project Import/Export Analysis
Generated: $(date)
Project Directory: $(pwd)
=====================================

EOF

# Function to analyze file
analyze_file() {
    local file="$1"
    local relative_path="${file#./src/}"
    
    # Skip node_modules and build directories
    if [[ "$file" =~ node_modules|build|dist ]]; then
        return
    fi
    
    # Only analyze JS/TS/JSX/TSX files
    if [[ "$file" =~ \.(js|jsx|ts|tsx)$ ]]; then
        echo "📄 Analyzing: $relative_path" >> "$REPORT_FILE"
        echo "----------------------------------------" >> "$REPORT_FILE"
        
        # Find imports from utils, pages, components, services
        echo "IMPORTS:" >> "$REPORT_FILE"
        
        # ES6 imports
        grep -n "import.*from.*['\"].*\(utils\|pages\|components\|services\)" "$file" 2>/dev/null | \
        sed 's/^/  Line /' >> "$REPORT_FILE"
        
        # Dynamic imports
        grep -n "import(['\"].*\(utils\|pages\|components\|services\)" "$file" 2>/dev/null | \
        sed 's/^/  Line /' >> "$REPORT_FILE"
        
        # Require statements
        grep -n "require(['\"].*\(utils\|pages\|components\|services\)" "$file" 2>/dev/null | \
        sed 's/^/  Line /' >> "$REPORT_FILE"
        
        # Find exports
        echo "" >> "$REPORT_FILE"
        echo "EXPORTS:" >> "$REPORT_FILE"
        
        # Named exports
        grep -n "export.*{" "$file" 2>/dev/null | sed 's/^/  Line /' >> "$REPORT_FILE"
        
        # Default exports
        grep -n "export default" "$file" 2>/dev/null | sed 's/^/  Line /' >> "$REPORT_FILE"
        
        # Direct exports
        grep -n "^export " "$file" 2>/dev/null | sed 's/^/  Line /' >> "$REPORT_FILE"
        
        echo "" >> "$REPORT_FILE"
        echo "========================================" >> "$REPORT_FILE"
        echo "" >> "$REPORT_FILE"
    fi
}

# Function to create directory summary
create_directory_summary() {
    local dir="$1"
    local dir_name=$(basename "$dir")
    
    if [ -d "$dir" ]; then
        echo "" >> "$REPORT_FILE"
        echo "📁 DIRECTORY SUMMARY: $dir_name" >> "$REPORT_FILE"
        echo "=============================================" >> "$REPORT_FILE"
        
        # Count files by type
        local js_count=$(find "$dir" -name "*.js" 2>/dev/null | wc -l)
        local jsx_count=$(find "$dir" -name "*.jsx" 2>/dev/null | wc -l)
        local ts_count=$(find "$dir" -name "*.ts" 2>/dev/null | wc -l)
        local tsx_count=$(find "$dir" -name "*.tsx" 2>/dev/null | wc -l)
        local total=$((js_count + jsx_count + ts_count + tsx_count))
        
        echo "Files: $total total (.js: $js_count, .jsx: $jsx_count, .ts: $ts_count, .tsx: $tsx_count)" >> "$REPORT_FILE"
        
        # List all files in directory
        echo "" >> "$REPORT_FILE"
        echo "File List:" >> "$REPORT_FILE"
        find "$dir" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" 2>/dev/null | \
        sort | sed 's|^src/||' | sed 's/^/  - /' >> "$REPORT_FILE"
        
        echo "" >> "$REPORT_FILE"
    fi
}

# Analyze key directories first
echo -e "${YELLOW}📊 Creating directory summaries...${NC}"

create_directory_summary "src/components"
create_directory_summary "src/pages"
create_directory_summary "src/utils"
create_directory_summary "src/services"

# Find all files and analyze them
echo -e "${YELLOW}🔄 Scanning all files in src directory...${NC}"
file_count=0

while IFS= read -r -d '' file; do
    analyze_file "$file"
    ((file_count++))
    
    # Show progress
    if ((file_count % 10 == 0)); then
        echo -e "${CYAN}Processed $file_count files...${NC}"
    fi
done < <(find src -type f -print0)

# Create summary statistics
echo "" >> "$REPORT_FILE"
echo "📈 SUMMARY STATISTICS" >> "$REPORT_FILE"
echo "=====================" >> "$REPORT_FILE"
echo "Total files analyzed: $file_count" >> "$REPORT_FILE"

# Count total imports/exports
total_imports=$(grep -c "IMPORTS:" "$REPORT_FILE" 2>/dev/null || echo "0")
total_exports=$(grep -c "EXPORTS:" "$REPORT_FILE" 2>/dev/null || echo "0")

echo "Files with imports: $total_imports" >> "$REPORT_FILE"
echo "Files with exports: $total_exports" >> "$REPORT_FILE"

# Find most imported directories
echo "" >> "$REPORT_FILE"
echo "Most imported from:" >> "$REPORT_FILE"
grep "from.*['\"].*\(utils\|pages\|components\|services\)" "$REPORT_FILE" 2>/dev/null | \
sed -E 's/.*from[[:space:]]*['\''"][^'\''"]*\/(utils|pages|components|services).*/\1/' | \
sort | uniq -c | sort -nr | head -10 | sed 's/^/  /' >> "$REPORT_FILE"

# Additional analysis - find circular dependencies (basic check)
echo "" >> "$REPORT_FILE"
echo "🔄 POTENTIAL CIRCULAR DEPENDENCY CHECK" >> "$REPORT_FILE"
echo "=====================================" >> "$REPORT_FILE"
echo "Files that both import from and export to the same directories:" >> "$REPORT_FILE"

# This is a basic check - for a full circular dependency analysis, you'd need more complex logic
find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
    if grep -q "import.*from.*['\"].*\(utils\|pages\|components\|services\)" "$file" 2>/dev/null && \
       grep -q "export" "$file" 2>/dev/null; then
        echo "  - ${file#./src/}" >> "$REPORT_FILE"
    fi
done

echo "" >> "$REPORT_FILE"
echo "Analysis completed at: $(date)" >> "$REPORT_FILE"

# Display completion message
echo ""
echo -e "${GREEN}✅ Analysis complete!${NC}"
echo -e "📄 Report saved to: ${YELLOW}$REPORT_FILE${NC}"
echo ""
echo -e "${BLUE}Quick Stats:${NC}"
echo -e "  Files analyzed: ${YELLOW}$file_count${NC}"
echo -e "  Report location: ${YELLOW}$OUTPUT_DIR/${NC}"

# Optional: Show first few lines of results
echo ""
echo -e "${PURPLE}Preview of results:${NC}"
head -20 "$REPORT_FILE"
echo "..."
echo -e "${CYAN}(See full report in $REPORT_FILE)${NC}"
