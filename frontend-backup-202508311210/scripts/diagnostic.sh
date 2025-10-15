#!/bin/bash

# Eddie's Automotive - Loading State Diagnostic Script
echo "🔧 Eddie's Automotive - Loading State Diagnostic"
echo "================================================"

# Navigate to project
cd ~/eddies-askan-automotive/frontend

echo "1. Checking DataContext.jsx for loading state management..."
echo ""

# Check if DataContext exists
if [ -f "src/contexts/DataContext.jsx" ]; then
    echo "✅ DataContext.jsx found"
    
    # Check for loading state patterns
    echo ""
    echo "🔍 Checking loading state patterns:"
    
    # Check if loading state is defined
    if grep -q "useState.*loading" src/contexts/DataContext.jsx; then
        echo "✅ Loading state found"
    else
        echo "❌ Loading state NOT found"
    fi
    
    # Check if setLoading is called after data fetch
    if grep -q "setLoading.*false" src/contexts/DataContext.jsx; then
        echo "✅ setLoading(false) found"
    else
        echo "❌ setLoading(false) NOT found - THIS IS LIKELY THE ISSUE!"
    fi
    
    # Check for initial loading setup
    if grep -q "initial.*true" src/contexts/DataContext.jsx; then
        echo "✅ Initial loading state setup found"
    else
        echo "❌ Initial loading state NOT properly set"
    fi
    
    echo ""
    echo "📋 Current loading-related lines in DataContext:"
    echo "------------------------------------------------"
    grep -n -A2 -B2 "loading\|Loading\|setLoading" src/contexts/DataContext.jsx | head -20
    
else
    echo "❌ DataContext.jsx NOT found!"
fi

echo ""
echo "2. Checking for any loading components..."
echo ""

# Find files that might control the loading screen
echo "🔍 Files that might control loading screen:"
find src/ -name "*.jsx" -o -name "*.js" | xargs grep -l "Firing up the engine\|loading" | head -5

echo ""
echo "3. Quick fix suggestions:"
echo "========================"

if ! grep -q "setLoading.*false" src/contexts/DataContext.jsx 2>/dev/null; then
    echo "🛠️  LIKELY FIX: Add this line after successful data fetch in DataContext.jsx:"
    echo "   setLoading(prev => ({ ...prev, initial: false, data: false }));"
    echo ""
    echo "🛠️  Or if using simple boolean loading:"
    echo "   setLoading(false);"
fi

echo ""
echo "4. Would you like me to:"
echo "   a) Show the full DataContext.jsx file"
echo "   b) Apply an automatic fix"
echo "   c) Create a fixed version"
echo ""
echo "Run one of these commands:"
echo "  cat src/contexts/DataContext.jsx    # Show full file"
echo "  # We can then create the fix based on what we see"

echo ""
echo "🏁 Diagnostic complete!"
echo "The issue is most likely missing setLoading(false) after data fetch succeeds."
