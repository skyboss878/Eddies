#!/bin/bash

# React App Diagnostics Script for Eddie's Automotive

echo -e "🔍 EDDIE'S AUTOMOTIVE - REACT APP DIAGNOSTICS"
echo -e "==============================================\n"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Directories
PROJECT_ROOT="$HOME/eddies-askan-automotive"
FRONTEND_ROOT="$PROJECT_ROOT/frontend"
SRC_ROOT="$FRONTEND_ROOT/src"

echo -e "${BLUE}📂 Project Structure Check${NC}"
echo "----------------------------------------"
[ -d "$PROJECT_ROOT" ] && echo -e "✅ Project root found: $PROJECT_ROOT" || { echo -e "❌ Project root NOT found: $PROJECT_ROOT"; exit 1; }
[ -d "$FRONTEND_ROOT" ] && echo -e "✅ Frontend directory found" || { echo -e "❌ Frontend directory NOT found"; exit 1; }
[ -d "$SRC_ROOT" ] && echo -e "✅ Source directory found" || { echo -e "❌ Source directory NOT found"; exit 1; }

echo -e "\n${BLUE}📋 File Existence Check${NC}"
echo "----------------------------------------"
cd "$FRONTEND_ROOT"
CRITICAL_FILES=("src/App.jsx" "src/main.jsx" "src/index.css" "package.json" "vite.config.js")
for file in "${CRITICAL_FILES[@]}"; do
    [ -f "$file" ] && echo -e "✅ $file" || echo -e "❌ $file - MISSING!"
done

echo -e "\n${BLUE}🔗 Import Path Analysis${NC}"
echo "----------------------------------------"
find "$SRC_ROOT" -name "*.js" -o -name "*.jsx" | while read -r file; do
    filename=$(basename "$file")
    if grep -q "\.\./\.\./\.\." "$file" 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Deep relative imports in $filename${NC}"
        grep -n "\.\./\.\./\.\." "$file" | head -3
    fi
    missing_ext=$(grep -E "from\s+['\"]\./[^'\"]+['\"]" "$file" | grep -vE "\.js|\.jsx|\.json|\.css" | head -2)
    if [ -n "$missing_ext" ]; then
        echo -e "${YELLOW}⚠️  Possible missing extensions in $filename:${NC}"
        echo "$missing_ext"
    fi
done

echo -e "\n${BLUE}📦 Component Import Verification${NC}"
echo "----------------------------------------"
cd "$SRC_ROOT"
if [ -f "App.jsx" ]; then
    echo "Checking App.jsx imports..."
    grep "import.*from.*'\./" App.jsx | sed "s/.*from.*'\.\///g" | sed "s/'.*//g" | while read -r import_path; do
        [ -z "$import_path" ] && continue
        path="$SRC_ROOT/$import_path"
        [[ "$path" != *.* ]] && path="${path}.jsx"
        [ -f "$path" ] && echo -e "✅ $import_path" || echo -e "❌ $import_path - FILE NOT FOUND!"
    done
fi

echo -e "\n${BLUE}⚠️  Syntax Error Check${NC}"
echo "----------------------------------------"
find "$SRC_ROOT" -name "*.js" -o -name "*.jsx" | while read -r file; do
    filename=$(basename "$file")
    if grep -q "<[A-Z][^>]*[^/]>" "$file" 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Check JSX tags in $filename${NC}"
    fi
    if grep -q "^import.*[^;]$" "$file" 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Missing semicolons in imports: $filename${NC}"
        grep -n "^import.*[^;]$" "$file" | head -2
    fi
    log_count=$(grep -c "console\.log" "$file" 2>/dev/null || echo 0)
    if [ "$log_count" -gt 5 ]; then
        echo -e "${YELLOW}⚠️  Many console.log statements in $filename ($log_count)${NC}"
    fi
done

echo -e "\n${BLUE}🎣 Hook Usage Analysis${NC}"
echo "----------------------------------------"
find "$SRC_ROOT" -name "*.js" -o -name "*.jsx" | while read -r file; do
    filename=$(basename "$file")
    if grep -q "use[A-Z]" "$file"; then
        hook_usage=$(grep -n "use[A-Z]" "$file" | head -3)
        if [ -n "$hook_usage" ]; then
            echo -e "${BLUE}Hooks found in $filename:${NC}"
            echo "$hook_usage" | cut -d: -f1,2
        fi
    fi
