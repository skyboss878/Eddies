// src/contexts/DataContext.jsx - Enhanced with AI integration
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import customerService from '../utils/services/customerService';
import vehicleService from '../utils/services/vehicleService';
import jobService from '../utils/services/jobService';
import estimateService from '../utils/services/estimateService';
import invoiceService from '../utils/services/invoiceService';
import appointmentService from '../utils/services/appointmentService';
import { timeclockService, reportService, aiService } from '../utils';
const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState({
    customers: [],
    vehicles: [],
    jobs: [],
    estimates: [],
    invoices: [],
    appointments: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [
        customersResponse,
        vehiclesResponse,
        jobsResponse,
        estimatesResponse,
        invoicesResponse,
        appointmentsResponse
      ] = await Promise.allSettled([
        customerService.getAll(),
        vehicleService.getAll(),
        jobService.getAll(),
        estimateService.getAll(),
        invoiceService.getAll(),
        appointmentService.getAll()
      ]);

      setData({
        customers: customersResponse.status === 'fulfilled' ? customersResponse.value.data : [],
        vehicles: vehiclesResponse.status === 'fulfilled' ? vehiclesResponse.value.data : [],
        jobs: jobsResponse.status === 'fulfilled' ? jobsResponse.value.data : [],
        estimates: estimatesResponse.status === 'fulfilled' ? estimatesResponse.value.data : [],
        invoices: invoicesResponse.status === 'fulfilled' ? invoicesResponse.value.data : [],
        appointments: appointmentsResponse.status === 'fulfilled' ? appointmentsResponse.value.data : []
      });
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err.message || 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateCustomer = useCallback((customerId, updatedData) => {
    setData(prev => ({
      ...prev,
      customers: prev.customers.map(customer => 
        customer.id === customerId ? { ...customer, ...updatedData } : customer
      )
    }));
  }, []);

  const addCustomer = useCallback((newCustomer) => {
    setData(prev => ({
      ...prev,
      customers: [...prev.customers, newCustomer]
    }));
  }, []);

  const removeCustomer = useCallback((customerId) => {
    setData(prev => ({
      ...prev,
      customers: prev.customers.filter(customer => customer.id !== customerId)
    }));
  }, []);

  const updateVehicle = useCallback((vehicleId, updatedData) => {
    setData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle => 
        vehicle.id === vehicleId ? { ...vehicle, ...updatedData } : vehicle
      )
    }));
  }, []);

  const addVehicle = useCallback((newVehicle) => {
    setData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle]
    }));
  }, []);

  const updateJob = useCallback((jobId, updatedData) => {
    setData(prev => ({
      ...prev,
      jobs: prev.jobs.map(job => 
        job.id === jobId ? { ...job, ...updatedData } : job
      )
    }));
  }, []);

  const addJob = useCallback((newJob) => {
    setData(prev => ({
      ...prev,
      jobs: [...prev.jobs, newJob]
    }));
  }, []);

  const value = {
    data,
    loading,
    error,
    setData,
    refreshData,
    // Data manipulation methods
    updateCustomer,
    addCustomer,
    removeCustomer,
    updateVehicle,
    addVehicle,
    updateJob,
    addJob,
    // Services
    customerService,
    vehicleService,
    jobService,
    estimateService,
    invoiceService,
    appointmentService,
    timeclockService,
    reportService,
    aiService,
    clearError: () => setError(null)
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
