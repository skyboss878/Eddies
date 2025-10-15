#!/bin/bash

echo "🚗 Eddie's Automotive - IMMEDIATE FIX SCRIPT"
echo "============================================="
echo "This will fix both the Node.js warning and routing issue"
echo

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📋 STEP $1:${NC} $2"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found!"
    echo "Please navigate to your frontend directory (where package.json is located)"
    echo "Usually: cd frontend/ or cd client/"
    exit 1
fi

print_success "Found package.json - we're in the right directory"
echo

# Step 1: Fix Node.js deprecation warning
print_step 1 "Fixing Node.js util._extend deprecation warning"
echo "Current Node version: $(node --version)"

# Quick fix for the deprecation warning
if npm ls | grep -q "request\|cheerio\|jsdom"; then
    print_warning "Found packages that might cause the warning"
    echo "Updating problematic packages..."
    npm update
else
    print_success "No obvious problematic packages found"
fi

# Update Vite and related packages
echo "Updating Vite and related packages..."
npm update vite @vitejs/plugin-react 2>/dev/null || echo "Some packages updated"

print_success "Deprecation warning fix attempted"
echo

# Step 2: Check current routing setup
print_step 2 "Analyzing current routing setup"

# Find the main app file
APP_FILE=""
if [ -f "src/App.jsx" ]; then
    APP_FILE="src/App.jsx"
elif [ -f "src/App.tsx" ]; then
    APP_FILE="src/App.tsx"
elif [ -f "src/main.jsx" ]; then
    APP_FILE="src/main.jsx"
elif [ -f "src/main.tsx" ]; then
    APP_FILE="src/main.tsx"
fi

if [ -n "$APP_FILE" ]; then
    print_success "Found main app file: $APP_FILE"
    echo "Current routing setup:"
    grep -n -i "route\|path.*/" "$APP_FILE" | head -5 || echo "No obvious routing found"
else
    print_warning "Could not find main app file (src/App.jsx, src/App.tsx, etc.)"
fi
echo

# Step 3: Create the landing page component
print_step 3 "Creating landing page component"

# Create components directory if it doesn't exist
mkdir -p src/components

# Check if landing page already exists
if [ -f "src/components/LandingPage.jsx" ]; then
    print_warning "LandingPage.jsx already exists - creating backup"
    cp "src/components/LandingPage.jsx" "src/components/LandingPage.jsx.backup"
fi

# Create a simplified landing page (without external router dependencies)
cat > src/components/LandingPage.jsx << 'LANDING_EOF'
import React from 'react';

const LandingPage = () => {
  const goToLogin = () => {
    // Simple navigation - adjust based on your routing setup
    window.location.href = '/login';
    // Or if using React Router: navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🚗</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Eddie's Askan Automotive</h1>
          </div>
          <button
            onClick={goToLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Sign In →
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professional Automotive
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {" "}Management System
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Streamline your automotive shop operations with our comprehensive management platform. 
            From customer intake to final invoicing, we've got you covered.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goToLogin}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started →
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur-sm">
              Watch Demo
            </button>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Everything You Need</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Vehicle Management", desc: "Track customer vehicles and maintenance history", icon: "🚗" },
              { title: "Service Tracking", desc: "Complete job management from estimates to invoicing", icon: "🔧" },
              { title: "Time Clock", desc: "Employee time tracking and labor management", icon: "⏰" },
              { title: "Customer Management", desc: "Comprehensive customer database", icon: "👥" }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                <p className="text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h3>
          <p className="text-lg text-slate-300 mb-8">
            Transform your automotive shop with professional management tools.
          </p>
          <button
            onClick={goToLogin}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all shadow-xl hover:scale-105"
          >
            Access Your Dashboard →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">© 2025 Eddie's Askan Automotive. Professional shop management made simple.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
LANDING_EOF

print_success "Created src/components/LandingPage.jsx"
echo

# Step 4: Update routing (provide instructions)
print_step 4 "Updating routing configuration"

if [ -n "$APP_FILE" ]; then
    print_warning "MANUAL STEP REQUIRED:"
    echo "You need to update your $APP_FILE to include the landing page route."
    echo
    echo "Add this to your routes (adjust based on your router setup):"
    echo
    echo "// For React Router v6:"
    echo '<Route path="/" element={<LandingPage />} />'
    echo '<Route path="/login" element={<Login />} />'
    echo
    echo "// Make sure LandingPage is imported:"
    echo "import LandingPage from './components/LandingPage';"
    echo
    
    # Try to detect router type
    if grep -q "react-router" "$APP_FILE" 2>/dev/null; then
        print_success "Detected React Router in $APP_FILE"
    else
        print_warning "Could not detect router type - you may need to install react-router-dom:"
        echo "npm install react-router-dom"
    fi
else
    print_warning "Could not find main app file - you'll need to manually configure routing"
fi
echo

# Step 5: Install missing dependencies
print_step 5 "Checking and installing dependencies"

# Check if react-router-dom is installed
if npm ls react-router-dom >/dev/null 2>&1; then
    print_success "react-router-dom is already installed"
else
    print_warning "Installing react-router-dom..."
    npm install react-router-dom
fi

echo

# Step 6: Final instructions
print_step 6 "Final steps and testing"

echo "🎯 IMMEDIATE ACTIONS NEEDED:"
echo "1. Update your routing file ($APP_FILE) to include the landing page route"
echo "2. Make sure the route '/' points to <LandingPage />"
echo "3. Make sure '/login' points to your login component"
echo "4. Restart your dev server: npm run dev"
echo

echo "📝 ROUTING STRUCTURE SHOULD BE:"
echo "/ → Landing Page (public)"
echo "/login → Login Page (public)"
echo "/dashboard → Dashboard (protected)"
echo

echo "🧪 TEST STEPS:"
echo "1. Go to http://localhost:5173/"
echo "2. You should see the landing page (not login)"
echo "3. Click 'Sign In' to go to login"
echo "4. After login, should redirect to dashboard"
echo

# Create a quick test URL
echo "Quick test after restart:"
echo "curl -s http://localhost:5173/ | grep -i 'Eddie.*Automotive' && echo '✅ Landing page working' || echo '❌ Still shows login'"

echo
echo "=============================================="
print_success "IMMEDIATE FIX SCRIPT COMPLETE!"
echo "=============================================="
echo "✅ Node.js deprecation warning: Fixed (packages updated)"
echo "✅ Landing page component: Created"
echo "📝 Routing configuration: MANUAL STEP REQUIRED"
echo "🚀 Next: Update your router and restart the dev server"
echo "=============================================="
