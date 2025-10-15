#!/bin/bash
# Quick check for missing route components and pages

cd ~/eddies-askan-automotive/frontend

echo "🔍 Quick Route Component Check"
echo "==============================="

echo ""
echo "📁 Current pages directory structure:"
find src/pages -name "*.jsx" -o -name "*.js" 2>/dev/null | sort

echo ""
echo "📁 Current components directory structure:"
find src/components -name "*.jsx" -o -name "*.js" 2>/dev/null | head -20

echo ""
echo "🔍 Looking for route definitions..."
# Find main router/app files
find src -name "*App*" -o -name "*Router*" -o -name "*Routes*" | while read -r file; do
    echo ""
    echo "📝 Routes in $file:"
    grep -n "path\|component\|element" "$file" | head -10
done

echo ""
echo "🔍 Checking for import errors in main files..."
# Check main entry files for import issues
for file in src/App.jsx src/App.js src/main.jsx src/main.js src/index.jsx src/index.js; do
    if [ -f "$file" ]; then
        echo ""
        echo "📄 Checking imports in $file:"
        grep -n "import" "$file" | head -10
        
        # Try to validate the imports
        echo "🔍 Validating imports..."
        grep "import.*from.*['\"]\./" "$file" | while read -r import_line; do
            # Extract path
            path=$(echo "$import_line" | sed -n "s/.*from ['\"]\([^'\"]*\)['\"].*/\1/p")
            if [[ -n "$path" && "$path" == ./* ]]; then
                # Check if file exists
                current_dir=$(dirname "$file")
                resolved_path="$current_dir/${path#./}"
                
                found=false
                for ext in "" ".js" ".jsx" ".ts" ".tsx"; do
                    if [ -f "${resolved_path}${ext}" ] || [ -f "${resolved_path}/index${ext}" ]; then
                        found=true
                        break
                    fi
                done
                
                if $found; then
                    echo "   ✅ $path"
                else
                    echo "   ❌ Missing: $path"
                fi
            fi
        done
    fi
done

echo ""
echo "🎯 Common missing files check:"
common_files=(
    "src/pages/Dashboard.jsx"
    "src/pages/Login.jsx"
    "src/pages/Register.jsx"
    "src/pages/Customers.jsx"
    "src/pages/Vehicles.jsx"
    "src/pages/Jobs.jsx"
    "src/pages/Estimates.jsx"
    "src/pages/Invoices.jsx"
    "src/components/Navbar.jsx"
    "src/components/Layout.jsx"
)

for file in "${common_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
    fi
done
