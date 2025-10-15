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
