// src/pages/Dashboard.jsx - Unified Best Version
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  Users, Car, Wrench, FileText, Calendar, DollarSign, BarChart3,
  Clock, Plus, RefreshCw, Bell, MapPin, Phone, Mail,
  TrendingUp, Sparkles, Brain, Search, Eye, Edit3,
  AlertTriangle, CheckCircle, ArrowUp, ArrowDown, X, Trophy
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    customers, 
    vehicles, 
    jobs, 
    estimates, 
    loading, 
    refreshData,
    enrichedJobs 
  } = useData();
  const navigate = useNavigate();

  // State variables
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate dashboard stats from real data
  const stats = {
    totalCustomers: customers?.length || 0,
    totalVehicles: vehicles?.length || 0,
    activeJobs: jobs?.filter(job => job.status !== 'completed')?.length || 0,
    completedJobs: jobs?.filter(job => job.status === 'completed')?.length || 0,
    monthlyRevenue: jobs?.reduce((total, job) => {
      if (job.status === 'completed') {
        return total + (parseFloat(job.total) || 0);
      }
      return total;
    }, 0) || 0,
    pendingEstimates: estimates?.filter(est => est.status === 'pending')?.length || 0
  };

  // Get recent jobs (last 5)
  const recentJobs = enrichedJobs?.slice(0, 5) || [];

  // Utility functions
  const formatCurrency = (amount) => 
    `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (err) {
      setError('Failed to refresh dashboard data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (err) {
      setError(`Navigation failed: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Quick actions with proper navigation
  const quickActions = [
    {
      name: 'Add Customer',
      path: '/customers/add',
      icon: Users,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'New customer record'
    },
    {
      name: 'New Job',
      path: '/jobs/create',
      icon: Wrench,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Create work order'
    },
    {
      name: 'Create Estimate',
      path: '/estimates/create',
      icon: FileText,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      description: 'Quote pricing'
    },
    {
      name: 'AI Diagnostics',
      path: '/ai-diagnostics',
      icon: Brain,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Smart diagnosis'
    }
  ];

  // Loading state
  if (loading.initialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we load your data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || user?.email?.split('@')[0] || 'Admin'}! 👋
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{currentTime.toLocaleDateString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </span>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI Active</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  refreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer" 
               onClick={() => handleNavigation('/customers')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  <span>+12% this month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => handleNavigation('/vehicles')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  <span>+8% this month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Car className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => handleNavigation('/jobs')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                <p className="text-xs text-gray-600 mt-1">{stats.completedJobs} completed today</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Wrench className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => handleNavigation('/reports')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  <span>+18% vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                onClick={() => handleNavigation(action.path)}
                className={`${action.color} text-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-all text-center group transform hover:scale-105`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium block">{action.name}</span>
                <p className="text-xs opacity-75 mt-1">{action.description}</p>
                {action.name.includes('AI') && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Recent Jobs Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-purple-600" />
                Recent Jobs
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleNavigation('/jobs/create')}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Job</span>
                </button>
                <button
                  onClick={() => handleNavigation('/jobs')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All ({jobs?.length || 0})
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="bg-gray-50 p-4 rounded-lg hover:shadow-sm transition-shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-blue-600 text-sm">
                          JOB-{String(job.id).padStart(3, '0')}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(job.status)}`}>
                          {job.status || 'Pending'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(parseFloat(job.total) || 0)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Today'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {job.customerName || 'Unknown Customer'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {job.customerData?.phone || 'No phone'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          {job.vehicleInfo || 'Unknown Vehicle'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {job.description || 'Service needed'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleNavigation(`/jobs/${job.id}`)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleNavigation(`/jobs/${job.id}/edit`)}
                          className="text-xs text-gray-600 hover:text-gray-700 font-medium flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated: {job.updatedAt ? new Date(job.updatedAt).toLocaleString() : 'Recently'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent jobs</p>
                <button
                  onClick={() => handleNavigation('/jobs/create')}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Create your first job
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Panel */}
        {showAIPanel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    AI Assistant
                  </h3>
                  <button
                    onClick={() => setShowAIPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Get AI-powered assistance for diagnostics and estimates.
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">Today's Insights:</p>
                    <p className="text-sm text-purple-700 mt-1">
                      {stats.activeJobs} active jobs, {stats.pendingEstimates} pending estimates
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleNavigation('/ai-diagnostics')}
                    className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Brain className="h-5 w-5 text-blue-600 inline mr-2" />
                    AI Diagnostics
                  </button>
                  
                  <button
                    onClick={() => handleNavigation('/estimates/ai')}
                    className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Sparkles className="h-5 w-5 text-green-600 inline mr-2" />
                    AI Estimates
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

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2 sm:mb-0">
              <span className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                3123 Chester Ave, Bakersfield CA 93301
              </span>
              <a href="tel:(661) 327-4242" className="flex items-center text-blue-600 hover:text-blue-700">
                <Phone className="w-4 h-4 mr-1" />
                (661) 327-4242
              </a>
              <a href="mailto:info@eddiesautomotive.com" className="flex items-center text-blue-600 hover:text-blue-700">
                <Mail className="w-4 h-4 mr-1" />
                info@eddiesautomotive.com
              </a>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-500">
              <Trophy className="w-4 h-4 text-green-500" />
              <span>AI-Powered • Last updated: {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* AI Quick Access Button */}
        <button
          onClick={() => setShowAIPanel(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-40"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
