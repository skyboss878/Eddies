// src/pages/Dashboard.jsx - Fixed to use correct data sources
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import DashboardCard from '../components/DashboardCard';
import {
  Users, Car, Wrench, FileText, Calendar, DollarSign, BarChart3,
  Clock, Plus, RefreshCw, AlertTriangle, CheckCircle, Eye,
  Clipboard, Database, Sparkles, Brain, Settings, Zap, X
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Use DataContext for actual data
  const { data, loading, error, refreshData } = useData();
  const { customers, vehicles, jobs, estimates, invoices, appointments } = data || {};

  const [refreshing, setRefreshing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Sample fallback data
  const sampleRecentJobs = [
    {
      id: 1,
      customer: 'Sarah Wilson',
      vehicle: '2019 Honda Civic',
      service: 'Oil Change',
      status: 'completed',
      total: 65.00
    },
    {
      id: 2,
      customer: 'Mike Johnson',
      vehicle: '2020 Toyota Camry',
      service: 'Brake Inspection',
      status: 'in-progress',
      total: 120.00
    },
    {
      id: 3,
      customer: 'Emily Davis',
      vehicle: '2018 Ford F-150',
      service: 'Transmission Service',
      status: 'pending',
      total: 285.00
    }
  ];

  // Calculate stats from real data or use fallback
  const hasRealData = customers?.length > 0 || vehicles?.length > 0 || jobs?.length > 0;

  const stats = {
    totalCustomers: hasRealData ? (customers?.length || 0) : 45,
    totalVehicles: hasRealData ? (vehicles?.length || 0) : 67,
    activeJobs: hasRealData 
      ? (jobs?.filter(job => job.status !== 'completed' && job.status !== 'cancelled')?.length || 0)
      : 12,
    pendingEstimates: hasRealData
      ? (estimates?.filter(est => est.status === 'pending' || est.status === 'draft')?.length || 0)
      : 8,
    unpaidInvoices: hasRealData
      ? (invoices?.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')?.length || 0)
      : 5,
    todayAppointments: hasRealData
      ? (appointments?.filter(apt => {
          const today = new Date().toDateString();
          const aptDate = new Date(apt.date || apt.scheduled_date).toDateString();
          return aptDate === today;
        })?.length || 0)
      : 3,
    monthlyRevenue: hasRealData
      ? (invoices?.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0) || 0)
      : 15420.00
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refreshData();
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view the dashboard.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || user?.username || user?.full_name || 'Eddie'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening at Eddie's Automotive today.
              </p>
              {error && (
                <div className="mt-2 flex items-center text-amber-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              {!hasRealData && !loading && (
                <div className="mt-2 flex items-center text-blue-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Showing demo data - add your first customer to see real stats</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing || loading ? 'animate-spin' : ''}`} />
                {refreshing || loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            color="bg-blue-500"
            href="/customers"
          />

          <DashboardCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon={Car}
            color="bg-green-500"
            href="/vehicles"
          />

          <DashboardCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={Wrench}
            color="bg-yellow-500"
            href="/jobs"
          />

          <DashboardCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-purple-500"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Pending Estimates"
            value={stats.pendingEstimates}
            icon={FileText}
            color="bg-indigo-500"
            href="/estimates"
          />

          <DashboardCard
            title="Unpaid Invoices"
            value={stats.unpaidInvoices}
            icon={AlertTriangle}
            color="bg-red-500"
            href="/invoices"
          />

          <DashboardCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={Calendar}
            color="bg-teal-500"
            href="/appointments"
          />
        </div>

        {/* Quick Actions & Recent Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                Quick Actions
              </h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleNavigation('/customers/create')}
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <Plus className="h-6 w-6 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-blue-900 font-medium">Add Customer</span>
              </button>

              <button
                onClick={() => handleNavigation('/jobs/create')}
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <Wrench className="h-6 w-6 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-green-900 font-medium">New Job</span>
              </button>

              <button
                onClick={() => handleNavigation('/estimates/create')}
                className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors group"
              >
                <FileText className="h-6 w-6 text-yellow-600 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-yellow-900 font-medium">Create Estimate</span>
              </button>

              <button
                onClick={() => handleNavigation('/inventory')}
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
              >
                <Database className="h-6 w-6 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-purple-900 font-medium">Parts Inventory</span>
              </button>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                Recent Jobs
              </h2>
              <button
                onClick={() => handleNavigation('/jobs')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View All <Eye className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="p-6">
              {sampleRecentJobs.length > 0 ? (
                <div className="space-y-4">
                  {sampleRecentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <Wrench className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{job.customer}</p>
                          <p className="text-sm text-gray-600">{job.vehicle}</p>
                          <p className="text-xs text-gray-500">{job.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${job.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          job.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : job.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clipboard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent jobs</p>
                  <button
                    onClick={() => handleNavigation('/jobs/create')}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Create your first job
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="AI Diagnostics"
            value="Available"
            icon={Brain}
            color="bg-gradient-to-r from-purple-500 to-blue-500"
            href="/ai-diagnostics"
            className="hover:shadow-xl transition-shadow"
          />

          <DashboardCard
            title="Generate Reports"
            value="Ready"
            icon={BarChart3}
            color="bg-gradient-to-r from-green-500 to-teal-500"
            href="/reports"
            className="hover:shadow-xl transition-shadow"
          />

          <DashboardCard
            title="Settings"
            value="Configure"
            icon={Settings}
            color="bg-gradient-to-r from-gray-500 to-slate-500"
            href="/settings"
            className="hover:shadow-xl transition-shadow"
          />
        </div>
      </div>

      {/* AI Panel Modal */}
      {showAIPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  AI Assistant
                </h3>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Get AI-powered assistance for diagnostics, estimates, and more.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    handleNavigation('/ai-diagnostics');
                    setShowAIPanel(false);
                  }}
                  className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Brain className="h-5 w-5 text-blue-600 inline mr-2" />
                  AI Diagnostics
                </button>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="w-full text-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      <button
        onClick={() => setShowAIPanel(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
        title="AI Assistant"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Dashboard;
