// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CombinedProviders } from './contexts/CombinedProviders';
import InvoiceDetail from './pages/InvoiceDetail';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Authentication Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Main Dashboard
import Dashboard from './pages/Dashboard';

// Core Management Pages
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';

// Financial Management
import Estimates from './pages/Estimates';
import EstimateDetail from './pages/EstimateDetail';
import Invoices from './pages/Invoices';
import AppointmentCalendar from './pages/AppointmentCalendar';

// Inventory & Parts Management
import PartsLabor from './pages/PartsLaborManagement';

// Reporting & Analytics
import Reports from './pages/Reports';

// AI & Diagnostics
import AIDiagnostics from './pages/AIDiagnostics';

// Settings & Configuration
import Settings from './pages/Settings';

// Utility Pages
import NotFound from './pages/NotFound';
import SearchSystem from './components/SearchSystem';
import RealTimeNotifications from './components/RealTimeNotifications';
import CustomerPortal from './components/CustomerPortal';
import Inventory from './pages/Inventory';

const App = () => {
  return (
    <CombinedProviders>
      <Router>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected App Routes with Layout */}
          <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* Dashboard - Main landing page */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Customer Management */}
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />

            {/* Vehicle Management */}
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:id" element={<VehicleDetail />} />

            {/* Job Management */}
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetail />} />

            {/* Scheduling & Appointments */}
            <Route path="appointments" element={<AppointmentCalendar />} />

            {/* Financial Management */}
            <Route path="estimates" element={<Estimates />} />
            <Route path="estimates/:id" element={<EstimateDetail />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/:id" element={<InvoiceDetail />} />

            {/* Parts & Inventory Management */}
            <Route path="parts-labor" element={<PartsLabor />} />
            <Route path="inventory" element={<Inventory />} />

            {/* AI & Diagnostics */}
            <Route path="ai-diagnostics" element={<AIDiagnostics />} />

            {/* Reports & Analytics */}
            <Route path="reports" element={<Reports />} />

            {/* Settings & Configuration */}
            <Route path="settings" element={<Settings />} />

            {/* Utility Pages */}
            <Route path="search" element={<SearchSystem />} />
            <Route path="notifications" element={<RealTimeNotifications />} />
            <Route path="profile" element={<CustomerPortal />} />

            {/* Catch-all for unknown app routes */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Root redirect to app dashboard */}
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

          {/* Catch-all for unknown routes outside app */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </CombinedProviders>
  );
};

export default App;
