#!/bin/bash
# Install only the missing dependencies

cd ~/eddies-askan-automotive/frontend

echo "📦 Installing missing dependencies..."
npm install json2csv jspdf prop-types react-icons

echo "✅ Dependencies installed:"
echo "   - json2csv (CSV export functionality)"
echo "   - jspdf (PDF generation)"
echo "   - prop-types (React prop validation)"
echo "   - react-icons (Font Awesome icons)"
echo ""
echo "💡 Now run the route mapping checker to fix any route issues."