done

echo -e "\n${BLUE}🌐 API Configuration Check${NC}"
echo "----------------------------------------"
if [ -f "$SRC_ROOT/utils/api.js" ]; then
    echo -e "✅ API utils file found"
    grep -q "localhost" "$SRC_ROOT/utils/api.js" && echo -e "${GREEN}✅ Localhost configuration found${NC}"
    grep -q "API_ENDPOINTS" "$SRC_ROOT/utils/api.js" && echo -e "✅ API_ENDPOINTS export found" || echo -e "${YELLOW}⚠️  API_ENDPOINTS export not found${NC}"
else
    echo -e "${YELLOW}⚠️  API utils file not found at src/utils/api.js${NC}"
    [ -f "$SRC_ROOT/api.js" ] && echo -e "${YELLOW}⚠️  Found API file at src/api.js instead${NC}"
fi

echo -e "\n${BLUE}📄 Package Dependencies${NC}"
echo "----------------------------------------"
cd "$FRONTEND_ROOT"
if [ -f "package.json" ]; then
    echo "Checking critical dependencies..."
    REQUIRED_DEPS=("react" "react-dom" "react-router-dom")
    for dep in "${REQUIRED_DEPS[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            version=$(grep "\"$dep\"" package.json | sed 's/.*: "//g' | sed 's/".*//g')
            echo -e "✅ $dep: $version"
        else
            echo -e "❌ $dep - MISSING!"
        fi
    done
    echo -e "\nReact versions:"
    grep -E "\"react" package.json | head -3
else
    echo -e "❌ package.json not found!"
fi

echo -e "\n${BLUE}🔧 Build Process Check${NC}"
echo "----------------------------------------"
[ -f "vite.config.js" ] && echo -e "✅ Vite config found" || echo -e "${YELLOW}⚠️  Vite config not found${NC}"
grep -q "localhost" vite.config.js 2>/dev/null && echo -e "${GREEN}✅ Localhost proxy configuration found${NC}"

if [ -d "node_modules" ]; then
    echo -e "✅ Node modules installed"
    size=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo -e "📦 Node modules size: $size"
else
    echo -e "❌ Node modules not installed - run 'npm install'"
fi

echo -e "\n${BLUE}🐛 Recent Error Log Check${NC}"
echo "----------------------------------------"
[ -f ".vite/deps/_metadata.json" ] && echo -e "✅ Vite cache found" || echo -e "${YELLOW}⚠️  No Vite cache - may need to restart dev server${NC}"

# Check for TS files
if find "$SRC_ROOT" -name "*.ts" -o -name "*.tsx" | grep -q .; then
    echo -e "${BLUE}TypeScript files detected${NC}"
fi

echo -e "\n${BLUE}🎯 Specific Issue Detection${NC}"
echo "----------------------------------------"
PROBLEM_FILES=("src/pages/CreateJob.jsx" "src/hooks/useDataOperations.js")
for file in "${PROBLEM_FILES[@]}"; do
    echo "Analyzing $file..."
    if [ -f "$file" ]; then
        echo -e "✅ File exists"
        size=$(wc -c < "$file")
        [ "$size" -lt 100 ] && echo -e "${YELLOW}⚠️  File is very small ($size bytes) - might be empty${NC}"
        grep -q "export default" "$file" && echo -e "✅ Default export found" || echo -e "${YELLOW}⚠️  No default export found${NC}"
        import_count=$(grep -c "^import" "$file" 2>/dev/null)
        echo -e "📥 Import statements: $import_count"
    else
        echo -e "❌ File not found!"
    fi
    echo ""
done

echo -e "${GREEN}🏁 DIAGNOSTICS COMPLETE${NC}"
echo "=============================================="
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Fix any ❌ MISSING files"
echo "2. Resolve ⚠️  warnings"
echo "3. Run: npm install (if node_modules missing)"
echo "4. Run: npm run dev"
echo "5. Check browser console for React errors"

# Save to diagnostics_report.txt
{
    echo "React App Diagnostics Report - $(date)"
    echo "Generated by Eddie's Automotive Diagnostics Script"
} > diagnostics_report.txt

echo -e "${YELLOW}📋 Summary saved to: ./diagnostics_report.txt${NC}"
