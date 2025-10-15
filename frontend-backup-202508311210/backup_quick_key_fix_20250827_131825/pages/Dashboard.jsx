import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useData } from '../contexts';
import {
  BanknotesIcon, TruckIcon, UsersIcon,
  WrenchScrewdriverIcon, DocumentTextIcon,
  ExclamationTriangleIcon, ClockIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { customers, vehicles, jobs, estimates, invoices, loading, refreshData } = useData();

  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    totalVehicles: 0,
    activeJobs: 0,
    pendingEstimates: 0,
    unpaidInvoices: 0,
    totalRevenue: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('invoices');

  // Refresh data on component mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Memoize dashboard stat calculations
  useEffect(() => {
    if (!loading && customers && vehicles && jobs && estimates && invoices) {
      setDashboardStats({
        totalCustomers: customers.length,
        totalVehicles: vehicles.length,
        activeJobs: jobs.filter(j => j.status === 'in_progress').length,
        pendingEstimates: estimates.filter(e => e.status === 'pending').length,
        unpaidInvoices: invoices.filter(i => i.status !== 'paid').length,
        totalRevenue: invoices
          .filter(i => i.status === 'paid')
          .reduce((sum, i) => sum + parseFloat(i.total_amount || 0), 0)
      });
    }
  }, [customers, vehicles, jobs, estimates, invoices, loading]);

  // Memoized live search logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const term = searchTerm.toLowerCase();

    const customerResults = customers
      .filter(c => c.name.toLowerCase().includes(term) || (c.phone && c.phone.includes(term)))
      .map(c => ({ type: 'Customer', id: c.id, name: c.name, details: c.phone, path: `/app/customers/${c.id}` }));

    const vehicleResults = vehicles
      .filter(v => v.license_plate?.toLowerCase().includes(term) || v.vin?.toLowerCase().includes(term))
      .map(v => ({ type: 'Vehicle', id: v.id, name: `${v.year} ${v.make} ${v.model}`, details: v.license_plate, path: `/app/vehicles/${v.id}` }));

    const jobResults = jobs
      .filter(j => j.id.toString().includes(term) || j.description?.toLowerCase().includes(term))
      .map(j => ({ type: 'Job', id: j.id, name: `Job #${j.id}`, details: j.description?.substring(0, 40) + '...', path: `/app/jobs/${j.id}` }));

    setSearchResults([...customerResults, ...vehicleResults, ...jobResults]);
  }, [searchTerm, customers, vehicles, jobs]);

  // Memoize derived data for alerts and recent items to improve performance
  const smartAlerts = useMemo(() => {
    const oneDay = 1000 * 60 * 60 * 24;
    const now = new Date();

    const inactiveCustomers = (customers && jobs) ? customers.filter(c => {
      const lastJob = jobs.filter(j => j.customer_id === c.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      return !lastJob || (now - new Date(lastJob.created_at)) / oneDay > 90;
    }) : [];

    const overdueInvoices = invoices ? invoices.filter(inv => inv.status !== 'paid' && (now - new Date(inv.created_at)) / oneDay > 30) : [];
    const pendingEstimates = estimates ? estimates.filter(est => est.status === 'pending') : [];
    const upcomingJobs = jobs ? jobs.filter(job => {
      const jobDate = new Date(job.scheduled_at || job.created_at);
      const diff = (jobDate - now) / oneDay;
      return diff >= 0 && diff <= 1;
    }) : [];

    return { inactiveCustomers, overdueInvoices, pendingEstimates, upcomingJobs };
  }, [customers, jobs, invoices, estimates]);

  const recentItems = useMemo(() => ({
    invoices: invoices ? [...invoices].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5) : [],
    jobs: jobs ? [...jobs].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5) : [],
    estimates: estimates ? [...estimates].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5) : [],
  }), [invoices, jobs, estimates]);

  const stats = [
    { name: 'Total Customers', value: dashboardStats.totalCustomers, icon: UsersIcon, color: 'bg-blue-500', href: '/app/customers' },
    { name: 'Total Vehicles', value: dashboardStats.totalVehicles, icon: TruckIcon, color: 'bg-green-500', href: '/app/vehicles' },
    { name: 'Active Jobs', value: dashboardStats.activeJobs, icon: WrenchScrewdriverIcon, color: 'bg-yellow-500', href: '/app/jobs' },
    { name: 'Pending Estimates', value: dashboardStats.pendingEstimates, icon: DocumentTextIcon, color: 'bg-purple-500', href: '/app/estimates' },
    { name: 'Unpaid Invoices', value: dashboardStats.unpaidInvoices, icon: ExclamationTriangleIcon, color: 'bg-red-500', href: '/app/invoices' },
    { name: 'Total Revenue', value: `$${dashboardStats.totalRevenue.toLocaleString()}`, icon: BanknotesIcon, color: 'bg-indigo-500', href: '/app/reports' }
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">

      {/* Header + Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.first_name || user?.name || 'User'}!
        </h1>
        <div className="relative w-full md:w-auto md:min-w-[350px]">
          <div className="flex items-center">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search customers, vehicles, jobs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute right-2 h-5 w-5 text-gray-400" />
          </div>
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
              <ul>
                {searchResults.map(item => (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      to={item.path}
                      onClick={() => setSearchTerm('')}
                      className="block p-3 hover:bg-gray-100 border-b"
                    >
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">{item.type}:</span> {item.details}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(stat => (
          <Link key={stat.name} to={stat.href} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div className="p-5 flex items-center">
              <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Smart Alerts */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-bold mb-2">Smart Actions</h3>
        <ul className="space-y-2">
          {smartAlerts.inactiveCustomers.map(c => (
            <li key={`inactive-${c.id}`} className="p-2 border rounded flex justify-between items-center hover:bg-gray-50">
              <span>Customer <strong>{c.name}</strong> has been inactive for 90+ days.</span>
              <Link to={`/app/customers/${c.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">View</Link>
            </li>
          ))}
          {smartAlerts.overdueInvoices.map(inv => (
            <li key={`overdue-${inv.id}`} className="p-2 border rounded flex justify-between items-center hover:bg-gray-50">
              <span>Invoice #{inv.id} has been unpaid for 30+ days.</span>
              <Link to={`/app/invoices/${inv.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">View</Link>
            </li>
          ))}
          {smartAlerts.pendingEstimates.map(est => (
            <li key={`pending-${est.id}`} className="p-2 border rounded flex justify-between items-center hover:bg-gray-50">
              <span>Pending estimate #{est.id} is awaiting approval.</span>
              <Link to={`/app/estimates/${est.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">View</Link>
            </li>
          ))}
          {smartAlerts.upcomingJobs.map(job => (
            <li key={`upcoming-${job.id}`} className="p-2 border rounded flex justify-between items-center hover:bg-gray-50">
              <span>Upcoming job #{job.id} is scheduled soon.</span>
              <Link to={`/app/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">View</Link>
            </li>
          ))}
          {Object.values(smartAlerts).every(arr => arr.length === 0) && (
             <p className="text-gray-500 text-center p-3">No smart actions needed right now.</p>
          )}
        </ul>
      </div>

      {/* Recent Items Tabs */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex border-b mb-4">
          {['invoices', 'jobs', 'estimates'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div>
          {activeTab === 'invoices' && (
            recentItems.invoices.length > 0 ? recentItems.invoices.map(inv => (
              <div key={inv.id} className="p-3 border-b last:border-b-0 flex justify-between items-center">
                <span>Invoice #{inv.id} - <span className="font-mono text-sm bg-gray-100 p-1 rounded">{inv.status}</span></span>
                <Link to={`/app/invoices/${inv.id}`} className="text-blue-600 hover:text-blue-800 text-sm">View</Link>
              </div>
            )) : <p className="text-gray-500 p-3 text-center">No recent invoices found.</p>
          )}
          {activeTab === 'jobs' && (
             recentItems.jobs.length > 0 ? recentItems.jobs.map(job => (
              <div key={job.id} className="p-3 border-b last:border-b-0 flex justify-between items-center">
                <span>Job #{job.id} - {job.description || 'No description'}</span>
                <Link to={`/app/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800 text-sm">View</Link>
              </div>
            )) : <p className="text-gray-500 p-3 text-center">No recent jobs found.</p>
          )}
          {activeTab === 'estimates' && (
            recentItems.estimates.length > 0 ? recentItems.estimates.map(est => (
              <div key={est.id} className="p-3 border-b last:border-b-0 flex justify-between items-center">
                <span>Estimate #{est.id} - <span className="font-mono text-sm bg-gray-100 p-1 rounded">{est.status}</span></span>
                <Link to={`/app/estimates/${est.id}`} className="text-blue-600 hover:text-blue-800 text-sm">View</Link>
              </div>
            )) : <p className="text-gray-500 p-3 text-center">No recent estimates found.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        <Link to="/app/customers/add" className="bg-blue-600 text-white p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-blue-700 transition-colors">
          <UsersIcon className="w-6 h-6 mb-1" />
          <span className="text-sm font-medium">Add Customer</span>
        </Link>
        <Link to="/app/vehicles/add" className="bg-green-600 text-white p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-green-700 transition-colors">
          <TruckIcon className="w-6 h-6 mb-1" />
          <span className="text-sm font-medium">Add Vehicle</span>
        </Link>
        <Link to="/app/jobs/add" className="bg-yellow-500 text-white p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-yellow-600 transition-colors">
          <WrenchScrewdriverIcon className="w-6 h-6 mb-1" />
          <span className="text-sm font-medium">Add Job</span>
        </Link>
        <Link to="/app/estimates/add" className="bg-purple-500 text-white p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-purple-600 transition-colors">
          <DocumentTextIcon className="w-6 h-6 mb-1" />
          <span className="text-sm font-medium">Add Estimate</span>
        </Link>
        <Link to="/app/invoices/add" className="bg-red-500 text-white p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-red-600 transition-colors">
          <ExclamationTriangleIcon className="w-6 h-6 mb-1" />
          <span className="text-sm font-medium">Add Invoice</span>
        </Link>
        <Link to="/app/reports" className="bg-indigo-500 text-white p-3 rounded-lg flex flex-col items-center justify-center text-center hover:bg-indigo-600 transition-colors">
          <BanknotesIcon className="w-6 h-6 mb-1" />
          <span className="text-sm font-medium">Reports</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
