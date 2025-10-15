// src/pages/AddAndEditCustomer.jsx - Following Dashboard.jsx pattern
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from "../contexts/DataContext";
import { showMessage } from "../utils";
import { 
  Car, PlusCircle, Save, ArrowLeft, Trash2, User, 
  AlertTriangle, CheckCircle, Phone, Mail, MapPin 
} from 'lucide-react';

const formatPhone = (value) => {
  const phoneNumber = value.replace(/\D/g, '');
  const phoneLength = phoneNumber.length;
  
  if (phoneLength < 4) return phoneNumber;
  if (phoneLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const AddAndEditCustomer = () => {
  const navigate = useNavigate();
  const { id: customerId } = useParams();
  const isEditing = Boolean(customerId);
  
  const { customers, vehicles, customerOps, isLoading } = useData();
  const nameRef = useRef();

  // State variables following Dashboard pattern
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [customerVehicles, setCustomerVehicles] = useState([]);

  // Focus on name field when component mounts
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Load customer data when editing - following Dashboard pattern
  useEffect(() => {
    if (isEditing && customers.length > 0) {
      const customer = customers.find(c => c.id === parseInt(customerId));
      if (customer) {
        setForm({
          name: customer.name || '',
          phone: customer.phone || '',
          email: customer.email || '',
          address: customer.address || '',
        });
        
        // Filter vehicles for this customer
        const filteredVehicles = vehicles.filter(v => v.customer_id === parseInt(customerId));
        setCustomerVehicles(filteredVehicles);
      } else {
        setError('Customer not found');
      }
    }
  }, [isEditing, customerId, customers, vehicles]);

  // Utility functions following Dashboard pattern
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'phone') {
      processedValue = formatPhone(value);
    }
    
    setForm(prev => ({ ...prev, [name]: processedValue }));
    
    if (name === 'email') {
      setEmailError('');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (err) {
      setError(`Navigation failed: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      showMessage('Customer name is required', 'error');
      nameRef.current?.focus();
      return;
    }
    
    if (form.email && !validateEmail(form.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = isEditing
        ? await customerOps.update(parseInt(customerId), form)
        : await customerOps.create(form);

      if (result.success) {
        showMessage(`Customer ${isEditing ? 'updated' : 'added'} successfully!`, 'success');
        if (!isEditing && result.data) {
          // Navigate to edit page for new customers to add vehicles
          handleNavigation(`/customers/${result.data.id}/edit`);
        }
      } else {
        showMessage(result.error || 'Failed to save customer', 'error');
      }
    } catch (error) {
      showMessage('Failed to save customer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await customerOps.delete(parseInt(customerId));
      if (result.success) {
        showMessage('Customer deleted successfully!', 'success');
        handleNavigation('/customers');
      } else {
        showMessage(result.error || 'Failed to delete customer', 'error');
      }
    } catch (error) {
      showMessage('Failed to delete customer', 'error');
    } finally {
      setLoading(false);
      setConfirmModalOpen(false);
    }
  };

  const isSaving = isLoading('createcustomer') || isLoading('updatecustomer') || loading;

  // Error handling following Dashboard pattern
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Customer Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
            <button
              onClick={() => handleNavigation('/customers')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Customers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header following Dashboard pattern */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <User className="mr-2 h-8 w-8 text-blue-600" />
            {isEditing ? 'Edit Customer' : 'Add New Customer'}
          </h1>
          <button
            onClick={() => handleNavigation('/customers')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Customers
          </button>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="w-4 h-4 mr-1" />
                Customer Name *
              </label>
              <input
                ref={nameRef}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={14}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="customer@email.com"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter customer address"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : (isEditing ? 'Update Customer' : 'Add Customer')}
              </button>
              
              <button
                type="button"
                onClick={() => handleNavigation('/customers')}
                className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Vehicle Management Section for existing customers */}
        {isEditing && (
          <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700 flex items-center">
                <Car className="mr-2 h-6 w-6 text-blue-600" />
                Customer's Vehicles ({customerVehicles.length})
              </h2>
              <button
                onClick={() => handleNavigation(`/vehicles/add?customerId=${customerId}`)}
                className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Vehicle
              </button>
            </div>
            
            <div className="space-y-3">
              {customerVehicles.length > 0 ? (
                customerVehicles.map(vehicle => (
                  <div key={vehicle.id} className="p-4 bg-white border rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      {vehicle.vin && (
                        <p className="text-sm text-gray-600">VIN: {vehicle.vin}</p>
                      )}
                      {vehicle.license_plate && (
                        <p className="text-sm text-gray-600">License: {vehicle.license_plate}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleNavigation(`/vehicles/${vehicle.id}/edit`)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Edit Vehicle
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No vehicles found for this customer.</p>
                  <button
                    onClick={() => handleNavigation(`/vehicles/add?customerId=${customerId}`)}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Vehicle
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Section for existing customers */}
        {isEditing && (
          <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
            <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Danger Zone
            </h2>
            <p className="text-gray-700 mb-4">
              Permanently delete this customer and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={() => setConfirmModalOpen(true)}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {loading ? 'Deleting...' : 'Delete Customer'}
            </button>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete this customer and all their associated vehicles and jobs? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setConfirmModalOpen(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAndEditCustomer;
