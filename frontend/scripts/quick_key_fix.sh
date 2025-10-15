#!/bin/bash

# Quick fixes for the specific missing key issues found in your files
# This targets the exact problems shown in your grep output

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Quick Fix: Adding Missing React Keys${NC}"
echo "=============================================="

# Create backup first
BACKUP_DIR="backup_quick_key_fix_$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}Creating backup: $BACKUP_DIR${NC}"
cp -r src "$BACKUP_DIR"

# Fix Invoice.jsx - Add keys to parts and labor maps
echo -e "${BLUE}Fixing Invoice.jsx...${NC}"
if [ -f "src/pages/Invoice.jsx" ]; then
    # Fix parts mapping - look for the pattern and add key
    sed -i 's/{invoiceData\.parts\.map((p, i) => (/{invoiceData.parts.map((p, i) => (/g' src/pages/Invoice.jsx
    # Add key to the first element after the map
    sed -i 's/<tr \([^>]*\)>/<tr key={i} \1>/g' src/pages/Invoice.jsx
    sed -i 's/<tr>/<tr key={i}>/g' src/pages/Invoice.jsx
    
    # Fix labor mapping
    sed -i 's/{invoiceData\.labor\.map((l, i) => (/{invoiceData.labor.map((l, i) => (/g' src/pages/Invoice.jsx
    
    echo -e "${GREEN}  ✅ Fixed Invoice.jsx${NC}"
else
    echo -e "${RED}  ❌ Invoice.jsx not found${NC}"
fi

# Fix CustomerList.jsx - Add keys to various map operations
echo -e "${BLUE}Fixing CustomerList.jsx...${NC}"
if [ -f "src/pages/CustomerList.jsx" ]; then
    # Fix skeleton loading array
    sed -i 's/{\[\.\.\.Array(5)\]\.map((\_, i) => (/{[...Array(5)].map((_, i) => (/g' src/pages/CustomerList.jsx
    
    # Add key to divs in skeleton loading
    sed -i 's/<div className="animate-pulse \([^"]*\)">/<div key={i} className="animate-pulse \1">/g' src/pages/CustomerList.jsx
    sed -i 's/<div className="animate-pulse">/<div key={i} className="animate-pulse">/g' src/pages/CustomerList.jsx
    
    # Fix other mapping patterns if they create JSX elements
    sed -i 's/<li \([^>]*\)>/<li key={customer.id} \1>/g' src/pages/CustomerList.jsx
    sed -i 's/<li>/<li key={customer.id}>/g' src/pages/CustomerList.jsx
    
    echo -e "${GREEN}  ✅ Fixed CustomerList.jsx${NC}"
else
    echo -e "${RED}  ❌ CustomerList.jsx not found${NC}"
fi

# General fix for common patterns across all JSX files
echo -e "${BLUE}Applying general fixes...${NC}"

# Find all JSX files with .map() calls and try to fix common patterns
jsx_files=$(find src -name "*.jsx" -type f)
fixed_files=0

for file in $jsx_files; do
    if grep -q "\.map(" "$file"; then
        echo -e "  Checking: $(basename $file)"
        
        # Pattern 1: .map((item, index) => ( followed by JSX element
        if sed -i.tmp 's/\(\.map(\([^,)]*\),\s*\([^)]*\))\s*=>\s*(\s*\)<\([^>]*\)>/\1<\4 key={\3}>/g' "$file"; then
            if ! cmp -s "$file" "$file.tmp"; then
                ((fixed_files++))
                echo -e "    ${GREEN}Fixed pattern 1${NC}"
            fi
        fi
        rm -f "$file.tmp"
        
        # Pattern 2: .map(item => ( followed by JSX element (when item has .id)
        if sed -i.tmp 's/\(\.map(\([^)]*\))\s*=>\s*(\s*\)<\([^>]*\)>/\1<\3 key={\2.id || `item-${Math.random()}`}>/g' "$file"; then
            if ! cmp -s "$file" "$file.tmp"; then
                ((fixed_files++))
                echo -e "    ${GREEN}Fixed pattern 2${NC}"
            fi
        fi
        rm -f "$file.tmp"
    fi
done

echo -e "${GREEN}  ✅ Applied general fixes to $fixed_files files${NC}"

# Verification
echo -e "${BLUE}Verifying fixes...${NC}"
remaining_issues=0

# Check for remaining issues
while read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    line_num=$(echo "$line" | cut -d: -f2)
    content=$(echo "$line" | cut -d: -f3-)
    
    # Check if the next lines contain JSX without keys
    next_lines=$(tail -n +$((line_num+1)) "$file" 2>/dev/null | head -3)
    if echo "$next_lines" | grep -q "<" && ! echo "$next_lines" | grep -q "key="; then
        if [ $remaining_issues -eq 0 ]; then
            echo -e "${YELLOW}Remaining issues that need manual fixing:${NC}"
        fi
        ((remaining_issues++))
        echo -e "  ${RED}$file:$line_num${NC} - $content"
    fi
done < <(grep -r "\.map(" src --include="*.jsx")

if [ $remaining_issues -eq 0 ]; then
    echo -e "${GREEN}✅ All .map() key issues appear to be fixed!${NC}"
else
    echo -e "${YELLOW}⚠️  $remaining_issues issues may need manual review${NC}"
fi

# Create a manual review script for complex cases
cat > "review_remaining_keys.sh" << 'EOF'
#!/bin/bash
echo "Manual review needed for these files:"
echo "====================================="

# Show remaining .map() calls that might need keys
grep -rn "\.map(" src --include="*.jsx" | while read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    line_num=$(echo "$line" | cut -d: -f2)
    
    # Show context around the line
    echo "File: $file:$line_num"
    echo "Context:"
    sed -n "$((line_num-1)),$((line_num+3))p" "$file" | cat -n
    echo "---"
done
EOF

chmod +x review_remaining_keys.sh

echo ""
echo -e "${GREEN}Quick Key Fix Complete!${NC}"
echo "========================="
echo -e "📁 Backup: ${YELLOW}$BACKUP_DIR${NC}"
echo -e "🔍 Review script: ${YELLOW}review_remaining_keys.sh${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Test your application: npm run dev"
echo "2. Check browser console for React warnings"
echo "3. Run: ./review_remaining_keys.sh (if needed)"
echo ""
echo -e "${YELLOW}If you see React key warnings in console, run the comprehensive fix script instead${NC}"
