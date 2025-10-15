#!/bin/bash

# Eddie's Automotive - Landing Page Setup Script
# This script ensures your backup landing page shows up at the root URL
# and all components are properly connected

echo "🚗 Eddie's Automotive Landing Page Setup Script"
echo "=============================================="

# Get the current directory
PROJECT_ROOT=$(pwd)
SRC_DIR="$PROJECT_ROOT/src"
PAGES_DIR="$SRC_DIR/pages"

# Check if we're in the right directory
if [ ! -d "$SRC_DIR" ] || [ ! -f "$PAGES_DIR/Landing_backup.jsx" ]; then
    echo "❌ Error: Please run this script from your frontend project root directory"
    echo "   Expected structure: ./src/pages/Landing_backup.jsx"
    exit 1
fi

echo "📁 Project root: $PROJECT_ROOT"
echo "📄 Found Landing_backup.jsx"

# Backup current Landing.jsx if it exists
if [ -f "$PAGES_DIR/Landing.jsx" ]; then
    BACKUP_NAME="Landing.jsx.backup.$(date +%Y%m%d_%H%M%S)"
    echo "📦 Backing up current Landing.jsx to $BACKUP_NAME"
    cp "$PAGES_DIR/Landing.jsx" "$PAGES_DIR/$BACKUP_NAME"
fi

# Replace Landing.jsx with Landing_backup.jsx
echo "🔄 Setting up backup landing page as main landing page..."
cp "$PAGES_DIR/Landing_backup.jsx" "$PAGES_DIR/Landing.jsx"
echo "✅ Landing.jsx updated with backup content"

# Check and update App.jsx routing
APP_JSX="$SRC_DIR/App.jsx"
if [ -f "$APP_JSX" ]; then
    echo "🔧 Checking App.jsx routing..."
    
    # Check if Landing route exists
    if grep -q "path=\"/\"" "$APP_JSX" && grep -q "Landing" "$APP_JSX"; then
        echo "✅ Landing page route found in App.jsx"
    else
        echo "⚠️  Landing page route may need to be configured in App.jsx"
        echo "   Make sure you have: <Route path=\"/\" element={<Landing />} />"
    fi
else
    echo "⚠️  App.jsx not found at expected location: $APP_JSX"
fi

# Check main.jsx or index.js for proper setup
MAIN_FILES=("$SRC_DIR/main.jsx" "$SRC_DIR/index.js" "$SRC_DIR/main.js")
MAIN_FILE=""

for file in "${MAIN_FILES[@]}"; do
    if [ -f "$file" ]; then
        MAIN_FILE="$file"
        break
    fi
done

if [ -n "$MAIN_FILE" ]; then
    echo "📋 Checking main entry file: $(basename "$MAIN_FILE")"
    
    if grep -q "AuthProvider\|CombinedProviders" "$MAIN_FILE"; then
        echo "✅ Authentication providers found"
    else
        echo "⚠️  Make sure AuthProvider is set up in $(basename "$MAIN_FILE")"
    fi
else
    echo "⚠️  Main entry file not found"
fi

# Create a simple routing verification
echo "🧪 Creating route verification..."

# Check if we have the necessary context files
CONTEXTS_DIR="$SRC_DIR/contexts"
REQUIRED_CONTEXTS=("AuthContext.jsx" "DataContext.jsx")

echo "🔍 Verifying contexts..."
for context in "${REQUIRED_CONTEXTS[@]}"; do
    if [ -f "$CONTEXTS_DIR/$context" ]; then
        echo "✅ $context found"
    else
        echo "❌ $context missing"
    fi
done

# Create a simple test component to verify routing
echo "📝 Creating route test component..."
cat > "$SRC_DIR/components/RouteTest.jsx" << 'EOF'
// Route Test Component - Remove after verification
import React from 'react';

const RouteTest = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#000',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      🚗 Landing Page Active
    </div>
  );
};

export default RouteTest;
EOF

