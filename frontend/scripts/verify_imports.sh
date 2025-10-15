#!/bin/bash
# Verify all imports are now correct

cd ~/eddies-askan-automotive/frontend

echo "🔍 Verifying Import Status..."
echo "=================================="

# Check for any remaining problematic imports
echo "❌ Checking for bad API imports..."
BAD_API=$(grep -r "import.*from.*\.\./\.\./api" src/ | grep -v backup | wc -l)
if [ "$BAD_API" -gt 0 ]; then
    echo "⚠️  Found $BAD_API bad API imports:"
    grep -r "import.*from.*\.\./\.\./api" src/ | grep -v backup
else
    echo "✅ No bad API imports found!"
fi

echo ""
echo "❌ Checking for incorrect context imports (non-auth)..."
BAD_CONTEXT=$(grep -r "import.*from.*\.\./\.\./contexts" src/ | grep -v "components/auth/" | grep -v backup | wc -l)
if [ "$BAD_CONTEXT" -gt 0 ]; then
    echo "⚠️  Found $BAD_CONTEXT bad context imports:"
    grep -r "import.*from.*\.\./\.\./contexts" src/ | grep -v "components/auth/" | grep -v backup
else
    echo "✅ No bad context imports found!"
fi

echo ""
echo "✅ Checking good imports..."
GOOD_API=$(grep -r "import.*from.*\.\./utils/api" src/ | grep -v backup | wc -l)
GOOD_CONTEXT=$(grep -r "import.*from.*\.\./contexts/" src/ | grep -v backup | wc -l)
AUTH_CONTEXT=$(grep -r "import.*from.*\.\./\.\./contexts/AuthContext" src/components/auth/ | grep -v backup | wc -l)

echo "✅ Good API imports: $GOOD_API"
echo "✅ Good context imports: $GOOD_CONTEXT"
echo "✅ Correct auth context imports: $AUTH_CONTEXT"

echo ""
echo "🚀 Current Status:"
echo "=================================="
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
echo ""

if [ "$BAD_API" -eq 0 ] && [ "$BAD_CONTEXT" -eq 0 ]; then
    echo "🎉 ALL IMPORTS LOOK GOOD!"
    echo "💡 Your app should now work without import errors"
    echo "💡 Open http://localhost:5173 in your browser to test"
else
    echo "⚠️  Some import issues remain - see details above"
fi
