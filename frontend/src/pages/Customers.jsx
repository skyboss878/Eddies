// src/pages/CustomerList.jsx - ENHANCED Production Ready
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserGroupIcon,
  StarIcon,
  CalendarIcon,
  ChevronUpDownIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useEnhancedNavigation } from "../hooks";
import SmartBreadcrumb from "../components/SmartBreadcrumb";

const CustomerList = () => {
  const { navigateTo, savePageState, getPageState, currentPath } = useEnhancedNavigation();

  // Enhanced States
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Enhanced search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid'

  // Advanced filters
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [vehicleCount, setVehicleCount] = useState('all');
  const [totalSpentRange, setTotalSpentRange] = useState({ min: '', max: '' });

  // Restore page state
  useEffect(() => {
    const savedState = getPageState(currentPath) || {};
    if (savedState.searchTerm) setSearchTerm(savedState.searchTerm);
    if (savedState.selectedCustomers) setSelectedCustomers(savedState.selectedCustomers);
    if (savedState.sortBy) setSortBy(savedState.sortBy);
    if (savedState.sortOrder) setSortOrder(savedState.sortOrder);
    if (savedState.filterStatus) setFilterStatus(savedState.filterStatus);
    if (savedState.viewMode) setViewMode(savedState.viewMode);
  }, []);

  // Save state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
    savePageState(currentPath, { 
      searchTerm, 
      selectedCustomers, 
      sortBy, 
      sortOrder, 
      filterStatus, 
      viewMode 
        }, 300);
    return () => clearTimeout(timeoutId);
  });
  }, [searchTerm, selectedCustomers, sortBy, sortOrder, filterStatus, viewMode, savePageState, currentPath]);

  // Fetch customers with enhanced data
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/customers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Enhanced customer data processing
      const processedCustomers = Array.isArray(data) 
        ? data.filter(c => c.id != null).map(customer => ({
            ...customer,
            // Ensure required fields
            name: customer.name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown Customer',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
            status: customer.status || 'active',
            created_at: customer.created_at || new Date().toISOString(),
            last_service: customer.last_service || null,
            total_spent: customer.total_spent || 0,
            vehicle_count: customer.vehicles?.length || 0,
            average_rating: customer.average_rating || 0,
            // Add computed fields
            initials: getInitials(customer.name || `${customer.first_name || ''} ${customer.last_name || ''}`),
            membershipDuration: getMembershipDuration(customer.created_at),
            isVIP: (customer.total_spent || 0) > 5000
          }))
        : [];
      
      setCustomers(processedCustomers);
    } catch (err) {
      setError(`Failed to load customers: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMembershipDuration = (createdAt) => {
    if (!createdAt) return 'New';
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return 'New';
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}m`;
    return `${Math.floor(diffDays / 365)}y`;
  };

  // Enhanced filtering and sorting
  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    // Text search (enhanced)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.phone?.includes(searchTerm) ||
        customer.address?.toLowerCase().includes(searchLower) ||
        customer.id?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(customer => customer.status === filterStatus);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(customer => 
        new Date(customer.created_at) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(customer => 
        new Date(customer.created_at) <= new Date(dateRange.end)
      );
    }

    // Vehicle count filter
    if (vehicleCount !== 'all') {
      const count = parseInt(vehicleCount);
      filtered = filtered.filter(customer => {
        if (vehicleCount === '0') return customer.vehicle_count === 0;
        if (vehicleCount === '1') return customer.vehicle_count === 1;
        if (vehicleCount === '2+') return customer.vehicle_count >= 2;
        return true;
      });
    }

    // Total spent range filter
    if (totalSpentRange.min) {
      filtered = filtered.filter(customer => 
        customer.total_spent >= parseFloat(totalSpentRange.min)
      );
    }
    if (totalSpentRange.max) {
      filtered = filtered.filter(customer => 
        customer.total_spent <= parseFloat(totalSpentRange.max)
      );
    }

    // Enhanced sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = (a.name || '').toLowerCase();
          bVal = (b.name || '').toLowerCase();
          break;
        case 'date':
          aVal = new Date(a.created_at || 0);
          bVal = new Date(b.created_at || 0);
          break;
        case 'spent':
          aVal = a.total_spent || 0;
          bVal = b.total_spent || 0;
          break;
        case 'vehicles':
          aVal = a.vehicle_count || 0;
          bVal = b.vehicle_count || 0;
          break;
        case 'rating':
          aVal = a.average_rating || 0;
          bVal = b.average_rating || 0;
          break;
        default:
          aVal = (a.name || '').toLowerCase();
          bVal = (b.name || '').toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [customers, searchTerm, filterStatus, dateRange, vehicleCount, totalSpentRange, sortBy, sortOrder]);

  // Enhanced navigation handlers
  const handleCustomerClick = useCallback((customer) => {
    if (!customer.id) {
      alert('Customer ID missing. Cannot proceed.');
      return;
    }
    navigateTo(`/customers/${customer.id}`, {
      state: {
        customer,
        returnTo: '/customers',
        listContext: { searchTerm, sortBy, sortOrder, filterStatus, viewMode }
      }
    });
  }, [navigateTo, searchTerm, sortBy, sortOrder, filterStatus, viewMode]);

  const handleAddCustomer = useCallback(() => {
    navigateTo('/customers/add', { state: { returnTo: '/customers' } });
  }, [navigateTo]);

  const handleEditCustomer = useCallback((customer, e) => {
    e?.stopPropagation();
    if (!customer.id) {
      alert('Customer ID missing. Cannot edit.');
      return;
    }
    navigateTo(`/customers/${customer.id}/edit`, {
      state: { customer, returnTo: '/customers', isEditing: true }
    });
  }, [navigateTo]);

  const handleDeleteCustomer = useCallback(async (customer, e) => {
    e?.stopPropagation();
    if (!customer.id) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.name}? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/auth/customers/${customer.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCustomers(prev => prev.filter(c => c.id !== customer.id));
        alert('Customer deleted successfully');
      } else {
        throw new Error('Failed to delete customer');
      }
    } catch (err) {
      alert(`Error deleting customer: ${err.message}`);
    }
  }, []);

  // Bulk operations
  const handleSelectCustomer = useCallback((customerId, checked) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  }, []);

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  }, [filteredCustomers]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedCustomers.length === 0) return;
    
    const confirmed = window.confirm(
      `Delete ${selectedCustomers.length} selected customers? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      const promises = selectedCustomers.map(id =>
        fetch(`/api/auth/customers/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(promises);
      
      setCustomers(prev => prev.filter(c => !selectedCustomers.includes(c.id)));
      setSelectedCustomers([]);
      alert(`${selectedCustomers.length} customers deleted successfully`);
    } catch (err) {
      alert(`Error deleting customers: ${err.message}`);
    }
  }, [selectedCustomers]);

  const handleExportCustomers = useCallback(() => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Address', 'Status', 'Vehicles', 'Total Spent', 'Member Since'],
      ...filteredCustomers.map(c => [
        c.name,
        c.email,
        c.phone,
        c.address,
        c.status,
        c.vehicle_count,
        c.total_spent,
        new Date(c.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredCustomers]);

  // Enhanced breadcrumb actions
  const breadcrumbActions = [
    {
      icon: ArrowDownTrayIcon,
      onClick: handleExportCustomers,
      title: 'Export CSV',
      className: 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
    },
    {
      icon: PlusIcon,
      onClick: handleAddCustomer,
      title: 'Add Customer',
      className: 'text-white bg-blue-600 hover:bg-blue-700'
    }
  ];

  // Loading and error states
// Enhanced Customer List - Part 2 (Continuation from loading state)

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XMarkIcon className="h-6 w-6 text-red-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Customers</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button 
                onClick={fetchCustomers}
                className="mt-3 bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SmartBreadcrumb path="/customers" actions={breadcrumbActions} />

      {/* Enhanced Header with Stats */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <CheckIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600">Active Customers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.isVIP).length}
                </p>
                <p className="text-sm text-gray-600">VIP Customers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => getMembershipDuration(c.created_at) === 'New').length}
                </p>
                <p className="text-sm text-gray-600">New This Month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, phone, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* View Toggle and Filter Button */}
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all ${
                  showFilters 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicles</label>
                  <select
                    value={vehicleCount}
                    onChange={(e) => setVehicleCount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Vehicles</option>
                    <option value="0">No Vehicles</option>
                    <option value="1">1 Vehicle</option>
                    <option value="2+">2+ Vehicles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clear Filters</label>
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setVehicleCount('all');
                      setDateRange({ start: '', end: '' });
                      setTotalSpentRange({ min: '', max: '' });
                      setSearchTerm('');
                    }}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sort and Results Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="name">Name</option>
                  <option value="date">Date Added</option>
                  <option value="spent">Total Spent</option>
                  <option value="vehicles">Vehicle Count</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronUpDownIcon className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredCustomers.length} of {customers.length} customers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckIcon className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                {selectedCustomers.length} customer{selectedCustomers.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Delete Selected</span>
              </button>
              <button
                onClick={() => setSelectedCustomers([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer List/Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Customers ({filteredCustomers.length})
            </h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="divide-y divide-gray-200">
            {filteredCustomers.map(customer => (
              <div
                key={customer.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    
                    <div 
                      onClick={() => handleCustomerClick(customer)}
                      className="cursor-pointer flex items-center space-x-4 flex-1"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        customer.isVIP ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                      }`}>
                        {customer.initials}
                        {customer.isVIP && (
                          <StarIcon className="absolute w-4 h-4 text-yellow-300 -mt-1 -mr-1" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900">{customer.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            customer.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {customer.status}
                          </span>
                          {customer.isVIP && (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              VIP
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          {customer.email && (
                            <span className="flex items-center space-x-1">
                              <EnvelopeIcon className="h-4 w-4" />
                              <span>{customer.email}</span>
                            </span>
                          )}
                          {customer.phone && (
                            <span className="flex items-center space-x-1">
                              <PhoneIcon className="h-4 w-4" />
                              <span>{customer.phone}</span>
                            </span>
                          )}
                          {customer.address && (
                            <span className="flex items-center space-x-1">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{customer.address}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">
                        {customer.vehicle_count} vehicle{customer.vehicle_count !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${customer.total_spent.toLocaleString()} spent
                      </p>
                      <p className="text-xs text-gray-500">
                        Member {customer.membershipDuration}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleCustomerClick(customer)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleEditCustomer(customer, e)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                        title="Edit Customer"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCustomer(customer, e)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Customer"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCustomers.map(customer => (
              <div
                key={customer.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleCustomerClick(customer)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    customer.isVIP ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}>
                    {customer.initials}
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditCustomer(customer, e)}
                      className="p-1 text-gray-600 hover:text-green-600 rounded"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteCustomer(customer, e)}
                      className="p-1 text-gray-600 hover:text-red-600 rounded"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                      {customer.isVIP && (
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className={`text-sm ${
                      customer.status === 'active' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)} Customer
                    </p>
                  </div>

                  {customer.email && (
                    <p className="text-sm text-gray-600 flex items-center space-x-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>{customer.email}</span>
                    </p>
                  )}

                  {customer.phone && (
                    <p className="text-sm text-gray-600 flex items-center space-x-2">
                      <PhoneIcon className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </p>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Vehicles:</span>
                      <span className="font-medium">{customer.vehicle_count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Spent:</span>
                      <span className="font-medium">${customer.total_spent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Member:</span>
                      <span className="font-medium">{customer.membershipDuration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCustomers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <UserGroupIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' || showFilters
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by adding your first customer.'
              }
            </p>
            <button
              onClick={handleAddCustomer}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