echo "✅ Route test component created"

# Update Landing.jsx to include the test component temporarily
echo "🔧 Adding test indicator to Landing.jsx..."
if ! grep -q "RouteTest" "$PAGES_DIR/Landing.jsx"; then
    # Add import at the top
    sed -i '1i import RouteTest from "../components/RouteTest";' "$PAGES_DIR/Landing.jsx"
    
    # Add component before closing div in return statement
    sed -i 's/<\/>/&\n      <RouteTest \/>/g' "$PAGES_DIR/Landing.jsx"
    
    echo "✅ Test indicator added to Landing.jsx"
fi

# Check package.json for required dependencies
if [ -f "$PROJECT_ROOT/package.json" ]; then
    echo "📦 Checking dependencies..."
    
    REQUIRED_DEPS=("react-router-dom" "axios")
    for dep in "${REQUIRED_DEPS[@]}"; do
        if grep -q "\"$dep\":" "$PROJECT_ROOT/package.json"; then
            echo "✅ $dep found in package.json"
        else
            echo "❌ $dep missing from package.json"
        fi
    done
else
    echo "⚠️  package.json not found"
fi

# Create a simple API health check script
echo "🏥 Creating API health check..."
cat > "$PROJECT_ROOT/check_api.js" << 'EOF'
// Simple API Health Check
const axios = require('axios');

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function checkAPI() {
    try {
        console.log('🔍 Checking API at:', API_URL);
        const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
        console.log('✅ API is healthy:', response.data);
        return true;
    } catch (error) {
        console.log('❌ API check failed:', error.message);
        return false;
    }
}

checkAPI().then(healthy => {
    process.exit(healthy ? 0 : 1);
});
EOF

echo "✅ API health check script created"

# Create environment file template if it doesn't exist
ENV_FILE="$PROJECT_ROOT/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "📄 Creating .env template..."
    cat > "$ENV_FILE" << 'EOF'
# Eddie's Automotive Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Eddie's Automotive
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ .env template created"
else
    echo "✅ .env file already exists"
fi

# Create a development start script
echo "🚀 Creating development scripts..."
cat > "$PROJECT_ROOT/dev-start.sh" << 'EOF'
#!/bin/bash
echo "🚗 Starting Eddie's Automotive Development Server..."

# Check if API is running
if ! curl -s http://localhost:5000/api/health > /dev/null; then
    echo "⚠️  Backend API not detected at localhost:5000"
    echo "   Make sure your backend is running first!"
fi

# Start the frontend
npm run dev
EOF

chmod +x "$PROJECT_ROOT/dev-start.sh"
echo "✅ Development start script created"

# Summary
echo ""
echo "🎉 Landing Page Setup Complete!"
echo "================================"
echo "✅ Landing_backup.jsx copied to Landing.jsx"
echo "✅ Route test component added"
echo "✅ API health check script created"
echo "✅ Development scripts created"
echo ""
echo "📋 Next Steps:"
echo "1. Run: npm install (if dependencies are missing)"
echo "2. Make sure your backend is running on port 5000"
echo "3. Run: npm run dev (or ./dev-start.sh)"
echo "4. Visit: http://localhost:3000 (or your dev port)"
echo ""
echo "🧪 Test Commands:"
echo "- Check API: node check_api.js"
echo "- Start dev: ./dev-start.sh"
echo ""
echo "📁 Files Created/Modified:"
echo "- Landing.jsx (updated with backup content)"
echo "- RouteTest.jsx (temporary test component)"
echo "- check_api.js (API health check)"
echo "- dev-start.sh (development startup script)"
echo "- .env (if it didn't exist)"
echo ""
echo "🗑️  Cleanup (run after verification):"
echo "- Remove RouteTest.jsx"
echo "- Remove RouteTest import from Landing.jsx"
echo "- Remove check_api.js if not needed"
echo ""
echo "🚗 Your Eddie's Automotive landing page should now load at the root URL!"
EOF
