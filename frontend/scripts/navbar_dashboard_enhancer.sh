#!/bin/bash
# Enhance Navbar and Dashboard for optimal flow

cd ~/eddies-askan-automotive/frontend

echo "🚀 Enhancing Navbar and Dashboard Flow..."
echo "=========================================="

# Check current Navbar
echo "🔍 Checking current Navbar..."
if [ -f "src/components/Navbar.jsx" ]; then
    echo "✅ Navbar.jsx exists"
    echo "📋 Current Navbar imports:"
    head -10 src/components/Navbar.jsx | grep import
else
    echo "❌ Navbar.jsx missing!"
fi

echo ""
echo "🔍 Checking current Dashboard..."
if [ -f "src/pages/Dashboard.jsx" ]; then
    echo "✅ Dashboard.jsx exists"
    echo "📋 Current Dashboard imports:"
    head -15 src/pages/Dashboard.jsx | grep import
else
    echo "❌ Dashboard.jsx missing!"
fi

echo ""
echo "🔍 Checking Layout integration..."
if [ -f "src/components/Layout.jsx" ]; then
    echo "✅ Layout.jsx exists"
    if grep -q "Navbar" src/components/Layout.jsx; then
        echo "✅ Layout includes Navbar"
    else
        echo "⚠️  Layout might not include Navbar"
    fi
else
    echo "❌ Layout.jsx missing!"
fi

echo ""
echo "🔍 Checking App.jsx routing..."
echo "📋 Route definitions in App.jsx:"
grep -n "Route path" src/App.jsx | head -10

echo ""
echo "💡 Creating enhanced components for better flow..."

# Create backup
cp src/components/Navbar.jsx src/components/Navbar.jsx.backup-$(date +%H%M%S) 2>/dev/null || true
cp src/pages/Dashboard.jsx src/pages/Dashboard.jsx.backup-$(date +%H%M%S) 2>/dev/null || true

