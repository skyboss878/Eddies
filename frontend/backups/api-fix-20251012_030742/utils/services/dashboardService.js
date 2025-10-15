import api from '../api';

export const dashboardService = {
  stats: async () => {
    try {
      const response = await api.get('/api/auth/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Fallback to calculating from existing data
      try {
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
      } catch (fallbackError) {
        console.error('Fallback stats error:', fallbackError);
        return {
          totalCustomers: 0,
          activeJobs: 0,
          totalRevenue: 0,
          unpaidInvoices: 0
        };
      }
    }
  }
};

export default dashboardService;
