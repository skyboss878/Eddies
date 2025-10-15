// src/hooks/useDataOperations.js - Enterprise-Grade Data Management Hook
import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../utils/api';

export const useDataOperations = () => {
  // Core data state with proper initialization
  const [customersMap, setCustomersMap] = useState(new Map());
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesMap, setVehiclesMap] = useState(new Map());
  const [estimates, setEstimates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Loading state management
  const setLoading = useCallback((key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  // Enhanced notification system for production
  const addNotification = useCallback((message, type = 'info') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Notification: [${type.toUpperCase()}] ${message}`);
    
    // In production, this would integrate with your toast system
    // toast.show({ message, type, timestamp });
    
    // Store in session for debugging (optional)
    if (typeof window !== 'undefined') {
      const notifications = JSON.parse(sessionStorage.getItem('app_notifications') || '[]');
      notifications.push({ message, type, timestamp });
      sessionStorage.setItem('app_notifications', JSON.stringify(notifications.slice(-50))); // Keep last 50
    }
  }, []);

  // Enhanced utilities with error handling
  const utils = useMemo(() => ({
    isLoading: (key) => Boolean(loadingStates[key]),
    addNotification,
    showMessage: addNotification, // Alias for compatibility
    hasError: Boolean(error),
    lastUpdated: lastFetch,
    clearError: () => setError(null),
    // Performance monitoring
    getLoadingStates: () => loadingStates,
    // Data validation helpers
    isDataReady: () => customersMap.size > 0 && vehicles.length > 0,
  }), [loadingStates, addNotification, error, lastFetch, customersMap, vehicles]);

  // Enhanced data fetching with retry logic
  const fetchData = useCallback(async (retryCount = 0) => {
    const maxRetries = 3;
    setLoading('initialData', true);
    setError(null);
    
    try {
      console.log(`🔄 Fetching shop data... (attempt ${retryCount + 1})`);
      
      const [customersRes, vehiclesRes, estimatesRes, jobsRes] = await Promise.all([
        apiClient.get('/customers/').catch(err => ({ data: [] })), // Graceful fallback
        apiClient.get('/vehicles/').catch(err => ({ data: [] })),
        apiClient.get('/financials/estimates').catch(err => ({ data: [] })),
        apiClient.get('/service/jobs').catch(err => ({ data: [] }))
      ]);

      // Safely process customer data
      const customers = Array.isArray(customersRes.data) ? customersRes.data : [];
      setCustomersMap(new Map(customers.map(c => [c.id, c])));

      // Safely process vehicle data
      const vehicleData = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : [];
      setVehicles(vehicleData);
      setVehiclesMap(new Map(vehicleData.map(v => [v.id, v])));

      // Safely process estimates and jobs
      setEstimates(Array.isArray(estimatesRes.data) ? estimatesRes.data : []);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);

      setLastFetch(new Date().toISOString());
      console.log(`✅ Shop data loaded successfully`);
      
    } catch (error) {
      console.error('❌ Failed to fetch shop data:', error);
      
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => fetchData(retryCount + 1), 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        setError(`Failed to load shop data after ${maxRetries} attempts. Please check your connection.`);
        addNotification('Failed to fetch initial shop data. Some features may not work properly.', 'error');
      }
    } finally {
      setLoading('initialData', false);
    }
  }, [setLoading, addNotification]);

  // Auto-refresh data every 5 minutes for real-time updates
  useEffect(() => {
    fetchData();
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing shop data...');
      fetchData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchData]);

  // Enhanced job enrichment with proper null checks
  const enrichedJobs = useMemo(() => {
    // ✅ Fixed: Proper null checks to prevent undefined errors
    if (!Array.isArray(jobs) || jobs.length === 0 || vehiclesMap.size === 0 || customersMap.size === 0) {
      return [];
    }

    return jobs.map(job => {
      const vehicle = vehiclesMap.get(job.vehicle_id || job.vehicleId);
      const customer = vehicle ? customersMap.get(vehicle.customer_id || vehicle.customerId) : null;
      
      return {
        ...job,
        vehicleInfo: vehicle 
          ? `${vehicle.year || 'Unknown'} ${vehicle.make || 'Unknown'} ${vehicle.model || 'Unknown'}`.trim()
          : 'Unknown Vehicle',
        customerName: customer?.name || 'Unknown Customer',
        vehicleId: job.vehicle_id || job.vehicleId,
        customerId: vehicle?.customer_id || vehicle?.customerId,
      };
    });
  }, [jobs, vehiclesMap, customersMap]);

  // Enhanced customer operations with optimistic updates
  const customerOps = {
    create: async (data) => {
      setLoading('createCustomer', true);
      try {
        const response = await apiClient.post('/customers/', data);
        const newCustomer = response.data;
        
        // Optimistic update
        setCustomersMap(prev => new Map(prev).set(newCustomer.id, newCustomer));
        addNotification('Customer created successfully!', 'success');
        
        return { success: true, data: newCustomer };
      } catch (error) {
        console.error('Customer creation failed:', error);
        addNotification('Failed to create customer. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading('createCustomer', false);
      }
    },

    update: async (id, data) => {
      setLoading(`updateCustomer_${id}`, true);
      try {
        const response = await apiClient.put(`/customers/${id}`, data);
        const updatedCustomer = response.data;
        
        // Optimistic update
        setCustomersMap(prev => new Map(prev).set(id, updatedCustomer));
        addNotification('Customer updated successfully!', 'success');
        
        return { success: true, data: updatedCustomer };
      } catch (error) {
        console.error('Customer update failed:', error);
        addNotification('Failed to update customer. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading(`updateCustomer_${id}`, false);
      }
    },

    delete: async (id) => {
      setLoading(`deleteCustomer_${id}`, true);
      try {
        await apiClient.delete(`/customers/${id}`);
        
        // Optimistic update
        setCustomersMap(prev => {
          const newMap = new Map(prev);
          newMap.delete(id);
          return newMap;
        });
        
        // Also remove related vehicles
        setVehicles(prev => prev.filter(v => v.customer_id !== id && v.customerId !== id));
        
        addNotification('Customer deleted successfully.', 'success');
        return { success: true };
      } catch (error) {
        console.error('Customer deletion failed:', error);
        addNotification('Failed to delete customer. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading(`deleteCustomer_${id}`, false);
      }
    },
  };

  // Enhanced vehicle operations
  const vehicleOps = {
    create: async (data) => {
      setLoading('createVehicle', true);
      try {
        const response = await apiClient.post('/vehicles/', data);
        const newVehicle = response.data;
        
        // Optimistic updates
        setVehicles(prev => [newVehicle, ...prev]);
        setVehiclesMap(prev => new Map(prev).set(newVehicle.id, newVehicle));
        
        addNotification('Vehicle added successfully!', 'success');
        return { success: true, data: newVehicle };
      } catch (error) {
        console.error('Vehicle creation failed:', error);
        addNotification('Failed to add vehicle. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading('createVehicle', false);
      }
    },

    update: async (id, data) => {
      setLoading(`updateVehicle_${id}`, true);
      try {
        const response = await apiClient.put(`/vehicles/${id}`, data);
        const updatedVehicle = response.data;
        
        // Optimistic updates
        setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v));
        setVehiclesMap(prev => new Map(prev).set(id, updatedVehicle));
        
        addNotification('Vehicle updated successfully!', 'success');
        return { success: true, data: updatedVehicle };
      } catch (error) {
        console.error('Vehicle update failed:', error);
        addNotification('Failed to update vehicle. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading(`updateVehicle_${id}`, false);
      }
    },

    delete: async (id) => {
      setLoading(`deleteVehicle_${id}`, true);
      try {
        await apiClient.delete(`/vehicles/${id}`);
        
        // Optimistic updates
        setVehicles(prev => prev.filter(v => v.id !== id));
        setVehiclesMap(prev => {
          const newMap = new Map(prev);
          newMap.delete(id);
          return newMap;
        });
        
        addNotification('Vehicle deleted successfully.', 'success');
        return { success: true };
      } catch (error) {
        console.error('Vehicle deletion failed:', error);
        addNotification('Failed to delete vehicle. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading(`deleteVehicle_${id}`, false);
      }
    },
  };

  // Enhanced estimate operations
  const estimateOps = {
    create: async (estimateData) => {
      setLoading('createEstimate', true);
      try {
        const response = await apiClient.post('/financials/estimates', estimateData);
        const newEstimate = response.data;
        
        setEstimates(prev => [newEstimate, ...prev]);
        addNotification('Estimate created successfully!', 'success');
        
        return { success: true, data: newEstimate };
      } catch (error) {
        console.error('Estimate creation failed:', error);
        addNotification('Failed to create estimate. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading('createEstimate', false);
      }
    },

    update: async (id, estimateData) => {
      setLoading(`updateEstimate_${id}`, true);
      try {
        const response = await apiClient.put(`/financials/estimates/${id}`, estimateData);
        const updatedEstimate = response.data;
        
        setEstimates(prev => prev.map(e => e.id === id ? updatedEstimate : e));
        addNotification('Estimate updated successfully!', 'success');
        
        return { success: true, data: updatedEstimate };
      } catch (error) {
        console.error('Estimate update failed:', error);
        addNotification('Failed to update estimate. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading(`updateEstimate_${id}`, false);
      }
    },

    delete: async (id) => {
      setLoading(`deleteEstimate_${id}`, true);
      try {
        await apiClient.delete(`/financials/estimates/${id}`);
        
        setEstimates(prev => prev.filter(e => e.id !== id));
        addNotification('Estimate deleted successfully.', 'success');
        
        return { success: true };
      } catch (error) {
        console.error('Estimate deletion failed:', error);
        addNotification('Failed to delete estimate. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading(`deleteEstimate_${id}`, false);
      }
    },
  };

  // Enhanced AI operations with better error handling
  const aiOps = {
    generateEstimate: async (aiRequest) => {
      setLoading('generateAiEstimate', true);
      try {
        console.log('🤖 Generating AI estimate...');
        const response = await apiClient.post('/ai/generate-estimate', aiRequest);
        
        let parsedEstimate;
        try {
          parsedEstimate = JSON.parse(response.data.estimate);
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          throw new Error('Invalid AI response format');
        }
        
        addNotification('AI estimate generated successfully!', 'success');
        return { success: true, data: parsedEstimate };
      } catch (error) {
        console.error('AI generation failed:', error);
        const errorMessage = error.response?.data?.error || error.message || 'AI generation failed';
        addNotification(`AI generation failed: ${errorMessage}`, 'error');
        return { success: false, error };
      } finally {
        setLoading('generateAiEstimate', false);
      }
    },

    generateDiagnosis: async (symptoms, vehicleData = {}) => {
      setLoading('generateAiDiagnosis', true);
      try {
        console.log('🔧 Generating AI diagnosis...');
        const response = await apiClient.post('/ai/diagnosis', {
          symptoms,
          vehicle: vehicleData,
          timestamp: new Date().toISOString()
        });
        
        addNotification('AI diagnosis completed!', 'success');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('AI diagnosis failed:', error);
        addNotification('AI diagnosis temporarily unavailable. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading('generateAiDiagnosis', false);
      }
    }
  };

  // Enhanced job operations with comprehensive CRUD
  const jobOps = {
    create: async (jobData) => {
      setLoading('createJob', true);
      try {
        const enrichedJobData = {
          ...jobData,
          created_at: new Date().toISOString(),
          status: jobData.status || 'Pending'
        };
        
        const response = await apiClient.post('/service/jobs', enrichedJobData);
        const newJob = response.data;
        
        setJobs(prev => [newJob, ...prev]);
        addNotification('Work order created successfully!', 'success');
        
        return { success: true, data: newJob };
      } catch (error) {
        console.error('Job creation failed:', error);
        addNotification('Failed to create work order. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading('createJob', false);
      }
    },

    update: async (jobId, jobData) => {
      setLoading(`updateJob_${jobId}`, true);
      try {
        const enrichedJobData = {
          ...jobData,
          updated_at: new Date().toISOString()
        };
        
        const response = await apiClient.put(`/service/jobs/${jobId}`, enrichedJobData);
        const updatedJob = response.data;
        
        setJobs(prev => prev.map(j => j.id === parseInt(jobId) ? updatedJob : j));
        addNotification('Work order updated successfully!', 'success');
        
        return { success: true, data: updatedJob };
      } catch (error) {
        console.error('Job update failed:', error);
        addNotification('Failed to update work order. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading(`updateJob_${jobId}`, false);
      }
    },

    delete: async (jobId) => {
      setLoading(`deleteJob_${jobId}`, true);
      try {
        await apiClient.delete(`/service/jobs/${jobId}`);
        
        setJobs(prev => prev.filter(j => j.id !== parseInt(jobId)));
        addNotification('Work order deleted successfully.', 'success');
        
        return { success: true };
      } catch (error) {
        console.error('Job deletion failed:', error);
        addNotification('Failed to delete work order. Please try again.', 'error');
        return { success: false, error };
      } finally {
        setLoading(`deleteJob_${jobId}`, false);
      }
    },

    diagnose: async (description) => {
      setLoading('diagnoseJob', true);
      try {
        const response = await apiClient.post('/ai/generate-estimate', {
          customer_complaint: description,
          vin: 'DIAGNOSTIC_REQUEST',
          request_type: 'diagnosis'
        });
        
        let parsed;
        try {
          parsed = JSON.parse(response.data.estimate);
        } catch (parseError) {
          // Fallback for simple text response
          parsed = { diagnosis: response.data.estimate || response.data.diagnosis };
        }
        
        return { success: true, data: { diagnosis: parsed.ai_diagnosis_summary || parsed.diagnosis } };
      } catch (error) {
        console.error('AI diagnosis failed:', error);
        addNotification('AI diagnosis temporarily unavailable.', 'error');
        return { success: false, error };
      } finally {
        setLoading('diagnoseJob', false);
      }
    }
  };

  // Data migration operations for enterprise features
  const migrationOps = {
    analyze: async (formData) => {
      setLoading('analyzeMigration', true);
      try {
        const response = await apiClient.post('/data/analyze', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        addNotification('File analysis completed!', 'success');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Migration analysis failed:', error);
        addNotification('Failed to analyze file. Please check format.', 'error');
        return { success: false, error };
      } finally {
        setLoading('analyzeMigration', false);
      }
    },

    importData: async (importData) => {
      setLoading('importMigration', true);
      try {
        const response = await apiClient.post('/data/import', importData);
        
        // Refresh all data after successful import
        await fetchData();
        
        addNotification(`Data imported successfully! ${response.data.message}`, 'success');
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Data import failed:', error);
        addNotification('Data import failed. Please check your file and mappings.', 'error');
        return { success: false, error };
      } finally {
        setLoading('importMigration', false);
      }
    }
  };

  // Reporting operations for business intelligence
  const reportOps = {
    getDailySummary: async (date) => {
      setLoading('getDailySummary', true);
      try {
        const response = await apiClient.get(`/reports/daily/${date}`);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Daily report failed:', error);
        addNotification('Failed to generate daily report.', 'error');
        return { success: false, error };
      } finally {
        setLoading('getDailySummary', false);
      }
    },

    getPeriodSummary: async (dateRange) => {
      setLoading('getPeriodSummary', true);
      try {
        const response = await apiClient.post('/reports/period', dateRange);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Period report failed:', error);
        addNotification('Failed to generate period report.', 'error');
        return { success: false, error };
      } finally {
        setLoading('getPeriodSummary', false);
      }
    }
  };

  // Return comprehensive data operations interface
  return {
    // Core data state
    customersMap,
    customers: Array.from(customersMap.values()),
    vehicles,
    vehiclesMap,
    estimates,
    jobs,
    enrichedJobs,

    // Operations
    customerOps,
    vehicleOps,
    estimateOps,
    aiOps,
    jobOps,
    migrationOps,
    reportOps,

    // Utilities and meta information
    utils,
    loading: utils.isLoading('initialData'),
    error,
    
    // Performance and debugging info
    stats: {
      customersCount: customersMap.size,
      vehiclesCount: vehicles.length,
      estimatesCount: estimates.length,
      jobsCount: jobs.length,
      lastFetch
    },

    // Manual refresh capability
    refreshData: () => fetchData(),
  };
};
