// src/components/Dashboard.jsx - Example usage of API services
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Car, 
  Wrench, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { 
  dashboardService, 
  jobService, 
  customerService, 
  vehicleService, 
  appointmentService,
  apiUtils 
} from '../utils/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_customers: 0,
    total_vehicles: 0,
    active_jobs: 0,
    pending_estimates: 0,
    total_revenue: 0,
    appointments_today: 0
  });
  
  const [recentJobs, setRecentJobs] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!apiUtils.requireAuth()) return;

    setLoading(true);
    setError(null);

    try {
      // Load dashboard stats from your backend
      const [statsResponse, jobsResponse, appointmentsResponse] = await Promise.all([
        dashboardService.getStats(),
        apiEndpoints.jobs.getAll({ limit: 5, sort: 'created_at', order: 'desc' }),
        appointmentService.getAll({ 
          date: new Date().toISOString().split('T')[0],
          limit: 5 
        })
      ]);

      // Handle different response structures
      setStats(statsResponse.data || statsResponse);
      setRecentJobs(jobsResponse.data || jobsResponse.jobs || jobsResponse);
      setUpcomingAppointments(appointmentsResponse.data || appointmentsResponse.appointments || appointmentsResponse);

    } catch (error) {
      console.error('Dashboard load error:', error);
      setError(apiUtils.formatError(error));
      
      // Load fallback data or show cached data
      loadFallbackData();
    }

    setLoading(false);
  };

  const loadFallbackData = () => {
    // Load cached data from localStorage if available
    const cachedStats = //localStorage.getItem('dashboard_stats');
    if (cachedStats) {
      setStats(JSON.parse(cachedStats));
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getJobStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshDashboard}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={refreshDashboard}
              className="text-sm text-red-600 hover:text-red-800 underline mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_customers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_vehicles}</p>
            </div>
            <Car className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active_jobs}</p>
            </div>
            <Wrench className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estimates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending_estimates}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.appointments_today}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentJobs.length > 0 ? (
              recentJobs.slice(0, 5).map((job, index) => (
                <div key={job.id || index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {job.title || job.description || `Job #${job.id}`}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {job.customer_name || 'Unknown Customer'}
                      </p>
                      {job.vehicle && (
                        <p className="text-xs text-gray-400">
                          {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobStatusColor(job.status)}`}>
                        {job.status?.replace('_', ' ') || 'Unknown'}
                      </span>
                      {job.total_amount && (
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(job.total_amount)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent jobs found</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => window.location.href = '/jobs'}
              className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Jobs →
            </button>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 5).map((appointment, index) => (
                <div key={appointment.id || index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {appointment.title || appointment.service_type || 'Appointment'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.customer_name || 'Unknown Customer'}
                      </p>
                      {appointment.scheduled_time && (
                        <p className="text-xs text-gray-400">
                          {new Date(appointment.scheduled_time).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {appointment.confirmed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Calendar className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No appointments today</p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => window.location.href = '/appointments'}
              className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Appointments →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button
            onClick={() => window.location.href = '/customers/new'}
            className="flex flex-col items-center p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Add Customer</span>
          </button>

          <button
            onClick={() => window.location.href = '/jobs/new'}
            className="flex flex-col items-center p-4 text-center bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Wrench className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">New Job</span>
          </button>

          <button
            onClick={() => window.location.href = '/appointments/new'}
            className="flex flex-col items-center p-4 text-center bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Calendar className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Schedule</span>
          </button>

          <button
            onClick={() => window.location.href = '/estimates/new'}
            className="flex flex-col items-center p-4 text-center bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">New Estimate</span>
          </button>

          <button
            onClick={() => window.location.href = '/parts'}
            className="flex flex-col items-center p-4 text-center bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Car className="w-6 h-6 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-yellow-900">Parts</span>
          </button>

          <button
            onClick={() => window.location.href = '/reports'}
            className="flex flex-col items-center p-4 text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <DollarSign className="w-6 h-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
