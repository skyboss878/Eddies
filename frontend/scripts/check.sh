#!/bin/bash

echo "🔍 Checking for syntax errors..."

# Check the specific files we modified
FILES=("src/components/Navbar.jsx" "src/components/UserDropdown.jsx" "src/components/DashboardCard.jsx")

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -n "Checking $file... "
        if node -c "$file" 2>/dev/null; then
            echo "✅ OK"
        else
            echo "❌ ERROR found!"
            echo "Error details:"
            node -c "$file"
            echo ""
        fi
    else
        echo "⚠️  $file not found"
    fi
done

echo ""
echo "🎯 Quick manual check for common issues:"

# Check for the specific typo we found
if grep -n "</Button>" src/components/UserDropdown.jsx 2>/dev/null; then
    echo "❌ Found </Button> typo in UserDropdown.jsx - should be </button>"
fi

# Check for HTML comments in JSX
if grep -r "<!--" src/ 2>/dev/null; then
    echo "❌ Found HTML comments in JSX files - use {/* */} instead"
fi

# Check for class instead of className
if grep -r " class=" src/ 2>/dev/null; then
    echo "❌ Found 'class' attributes - use 'className' instead"
fi

echo ""
echo "🚀 If no errors shown above, check browser console (F12) for runtime errors"