# Create enhanced Navbar
cat > src/components/EnhancedNavbar.jsx << 'EOF'
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  UsersIcon, 
  TruckIcon, 
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const EnhancedNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Customers', href: '/customers', icon: UsersIcon },
    { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
    { name: 'Jobs', href: '/jobs', icon: WrenchScrewdriverIcon },
    { name: 'Estimates', href: '/estimates', icon: DocumentTextIcon },
    { name: 'Invoices', href: '/invoices', icon: BanknotesIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-white text-xl font-bold">
                Eddie's Automotive
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'border-blue-500 text-white bg-gray-700'
                        : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                    } inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium rounded-md transition-colors duration-200`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <span className="text-gray-300">Welcome, {user?.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${
                    isActive(item.href)
                      ? 'bg-gray-600 text-white'
                      : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                  } flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 pb-3 border-t border-gray-600">
              <div className="px-3 py-2 text-gray-300 text-sm">
                Welcome, {user?.name || 'User'}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-300 hover:bg-gray-600 hover:text-red-200 rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default EnhancedNavbar;
EOF

echo "✅ Created EnhancedNavbar.jsx"

# Create enhanced Dashboard with Invoices focus
cat > src/pages/EnhancedDashboard.jsx << 'EOF'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  BanknotesIcon,
  TruckIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const { 
    customers, 
    vehicles, 
    jobs, 
    estimates, 
    invoices, 
    loading, 
    refreshData 
  } = useData();
  
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    totalVehicles: 0,
    activeJobs: 0,
    pendingEstimates: 0,
    unpaidInvoices: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (customers && vehicles && jobs && estimates && invoices) {
      setDashboardStats({
        totalCustomers: customers.length,
        totalVehicles: vehicles.length,
        activeJobs: jobs.filter(job => job.status === 'in_progress').length,
        pendingEstimates: estimates.filter(est => est.status === 'pending').length,
        unpaidInvoices: invoices.filter(inv => inv.status !== 'paid').length,
        totalRevenue: invoices
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0)
      });
    }
  }, [customers, vehicles, jobs, estimates, invoices]);

  const stats = [
    {
      name: 'Total Customers',
      value: dashboardStats.totalCustomers,
      icon: UsersIcon,
      color: 'bg-blue-500',
      href: '/customers'
    },
    {
      name: 'Total Vehicles',
      value: dashboardStats.totalVehicles,
      icon: TruckIcon,
      color: 'bg-green-500',
      href: '/vehicles'
    },
    {
      name: 'Active Jobs',
      value: dashboardStats.activeJobs,
      icon: WrenchScrewdriverIcon,
      color: 'bg-yellow-500',
      href: '/jobs'
    },
    {
      name: 'Pending Estimates',
      value: dashboardStats.pendingEstimates,
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      href: '/estimates'
    },
    {
      name: 'Unpaid Invoices',
      value: dashboardStats.unpaidInvoices,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      href: '/invoices'
    },
    {
      name: 'Total Revenue',
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      icon: BanknotesIcon,
      color: 'bg-indigo-500',
      href: '/reports'
    }
  ];

  // Recent invoices for quick access
  const recentInvoices = invoices
    ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    ?.slice(0, 5) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your automotive business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Invoices Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Invoices
            </h3>
            <Link
              to="/invoices"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all invoices →
            </Link>
          </div>
          
          {recentInvoices.length > 0 ? (
            <div className="overflow-hidden">
              <div className="space-y-3">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Invoice #{invoice.id}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Customer: {invoice.customer_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          ${parseFloat(invoice.total_amount || 0).toLocaleString()}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first invoice.
              </p>
              <div className="mt-6">
                <Link
                  to="/invoices/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Invoice
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/customers/add"
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors"
            >
              <UsersIcon className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-sm font-medium text-blue-600">Add Customer</p>
            </Link>
            <Link
              to="/vehicles/add"
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors"
            >
              <TruckIcon className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-sm font-medium text-green-600">Add Vehicle</p>
            </Link>
            <Link
              to="/jobs/create"
              className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg text-center transition-colors"
            >
              <WrenchScrewdriverIcon className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <p className="text-sm font-medium text-yellow-600">Create Job</p>
            </Link>
            <Link
              to="/invoices/create"
              className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors"
            >
              <BanknotesIcon className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <p className="text-sm font-medium text-purple-600">Create Invoice</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
EOF

echo "✅ Created EnhancedDashboard.jsx"

echo ""
echo "🔗 Setting up component replacements..."
echo "Choose how to implement the enhanced components:"
echo "1) Replace existing files (recommended)"
echo "2) Keep as separate files for testing"
echo "3) Show what needs to be updated in App.jsx"

read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🔄 Replacing existing components..."
        mv src/components/EnhancedNavbar.jsx src/components/Navbar.jsx
        mv src/pages/EnhancedDashboard.jsx src/pages/Dashboard.jsx
        echo "✅ Components replaced!"
        echo "💡 Your app will now use the enhanced versions"
        ;;
    2)
        echo "✅ Enhanced components created as separate files:"
        echo "   - src/components/EnhancedNavbar.jsx"
        echo "   - src/pages/EnhancedDashboard.jsx"
        echo "💡 You can test them by importing in App.jsx"
        ;;
    3)
        echo "📝 To use enhanced components, update your App.jsx imports:"
        echo "   import EnhancedNavbar from './components/EnhancedNavbar';"
        echo "   import EnhancedDashboard from './pages/EnhancedDashboard';"
        ;;
esac

echo ""
echo "🎉 Enhanced components ready!"
echo "================================"
echo "✅ Enhanced Navbar with:"
echo "   - Modern navigation with icons"
echo "   - Mobile responsive menu"
echo "   - Active page highlighting"
echo "   - User welcome message"
echo ""
echo "✅ Enhanced Dashboard with:"
echo "   - Key business statistics"
echo "   - Recent invoices section"
echo "   - Quick action buttons"
echo "   - Responsive layout"
echo ""
echo "💡 Your app at http://localhost:3002 should now have improved navigation and dashboard flow!"
