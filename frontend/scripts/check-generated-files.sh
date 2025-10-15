#!/bin/bash

# Check what was generated and fix immediate issues
echo "🔍 Checking generated files..."

cd ~/eddies-asian-automotive/frontend

echo "📁 Checking generated index.js files:"
echo "======================================"

# Check components/index.js
if [ -f "src/components/index.js" ]; then
    echo "✅ src/components/index.js exists"
    echo "Content preview:"
    head -10 src/components/index.js
    echo "..."
    echo "Total lines: $(wc -l < src/components/index.js)"
else
    echo "❌ src/components/index.js missing"
fi

echo ""

# Check utils/index.js  
if [ -f "src/utils/index.js" ]; then
    echo "✅ src/utils/index.js exists"
    echo "Content preview:"
    head -10 src/utils/index.js
    echo "..."
    echo "Total lines: $(wc -l < src/utils/index.js)"
else
    echo "❌ src/utils/index.js missing"
fi

echo ""

# Check hooks/index.js
if [ -f "src/hooks/index.js" ]; then
    echo "✅ src/hooks/index.js exists"
    echo "Content preview:"
    head -10 src/hooks/index.js
else
    echo "❌ src/hooks/index.js missing (may not have hooks directory)"
fi

echo ""

# Check contexts/index.js
if [ -f "src/contexts/index.js" ]; then
    echo "✅ src/contexts/index.js exists"
    echo "Content preview:"
    head -10 src/contexts/index.js
else
    echo "❌ src/contexts/index.js missing (may not have contexts directory)"
fi

echo ""
echo "🔍 Checking for specific issues..."

# Check if vehicleHelpers is properly exported
echo "🚗 Checking vehicleHelpers:"
if [ -f "src/utils/vehicleHelpers.js" ]; then
    echo "  ✅ vehicleHelpers.js exists"
    if grep -q "export.*vehicleHelpers" src/utils/index.js 2>/dev/null; then
        echo "  ✅ vehicleHelpers exported in utils/index.js"
    else
        echo "  ❌ vehicleHelpers NOT exported in utils/index.js"
        echo "  💡 Need to add: export { vehicleHelpers } from './vehicleHelpers';"
    fi
else
    echo "  ❌ vehicleHelpers.js missing"
fi

echo ""
echo "🔍 Checking for common utility functions that might be missing..."

# Check for common utility functions
missing_utils=(
    "apiEndpoints"
    "generateAIResponse" 
    "showMessage"
    "socket"
    "computeTotals"
    "formatDate"
    "formatTime"
    "getStatusColor"
    "getStatusIcon"
    "handleApiError"
)

echo "Missing utility functions that need to be created:"
for util in "${missing_utils[@]}"; do
    if ! find src/utils -name "*.js" -exec grep -l "export.*$util" {} \; 2>/dev/null | grep -q .; then
        echo "  ❌ $util - needs to be created/exported"
    else
        echo "  ✅ $util - found"
    fi
done

echo ""
echo "🧪 Quick test - trying to start the dev server..."
echo "If this fails, we'll know there are still import issues"

# Try a quick syntax check on the main files
if [ -f "src/App.jsx" ]; then
    echo "📋 Checking App.jsx imports..."
    grep "^import" src/App.jsx | head -5
fi

if [ -f "src/main.jsx" ]; then
    echo "📋 Checking main.jsx imports..."
    grep "^import" src/main.jsx
fi

echo ""
echo "🎯 Next steps:"
echo "1. Run the verification script: ./verify-imports-script.sh"
echo "2. Create missing utility files (see list above)"
echo "3. Test with: npm start"
echo "4. If errors persist, check specific import statements"

echo ""
echo "🔧 Quick fixes needed (if any):"

# Check if we need to fix the utils/index.js for vehicleHelpers
if [ -f "src/utils/vehicleHelpers.js" ] && [ -f "src/utils/index.js" ]; then
    if ! grep -q "vehicleHelpers" src/utils/index.js; then
        echo "  - Add vehicleHelpers export to utils/index.js"
    fi
fi

# Check the build configuration issue
echo ""
echo "🔍 Build configuration check:"
if [ -f "tsconfig.json" ]; then
    echo "  ✅ TypeScript config found"
    echo "  💡 The build ran TSC instead of Vite - this might be normal for your setup"
else
    echo "  ❌ No tsconfig.json found"
fi

if [ -f "vite.config.js" ] || [ -f "vite.config.ts" ]; then
    echo "  ✅ Vite config found"
else
    echo "  ❌ No Vite config found"
fi
