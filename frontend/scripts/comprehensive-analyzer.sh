#!/bin/bash

# Comprehensive Frontend Analysis Script
# Analyzes imports, exports, component usage, and potential conflicts

set -e

FRONTEND_DIR="${1:-./src}"
OUTPUT_FILE="analysis-$(date +%Y%m%d_%H%M%S).log"

echo "🔍 COMPREHENSIVE FRONTEND ANALYSIS" | tee "$OUTPUT_FILE"
echo "====================================" | tee -a "$OUTPUT_FILE"
echo "Analyzing directory: $FRONTEND_DIR" | tee -a "$OUTPUT_FILE"
echo "Generated: $(date)" | tee -a "$OUTPUT_FILE"
echo "" | tee -a "$OUTPUT_FILE"

# Function to log with both stdout and file
log() {
    echo "$1" | tee -a "$OUTPUT_FILE"
}

# Check if directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    log "❌ Directory $FRONTEND_DIR not found!"
    exit 1
fi

cd "$FRONTEND_DIR"

log "📊 PROJECT STRUCTURE OVERVIEW"
log "=============================="
find . -type f -name "*.jsx" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" | head -50 | tee -a "$OUTPUT_FILE"
log ""

log "🔗 IMPORT ANALYSIS"
log "=================="

log "--- Context Imports Analysis ---"
grep -r "from.*contexts" . --include="*.jsx" --include="*.js" 2>/dev/null | while read -r line; do
    log "$line"
done
log ""

log "--- Component Imports Analysis ---"
grep -r "from.*components" . --include="*.jsx" --include="*.js" 2>/dev/null | head -20 | while read -r line; do
    log "$line"
done
log ""

log "--- Utils/Services Imports Analysis ---"
grep -r "from.*utils\|from.*services" . --include="*.jsx" --include="*.js" 2>/dev/null | head -20 | while read -r line; do
    log "$line"
done
log ""

log "🔄 EXPORT ANALYSIS"
log "=================="

log "--- Default Exports ---"
grep -r "export default" . --include="*.jsx" --include="*.js" | grep -v node_modules | head -30 | while read -r line; do
    log "$line"
done
log ""

log "--- Named Exports ---"
grep -r "export {" . --include="*.jsx" --include="*.js" | head -20 | while read -r line; do
    log "$line"
done
log ""

log "⚠️  POTENTIAL CONFLICTS DETECTION"
log "================================="

log "--- Duplicate Component Names ---"
find . -name "*.jsx" -o -name "*.js" | xargs basename -s .jsx | sort | uniq -d | while read -r component; do
    log "DUPLICATE: $component"
    find . -name "$component.*" | while read -r file; do
        log "  - $file"
    done
done
log ""

log "--- Multiple useAuth Implementations ---"
grep -r "useAuth" . --include="*.jsx" --include="*.js" | grep -E "(export.*useAuth|const useAuth)" | while read -r line; do
    log "$line"
done
log ""

log "--- Multiple API Services ---"
find . -name "*api*" -type f | while read -r file; do
    log "API FILE: $file"
    head -5 "$file" 2>/dev/null | while read -r line; do
        log "  $line"
    done
    log ""
done

log "--- Layout Component Conflicts ---"
find . -name "*Layout*" -type f | while read -r file; do
    log "LAYOUT: $file"
    grep -E "export|function|const.*Layout" "$file" 2>/dev/null | head -3 | while read -r line; do
        log "  $line"
    done
    log ""
done

log "🚨 BROKEN IMPORTS DETECTION"
log "=========================="

log "--- Generic Path Imports (likely broken) ---"
grep -r "from ['\"]\.\.\/contexts['\"]" . --include="*.jsx" --include="*.js" 2>/dev/null | while read -r line; do
    log "GENERIC CONTEXT IMPORT: $line"
done

grep -r "from ['\"]\.\.\/components['\"]" . --include="*.jsx" --include="*.js" 2>/dev/null | while read -r line; do
    log "GENERIC COMPONENT IMPORT: $line"
done

