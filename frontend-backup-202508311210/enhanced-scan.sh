#!/bin/bash

# Simple React Project Scanner - Fixed Version
# Analyzes imports/exports without complex arithmetic

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
OUTPUT_DIR="scan_results"
mkdir -p "$OUTPUT_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT="$OUTPUT_DIR/simple_analysis_$TIMESTAMP.txt"

echo -e "${BLUE}🔍 React Project Analysis (Fixed Version)${NC}"
echo ""

# Initialize report
cat > "$REPORT" << EOF
React Project Analysis - Fixed Version
Generated: $(date)
Project: $(pwd)
=====================================

EOF

echo -e "${YELLOW}📊 Gathering project statistics...${NC}"

# Basic file counts
echo "📊 PROJECT OVERVIEW" >> "$REPORT"
echo "===================" >> "$REPORT"
echo "" >> "$REPORT"

echo "📁 DIRECTORY STRUCTURE:" >> "$REPORT"
echo "----------------------" >> "$REPORT"

# Count files in each directory
for dir in components pages utils services hooks contexts api lib assets; do
    if [ -d "src/$dir" ]; then
        count=$(find "src/$dir" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)
        printf "%-12s: %3d files\n" "$dir" "$count" >> "$REPORT"
    fi
done

echo "" >> "$REPORT"

# File type breakdown
echo "📄 FILE TYPES:" >> "$REPORT"
echo "--------------" >> "$REPORT"
js_files=$(find src -name "*.js" 2>/dev/null | wc -l)
jsx_files=$(find src -name "*.jsx" 2>/dev/null | wc -l)
ts_files=$(find src -name "*.ts" 2>/dev/null | wc -l)
tsx_files=$(find src -name "*.tsx" 2>/dev/null | wc -l)
total_files=$((js_files + jsx_files + ts_files + tsx_files))

printf "JavaScript:  %3d files\n" "$js_files" >> "$REPORT"
printf "JSX:         %3d files\n" "$jsx_files" >> "$REPORT"
printf "TypeScript:  %3d files\n" "$ts_files" >> "$REPORT"
printf "TSX:         %3d files\n" "$tsx_files" >> "$REPORT"
printf "TOTAL:       %3d files\n" "$total_files" >> "$REPORT"
echo "" >> "$REPORT"

echo -e "${YELLOW}🔗 Analyzing imports...${NC}"

# Import analysis
echo "🔗 IMPORT ANALYSIS" >> "$REPORT"
echo "==================" >> "$REPORT"

# Count files that import from different directories
utils_importers=$(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "from.*utils" 2>/dev/null | wc -l)
services_importers=$(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "from.*services" 2>/dev/null | wc -l)
components_importers=$(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "from.*components" 2>/dev/null | wc -l)
pages_importers=$(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "from.*pages" 2>/dev/null | wc -l)

printf "Files importing from utils:      %3d\n" "$utils_importers" >> "$REPORT"
printf "Files importing from services:   %3d\n" "$services_importers" >> "$REPORT"
printf "Files importing from components: %3d\n" "$components_importers" >> "$REPORT"
printf "Files importing from pages:      %3d\n" "$pages_importers" >> "$REPORT"
echo "" >> "$REPORT"

echo -e "${YELLOW}🏆 Finding most used utilities...${NC}"

# Most imported utilities (simplified)
echo "🏆 TOP UTILITIES" >> "$REPORT"
echo "================" >> "$REPORT"

if [ -d "src/utils" ]; then
    echo "Most referenced utility files:" >> "$REPORT"
    find src/utils -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read util_file; do
        util_name=$(basename "$util_file" | sed 's/\.[^.]*$//')
        # Count references to this utility
        refs=$(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "$util_name" 2>/dev/null | wc -l)
        echo "  $util_name: $refs references" >> "$REPORT"
    done
fi

echo "" >> "$REPORT"

echo -e "${YELLOW}⚠️  Checking for large files...${NC}"

# Large files analysis
echo "⚠️  LARGE FILES (>500 lines)" >> "$REPORT"
echo "============================" >> "$REPORT"

find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
    lines=$(wc -l < "$file" 2>/dev/null)
    if [ "$lines" -gt 500 ]; then
        printf "  %-40s: %4d lines\n" "${file#src/}" "$lines" >> "$REPORT"
    fi
done

echo "" >> "$REPORT"

# Files with many imports
echo "📦 FILES WITH MANY IMPORTS (>15)" >> "$REPORT"
echo "=================================" >> "$REPORT"

find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
    import_lines=$(grep -c "^import\|require(" "$file" 2>/dev/null)
    if [ "$import_lines" -gt 15 ]; then
        printf "  %-40s: %4d imports\n" "${file#src/}" "$import_lines" >> "$REPORT"
    fi
done

echo "" >> "$REPORT"

echo -e "${YELLOW}🏗️  Analyzing architecture patterns...${NC}"

# Architecture patterns
echo "🏗️  ARCHITECTURE PATTERNS" >> "$REPORT"
echo "=========================" >> "$REPORT"

echo "Detected patterns:" >> "$REPORT"

# Check for React patterns
if find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "useState\|useEffect" >/dev/null 2>&1; then
    echo "  ✅ React Hooks pattern detected" >> "$REPORT"
fi

if [ -d "src/contexts" ]; then
    echo "  ✅ Context API pattern detected" >> "$REPORT"
fi

if find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "axios\|fetch" >/dev/null 2>&1; then
    echo "  ✅ HTTP client pattern detected" >> "$REPORT"
fi

if [ -d "src/hooks" ]; then
    echo "  ✅ Custom hooks pattern detected" >> "$REPORT"
fi

if [ -d "src/services" ]; then
    echo "  ✅ Service layer pattern detected" >> "$REPORT"
fi

echo "" >> "$REPORT"

# Top imported files (simplified approach)
echo "📈 IMPORT FREQUENCY" >> "$REPORT"
echo "===================" >> "$REPORT"

echo "Files mentioned most in import statements:" >> "$REPORT"

# Find common import patterns
find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep "from.*['\"]" 2>/dev/null | \
grep -E "(utils|services|components)" | \
sed -E 's/.*from[[:space:]]*['\''"][^'\''"]*\/([^\/'\''"]*).*$/\1/' | \
sort | uniq -c | sort -nr | head -10 | \
while read count name; do
    printf "  %-20s: %3d imports\n" "$name" "$count" >> "$REPORT"
done

echo "" >> "$REPORT"
echo "Analysis completed at: $(date)" >> "$REPORT"

# Display results
echo ""
echo -e "${GREEN}✅ Analysis complete!${NC}"
echo -e "📄 Report saved to: ${YELLOW}$REPORT${NC}"
echo ""

# Show summary
echo -e "${PURPLE}=== QUICK SUMMARY ===${NC}"
echo -e "📁 Total files: ${YELLOW}$total_files${NC}"
echo -e "🔗 Utils importers: ${YELLOW}$utils_importers${NC}"
echo -e "🔗 Service importers: ${YELLOW}$services_importers${NC}"
echo ""

# Show first part of the report
echo -e "${CYAN}Preview of full report:${NC}"
head -30 "$REPORT"
echo "..."
echo -e "${CYAN}(Full report in $REPORT)${NC}"
