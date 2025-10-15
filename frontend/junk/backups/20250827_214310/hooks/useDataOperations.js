import { useState, useCallback } from 'react';
import { apiEndpoints } from "../utils";
import { showMessage } from "../utils";

export const useDataOperations = () => {
  const [loading, setLoading] = useState(false);

  const fetchCustomers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await apiEndpoints.customers.getAll(params);
      return response.data;
    } catch (error) {
      showMessage('Failed to fetch customers', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVehicles = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await apiEndpoints.vehicles.getAll(params);
      return response.data;
    } catch (error) {
      showMessage('Failed to fetch vehicles', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobs = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await apiEndpoints.jobs.getAll(params);
      return response.data;
    } catch (error) {
      showMessage('Failed to fetch jobs', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    fetchCustomers,
    fetchVehicles,
    fetchJobs
  };
};
