// src/contexts/DataContext.jsx - Fixed to work with your API
import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  customers_get, 
  vehicles_get, 
  jobs_get, 
  estimates_get,
  invoices_get,
  appointments_get 
} from "../utils/api";
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [state, setState] = useState({
    customers: [],
    vehicles: [],
    jobs: [],
    estimates: [],
    invoices: [],
    appointments: [],
    loading: {
      customers: false,
      vehicles: false,
      jobs: false,
      estimates: false,
      invoices: false,
      appointments: false
    },
    errors: {},
    lastFetch: {}
  });

  const setLoading = useCallback((resource, loading) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [resource]: loading }
    }));
  }, []);

  const setError = useCallback((resource, error) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [resource]: error }
    }));
  }, []);

  const fetchCustomers = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;

    setLoading('customers', true);
    setError('customers', null);
    
    try {
      const response = await customers_get(params);
      setState(prev => ({ 
        ...prev, 
        customers: response.data,
        lastFetch: { ...prev.lastFetch, customers: new Date() }
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch customers';
      setError('customers', errorMsg);
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading('customers', false);
    }
  }, [isAuthenticated, setLoading, setError]);

  const fetchVehicles = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;

    setLoading('vehicles', true);
    setError('vehicles', null);
    
    try {
      const response = await vehicles_get(params);
      setState(prev => ({ 
        ...prev, 
        vehicles: response.data,
        lastFetch: { ...prev.lastFetch, vehicles: new Date() }
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch vehicles';
      setError('vehicles', errorMsg);
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading('vehicles', false);
    }
  }, [isAuthenticated, setLoading, setError]);

  const fetchJobs = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;

    setLoading('jobs', true);
    setError('jobs', null);
    
    try {
      const response = await jobs_get(params);
      setState(prev => ({ 
        ...prev, 
        jobs: response.data,
        lastFetch: { ...prev.lastFetch, jobs: new Date() }
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch jobs';
      setError('jobs', errorMsg);
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading('jobs', false);
    }
  }, [isAuthenticated, setLoading, setError]);

  const fetchEstimates = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;

    setLoading('estimates', true);
    setError('estimates', null);
    
    try {
      const response = await estimates_get(params);
      setState(prev => ({ 
        ...prev, 
        estimates: response.data,
        lastFetch: { ...prev.lastFetch, estimates: new Date() }
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch estimates';
      setError('estimates', errorMsg);
      console.error('Failed to fetch estimates:', error);
    } finally {
      setLoading('estimates', false);
    }
  }, [isAuthenticated, setLoading, setError]);

  const fetchInvoices = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;

    setLoading('invoices', true);
    setError('invoices', null);
    
    try {
      const response = await invoices_get(params);
      setState(prev => ({ 
        ...prev, 
        invoices: response.data,
        lastFetch: { ...prev.lastFetch, invoices: new Date() }
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch invoices';
      setError('invoices', errorMsg);
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading('invoices', false);
    }
  }, [isAuthenticated, setLoading, setError]);

  const fetchAppointments = useCallback(async (params = {}) => {
    if (!isAuthenticated) return;

    setLoading('appointments', true);
    setError('appointments', null);
    
    try {
      const response = await appointments_get(params);
      setState(prev => ({ 
        ...prev, 
        appointments: response.data,
        lastFetch: { ...prev.lastFetch, appointments: new Date() }
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch appointments';
      setError('appointments', errorMsg);
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading('appointments', false);
    }
  }, [isAuthenticated, setLoading, setError]);

  // Helper to refresh all data
  const refreshAllData = useCallback(async () => {
    if (!isAuthenticated) return;

    await Promise.allSettled([
      fetchCustomers(),
      fetchVehicles(),
      fetchJobs(),
      fetchEstimates(),
      fetchInvoices(),
      fetchAppointments()
    ]);
  }, [isAuthenticated, fetchCustomers, fetchVehicles, fetchJobs, fetchEstimates, fetchInvoices, fetchAppointments]);

  // Clear data on logout
  const clearData = useCallback(() => {
    setState({
      customers: [],
      vehicles: [],
      jobs: [],
      estimates: [],
      invoices: [],
      appointments: [],
      loading: {
        customers: false,
        vehicles: false,
        jobs: false,
        estimates: false,
        invoices: false,
        appointments: false
      },
      errors: {},
      lastFetch: {}
    });
  }, []);

  const value = {
    // State
    ...state,
    
    // Actions
    fetchCustomers,
    fetchVehicles,
    fetchJobs,
    fetchEstimates,
    fetchInvoices,
    fetchAppointments,
    refreshAllData,
    clearData,
    
    // Utilities
    setLoading,
    setError
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
