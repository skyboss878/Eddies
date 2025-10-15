import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Providers
import { CombinedProviders } from './contexts/CombinedProviders';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import AddAndEditCustomer from './pages/AddAndEditCustomer';
import Vehicles from './pages/Vehicles';
import VehicleList from './pages/VehicleList';
import VehicleDetail from './pages/VehicleDetail';
import VehicleForm from './pages/VehicleForm';
import AddVehicle from './pages/AddVehicle';
import Jobs from './pages/Jobs';
import ViewJobs from './pages/ViewJobs';
import JobDetail from './pages/JobDetail';
import CreateJob from './pages/CreateJob';
import Estimates from './pages/Estimates';
import EstimatesList from './pages/EstimatesList';
import EstimateDetail from './pages/EstimateDetail';
import CreateEditEstimate from './pages/CreateEditEstimate';
import EstimateAI from './pages/EstimateAI';
import Invoices from './pages/Invoices';
import Invoice from './pages/Invoice';
import InvoiceDetail from './pages/InvoiceDetail';
import CreateInvoice from './pages/CreateInvoice';
import AppointmentCalendar from './pages/AppointmentCalendar';
import AIDiagnostics from './pages/AIDiagnostics';
import Diagnosis from './pages/Diagnosis';
import Inventory from './pages/Inventory';
import PartsLaborManagement from './pages/PartsLaborManagement';
import TimeClock from './pages/TimeClock';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import DataMigration from './pages/DataMigration';
import Mobile from './pages/Mobile';
import NotFound from './pages/NotFound';

// Layouts
import ProtectedDashboardLayout from './layouts/ProtectedDashboardLayout';

function App() {
  return (
    <CombinedProviders>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/landing" element={<Landing />} />

            {/* Protected dashboard routes */}
            <Route element={<ProtectedDashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Customers */}
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/list" element={<CustomerList />} />
              <Route path="/customers/new" element={<AddAndEditCustomer />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/customers/:id/edit" element={<AddAndEditCustomer />} />

              {/* Vehicles */}
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/list" element={<VehicleList />} />
              <Route path="/vehicles/new" element={<VehicleForm />} />
              <Route path="/vehicles/add" element={<AddVehicle />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
              <Route path="/vehicles/:id/edit" element={<VehicleForm />} />

              {/* Jobs */}
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/list" element={<ViewJobs />} />
              <Route path="/jobs/new" element={<CreateJob />} />
              <Route path="/jobs/:id" element={<JobDetail />} />

              {/* Estimates */}
              <Route path="/estimates" element={<Estimates />} />
              <Route path="/estimates/list" element={<EstimatesList />} />
              <Route path="/estimates/new" element={<CreateEditEstimate />} />
              <Route path="/estimates/ai" element={<EstimateAI />} />
              <Route path="/estimates/:id" element={<EstimateDetail />} />
              <Route path="/estimates/:id/edit" element={<CreateEditEstimate />} />

              {/* Invoices */}
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/new" element={<CreateInvoice />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/invoice" element={<Invoice />} />

              {/* Other dashboard pages */}
              <Route path="/appointments" element={<AppointmentCalendar />} />
              <Route path="/ai-diagnostics" element={<AIDiagnostics />} />
              <Route path="/diagnosis" element={<Diagnosis />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/parts-labor" element={<PartsLaborManagement />} />
              <Route path="/timeclock" element={<TimeClock />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/migration" element={<DataMigration />} />
              <Route path="/mobile" element={<Mobile />} />
            </Route>

            {/* 404 */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </div>
      </Router>
    </CombinedProviders>
  );
}

export default App;