grep -r "from ['\"]\.\.\/utils['\"]" . --include="*.jsx" --include="*.js" 2>/dev/null | while read -r line; do
    log "GENERIC UTILS IMPORT: $line"
done
log ""

log "--- Missing/Undefined Imports ---"
grep -r "import.*authService\|refreshData\|handleApiError" . --include="*.jsx" --include="*.js" 2>/dev/null | while read -r line; do
    log "POTENTIALLY UNDEFINED: $line"
done
log ""

log "📱 COMPONENT USAGE ANALYSIS"
log "=========================="

log "--- App.jsx Route Components ---"
if [ -f "App.jsx" ]; then
    log "Routes defined in App.jsx:"
    grep -E "element=|component=" App.jsx 2>/dev/null | while read -r line; do
        log "  $line"
    done
else
    log "App.jsx not found in current directory"
fi
log ""

log "--- Most Imported Components ---"
grep -r "import.*from.*components" . --include="*.jsx" --include="*.js" 2>/dev/null | \
    sed 's/.*import[^{]*{\([^}]*\)}.*/\1/' | \
    tr ',' '\n' | \
    sed 's/^[[:space:]]*//' | \
    sort | uniq -c | sort -nr | head -10 | while read -r count component; do
    log "$count times: $component"
done
log ""

log "🔧 CONFIGURATION FILES"
log "======================"

log "--- package.json Scripts ---"
if [ -f "../package.json" ]; then
    grep -A 10 '"scripts"' ../package.json | while read -r line; do
        log "$line"
    done
else
    log "package.json not found"
fi
log ""

log "--- Vite Config ---"
if [ -f "../vite.config.js" ]; then
    log "vite.config.js found:"
    head -20 ../vite.config.js | while read -r line; do
        log "  $line"
    done
else
    log "vite.config.js not found"
fi
log ""

log "🏗️  ARCHITECTURE ANALYSIS"
log "========================"

log "--- Context Providers ---"
find . -name "*Context*" -o -name "*Provider*" | while read -r file; do
    log "CONTEXT: $file"
    grep -E "createContext|Provider" "$file" 2>/dev/null | head -2 | while read -r line; do
        log "  $line"
    done
done
log ""

log "--- Hook Files ---"
find . -name "use*.js" -o -name "use*.jsx" | while read -r file; do
    log "HOOK: $file"
done
log ""

log "📋 SUMMARY STATISTICS"
log "===================="

log "File counts:"
log "  JavaScript files: $(find . -name "*.js" | wc -l)"
log "  JSX files: $(find . -name "*.jsx" | wc -l)"
log "  TypeScript files: $(find . -name "*.ts" | wc -l)"
log "  TSX files: $(find . -name "*.tsx" | wc -l)"
log ""

log "Directory structure:"
for dir in components contexts hooks pages utils services layouts; do
    if [ -d "$dir" ]; then
        count=$(find "$dir" -name "*.js" -o -name "*.jsx" | wc -l)
        log "  $dir/: $count files"
    fi
done
log ""

log "🎯 RECOMMENDATIONS"
log "=================="

# Check for specific issues
if grep -r "from ['\"]\.\.\/contexts['\"]" . --include="*.jsx" --include="*.js" >/dev/null 2>&1; then
    log "❌ Fix generic context imports - use specific context files"
fi

if find . -name "*api*" | wc -l | awk '{if($1>1) exit 0; else exit 1}'; then
    log "⚠️  Multiple API services detected - consolidate to avoid conflicts"
fi

if grep -r "useAuth" . --include="*.jsx" --include="*.js" | grep -E "(export.*useAuth|const useAuth)" | wc -l | awk '{if($1>1) exit 0; else exit 1}'; then
    log "⚠️  Multiple useAuth implementations - use Context-based approach"
fi

if [ -f "../vite.config.js" ] && grep -q "port: 3000" ../vite.config.js; then
    log "⚠️  Vite config uses port 3000 - consider changing to 5173"
fi

log ""
log "Analysis complete! Results saved to: $OUTPUT_FILE"
log "Run: cat $OUTPUT_FILE | grep -E '❌|⚠️|DUPLICATE|BROKEN' for quick issue overview"
