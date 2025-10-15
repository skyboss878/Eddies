#!/bin/bash

echo "=== Frontend Diagnostics ==="
echo "Checking React + Vite frontend for common issues..."
echo ""

PROJECT_DIR="$HOME/eddies-askan-automotive"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# Check if directories exist
echo "1. Directory Structure Check:"
if [ -d "$FRONTEND_DIR" ]; then
    echo "✓ Frontend directory exists: $FRONTEND_DIR"
else
    echo "✗ Frontend directory missing: $FRONTEND_DIR"
    exit 1
fi

if [ -d "$FRONTEND_DIR/src" ]; then
    echo "✓ Src directory exists"
else
    echo "✗ Src directory missing"
fi

if [ -d "$FRONTEND_DIR/public" ]; then
    echo "✓ Public directory exists"
else
    echo "✗ Public directory missing"
fi

if [ -d "$FRONTEND_DIR/node_modules" ]; then
    echo "✓ Node modules directory exists"
else
    echo "✗ Node modules directory missing - need to run npm install"
fi

echo ""

# Check package.json
echo "2. Package Configuration Check:"
if [ -f "$FRONTEND_DIR/package.json" ]; then
    echo "✓ package.json exists"
    
    # Check for essential dependencies
    if grep -q '"react"' "$FRONTEND_DIR/package.json"; then
        echo "✓ React dependency found"
    else
        echo "✗ React dependency missing"
    fi
    
    if grep -q '"vite"' "$FRONTEND_DIR/package.json"; then
        echo "✓ Vite found"
    else
        echo "✗ Vite missing"
    fi
    
    if grep -q '"axios"' "$FRONTEND_DIR/package.json"; then
        echo "✓ Axios found for API calls"
    else
        echo "? Axios not found - may need for API calls"
    fi
    
    # Check scripts
    if grep -q '"dev"' "$FRONTEND_DIR/package.json"; then
        echo "✓ Dev script found"
    else
        echo "✗ Dev script missing"
    fi
    
    if grep -q '"build"' "$FRONTEND_DIR/package.json"; then
        echo "✓ Build script found"
    else
        echo "✗ Build script missing"
    fi
    
else
    echo "✗ package.json missing"
fi

echo ""

# Check main entry files
echo "3. Entry Files Check:"
if [ -f "$FRONTEND_DIR/index.html" ]; then
    echo "✓ index.html exists"
else
    echo "✗ index.html missing"
fi

if [ -f "$FRONTEND_DIR/src/main.jsx" ]; then
    echo "✓ main.jsx exists"
elif [ -f "$FRONTEND_DIR/src/index.js" ]; then
    echo "✓ index.js exists"
else
    echo "✗ Main entry file missing"
fi

if [ -f "$FRONTEND_DIR/src/App.jsx" ]; then
    echo "✓ App.jsx exists"
elif [ -f "$FRONTEND_DIR/src/App.js" ]; then
    echo "✓ App.js exists"
else
    echo "✗ App component missing"
fi

echo ""

# Check for common import issues
echo "4. Import Issues Check:"

# Check for missing file extensions
echo "Checking for imports without extensions..."
if find "$FRONTEND_DIR/src" -name "*.jsx" -o -name "*.js" | xargs grep -l "from ['\"]\..*[^\.jsx?]['\"]" 2>/dev/null; then
    echo "✗ Found imports without proper extensions"
else
    echo "✓ No missing extension issues found"
fi

# Check for mixed import styles
echo "Checking for mixed import/export styles..."
if find "$FRONTEND_DIR/src" -name "*.jsx" -o -name "*.js" | xargs grep -l "module\.exports\|require(" 2>/dev/null; then
    echo "✗ Found CommonJS imports/exports (should use ES6)"
else
    echo "✓ No CommonJS import issues found"
fi

echo ""

# Check configuration files
echo "5. Configuration Files Check:"
if [ -f "$FRONTEND_DIR/vite.config.js" ]; then
    echo "✓ vite.config.js exists"
    
    # Check for proxy configuration
    if grep -q "proxy" "$FRONTEND_DIR/vite.config.js"; then
        echo "✓ Proxy configuration found"
    else
        echo "? No proxy configuration found - may need for API calls"
    fi
else
    echo "✗ vite.config.js missing"
fi

if [ -f "$FRONTEND_DIR/tailwind.config.js" ]; then
    echo "✓ tailwind.config.js exists"
else
    echo "? tailwind.config.js missing (if using Tailwind)"
fi

if [ -f "$FRONTEND_DIR/.env" ] || [ -f "$FRONTEND_DIR/.env.local" ]; then
    echo "✓ Environment file found"
else
    echo "? No environment files found"
fi

echo ""

# Check for API configuration
echo "6. API Configuration Check:"
if [ -f "$FRONTEND_DIR/src/config/api.js" ] || [ -f "$FRONTEND_DIR/src/config/config.js" ]; then
    echo "✓ API config file found"
else
    echo "? No API config file found"
fi

# Check for hardcoded API URLs
echo "Checking for hardcoded API URLs..."
if find "$FRONTEND_DIR/src" -name "*.jsx" -o -name "*.js" | xargs grep -l "localhost:\|127\.0\.0\.1:\|http://.*:" 2>/dev/null; then
    echo "? Found potential hardcoded API URLs"
    find "$FRONTEND_DIR/src" -name "*.jsx" -o -name "*.js" | xargs grep -n "localhost:\|127\.0\.0\.1:\|http://.*:" 2>/dev/null | head -5
else
    echo "✓ No obvious hardcoded URLs found"
fi

echo ""

# Check for broken components
echo "7. Component Structure Check:"
echo "Checking for broken or missing component imports..."

# Look for import errors
if find "$FRONTEND_DIR/src" -name "*.jsx" -o -name "*.js" | xargs grep -l "import.*from.*['\"]\./" 2>/dev/null; then
    echo "Checking relative imports..."
    # This is a complex check, so we'll just note it
    echo "? Found relative imports - verify they point to existing files"
else
    echo "✓ No obvious relative import issues"
fi

echo ""

# Check for build artifacts
echo "8. Build Artifacts Check:"
if [ -d "$FRONTEND_DIR/dist" ]; then
    echo "? Build directory exists - may need to clean"
else
    echo "✓ No build directory (clean slate)"
fi

if [ -f "$FRONTEND_DIR/package-lock.json" ]; then
    echo "✓ package-lock.json exists"
else
    echo "? package-lock.json missing"
fi

echo ""

# Check Node/npm versions
echo "9. Environment Check:"
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js installed: $NODE_VERSION"
else
    echo "✗ Node.js not found"
fi

if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm installed: $NPM_VERSION"
else
    echo "✗ npm not found"
fi

echo ""

# Quick syntax check
echo "10. Quick Syntax Check:"
echo "Checking for common syntax errors..."

# Check for missing semicolons or common errors (basic check)
if find "$FRONTEND_DIR/src" -name "*.jsx" -o -name "*.js" | xargs grep -l "import.*{$" 2>/dev/null; then
    echo "? Found incomplete import statements"
else
    echo "✓ No obvious import syntax issues"
fi

echo ""
echo "=== End Frontend Diagnostics ==="
echo ""
echo "Run the frontend fix script to automatically resolve common issues."
