import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import DashboardLayout from '@components/layout/DashboardLayout';
import LoadingSpinner from '@components/ui/LoadingSpinner';

// Pages - Using lazy loading for better performance
const Dashboard = React.lazy(() => import('@components/dashboards/Dashboard'));
const VehicleDiagnostics = React.lazy(() => import('@components/diagnostics/VehicleDiagnostics'));
const CustomerManagement = React.lazy(() => import('@components/customers/CustomerManagement'));
const InventoryManagement = React.lazy(() => import('@components/inventory/InventoryManagement'));
const SchedulingCalendar = React.lazy(() => import('@components/scheduling/SchedulingCalendar'));
const ReportsAnalytics = React.lazy(() => import('@components/reports/ReportsAnalytics'));
const MobileTechApp = React.lazy(() => import('@components/mobile/MobileTechApp'));
const LoginPage = React.lazy(() => import('@components/auth/LoginPage'));

// Services
import { initializeApp } from '@services/appInitialization';
import { useAuthStore } from '@hooks/useAuthStore';

// Styles
import './index.css';

// Create React Query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

const App: React.FC = () => {
  const { isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initializeApp();
      await initialize();
    };
    
    init();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <AnimatePresence mode="wait">
            <Suspense 
              fallback={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center min-h-screen"
                >
                  <LoadingSpinner size="large" />
                </motion.div>
              }
            >
              <Routes>
                {isAuthenticated ? (
                  <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="diagnostics" element={<VehicleDiagnostics />} />
                    <Route path="customers" element={<CustomerManagement />} />
                    <Route path="inventory" element={<InventoryManagement />} />
                    <Route path="scheduling" element={<SchedulingCalendar />} />
                    <Route path="reports" element={<ReportsAnalytics />} />
                    <Route path="mobile" element={<MobileTechApp />} />
                  </Route>
                ) : (
                  <Route path="/*" element={<Navigate to="/login" replace />} />
                )}
                
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
