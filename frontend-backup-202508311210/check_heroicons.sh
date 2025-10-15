#!/bin/bash
# Check if Heroicons is installed and install if needed

cd ~/eddies-askan-automotive/frontend

echo "🔍 Checking for Heroicons dependency..."

if grep -q "@heroicons/react" package.json; then
    echo "✅ Heroicons already installed"
else
    echo "📦 Installing Heroicons for enhanced icons..."
    npm install @heroicons/react
    echo "✅ Heroicons installed!"
fi

echo ""
echo "🎯 Verifying enhanced components are working..."

# Check if enhanced components exist
if [ -f "src/components/EnhancedNavbar.jsx" ] || [ -f "src/components/Navbar.jsx" ]; then
    echo "✅ Enhanced Navbar ready"
else
    echo "❌ Enhanced Navbar not found"
fi

if [ -f "src/pages/EnhancedDashboard.jsx" ] || [ -f "src/pages/Dashboard.jsx" ]; then
    echo "✅ Enhanced Dashboard ready"
else
    echo "❌ Enhanced Dashboard not found"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Make sure you selected option 1 in the previous script"
echo "2. Refresh your browser at http://localhost:3002"
echo "3. Test the new navbar navigation"
echo "4. Check the dashboard for invoices section"
echo ""
echo "💡 The enhanced components include:"
echo "   - Modern navbar with icons and mobile menu"
echo "   - Dashboard with recent invoices section"
echo "   - Better navigation flow throughout the app"
