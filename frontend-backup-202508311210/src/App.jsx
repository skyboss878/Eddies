// src/App.jsx - Complete App Component with Routing
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import apiEndpoints from './utils/api';

// Import all pages
import {
  Dashboard,
  Login,
  Register,
  Landing,
  NotFound,
  Customers,
  CustomerDetail,
  CustomerList,
  AddAndEditCustomer,
  Vehicles,
  VehicleDetail,
  VehicleList,
  VehicleForm,
  AddVehicle,
  Jobs,
  JobDetail,
  CreateJob,
  ViewJobs,
  Estimates,
  EstimateDetail,
  EstimatesList,
  CreateEditEstimate,
  Invoices,
  Invoice,
  InvoiceDetail,
  CreateInvoice,
  AppointmentCalendar,
  Reports,
  Settings,
  AIDiagnostics,
  Diagnosis,
  PartsLaborManagement,
  Inventory,
  TimeClock,
  DataMigration,
  Mobile
} from './pages';

// Layout components
import Navbar from './components/Navbar';
import AppointmentBar from './components/AppointmentBar';
import TimeClockNavbar from './components/TimeClockNavbar';
import GlobalToastDisplay from './components/GlobalToastDisplay';
import ErrorBoundaryWithAuth from './components/ErrorBoundaryWithAuth';
import LoadingSpinner from './components/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/app/dashboard" replace /> : children;
};

// Main App Layout for authenticated routes
const AppLayout = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await apiEndpoints.settings.shop.get();
        setSettings(response.data);
      } catch (error) {
        console.error('Failed to load shop settings:', error);
        // Set default settings if API fails
        setSettings({
          shop: {
            name: "Eddie's Automotive",
            phone: "(661) 555-0123",
            address: "123 Main Street, Bakersfield, CA 93301"
          }
        });
      } finally {
        setSettingsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  if (settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TimeClockNavbar settings={settings} />
      <AppointmentBar />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <GlobalToastDisplay />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundaryWithAuth>
      <Router>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Landing />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Protected App Routes */}
              <Route 
                path="/app/*" 
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        {/* Dashboard Routes */}
                        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        
                        {/* Customer Routes */}
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/customers/add" element={<AddAndEditCustomer />} />
                        <Route path="/customers/list" element={<CustomerList />} />
                        <Route path="/customers/:id" element={<CustomerDetail />} />
                        <Route path="/customers/:id/edit" element={<AddAndEditCustomer />} />
                        
                        {/* Vehicle Routes */}
                        <Route path="/vehicles" element={<Vehicles />} />
                        <Route path="/vehicles/add" element={<AddVehicle />} />
                        <Route path="/vehicles/list" element={<VehicleList />} />
                        <Route path="/vehicles/:id" element={<VehicleDetail />} />
                        <Route path="/vehicles/:id/edit" element={<VehicleForm />} />
                        
                        {/* Job Routes */}
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/jobs/create" element={<CreateJob />} />
                        <Route path="/jobs/view" element={<ViewJobs />} />
                        <Route path="/jobs/:id" element={<JobDetail />} />
                        <Route path="/jobs/:id/edit" element={<CreateJob />} />
                        
                        {/* Estimate Routes */}
                        <Route path="/estimates" element={<Estimates />} />
                        <Route path="/estimates/create" element={<CreateEditEstimate />} />
                        <Route path="/estimates/list" element={<EstimatesList />} />
                        <Route path="/estimates/ai" element={<AIDiagnostics />} />
                        <Route path="/estimates/:id" element={<EstimateDetail />} />
                        <Route path="/estimates/:id/edit" element={<CreateEditEstimate />} />
                        
                        {/* Invoice Routes */}
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/invoices/create" element={<CreateInvoice />} />
                        <Route path="/invoices/:id" element={<InvoiceDetail />} />
                        <Route path="/invoices/:id/edit" element={<CreateInvoice />} />
                        
                        {/* Appointment Routes */}
                        <Route path="/appointments" element={<AppointmentCalendar />} />
                        <Route path="/appointments/calendar" element={<AppointmentCalendar />} />
                        
                        {/* Parts & Inventory Routes */}
                        <Route path="/parts" element={<PartsLaborManagement />} />
                        <Route path="/inventory" element={<Inventory />} />
                        
                        {/* AI & Diagnostics Routes */}
                        <Route path="/ai-diagnostics" element={<AIDiagnostics />} />
                        <Route path="/diagnosis" element={<Diagnosis />} />
                        
                        {/* Time Management Routes */}
                        <Route path="/timeclock" element={<TimeClock />} />
                        
                        {/* Reports & Analytics Routes */}
                        <Route path="/reports" element={<Reports />} />
                        
                        {/* Settings & Configuration Routes */}
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/migration" element={<DataMigration />} />
                        
                        {/* Mobile Routes */}
                        <Route path="/mobile" element={<Mobile />} />
                        
                        {/* Legacy route redirects */}
                        <Route path="/customer-list" element={<Navigate to="/app/customers/list" replace />} />
                        <Route path="/vehicle-list" element={<Navigate to="/app/vehicles/list" replace />} />
                        <Route path="/estimate-list" element={<Navigate to="/app/estimates/list" replace />} />
                        
                        {/* Catch-all for undefined app routes */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Legacy redirects */}
              <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/customers" element={<Navigate to="/app/customers" replace />} />
              <Route path="/vehicles" element={<Navigate to="/app/vehicles" replace />} />
              <Route path="/jobs" element={<Navigate to="/app/jobs" replace />} />
              <Route path="/estimates" element={<Navigate to="/app/estimates" replace />} />
              <Route path="/invoices" element={<Navigate to="/app/invoices" replace />} />
              <Route path="/appointments" element={<Navigate to="/app/appointments" replace />} />
              <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
              <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
              
              {/* Catch-all for all other routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundaryWithAuth>
  );
}

export default App;
