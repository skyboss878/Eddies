import { useState, useEffect } from 'react';
import { useDataOperations } from './useDataOperations';

export const useShopData = () => {
  const dataOps = useDataOperations();
  
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [estimates, setEstimates] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a Map of customers for quick lookup
  const customersMap = new Map(
    customers.map(customer => [customer.id, customer])
  );

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [customersData, vehiclesData, jobsData, estimatesData, invoicesData, appointmentsData] = 
          await Promise.all([
            dataOps.fetchCustomers().catch(() => []),
            dataOps.fetchVehicles().catch(() => []),
            dataOps.fetchJobs().catch(() => []),
            dataOps.fetchEstimates().catch(() => []),
            dataOps.fetchInvoices().catch(() => []),
            dataOps.fetchAppointments().catch(() => [])
          ]);

        setCustomers(customersData || []);
        setVehicles(vehiclesData || []);
        setJobs(jobsData || []);
        setEstimates(estimatesData || []);
        setInvoices(invoicesData || []);
        setAppointments(appointmentsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [customersData, vehiclesData, jobsData] = await Promise.all([
        dataOps.fetchCustomers().catch(() => []),
        dataOps.fetchVehicles().catch(() => []),
        dataOps.fetchJobs().catch(() => [])
      ]);
      
      setCustomers(customersData || []);
      setVehicles(vehiclesData || []);
      setJobs(jobsData || []);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    vehicles,
    jobs,
    estimates,
    invoices,
    appointments,
    customersMap,
    loading,
    error,
    refreshData,
    vehicleOps: dataOps,
    utils: dataOps.utils
  };
};
