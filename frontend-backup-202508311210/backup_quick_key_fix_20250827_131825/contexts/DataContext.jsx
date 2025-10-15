import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiEndpoints } from "../utils";
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [state, setState] = useState({
    customers: [],
    vehicles: [],
    jobs: [],
    estimates: [],
    loading: {
      customers: false,
      vehicles: false,
      jobs: false,
      estimates: false
    },
    errors: {}
  });

  const setLoading = useCallback((resource, loading) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [resource]: loading }
    }));
  }, []); // Fixed: removed state dependency

  const fetchCustomers = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading('customers', true);
    try {
      const response = await apiEndpoints.customers.getAll();
      setState(prev => ({ ...prev, customers: response.data }));
    } catch (error) {
    } finally {
      setLoading('customers', false);
    }
  }, [isAuthenticated, setLoading]);

  const value = {
    ...state,
    fetchCustomers,
    setLoading
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
