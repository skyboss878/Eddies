import api from '../api';

export const stats = async () => {
  try {
    const response = await api.get('/api/auth/dashboard/stats');
    return response.data;
  } catch (error) {
    // Fallback to calculating from existing data
    const [customers, jobs, invoices] = await Promise.all([
      api.get('/api/auth/customers'),
      api.get('/api/auth/jobs'), 
      api.get('/api/auth/invoices')
    ]);
    
    return {
      totalCustomers: customers.data?.length || 0,
      activeJobs: jobs.data?.filter(j => j.status === 'active')?.length || 0,
      totalRevenue: invoices.data?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
      unpaidInvoices: invoices.data?.filter(inv => inv.status !== 'paid')?.length || 0
    };
  }
};

export default { stats };
