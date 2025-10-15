#!/bin/bash

echo "=== QUICK API FIXES FOR PAGES ==="
echo

cd src/pages

# Fix 1: Settings.jsx - Replace direct fetch with /api prefix
echo "1. Fixing Settings.jsx..."
if [ -f "Settings.jsx" ]; then
    # Fix the fetch calls to use proper API endpoints
    sed -i.backup "s|'/settings/'|'/api/settings'|g" Settings.jsx
    echo "✅ Fixed Settings.jsx API endpoints"
else
    echo "❌ Settings.jsx not found"
fi

echo

# Check critical pages
echo "2. Critical pages status:"
echo "========================="

for page in Dashboard.jsx EstimateAI.jsx CustomerList.jsx VehicleList.jsx EstimatesList.jsx; do
    if [ -f "$page" ]; then
        echo "✅ $page found"
        if grep -q "useDataOperations" "$page" 2>/dev/null; then
            echo "   ✅ Uses useDataOperations (should work)"
        elif grep -q "apiClient" "$page" 2>/dev/null; then
            echo "   ✅ Uses apiClient (should work)"
        else
            echo "   ⚠️  May need manual review"
        fi
    else
        echo "❌ $page not found"
    fi
done

echo
echo "3. MANUAL FIXES STILL NEEDED:"
echo "============================="
echo "- CustomerList.jsx: Replace fetchCustomers with useDataOperations"
echo "- AddVehicle.jsx: Replace direct fetch with apiClient"
echo

echo "4. START TESTING:"
echo "================="
echo "Backend: cd ../backend && python run.py"
echo "Frontend: npm start"
