#!/bin/bash
# Final fix for the stubborn AuthContext import

cd ~/eddies-askan-automotive/frontend

echo "🎯 Targeting the specific AuthContext import issue..."

# Show current problematic line
echo "❌ Current problematic import:"
grep -n "import api from" src/contexts/AuthContext.jsx

# Create backup of just this file
cp src/contexts/AuthContext.jsx src/contexts/AuthContext.jsx.final-backup

# Use more specific sed command with exact line matching
sed -i "s|^import api from '../../api';$|import api from '../utils/api';|g" src/contexts/AuthContext.jsx

# Also try with potential whitespace
sed -i "s|^import api from '../../api'; *$|import api from '../utils/api';|g" src/contexts/AuthContext.jsx

# And handle any trailing characters
sed -i "s|import api from '../../api';|import api from '../utils/api';|g" src/contexts/AuthContext.jsx

echo ""
echo "✅ After fix:"
grep -n "import api from" src/contexts/AuthContext.jsx

echo ""
echo "🔍 Verifying the fix worked..."
if grep -q "import api from '../../api'" src/contexts/AuthContext.jsx; then
    echo "❌ Import still not fixed - let's check file content:"
    echo "--- First 10 lines of AuthContext.jsx ---"
    head -10 src/contexts/AuthContext.jsx
    echo "--- Lines containing 'api' ---"
    grep -n "api" src/contexts/AuthContext.jsx | head -5
else
    echo "🎉 Success! Import has been fixed!"
    echo "💡 Now refresh your browser at http://localhost:3002"
fi
