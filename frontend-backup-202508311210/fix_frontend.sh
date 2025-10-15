#!/usr/bin/env bash
# Fix Frontend Configuration Issues
# Run this in your frontend directory

echo "🔧 Fixing Eddie's Automotive Frontend Configuration..."

# 1. Fix Vite Config - Use TypeScript version and update it
echo "📝 Updating vite.config.ts..."
cat > vite.config.ts <<'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@contexts': path.resolve(__dirname, './src/contexts')
    }
  },
  server: {
    port: 5173, // Match the port your mobile is using
    host: true, // Allow external connections
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your Flask backend
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
EOF

# 2. Remove conflicting vite.config.js
if [ -f "vite.config.js" ]; then
  mv vite.config.js vite.config.js.backup
  echo "✅ Backed up old vite.config.js"
fi

# 3. Fix main.tsx to properly bootstrap the app
echo "📝 Updating main.tsx..."
cat > src/main.tsx <<'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import App from './App'
import './index.css'

// Error boundary for development
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)
EOF

# 4. Remove conflicting main.jsx
if [ -f "src/main.jsx" ]; then
  mv src/main.jsx src/main.jsx.backup
  echo "✅ Backed up old main.jsx"
fi

# 5. Create proper App.tsx
echo "📝 Creating proper App.tsx..."
cat > src/App.tsx <<'EOF'
import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const VehicleList = lazy(() => import('./pages/VehicleList'))
const VehicleDetail = lazy(() => import('./pages/VehicleDetail'))
const AddVehicle = lazy(() => import('./pages/AddVehicle'))
const ViewJobs = lazy(() => import('./pages/ViewJobs'))
const CreateJob = lazy(() => import('./pages/CreateJob'))
const EstimateAI = lazy(() => import('./pages/EstimateAI'))
const CustomerList = lazy(() => import('./pages/CustomerList'))
const CustomerDetail = lazy(() => import('./pages/CustomerDetail'))
const AddAndEditCustomer = lazy(() => import('./pages/AddAndEditCustomer'))
const Invoice = lazy(() => import('./pages/Invoice'))
const Reports = lazy(() => import('./pages/Reports'))
const AppointmentCalendar = lazy(() => import('./pages/AppointmentCalendar'))
const PartsLaborManagement = lazy(() => import('./pages/PartsLaborManagement'))
const Settings = lazy(() => import('./pages/Settings'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Mobile components
const MobileTechApp = lazy(() => import('./components/mobile/MobileTechApp'))

// Data Context
const DataContext = React.createContext<any>(null)

export const useData = () => {
  const context = React.useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [customers, setCustomers] = React.useState([])
  const [vehicles, setVehicles] = React.useState([])
  const [jobs, setJobs] = React.useState([])

  const contextValue = {
    customers,
    vehicles,
    jobs,
    setCustomers,
    setVehicles,
    setJobs
  }

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  )
}

function AppContent() {
  const { user } = useAuth()
  const location = useLocation()

  // Check if we're on mobile route
  const isMobileRoute = location.pathname.startsWith('/mobile')

  return (
    <DataProvider>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoadingSpinner size="large" />
          </div>
        }>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register />} 
            />

            {/* Mobile Tech App Route */}
            <Route path="/mobile" element={<MobileTechApp />} />

            {/* Protected routes with layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Vehicle routes */}
              <Route path="vehicles">
                <Route index element={<VehicleList />} />
                <Route path="add" element={<AddVehicle />} />
                <Route path="new" element={<AddVehicle />} />
                <Route path=":id" element={<VehicleDetail />} />
                <Route path=":id/edit" element={<AddVehicle />} />
              </Route>

              {/* Job routes */}
              <Route path="jobs">
                <Route index element={<ViewJobs />} />
                <Route path="create" element={<CreateJob />} />
                <Route path="new" element={<CreateJob />} />
                <Route path=":id/edit" element={<CreateJob />} />
              </Route>

              {/* Customer routes */}
              <Route path="customers">
                <Route index element={<CustomerList />} />
                <Route path="add" element={<AddAndEditCustomer />} />
                <Route path="new" element={<AddAndEditCustomer />} />
                <Route path=":id" element={<CustomerDetail />} />
                <Route path=":id/edit" element={<AddAndEditCustomer />} />
              </Route>

              {/* Other routes */}
              <Route path="estimates">
                <Route index element={<EstimateAI />} />
                <Route path="ai" element={<EstimateAI />} />
              </Route>

              <Route path="invoices">
                <Route index element={<Invoice />} />
                <Route path=":id" element={<Invoice />} />
              </Route>

              <Route path="appointments" element={<AppointmentCalendar />} />
              <Route path="calendar" element={<AppointmentCalendar />} />
              <Route path="reports" element={<Reports />} />
              <Route path="parts-labor" element={<PartsLaborManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      {/* Global Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px'
          }
        }}
      />
    </DataProvider>
  )
}

const App: React.FC = () => {
  return <AppContent />
}

export default App
EOF

# 6. Update package.json to ensure proper scripts
echo "📝 Updating package.json scripts..."
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="tsc && vite build"
npm pkg set scripts.preview="vite preview"
npm pkg set scripts.start="vite --port 5173"

# 7. Install missing dependencies
echo "📦 Installing missing dependencies..."
npm install @types/react @types/react-dom --save-dev
npm install react-hot-toast --save

# 8. Fix TypeScript config if it exists
if [ -f "tsconfig.json" ]; then
  echo "📝 Updating tsconfig.json..."
  cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@services/*": ["./src/services/*"],
      "@utils/*": ["./src/utils/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"],
      "@pages/*": ["./src/pages/*"],
      "@contexts/*": ["./src/contexts/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF
fi

# 9. Create index.html if missing or fix it
echo "📝 Ensuring proper index.html..."
cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Eddie's Askan Automotive</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

echo "✅ Frontend configuration fixes complete!"
echo ""
echo "🚀 To restart your frontend:"
echo "1. Stop the current dev server (Ctrl+C)"
echo "2. Run: npm run dev"
echo "3. Your app should now be at http://localhost:5173"
echo ""
echo "📱 Mobile Tech App will be available at: http://localhost:5173/mobile"
