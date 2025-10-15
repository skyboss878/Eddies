#!/bin/bash

# Component Connection Investigator
# Detailed analysis of flagged components

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

OUTPUT_DIR="component_investigation"
mkdir -p "$OUTPUT_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DETAILED_REPORT="$OUTPUT_DIR/component_details_$TIMESTAMP.txt"

echo -e "${BLUE}Component Connection Investigation${NC}"
echo ""

cat > "$DETAILED_REPORT" << EOF
Component Connection Investigation
Generated: $(date)
=====================================

EOF

# Components flagged in the previous analysis
flagged_components=(
    "Navbar.jsx"
    "ConfirmModal.jsx" 
    "PromptModal.jsx"
    "UserDropdown.jsx"
    "ShareableActions.jsx"
    "Navigation.jsx"
)

echo -e "${YELLOW}Investigating flagged components...${NC}"

investigate_component() {
    local component_name="$1"
    local file_path=""
    
    # Find the component file
    file_path=$(find src -name "$component_name" 2>/dev/null | head -1)
    
    if [ -z "$file_path" ]; then
        echo "Component $component_name not found" >> "$DETAILED_REPORT"
        return
    fi
    
    echo "COMPONENT: $component_name" >> "$DETAILED_REPORT"
    echo "Path: $file_path" >> "$DETAILED_REPORT"
    echo "$(printf '%.50s' "==================================================")" >> "$DETAILED_REPORT"
    echo "" >> "$DETAILED_REPORT"
    
    # Show file size and complexity
    lines=$(wc -l < "$file_path" 2>/dev/null)
    echo "File size: $lines lines" >> "$DETAILED_REPORT"
    
    # Show all imports
    echo "IMPORTS:" >> "$DETAILED_REPORT"
    grep "^import" "$file_path" 2>/dev/null | sed 's/^/  /' >> "$DETAILED_REPORT"
    echo "" >> "$DETAILED_REPORT"
    
    # Show props received
    echo "PROPS/PARAMETERS:" >> "$DETAILED_REPORT"
    grep -n "function.*{" "$file_path" 2>/dev/null | head -3 | sed 's/^/  /' >> "$DETAILED_REPORT"
    grep -n "const.*=.*{" "$file_path" 2>/dev/null | head -3 | sed 's/^/  /' >> "$DETAILED_REPORT"
    echo "" >> "$DETAILED_REPORT"
    
    # Show state usage
    echo "STATE MANAGEMENT:" >> "$DETAILED_REPORT"
    grep -n "useState\|useEffect\|useContext\|useReducer" "$file_path" 2>/dev/null | sed 's/^/  /' >> "$DETAILED_REPORT"
    echo "" >> "$DETAILED_REPORT"
    
    # Show form elements
    echo "FORM ELEMENTS:" >> "$DETAILED_REPORT"
    grep -n "input\|button\|form\|select\|textarea" "$file_path" 2>/dev/null | head -5 | sed 's/^/  /' >> "$DETAILED_REPORT"
    echo "" >> "$DETAILED_REPORT"
    
    # Show event handlers
    echo "EVENT HANDLERS:" >> "$DETAILED_REPORT"
    grep -n "onClick\|onSubmit\|onChange\|onInput" "$file_path" 2>/dev/null | head -5 | sed 's/^/  /' >> "$DETAILED_REPORT"
    echo "" >> "$DETAILED_REPORT"
    
    # Check if it's actually a pure UI component
    echo "COMPONENT TYPE ANALYSIS:" >> "$DETAILED_REPORT"
    
    # Check for data fetching patterns
    has_useEffect=$(grep -c "useEffect" "$file_path" 2>/dev/null)
    has_api_calls=$(grep -c "axios\|fetch\|api\." "$file_path" 2>/dev/null)
    has_props=$(grep -c "props\." "$file_path" 2>/dev/null)
    has_context=$(grep -c "useContext\|Context\." "$file_path" 2>/dev/null)
    
    echo "  - useEffect calls: $has_useEffect" >> "$DETAILED_REPORT"
    echo "  - API calls: $has_api_calls" >> "$DETAILED_REPORT"
    echo "  - Props usage: $has_props" >> "$DETAILED_REPORT"
    echo "  - Context usage: $has_context" >> "$DETAILED_REPORT"
    
    # Determine component purpose
    if [ $has_props -gt 0 ] && [ $has_api_calls -eq 0 ]; then
        echo "  -> ASSESSMENT: Likely a presentational component (receives data via props)" >> "$DETAILED_REPORT"
    elif [ $has_context -gt 0 ] && [ $has_api_calls -eq 0 ]; then
        echo "  -> ASSESSMENT: Uses context for data (may not need direct API calls)" >> "$DETAILED_REPORT"
    elif [ $has_useEffect -eq 0 ] && [ $has_api_calls -eq 0 ]; then
        echo "  -> ASSESSMENT: Pure UI component (no data fetching needed)" >> "$DETAILED_REPORT"
    else
        echo "  -> ASSESSMENT: May need API connection review" >> "$DETAILED_REPORT"
    fi
    
    echo "" >> "$DETAILED_REPORT"
    
    # Show where this component is used
    echo "USAGE IN OTHER FILES:" >> "$DETAILED_REPORT"
    component_base=$(basename "$component_name" .jsx)
    usage_files=$(find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "$component_base" 2>/dev/null | grep -v "$file_path")
    
    if [ -n "$usage_files" ]; then
        echo "$usage_files" | while read usage_file; do
            echo "  Used in: $usage_file" >> "$DETAILED_REPORT"
            # Show how it's used
            grep -n "$component_base" "$usage_file" 2>/dev/null | head -2 | sed 's/^/    /' >> "$DETAILED_REPORT"
        done
    else
        echo "  Not found in other files (may be unused or imported differently)" >> "$DETAILED_REPORT"
    fi
    
    echo "" >> "$DETAILED_REPORT"
    echo "$(printf '%.80s' "================================================================================")" >> "$DETAILED_REPORT"
    echo "" >> "$DETAILED_REPORT"
}

