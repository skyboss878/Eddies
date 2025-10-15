import { useState, useCallback } from 'react';
import {
  customerService,
  vehicleService,
  jobService,
  estimateService,
  invoiceService,
  appointmentService,
  timeclockService,
  reportsService,
  diagnosticsService
} from "../utils/services";
import migrationService from "../utils/services/migrationServices";
import { showError, showSuccess } from "../utils/toast";

export const useDataOperations = () => {
  const [loading, setLoading] = useState({
    customers: false,
    vehicles: false,
    jobs: false,
    estimates: false,
    invoices: false,
    appointments: false,
    timeclock: false,
    reports: false,
    diagnostics: false,
    analyzeMigration: false,
    importMigration: false
  });

  const setSpecificLoading = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  // Customer operations
  const fetchCustomers = useCallback(async () => {
    setSpecificLoading('customers', true);
    try {
      const response = await customerService.getAll();
      return response.data || response;
    } catch (error) {
      showError('Failed to fetch customers');
      throw error;
    } finally {
      setSpecificLoading('customers', false);
    }
  }, []);

  const createCustomer = useCallback(async (customerData) => {
    setSpecificLoading('customers', true);
    try {
      const response = await customerService.create(customerData);
      showSuccess('Customer created successfully');
      return response;
    } catch (error) {
      showError('Failed to create customer');
      throw error;
    } finally {
      setSpecificLoading('customers', false);
    }
  }, []);

  // Vehicle operations
  const fetchVehicles = useCallback(async () => {
    setSpecificLoading('vehicles', true);
    try {
      const response = await vehicleService.getAll();
      return response.data || response;
    } catch (error) {
      showError('Failed to fetch vehicles');
      throw error;
    } finally {
      setSpecificLoading('vehicles', false);
    }
  }, []);

  const createVehicle = useCallback(async (vehicleData) => {
    setSpecificLoading('vehicles', true);
    try {
      const response = await vehicleService.create(vehicleData);
      showSuccess('Vehicle created successfully');
      return response;
    } catch (error) {
      showError('Failed to create vehicle');
      throw error;
    } finally {
      setSpecificLoading('vehicles', false);
    }
  }, []);

  // Job operations
  const fetchJobs = useCallback(async () => {
    setSpecificLoading('jobs', true);
    try {
      const response = await jobService.getAll();
      return response.data || response;
    } catch (error) {
      showError('Failed to fetch jobs');
      throw error;
    } finally {
      setSpecificLoading('jobs', false);
    }
  }, []);

  const createJob = useCallback(async (jobData) => {
    setSpecificLoading('jobs', true);
    try {
      const response = await jobService.create(jobData);
      showSuccess('Job created successfully');
      return response;
    } catch (error) {
      showError('Failed to create job');
      throw error;
    } finally {
      setSpecificLoading('jobs', false);
    }
  }, []);

  // Estimate operations
  const fetchEstimates = useCallback(async () => {
    setSpecificLoading('estimates', true);
    try {
      const response = await estimateService.getAll();
      return response.data || response;
    } catch (error) {
      showError('Failed to fetch estimates');
      throw error;
    } finally {
      setSpecificLoading('estimates', false);
    }
  }, []);

  const createEstimate = useCallback(async (estimateData) => {
    setSpecificLoading('estimates', true);
    try {
      const response = await estimateService.create(estimateData);
      showSuccess('Estimate created successfully');
      return response;
    } catch (error) {
      showError('Failed to create estimate');
      throw error;
    } finally {
      setSpecificLoading('estimates', false);
    }
  }, []);

  // Invoice operations
  const fetchInvoices = useCallback(async () => {
    setSpecificLoading('invoices', true);
    try {
      const response = await invoiceService.getAll();
      return response.data || response;
    } catch (error) {
      showError('Failed to fetch invoices');
      throw error;
    } finally {
      setSpecificLoading('invoices', false);
    }
  }, []);

  const createInvoice = useCallback(async (invoiceData) => {
    setSpecificLoading('invoices', true);
    try {
      const response = await invoiceService.create(invoiceData);
      showSuccess('Invoice created successfully');
      return response;
    } catch (error) {
      showError('Failed to create invoice');
      throw error;
    } finally {
      setSpecificLoading('invoices', false);
    }
  }, []);

  // Appointment operations
  const fetchAppointments = useCallback(async () => {
    setSpecificLoading('appointments', true);
    try {
      const response = await appointmentService.getAll();
      return response.data || response;
    } catch (error) {
      showError('Failed to fetch appointments');
      throw error;
    } finally {
      setSpecificLoading('appointments', false);
    }
  }, []);

  // Report operations
  const fetchReports = useCallback(async (params = {}) => {
    setSpecificLoading('reports', true);
    try {
      const response = await reportService.getAll(params);
      return response.data || response;
    } catch (error) {
      showError('Failed to fetch reports');
      throw error;
    } finally {
      setSpecificLoading('reports', false);
    }
  }, []);

  // Diagnostics operations
  const fetchDiagnosticsStatus = useCallback(async () => {
    setSpecificLoading('diagnostics', true);
    try {
      const response = await diagnosticsService.getSystemStatus();
      return response;
    } catch (error) {
      showError('Failed to fetch diagnostics status');
      throw error;
    } finally {
      setSpecificLoading('diagnostics', false);
    }
  }, []);

  const runDiagnosticTest = useCallback(async (testType) => {
    setSpecificLoading('diagnostics', true);
    try {
      const response = await diagnosticsService.runTest(testType);
      showSuccess(`Diagnostic test "${testType}" completed`);
      return response;
    } catch (error) {
      showError(`Failed to run diagnostic test: ${testType}`);
      throw error;
    } finally {
      setSpecificLoading('diagnostics', false);
    }
  }, []);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    try {
      await Promise.allSettled([
        fetchCustomers(),
        fetchVehicles(),
        fetchJobs(),
        fetchEstimates(),
        fetchInvoices(),
        fetchAppointments(),
        fetchReports(),
        fetchDiagnosticsStatus()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, [
    fetchCustomers,
    fetchVehicles,
    fetchJobs,
    fetchEstimates,
    fetchInvoices,
    fetchAppointments,
    fetchReports,
    fetchDiagnosticsStatus
  ]);

  return {
    loading,

    // Customer operations
    fetchCustomers,
    createCustomer,
    updateCustomer: async () => {},
    deleteCustomer: async () => {},

    // Vehicle operations
    fetchVehicles,
    createVehicle,
    updateVehicle: async () => {},

    // Job operations
    fetchJobs,
    createJob,
    updateJobStatus: async () => {},

    // Estimate operations
    fetchEstimates,
    createEstimate,

    // Invoice operations
    fetchInvoices,
    createInvoice,

    // Appointment operations
    fetchAppointments,

    // Time clock operations
    getTimeClockStatus: async () => {},
    clockIn: async () => {},
    clockOut: async () => {},

    // Report operations
    fetchReports,

    // Diagnostics operations
    fetchDiagnosticsStatus,
    runDiagnosticTest,

    // Migration operations
    migrationOps: {
      analyze: async (formData) => {
        setSpecificLoading('analyzeMigration', true);
        try {
          const response = await fetch('/api/migration/analyze', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          const result = await response.json();
          if (!response.ok) {
            showError(result.error || 'Analysis failed');
            return { success: false, error: result.error };
          }
          return { success: true, data: result.data };
        } catch (error) {
          showError('Failed to analyze file');
          return { success: false, error: error.message };
        } finally {
          setSpecificLoading('analyzeMigration', false);
        }
      },
      importData: async (data) => {
        setSpecificLoading('importMigration', true);
        try {
          const response = await fetch('/api/migration/import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
          });
          const result = await response.json();
          if (!response.ok) {
            showError(result.error || 'Import failed');
            return { success: false, error: result.error };
          }
          showSuccess('Data imported successfully!');
          return { success: true, data: result.data };
        } catch (error) {
          showError('Failed to import data');
          return { success: false, error: error.message };
        } finally {
          setSpecificLoading('importMigration', false);
        }
      }
    },

    // Utility
    refreshAllData,
    utils: {
      isLoading: (key) => loading[key],
      showMessage: showSuccess
    }
  };
};
