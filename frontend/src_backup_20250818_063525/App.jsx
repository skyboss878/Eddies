// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Lazy load pages for better code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const VehicleList = lazy(() => import('./pages/VehicleList'));
const VehicleDetail = lazy(() => import('./pages/VehicleDetail'));
const AddVehicle = lazy(() => import('./pages/AddVehicle'));
const ViewJobs = lazy(() => import('./pages/ViewJobs'));
const CreateJob = lazy(() => import('./pages/CreateJob'));
const EstimateAI = lazy(() => import('./pages/EstimateAI'));
const CustomerList = lazy(() => import('./pages/CustomerList'));
const CustomerDetail = lazy(() => import('./pages/CustomerDetail'));
const AddAndEditCustomer = lazy(() => import('./pages/AddAndEditCustomer'));
const Invoice = lazy(() => import('./pages/Invoice'));
const Reports = lazy(() => import('./pages/Reports'));
const AppointmentCalendar = lazy(() => import('./pages/AppointmentCalendar'));
const PartsLaborManagement = lazy(() => import('./pages/PartsLaborManagement'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes with layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Default redirect */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* Vehicle routes */}
              <Route path="vehicles">
                <Route index element={<VehicleList />} />
                <Route path="add" element={<AddVehicle />} />
                <Route path=":id" element={<VehicleDetail />} />
              </Route>

              {/* Job routes */}
              <Route path="jobs">
                <Route index element={<ViewJobs />} />
                <Route path="create" element={<CreateJob />} />
              </Route>

              {/* Customer routes */}
              <Route path="customers">
                <Route index element={<CustomerList />} />
                <Route path="add" element={<AddAndEditCustomer />} />
                <Route path=":id" element={<CustomerDetail />} />
              </Route>

              {/* Estimate routes */}
              <Route path="estimates">
                <Route path="ai" element={<EstimateAI />} />
              </Route>

              {/* Business routes */}
              <Route path="invoice/:id" element={<Invoice />} />
              <Route path="reports" element={<Reports />} />
              <Route path="calendar" element={<AppointmentCalendar />} />
              <Route path="parts-labor" element={<PartsLaborManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
