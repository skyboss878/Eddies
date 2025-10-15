import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  DollarSign, Truck, Users, Wrench, FileText,
  AlertTriangle, Clock, Search, Plus, TrendingUp,
  Calendar, Bell, Settings
} from 'lucide-react';

// Import components
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardCard from '../components/DashboardCard';
import SearchSystem from '../components/SearchSystem';
import RealTimeNotifications from '../components/RealTimeNotifications';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    customers,
    vehicles,
    jobs,
    estimates,
    invoices,
    appointments,
    loading,
    refreshAllData,
    fetchCustomers,
    fetchVehicles,
    fetchJobs,
    fetchEstimates,
    fetchInvoices,
    fetchAppointments
  } = useData();

  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    totalVehicles: 0,
    activeJobs: 0,
    pendingEstimates: 0,
    unpaidInvoices: 0,
    totalRevenue: 0,
    todayAppointments: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('invoices');
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Refresh data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (refreshAllData) {
          await refreshAllData();
        } else {
          // Fallback: fetch individual data
          await Promise.allSettled([
            fetchCustomers?.(),
            fetchVehicles?.(),
            fetchJobs?.(),
            fetchEstimates?.(),
            fetchInvoices?.(),
            fetchAppointments?.()
          ]);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [refreshAllData, fetchCustomers, fetchVehicles, fetchJobs, fetchEstimates, fetchInvoices, fetchAppointments]);

  // Calculate dashboard stats
  useEffect(() => {
    const calculateStats = () => {
      // Safely handle arrays that might be null/undefined
      const customerCount = Array.isArray(customers) ? customers.length : 0;
      const vehicleCount = Array.isArray(vehicles) ? vehicles.length : 0;

      const activeJobsCount = Array.isArray(jobs)
        ? jobs.filter(j => ['in_progress', 'active', 'assigned', 'started'].includes(j.status?.toLowerCase())).length
        : 0;

      const pendingEstimatesCount = Array.isArray(estimates)
        ? estimates.filter(e => ['pending', 'draft', 'sent'].includes(e.status?.toLowerCase())).length
        : 0;

      const unpaidInvoicesCount = Array.isArray(invoices)
        ? invoices.filter(i => !['paid', 'completed'].includes(i.status?.toLowerCase())).length
        : 0;

      const totalRevenue = Array.isArray(invoices)
        ? invoices
            .filter(i => ['paid', 'completed'].includes(i.status?.toLowerCase()))
            .reduce((sum, i) => sum + parseFloat(i.total_amount || i.total || 0), 0)
        : 0;

      // Calculate today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayAppointmentsCount = Array.isArray(appointments)
        ? appointments.filter(a => {
            const aptDate = new Date(a.scheduled_date || a.date || a.created_at).toISOString().split('T')[0];
            return aptDate === today;
          }).length
        : 0;

      setDashboardStats({
        totalCustomers: customerCount,
        totalVehicles: vehicleCount,
        activeJobs: activeJobsCount,
        pendingEstimates: pendingEstimatesCount,
        unpaidInvoices: unpaidInvoicesCount,
        totalRevenue: totalRevenue,
        todayAppointments: todayAppointmentsCount
      });
    };

    // Only calculate if not loading
    const isLoading = Object.values(loading || {}).some(Boolean);
    if (!isLoading) {
      calculateStats();
    }
  }, [customers, vehicles, jobs, estimates, invoices, appointments, loading]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = [];

    // Search customers
    if (Array.isArray(customers)) {
      const customerResults = customers
        .filter(c =>
          (c.name && c.name.toLowerCase().includes(term)) ||
          (c.phone && c.phone.includes(term)) ||
          (c.email && c.email.toLowerCase().includes(term))
        )
        .slice(0, 5)
        .map(c => ({
          type: 'Customer',
          id: c.id,
          name: c.name || 'Unnamed Customer',
          details: c.phone || c.email || 'No contact info',
          path: `/app/customers/${c.id}`
        }));
      results.push(...customerResults);
    }

    // Search vehicles
    if (Array.isArray(vehicles)) {
      const vehicleResults = vehicles
        .filter(v =>
          (v.license_plate && v.license_plate.toLowerCase().includes(term)) ||
          (v.vin && v.vin.toLowerCase().includes(term)) ||
          (v.make && v.make.toLowerCase().includes(term)) ||
          (v.model && v.model.toLowerCase().includes(term)) ||
          (v.year && v.year.toString().includes(term))
        )
        .slice(0, 5)
        .map(v => ({
          type: 'Vehicle',
          id: v.id,
          name: `${v.year || ''} ${v.make || ''} ${v.model || ''}`.trim() || 'Unknown Vehicle',
          details: v.license_plate || v.vin || 'No plate/VIN',
          path: `/app/vehicles/${v.id}`
        }));
      results.push(...vehicleResults);
    }

    // Search jobs
    if (Array.isArray(jobs)) {
      const jobResults = jobs
        .filter(j =>
          j.id.toString().includes(term) ||
          (j.title && j.title.toLowerCase().includes(term)) ||
          (j.description && j.description.toLowerCase().includes(term))
        )
        .slice(0, 5)
        .map(j => ({
          type: 'Job',
          id: j.id,
          name: `Job #${j.id}${j.title ? ' - ' + j.title : ''}`,
          details: (j.description || 'No description').substring(0, 40) + '...',
          path: `/app/jobs/${j.id}`
        }));
      results.push(...jobResults);
    }

    setSearchResults(results);
  }, [searchTerm, customers, vehicles, jobs]);

  // Smart alerts
  const smartAlerts = useMemo(() => {
    const isLoading = Object.values(loading || {}).some(Boolean);
    if (isLoading) {
      return { inactiveCustomers: [], overdueInvoices: [], pendingEstimates: [], upcomingJobs: [] };
    }

    const oneDay = 1000 * 60 * 60 * 24;
    const now = new Date();

    const inactiveCustomers = (Array.isArray(customers) && Array.isArray(jobs)) ?
      customers.filter(c => {
        const customerJobs = jobs.filter(j => j.customer_id === c.id);
        if (customerJobs.length === 0) return true;

        const lastJob = customerJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
        return (now - new Date(lastJob.created_at)) / oneDay > 90;
      }).slice(0, 5) : [];

    const overdueInvoices = Array.isArray(invoices) ?
      invoices
        .filter(inv => !['paid', 'completed'].includes(inv.status?.toLowerCase()) && 
                (now - new Date(inv.created_at)) / oneDay > 30)
        .slice(0, 5) : [];

    const pendingEstimates = Array.isArray(estimates) ?
      estimates.filter(est => ['pending', 'draft', 'sent'].includes(est.status?.toLowerCase())).slice(0, 5) : [];

    const upcomingJobs = Array.isArray(jobs) ?
      jobs.filter(job => {
        if (!job.scheduled_date && !job.scheduled_at && !job.created_at) return false;
        const jobDate = new Date(job.scheduled_date || job.scheduled_at || job.created_at);
        const diff = (jobDate - now) / oneDay;
        return diff >= 0 && diff <= 1;
      }).slice(0, 5) : [];

    return { inactiveCustomers, overdueInvoices, pendingEstimates, upcomingJobs };
  }, [customers, jobs, invoices, estimates, loading]);

  // Recent items
  const recentItems = useMemo(() => {
    const sortByDate = (arr, dateField = 'created_at') => Array.isArray(arr)
      ? [...arr].sort((a, b) => new Date(b[dateField] || b.created_at) - new Date(a[dateField] || a.created_at)).slice(0, 5)
      : [];

    return {
      invoices: sortByDate(invoices),
      jobs: sortByDate(jobs),
      estimates: sortByDate(estimates),
      appointments: sortByDate(appointments, 'scheduled_date')
    };
  }, [invoices, jobs, estimates, appointments]);

  const stats = [
    { 
      name: 'Total Customers', 
      value: dashboardStats.totalCustomers, 
      icon: Users, 
      color: 'bg-blue-500', 
      href: '/app/customers',
      trend: '+12% from last month'
    },
    { 
      name: 'Total Vehicles', 
      value: dashboardStats.totalVehicles, 
      icon: Truck, 
      color: 'bg-green-500', 
      href: '/app/vehicles',
      trend: '+8% from last month'
    },
    { 
      name: 'Active Jobs', 
      value: dashboardStats.activeJobs, 
      icon: Wrench, 
      color: 'bg-yellow-500', 
      href: '/app/jobs',
      trend: 'In progress'
    },
    { 
      name: 'Pending Estimates', 
      value: dashboardStats.pendingEstimates, 
      icon: FileText, 
      color: 'bg-purple-500', 
      href: '/app/estimates',
      trend: 'Awaiting approval'
    },
    { 
      name: 'Unpaid Invoices', 
      value: dashboardStats.unpaidInvoices, 
      icon: AlertTriangle, 
      color: 'bg-red-500', 
      href: '/app/invoices',
      trend: dashboardStats.unpaidInvoices > 0 ? 'Action needed' : 'All current'
    },
    { 
      name: 'Total Revenue', 
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-indigo-500', 
      href: '/app/reports',
      trend: '+15% from last month'
    },
    {
      name: "Today's Appointments",
      value: dashboardStats.todayAppointments,
      icon: Calendar,
      color: 'bg-cyan-500',
      href: '/app/appointments',
      trend: new Date().toLocaleDateString()
    }
  ];

  // Show loading state
  const isLoading = Object.values(loading || {}).some(Boolean);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header + Search + Notifications */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || user?.name || user?.username || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening at Eddie's Automotive today
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Search className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Search...</span>
          </button>
          
          {/* Notifications */}
          <RealTimeNotifications />
          
          {/* Settings Quick Access */}
          <Link
            to="/app/settings"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map(stat => (
          <DashboardCard
            key={stat.name}
            title={stat.name}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            href={stat.href}
            trend={stat.trend}
            className="hover:shadow-lg transition-shadow duration-300"
          />
        ))}
      </div>

      {/* Smart Alerts */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-bold text-gray-900">Smart Actions</h3>
        </div>
        
        <div className="space-y-3">
          {smartAlerts.inactiveCustomers.map(c => (
            <div key={`inactive-${c.id}`} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Customer <strong>{c.name}</strong> has been inactive for 90+ days
                </span>
              </div>
              <Link 
                to={`/app/customers/${c.id}`} 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Contact
              </Link>
            </div>
          ))}
          
          {smartAlerts.overdueInvoices.map(inv => (
            <div key={`overdue-${inv.id}`} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">
                  Invoice #{inv.id} has been unpaid for 30+ days
                </span>
              </div>
              <Link 
                to={`/app/invoices/${inv.id}`} 
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Follow Up
              </Link>
            </div>
          ))}
          
          {smartAlerts.pendingEstimates.map(est => (
            <div key={`pending-${est.id}`} className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-800">
                  Estimate #{est.id} is awaiting customer approval
                </span>
              </div>
              <Link 
                to={`/app/estimates/${est.id}`} 
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Review
              </Link>
            </div>
          ))}
          
          {smartAlerts.upcomingJobs.map(job => (
            <div key={`upcoming-${job.id}`} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Job #{job.id} is scheduled for today
                </span>
              </div>
              <Link 
                to={`/app/jobs/${job.id}`} 
                className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
              >
                Prepare
              </Link>
            </div>
          ))}
          
          {Object.values(smartAlerts).every(arr => arr.length === 0) && (
            <div className="text-center p-6 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No urgent actions needed right now. Great job!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Items Tabs */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <div className="flex border-b">
            {['invoices', 'jobs', 'estimates', 'appointments'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize transition-colors ${
                  activeTab === tab 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          {activeTab === 'invoices' && (
            recentItems.invoices.length > 0 ? recentItems.invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <span className="font-medium">Invoice #{inv.id}</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      ['paid', 'completed'].includes(inv.status?.toLowerCase()) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inv.status || 'pending'}
                    </span>
                    {inv.total_amount && (
                      <span className="ml-2 text-sm text-gray-600">
                        ${parseFloat(inv.total_amount || inv.total || 0).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <Link to={`/app/invoices/${inv.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </Link>
              </div>
            )) : (
              <p className="text-gray-500 p-4 text-center">No recent invoices found.</p>
            )
          )}
          
          {activeTab === 'jobs' && (
            recentItems.jobs.length > 0 ? recentItems.jobs.map(job => (
              <div key={job.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Wrench className="h-4 w-4 text-blue-600" />
                  <div>
                    <span className="font-medium">Job #{job.id}</span>
                    {job.title && <span className="ml-2 text-gray-600">- {job.title}</span>}
                    <div className="text-sm text-gray-500">
                      {job.description ? job.description.substring(0, 50) + '...' : 'No description'}
                    </div>
                  </div>
                </div>
                <Link to={`/app/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </Link>
              </div>
            )) : (
              <p className="text-gray-500 p-4 text-center">No recent jobs found.</p>
            )
          )}
          
          {activeTab === 'estimates' && (
            recentItems.estimates.length > 0 ? recentItems.estimates.map(est => (
              <div key={est.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <div>
                    <span className="font-medium">Estimate #{est.id}</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      est.status?.toLowerCase() === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {est.status || 'pending'}
                    </span>
                  </div>
                </div>
                <Link to={`/app/estimates/${est.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </Link>
              </div>
            )) : (
              <p className="text-gray-500 p-4 text-center">No recent estimates found.</p>
            )
          )}
          
          {activeTab === 'appointments' && (
            recentItems.appointments.length > 0 ? recentItems.appointments.map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-cyan-600" />
                  <div>
                    <span className="font-medium">Appointment #{apt.id}</span>
                    <div className="text-sm text-gray-500">
                      {apt.customer_name || apt.name || 'Unknown customer'}
                      {apt.scheduled_date && (
                        <span className="ml-2">
                          - {new Date(apt.scheduled_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link to={`/app/appointments/${apt.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </Link>
              </div>
            )) : (
              <p className="text-gray-500 p-4 text-center">No recent appointments found.</p>
            )
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { to: "/app/customers/add", icon: Users, label: "Add Customer", color: "bg-blue-600 hover:bg-blue-700" },
          { to: "/app/vehicles/add", icon: Truck, label: "Add Vehicle", color: "bg-green-600 hover:bg-green-700" },
          { to: "/app/jobs/create", icon: Wrench, label: "New Job", color: "bg-yellow-500 hover:bg-yellow-600" },
          { to: "/app/estimates/create", icon: FileText, label: "New Estimate", color: "bg-purple-500 hover:bg-purple-600" },
          { to: "/app/invoices/create", icon: DollarSign, label: "New Invoice", color: "bg-red-500 hover:bg-red-600" },
          { to: "/app/reports", icon: TrendingUp, label: "View Reports", color: "bg-indigo-500 hover:bg-indigo-600" }
        ].map(action => (
          <Link 
            key={action.to}
            to={action.to} 
            className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 transform hover:scale-105 shadow-lg`}
          >
            <action.icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Search Modal */}
      <SearchSystem 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />
    </div>
  );
};

export default Dashboard;
