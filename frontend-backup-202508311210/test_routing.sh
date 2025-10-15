#!/bin/bash

# A safe, non-destructive script to analyze frontend routes
# and create a temporary component for testing.

echo "🚀 Frontend Routing Test Script"
echo "========================================================"

# --- 1. Find the project's router file ---
PROJECT_ROOT=$(pwd)
SRC_DIR="$PROJECT_ROOT/src"

if [ ! -d "$SRC_DIR" ]; then
    echo "❌ Error: Please run this script from the root of your frontend project."
    echo "   Could not find the './src' directory."
    exit 1
fi

ROUTER_FILES=("$SRC_DIR/App.jsx" "$SRC_DIR/router.jsx" "$SRC_DIR/routes.jsx")
ROUTER_FILE=""
for file in "${ROUTER_FILES[@]}"; do
    if [ -f "$file" ]; then
        ROUTER_FILE="$file"
        break
    fi
done

# --- 2. Analyze existing routes (read-only) ---
echo
echo "## 🔎 Analyzing Existing Routes"
echo "-----------------------------------"
if [ -z "$ROUTER_FILE" ]; then
    echo "⚠️  Could not automatically find your main router file (e.g., App.jsx)."
else
    echo "✅ Found router file at: $ROUTER_FILE"
    echo
    echo "📋 Routes, Links, and NavLinks found:"
    # Use grep with color to highlight important lines
    grep --color=always -n -E '<Route|<Link|<NavLink' "$ROUTER_FILE"
    echo

    echo "🔍 Checking for a 'Not Found' (catch-all) route..."
    if grep -q 'path="\*"' "$ROUTER_FILE"; then
        echo "✅ A 'Not Found' route (path=\"*\") is already present."
    else
        echo "💡 Tip: Consider adding a catch-all route to handle invalid URLs:"
        echo "   <Route path=\"*\" element={<NotFoundPage />} />"
    fi
fi

# --- 3. Create a temporary test component ---
echo
echo "## 📝 Creating a Temporary Test Component"
echo "------------------------------------------"
TEST_COMPONENT_PATH="$SRC_DIR/components/RoutingTestComponent.jsx"

# Create the components directory if it doesn't exist
mkdir -p "$(dirname "$TEST_COMPONENT_PATH")"

# Use a "here document" to write the component file
cat > "$TEST_COMPONENT_PATH" << 'EOF'
// TEMPORARY COMPONENT - SAFE TO DELETE AFTER TESTING

import React from 'react';
import { useLocation } from 'react-router-dom';

const RoutingTestComponent = () => {
  const location = useLocation();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a202c',
      color: 'white',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#48bb78', marginBottom: '1rem' }}>
        ✅ Routing Test Successful!
      </h1>
      <p style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#2d3748',
        borderRadius: '8px',
        fontFamily: 'monospace'
      }}>
        Current Path: <span style={{ color: '#f6ad55' }}>{location.pathname}</span>
      </p>
      <p style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#a0aec0' }}>
        You can now delete this file and remove the test route from your router configuration.
      </p>
    </div>
  );
};

export default RoutingTestComponent;
EOF

echo "✅ Created temporary test component at: $TEST_COMPONENT_PATH"

# --- 4. Provide instructions ---
echo
echo "## 🛠️ How to Test Your Route"
echo "----------------------------"
echo "This script DOES NOT modify your code. Follow these steps:"
echo
echo "1.  Open your router file: ${ROUTER_FILE:-'src/App.jsx'}"
echo
echo "2.  Add this import at the top of the file:"
echo "    ------------------------------------------------------------------"
echo "    import RoutingTestComponent from './components/RoutingTestComponent';"
echo "    ------------------------------------------------------------------"
echo
echo "3.  Add this <Route> inside your <Routes> block:"
echo "    ------------------------------------------------------------------"
echo "    <Route path=\"/test-route\" element={<RoutingTestComponent />} />"
echo "    ------------------------------------------------------------------"
echo
echo "4.  Start your dev server (e.g., 'npm run dev') and visit http://localhost:xxxx/test-route in your browser."

# --- 5. Provide cleanup instructions ---
echo
echo "## 🗑️ Cleanup (Very Important!)"
echo "--------------------------------"
echo "When you are done, remember to REMOVE the changes:"
echo
echo "1.  Delete the test route from your router file."
echo "2.  Delete the import statement from your router file."
echo "3.  Delete the temporary component file by running:"
echo "    rm $TEST_COMPONENT_PATH"
echo
echo "🎉 Script finished."

