// FIXED VERSION - Customer Search with Auto-ID Generation
import React, { useState, useEffect } from 'react';

// CustomerSearch Component - FIXED
const CustomerSearch = ({ onCustomerSelect, selectedCustomer, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load customers when component mounts
  useEffect(() => {
    loadCustomers();
  }, []);

  // Update search term when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSearchTerm(value);
    }
  }, [value]);

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/customers', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw customer data from API:', data);
      
      // Process customer data to ensure consistent format
      const processedCustomers = Array.isArray(data) ? data.map(customer => ({
        ...customer,
        // Ensure we have an id field (try different possible field names)
        id: customer.id || customer.customer_id || customer._id || customer.pk,
        // Ensure we have name fields
        first_name: customer.first_name || customer.firstName || '',
        last_name: customer.last_name || customer.lastName || '',
        // Create full name if not exists
        name: customer.name || `${customer.first_name || customer.firstName || ''} ${customer.last_name || customer.lastName || ''}`.trim() || 'Unknown Customer',
        phone: customer.phone || customer.phoneNumber || '',
        email: customer.email || customer.emailAddress || ''
      })).filter(customer => customer.id != null) : [];
      
      console.log('Processed customers:', processedCustomers);
      setCustomers(processedCustomers);
      
      if (processedCustomers.length === 0) {
        setError('No customers found. Please add customers first.');
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      setError(`Failed to load customers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter customers as user types
  useEffect(() => {
    if (searchTerm.length > 0 && customers.length > 0) {
      const searchLower = searchTerm.toLowerCase().trim();
      const filtered = customers.filter(customer => {
        const name = (customer.name || '').toLowerCase();
        const phone = (customer.phone || '').replace(/\D/g, ''); // Remove non-digits for phone search
        const email = (customer.email || '').toLowerCase();
        const searchPhone = searchTerm.replace(/\D/g, ''); // Remove non-digits from search
        
        return name.includes(searchLower) ||
               phone.includes(searchPhone) ||
               email.includes(searchLower) ||
               customer.id.toString().includes(searchTerm);
      });
      
      console.log('Filtered customers:', filtered);
      setFilteredCustomers(filtered);
      setIsOpen(true);
    } else {
      setFilteredCustomers([]);
      setIsOpen(false);
    }
  }, [searchTerm, customers]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (onChange) {
      onChange(newValue);
    }
    // Clear selection if user is typing
    if (selectedCustomer && newValue !== selectedCustomer.displayText) {
      onCustomerSelect(null);
    }
  };

  const handleSelectCustomer = (customer) => {
    console.log('Customer selected:', customer);
    
    // Create display text
    const displayText = `${customer.name} - ${customer.phone || 'No phone'}`;
    setSearchTerm(displayText);
    setIsOpen(false);
    
    // Pass complete customer data to parent
    const customerData = {
      id: customer.id,
      customerId: customer.id, // Also set customerId for compatibility
      name: customer.name,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone || '',
      email: customer.email || '',
      displayText: displayText
    };
    
    console.log('Passing customer data to parent:', customerData);
    onCustomerSelect(customerData);
    
    if (onChange) {
      onChange(displayText);
    }
  };

  const handleRefresh = () => {
    loadCustomers();
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Customer *
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={loading ? "Loading customers..." : "Search customer by name, phone, or email..."}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
            error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={loading}
        />
        
        {/* Refresh button */}
        <button
          type="button"
          onClick={handleRefresh}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          title="Refresh customer list"
        >
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-1 text-sm text-red-600 flex items-center space-x-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
          <button 
            onClick={handleRefresh}
            className="underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Customer dropdown */}
      {isOpen && filteredCustomers.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => handleSelectCustomer(customer)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {customer.name || 'Unknown Customer'}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center space-x-3">
                    {customer.phone && (
                      <span className="flex items-center space-x-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>{customer.phone}</span>
                      </span>
                    )}
                    {customer.email && (
                      <span className="flex items-center space-x-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>{customer.email}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Customer ID: {customer.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {isOpen && filteredCustomers.length === 0 && searchTerm.length > 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
          <div className="mb-2">
            <svg className="h-8 w-8 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p>No customers found matching "{searchTerm}"</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

// Enhanced Vehicle Form Component - FIXED
const VehicleForm = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchValue, setCustomerSearchValue] = useState('');
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    vin: '',
    mileage: '',
    license_plate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleCustomerSelect = (customer) => {
    console.log('Customer selected in form:', customer);
    setSelectedCustomer(customer);
    setSubmitError(''); // Clear any previous errors
  };

  const handleCustomerSearchChange = (value) => {
    setCustomerSearchValue(value);
  };

  const handleInputChange = (field, value) => {
    setVehicleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!selectedCustomer || !selectedCustomer.id) {
      errors.push('Please select a customer');
    }
    
    if (!vehicleData.make.trim()) {
      errors.push('Vehicle make is required');
    }
    
    if (!vehicleData.model.trim()) {
      errors.push('Vehicle model is required');
    }
    
    if (!vehicleData.year || vehicleData.year < 1900 || vehicleData.year > new Date().getFullYear() + 1) {
      errors.push('Please enter a valid year');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join(', '));
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    // Prepare data for API (try multiple field name formats)
    const submitData = {
      // Try different customer ID field names your API might expect
      customer_id: selectedCustomer.id,
      customerId: selectedCustomer.id,
      customer: selectedCustomer.id,
      
      // Vehicle data
      make: vehicleData.make.trim(),
      model: vehicleData.model.trim(),
      year: parseInt(vehicleData.year),
      color: vehicleData.color.trim() || null,
      vin: vehicleData.vin.trim() || null,
      mileage: vehicleData.mileage ? parseInt(vehicleData.mileage) : null,
      license_plate: vehicleData.license_plate.trim() || null
    };

    console.log('Submitting vehicle data:', submitData);
    console.log('Selected customer data:', selectedCustomer);

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText}`);
      }

      if (response.ok) {
        console.log('Vehicle added successfully:', result);
        alert('Vehicle added successfully!');
        
        // Reset form
        setSelectedCustomer(null);
        setCustomerSearchValue('');
        setVehicleData({
          make: '',
          model: '',
          year: '',
          color: '',
          vin: '',
          mileage: '',
          license_plate: ''
        });
      } else {
        console.error('Server error response:', result);
        throw new Error(result.message || result.error || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Network or parsing error:', error);
      setSubmitError(`Failed to add vehicle: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Add New Vehicle</h2>
        <p className="text-center text-gray-600">Enter vehicle details and select the owner</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Search */}
        <div>
          <CustomerSearch 
            onCustomerSelect={handleCustomerSelect}
            selectedCustomer={selectedCustomer}
            value={customerSearchValue}
            onChange={handleCustomerSearchChange}
          />
        </div>

        {/* Show selected customer confirmation */}
        {selectedCustomer && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Customer Selected</span>
            </div>
            <div className="mt-2 text-sm text-green-700">
              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Customer ID:</strong> {selectedCustomer.id}</p>
              {selectedCustomer.phone && <p><strong>Phone:</strong> {selectedCustomer.phone}</p>}
              {selectedCustomer.email && <p><strong>Email:</strong> {selectedCustomer.email}</p>}
            </div>
          </div>
        )}

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Make *
            </label>
            <input
              type="text"
              value={vehicleData.make}
              onChange={(e) => handleInputChange('make', e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Honda, Toyota, Ford"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <input
              type="text"
              value={vehicleData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Accord, Camry, F-150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <input
              type="number"
              value={vehicleData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2020"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              type="text"
              value={vehicleData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., White, Black, Silver"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            VIN (Vehicle Identification Number)
          </label>
          <input
            type="text"
            value={vehicleData.vin}
            onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            placeholder="17-character VIN"
            maxLength="17"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Mileage
            </label>
            <input
              type="number"
              value={vehicleData.mileage}
              onChange={(e) => handleInputChange('mileage', e.target.value)}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Plate
            </label>
            <input
              type="text"
              value={vehicleData.license_plate}
              onChange={(e) => handleInputChange('license_plate', e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., ABC123"
            />
          </div>
        </div>

        {/* Error message */}
        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Error:</span>
            </div>
            <p className="mt-1 text-red-700">{submitError}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!selectedCustomer || isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all transform ${
            !selectedCustomer || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Adding Vehicle...</span>
            </div>
          ) : !selectedCustomer ? (
            'Select Customer First'
          ) : (
            'Add Vehicle'
          )}
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;
