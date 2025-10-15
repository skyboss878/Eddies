#!/bin/bash

# safe-dependency-analyzer.sh
# Analyzes EXACTLY what you have and creates MINIMAL safe changes

echo "SAFE DEPENDENCY ANALYSIS FOR EDDIE'S AUTOMOTIVE"
echo "==============================================="
echo "ANALYSIS ONLY - NO CHANGES MADE"
echo ""

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT="safe-analysis-${TIMESTAMP}.txt"

{
echo "=== CURRENT STATE ANALYSIS ==="
echo "Timestamp: $TIMESTAMP"
echo "Path: $(pwd)"
echo ""

echo "=== API IMPLEMENTATIONS FOUND ==="
echo "1. utils/api.js:"
if [[ -f "src/utils/api.js" ]]; then
    echo "   Lines: $(wc -l < src/utils/api.js)"
    echo "   Exports: $(grep -c "^export" src/utils/api.js)"
    echo "   Services: $(grep -c "Service.*=" src/utils/api.js)"
    echo "   Has axios config: $(grep -q "axios.create" src/utils/api.js && echo "YES" || echo "NO")"
fi

echo ""
echo "2. utils/apiEndpoints.js:"
if [[ -f "src/utils/apiEndpoints.js" ]]; then
    echo "   Lines: $(wc -l < src/utils/apiEndpoints.js)"
    echo "   Exports: $(grep -c "^export" src/utils/apiEndpoints.js)"
    echo "   Services: $(grep -c "Service.*=" src/utils/apiEndpoints.js)"
    echo "   Has axios config: $(grep -q "axios.create" src/utils/apiEndpoints.js && echo "YES" || echo "NO")"
fi

echo ""
echo "3. Individual service files in utils/services/:"
if [[ -d "src/utils/services" ]]; then
    echo "   Service files found: $(find src/utils/services -name "*Service.js" | wc -l)"
    find src/utils/services -name "*Service.js" | while read file; do
        echo "   - $file ($(wc -l < "$file") lines)"
    done
fi

echo ""
echo "=== CONTEXT PROVIDERS ANALYSIS ==="
if [[ -f "src/contexts/AuthContext.jsx" ]]; then
    echo "AuthContext.jsx:"
    echo "   Has useAuth: $(grep -q "export.*useAuth" src/contexts/AuthContext.jsx && echo "YES" || echo "NO")"
    echo "   Has AuthProvider: $(grep -q "export.*AuthProvider" src/contexts/AuthContext.jsx && echo "YES" || echo "NO")"
fi

if [[ -f "src/contexts/DataContext.jsx" ]]; then
    echo "DataContext.jsx:"
    echo "   Has useData: $(grep -q "export.*useData" src/contexts/DataContext.jsx && echo "YES" || echo "NO")"
    echo "   Has DataProvider: $(grep -q "export.*DataProvider" src/contexts/DataContext.jsx && echo "YES" || echo "NO")"
fi

if [[ -f "src/hooks/useAuth.js" ]]; then
    echo "DUPLICATE useAuth found in hooks/useAuth.js"
fi

echo ""
echo "=== COMPONENT DEPENDENCY ANALYSIS ==="
echo "Components importing from '../utils':"
grep -r "from ['\"]\.\.\/utils['\"]" src/ --include="*.jsx" | wc -l

echo ""
echo "Components importing specific API services:"
grep -r "customerService\|vehicleService\|jobService" src/ --include="*.jsx" | head -5

echo ""
echo "=== MOST CRITICAL CONFLICTS ==="
echo "Files that will break with current setup:"

# Check specific problematic files
critical_files=(
    "src/pages/Reports.jsx"
    "src/components/SearchSystem.jsx"
    "src/pages/CreateEditEstimate.jsx"
    "src/pages/EstimatesList.jsx"
)

for file in "${critical_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo ""
        echo "CRITICAL: $file"
        echo "   Generic imports: $(grep -c "from.*utils['\"]" "$file")"
        echo "   Specific imports: $(grep -c "from.*utils/.*" "$file")"
        echo "   Uses services: $(grep -c "Service" "$file")"
        
        # Show actual import lines
        echo "   Import lines:"
        grep -n "^import.*from.*utils" "$file" | head -3 | sed 's/^/     /'
    fi
done

echo ""
echo "=== RECOMMENDED STRATEGY ==="
echo ""

# Determine which API implementation is most complete
api_lines=$(wc -l < src/utils/api.js 2>/dev/null || echo 0)
endpoints_lines=$(wc -l < src/utils/apiEndpoints.js 2>/dev/null || echo 0)
services_count=$(find src/utils/services -name "*Service.js" 2>/dev/null | wc -l)

echo "API file sizes:"
echo "   utils/api.js: $api_lines lines"
echo "   utils/apiEndpoints.js: $endpoints_lines lines"
echo "   utils/services/: $services_count service files"

if [[ $endpoints_lines -gt $api_lines ]]; then
    echo ""
    echo "RECOMMENDATION: Keep apiEndpoints.js (most comprehensive)"
    echo "ACTION: Remove utils/api.js and consolidate services/"
else
    echo ""
    echo "RECOMMENDATION: Keep utils/api.js"
    echo "ACTION: Remove apiEndpoints.js and consolidate services/"
fi

echo ""
echo "=== SAFE MINIMAL FIX STRATEGY ==="
echo "1. Choose ONE API implementation"
echo "2. Update ONLY utils/index.js exports"
echo "3. Test immediately"
echo "4. Fix remaining imports individually"
echo ""
echo "DO NOT delete multiple files at once"
echo "DO NOT run automated scripts on this complex setup"

} | tee "$REPORT"

echo ""
echo "ANALYSIS COMPLETE - NO CHANGES MADE"
echo "Report saved: $REPORT"
echo ""
echo "NEXT STEPS:"
echo "1. Review the analysis above"
echo "2. Choose which API implementation to keep"
echo "3. Run minimal fixes only"
echo "4. Test after each change"

# Create a minimal safe fix script
cat > "minimal-fix-${TIMESTAMP}.sh" << 'MINIMAL'
#!/bin/bash
echo "MINIMAL SAFE FIX - Choose which approach:"
echo ""
echo "Option A: Keep apiEndpoints.js (recommended)"
echo "  rm src/utils/api.js"
echo "  # Update utils/index.js to export only from apiEndpoints.js"
echo ""
echo "Option B: Keep api.js"  
echo "  rm src/utils/apiEndpoints.js"
echo "  # Update utils/index.js to export only from api.js"
echo ""
echo "Option C: Keep services/ folder"
echo "  rm src/utils/api.js src/utils/apiEndpoints.js"
echo "  # Export directly from services/"
echo ""
echo "DO NOT run this script - choose your approach manually"
MINIMAL

chmod +x "minimal-fix-${TIMESTAMP}.sh"

echo "Minimal fix options: minimal-fix-${TIMESTAMP}.sh"
