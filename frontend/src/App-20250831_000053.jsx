import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CombinedProviders } from './contexts/CombinedProviders';

// Import from layouts instead of components
import Layout from './layouts/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import components
import SearchSystem from './components/SearchSystem';
import RealTimeNotifications from './components/RealTimeNotifications';
import CustomerPortal from './components/CustomerPortal';

// Import pages
import {
  Dashboard,
  Login,
  Register,
  Landing,
  NotFound,
  Customers,
  CustomerDetail,
  Vehicles,
  VehicleDetail,
  Jobs,
  JobDetail,
  Estimates,
  EstimateDetail,
  Invoices,
  InvoiceDetail,
  AppointmentCalendar,
  Reports,
  Settings,
  AIDiagnostics
} from './pages';

// Additional imports that might be missing from index.js
import PartsLaborManagement from './pages/PartsLaborManagement';
import TimeClock from './pages/TimeClock';
import Inventory from './pages/Inventory';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CombinedProviders>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected app routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="vehicles/:id" element={<VehicleDetail />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="jobs/:id" element={<JobDetail />} />
              <Route path="appointments" element={<AppointmentCalendar />} />
              <Route path="estimates" element={<Estimates />} />
              <Route path="estimates/:id" element={<EstimateDetail />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/:id" element={<InvoiceDetail />} />
              <Route path="parts-labor" element={<PartsLaborManagement />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="ai-diagnostics" element={<AIDiagnostics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="search" element={<SearchSystem />} />
              <Route path="notifications" element={<RealTimeNotifications />} />
              <Route path="profile" element={<CustomerPortal />} />
              <Route path="timeclock" element={<TimeClock />} />
            </Route>
            
            {/* Catch all - redirect to app */}
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </CombinedProviders>
    </QueryClientProvider>
  );
}

export default App;
