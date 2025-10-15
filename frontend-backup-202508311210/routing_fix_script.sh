#!/bin/bash

# Eddie's Automotive - Routing Configuration Fix Script
# Ensures your App.jsx has proper routing setup for the landing page

echo "🔧 Eddie's Automotive Routing Fix Script"
echo "========================================"

PROJECT_ROOT=$(pwd)
SRC_DIR="$PROJECT_ROOT/src"
APP_JSX="$SRC_DIR/App.jsx"

# Check if App.jsx exists
if [ ! -f "$APP_JSX" ]; then
    echo "❌ App.jsx not found at: $APP_JSX"
    echo "Creating a complete App.jsx with proper routing..."
    
    cat > "$APP_JSX" << 'EOF'
// src/App.jsx - Eddie's Automotive Main App Component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Import pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Vehicles from './pages/Vehicles';
import Jobs from './pages/Jobs';
import Estimates from './pages/Estimates';
import NotFound from './pages/NotFound';

// Import layouts
import Layout from './layouts/Layout';
import ProtectedLayout from './layouts/ProtectedLayout';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading Eddie's Automotive...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <DataProvider>
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                </ProtectedRoute>
              </DataProvider>
            } />
            
            <Route path="/customers/*" element={
              <DataProvider>
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Routes>
                      <Route index element={<Customers />} />
                      <Route path="add" element={<AddAndEditCustomer />} />
                      <Route path=":id" element={<CustomerDetail />} />
                      <Route path=":id/edit" element={<AddAndEditCustomer />} />
                    </Routes>
                  </ProtectedLayout>
                </ProtectedRoute>
              </DataProvider>
            } />
            
            <Route path="/vehicles/*" element={
              <DataProvider>
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Routes>
                      <Route index element={<Vehicles />} />
                      <Route path="add" element={<AddVehicle />} />
                      <Route path=":id" element={<VehicleDetail />} />
                    </Routes>
                  </ProtectedLayout>
                </ProtectedRoute>
              </DataProvider>
            } />
            
            <Route path="/jobs/*" element={
              <DataProvider>
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Routes>
                      <Route index element={<Jobs />} />
                      <Route path="create" element={<CreateJob />} />
                      <Route path=":id" element={<JobDetail />} />
                    </Routes>
                  </ProtectedLayout>
                </ProtectedRoute>
              </DataProvider>
            } />
            
            <Route path="/estimates/*" element={
              <DataProvider>
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Routes>
                      <Route index element={<Estimates />} />
                      <Route path="create" element={<CreateEditEstimate />} />
                      <Route path=":id" element={<EstimateDetail />} />
                    </Routes>
                  </ProtectedLayout>
                </ProtectedRoute>
              </DataProvider>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
EOF
    
    echo "✅ Complete App.jsx created with proper routing"
else
    echo "📄 Found existing App.jsx, checking routing..."
    
    # Check if it has the landing page route
    if ! grep -q 'path="/"' "$APP_JSX" || ! grep -q 'Landing' "$APP_JSX"; then
        echo "🔧 Adding/fixing landing page route..."
        
        # Backup existing App.jsx
        BACKUP_NAME="App.jsx.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$APP_JSX" "$SRC_DIR/$BACKUP_NAME"
        echo "📦 Backed up existing App.jsx to $BACKUP_NAME"
        
        # Create the fixed version
        cat > "$APP_JSX" << 'EOF'
// src/App.jsx - Eddie's Automotive Main App Component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Import pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Import layouts
import ProtectedLayout from './layouts/ProtectedLayout';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading Eddie's Automotive...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes - Landing page at root */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <DataProvider>
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                </ProtectedRoute>
              </DataProvider>
            } />
            
            {/* Add other protected routes here */}
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
EOF
        echo "✅ App.jsx updated with proper landing page routing"
    else
        echo "✅ Landing page route already configured"
    fi
fi

# Check main.jsx/index.js setup
MAIN_FILES=("$SRC_DIR/main.jsx" "$SRC_DIR/index.js" "$SRC_DIR/main.js")
MAIN_FILE=""

for file in "${MAIN_FILES[@]}"; do
    if [ -f "$file" ]; then
        MAIN_FILE="$file"
        break
    fi
done

if [ -n "$MAIN_FILE" ]; then
    echo "🔍 Checking main entry file: $(basename "$MAIN_FILE")"
    
    if ! grep -q 'import.*App.*from.*./App' "$MAIN_FILE"; then
        echo "🔧 Fixing main entry file..."
        
        # Backup
        BACKUP_NAME="$(basename "$MAIN_FILE").backup.$(date +%Y%m%d_%H%M%S)"
        cp "$MAIN_FILE" "$SRC_DIR/$BACKUP_NAME"
        
        # Create proper main.jsx
        cat > "$MAIN_FILE" << 'EOF'
// src/main.jsx - Eddie's Automotive Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF
        echo "✅ Main entry file updated"
    else
        echo "✅ Main entry file looks good"
    fi
else
    echo "📝 Creating main.jsx entry file..."
    cat > "$SRC_DIR/main.jsx" << 'EOF'
// src/main.jsx - Eddie's Automotive Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF
    echo "✅ main.jsx created"
fi

# Check if index.css exists
if [ ! -f "$SRC_DIR/index.css" ]; then
    echo "🎨 Creating basic index.css..."
    cat > "$SRC_DIR/index.css" << 'EOF'
/* Eddie's Automotive - Base Styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

/* Custom animations for Eddie's Automotive */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 2s infinite;
}
EOF
    echo "✅ index.css created"
fi

# Check vite.config.js
VITE_CONFIG="$PROJECT_ROOT/vite.config.js"
if [ ! -f "$VITE_CONFIG" ]; then
    echo "⚙️  Creating vite.config.js..."
    cat > "$VITE_CONFIG" << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 3000
  }
})
EOF
    echo "✅ vite.config.js created"
fi

echo ""
echo "🎉 Routing Configuration Complete!"
echo "================================="
echo "✅ App.jsx configured with proper routing"
echo "✅ Landing page route: / → Landing component"
echo "✅ Main entry file configured"
echo "✅ Basic CSS and Vite config created"
echo ""
echo "📋 Route Structure:"
echo "   / → Landing (your backup landing page)"
echo "   /login → Login page"
echo "   /register → Register page"
echo "   /dashboard → Dashboard (protected)"
echo ""
echo "🚀 Ready to start development server!"
EOF
