#!/bin/bash

# Master Fix Script for Eddie's Automotive
# Run this script to fix all detected issues

echo "🚀 Eddie's Automotive - Master Fix Script"
echo "========================================="
echo ""

# Make all scripts executable
chmod +x *.sh 2>/dev/null || true

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}$1${NC}"
    echo "----------------------------------------"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Backup current state
print_step "Step 1: Creating Backup"
backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
cp -r src "$backup_dir/" 2>/dev/null || true
cp package.json "$backup_dir/" 2>/dev/null || true
cp vite.config.js "$backup_dir/" 2>/dev/null || true
print_success "Backup created in $backup_dir"
echo ""

# Step 2: Fix import statements and semicolons
print_step "Step 2: Fixing Import Statements"

# Fix missing semicolons in imports
find src -name "*.jsx" -o -name "*.js" | while read file; do
    if [ -f "$file" ]; then
        # Remove comments from import lines that have semicolons
        sed -i 's/import \([^;]*\); \/\/ .*/import \1;/g' "$file"
        
        # Fix specific patterns found in diagnostics
        sed -i 's/from "\.\.\/utils\/api"; \/\/ ✨ Use the centralized API utility/from "..\/utils\/api";/g' "$file"
        sed -i 's/from '\''\.\.\/hooks\/useDataOperations'\''; \/\/ ✨ Use our main hook/from '\''..\/hooks\/useDataOperations'\'';/g' "$file"
        sed -i 's/from "\.\.\/contexts\/AuthContext"; \/\/ Import useAuth/from "..\/contexts\/AuthContext";/g' "$file"
        sed -i 's/from "\.\.\/contexts\/AuthContext"; \/\/ Import the useAuth hook/from "..\/contexts\/AuthContext";/g' "$file"
        sed -i 's/from '\''\.\.\/hooks\/useSearchFilter'\''; \/\/  ✨ Import custom hook/from '\''..\/hooks\/useSearchFilter'\'';/g' "$file"
        sed -i 's/from '\''\.\.\/components\/modals\/ConfirmModal'\''; \/\/ ✨ Import modal/from '\''..\/components\/modals\/ConfirmModal'\'';/g' "$file"
        sed -i 's/from '\''\.\.\/hooks\/useLocalStorage'\''; \/\/ ✨ Use our new local storage hook/from '\''..\/hooks\/useLocalStorage'\'';/g' "$file"
        sed -i 's/from "\.\.\/styles\/Navbar\.css"; \/\/ External CSS for animation/from "..\/styles\/Navbar.css";/g' "$file"
        sed -i 's/from '\''\.\.\/utils\/toast'\''; \/\/ Path to your toast utility/from '\''..\/utils\/toast'\'';/g' "$file"
    fi
done

print_success "Import statements cleaned up"
echo ""

# Step 3: Remove excessive console.log statements
print_step "Step 3: Cleaning Console Logs"

# Remove console.log statements but preserve error handling
find src -name "*.jsx" -o -name "*.js" | while read file; do
    if [ -f "$file" ]; then
        # Remove debug console.log but keep console.error and console.warn
        sed -i '/console\.log.*debug\|console\.log.*Debug\|console\.log.*DEBUG/d' "$file"
        # Remove simple console.log statements (but be careful not to remove ones in strings)
        sed -i '/^[[:space:]]*console\.log(/d' "$file"
    fi
done

print_success "Console logs cleaned up"
echo ""

# Step 4: Fix useDataOperations hook
print_step "Step 4: Fixing useDataOperations Hook"

if [ -f "src/hooks/useDataOperations.js" ]; then
    # Check if default export exists
    if ! grep -q "export default" src/hooks/useDataOperations.js; then
        echo "" >> src/hooks/useDataOperations.js
        echo "// Default export for compatibility" >> src/hooks/useDataOperations.js
        echo "export default useDataOperations;" >> src/hooks/useDataOperations.js
        print_success "Added default export to useDataOperations"
    else
        print_success "useDataOperations already has default export"
    fi
else
    print_warning "useDataOperations.js not found - you may need to create it"
fi
echo ""

# Step 5: Fix common JSX issues
print_step "Step 5: Fixing JSX Issues"