# Investigate each flagged component
for component in "${flagged_components[@]}"; do
    investigate_component "$component"
done

# Additional analysis: Find truly problematic components
echo -e "${YELLOW}Finding components that likely need API connections...${NC}"

echo "COMPONENTS LIKELY NEEDING API REVIEW" >> "$DETAILED_REPORT"
echo "====================================" >> "$DETAILED_REPORT"
echo "" >> "$DETAILED_REPORT"

find src/components src/pages -name "*.jsx" -o -name "*.js" | while read file; do
    # Skip if already has API calls
    has_api=$(grep -c "axios\|fetch\|api\." "$file" 2>/dev/null)
    if [ $has_api -gt 0 ]; then
        continue
    fi
    
    # Check for data management patterns that suggest API needs
    has_useEffect=$(grep -c "useEffect" "$file" 2>/dev/null)
    has_form_submit=$(grep -c "onSubmit\|handleSubmit" "$file" 2>/dev/null)
    has_data_state=$(grep -c "useState.*\[\]\|setData\|setItems\|setList" "$file" 2>/dev/null)
    has_loading_state=$(grep -c "loading\|isLoading\|Loading" "$file" 2>/dev/null)
    
    # Score the likelihood of needing API
    api_need_score=$((has_useEffect + has_form_submit * 2 + has_data_state * 2 + has_loading_state))
    
    if [ $api_need_score -gt 2 ]; then
        echo "HIGH PRIORITY: $(basename $file) (score: $api_need_score)" >> "$DETAILED_REPORT"
        echo "  - useEffect: $has_useEffect" >> "$DETAILED_REPORT"
        echo "  - Form submissions: $has_form_submit" >> "$DETAILED_REPORT"
        echo "  - Data state: $has_data_state" >> "$DETAILED_REPORT"
        echo "  - Loading state: $has_loading_state" >> "$DETAILED_REPORT"
        echo "" >> "$DETAILED_REPORT"
    fi
done

# Summary
echo "INVESTIGATION SUMMARY" >> "$DETAILED_REPORT"
echo "====================" >> "$DETAILED_REPORT"
echo "" >> "$DETAILED_REPORT"

total_flagged=${#flagged_components[@]}
echo "Flagged components investigated: $total_flagged" >> "$DETAILED_REPORT"
echo "Investigation completed at: $(date)" >> "$DETAILED_REPORT"

echo ""
echo -e "${GREEN}Investigation complete!${NC}"
echo -e "Detailed report: ${YELLOW}$DETAILED_REPORT${NC}"
echo ""

# Show quick preview
echo -e "${CYAN}Quick findings preview:${NC}"
echo ""
grep -A 1 "ASSESSMENT:" "$DETAILED_REPORT" | head -10