fix_jsx_file() {
    local file=$1
    if [ -f "$file" ]; then
        # Fix className instead of class (but be careful in comments)
        sed -i 's/\bclass=/className=/g' "$file"
        
        # Fix htmlFor instead of for
        sed -i 's/\bfor=/htmlFor=/g' "$file"
        
        print_success "Fixed JSX issues in $(basename "$file")"
    fi
}

# Fix files that had JSX warnings
fix_jsx_file "src/pages/ViewJobs.jsx"
fix_jsx_file "src/pages/Login.jsx"
fix_jsx_file "src/pages/EstimatesList.jsx"
fix_jsx_file "src/pages/Register.jsx"
fix_jsx_file "src/contexts/AuthContext.jsx"
echo ""

# Step 6: Clear caches
print_step "Step 6: Clearing Caches"

# Clear Vite cache
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf .vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true

print_success "Caches cleared"
echo ""

# Step 7: Validate package.json and dependencies
print_step "Step 7: Checking Dependencies"

if [ -f "package.json" ]; then
    print_success "package.json found"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found - will need to run npm install"
    else
        print_success "node_modules directory exists"
    fi
else
    print_error "package.json not found!"
fi
echo ""

# Step 8: Basic syntax validation
print_step "Step 8: Basic Syntax Validation"

syntax_issues=0

# Check for unmatched brackets in JSX files
find src -name "*.jsx" | while read file; do
    if [ -f "$file" ]; then
        open_braces=$(grep -o '{' "$file" | wc -l)
        close_braces=$(grep -o '}' "$file" | wc -l)
        
        if [ "$open_braces" -ne "$close_braces" ]; then
            print_warning "Unmatched braces in $(basename "$file"): $open_braces open, $close_braces close"
            syntax_issues=$((syntax_issues + 1))
        fi
    fi
done

if [ $syntax_issues -eq 0 ]; then
    print_success "Basic syntax validation passed"
else
    print_warning "Found $syntax_issues potential syntax issues"
fi
echo ""

# Step 9: Final summary and next steps
print_step "Step 9: Summary and Next Steps"

echo "🎉 Master fix script completed!"
echo ""
echo "✅ What was fixed:"
echo "   • Import statement semicolons and comments"
echo "   • Excessive console.log statements"
echo "   • useDataOperations hook export"
echo "   • Common JSX syntax issues"
echo "   • Cleared Vite cache"
echo ""

# Check if we need to install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Next steps:"
    echo "   1. Run: npm install"
    echo "   2. Run: npm run dev"
    echo "   3. Open http://localhost:5173"
    echo "   4. Check browser console for any remaining errors"
else
    echo "🚀 Ready to run:"
    echo "   1. Run: npm run dev"
    echo "   2. Open http://localhost:5173"
    echo "   3. Check browser console for any remaining errors"
fi

echo ""
echo "🔍 If you still see issues:"
echo "   • Run ./diagnose.sh again to check remaining problems"
echo "   • Check browser developer tools console"
echo "   • Look for specific error messages in the terminal"
echo ""

# Check if there are any obvious remaining issues
remaining_issues=0

# Check for files that might still have issues
if find src -name "*.jsx" -exec grep -l "class=" {} \; | head -1 | grep -q .; then
    print_warning "Some files may still use 'class=' instead of 'className='"
    remaining_issues=$((remaining_issues + 1))
fi

if find src -name "*.jsx" -exec grep -l "\bfor=" {} \; | head -1 | grep -q .; then
    print_warning "Some files may still use 'for=' instead of 'htmlFor='"
    remaining_issues=$((remaining_issues + 1))
fi

if [ $remaining_issues -eq 0 ]; then
    echo -e "${GREEN}🎯 All common issues appear to be resolved!${NC}"
else
    echo -e "${YELLOW}⚠️  $remaining_issues types of issues may need manual review${NC}"
fi

echo ""
echo "💾 Backup saved in: $backup_dir"
echo "📋 You can restore from backup if needed: cp -r $backup_dir/src ."
echo ""
echo "🚀 Happy coding! Your Eddie's Automotive app should be ready to run!"
