// src/pages/AddVehicle.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { apiEndpoints } from "../utils";
import { useData } from "../contexts";

export default function AddVehicle() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get vehicle ID from URL params or search params
  const vehicleId = searchParams.get("id");
  const customerId = searchParams.get("customerId");

  const { customers, refreshData } = useData();
  const [customerSearch, setCustomerSearch] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  
  const [form, setForm] = useState({
    customerId: customerId || "",
    make: "",
    model: "",
    year: "",
    vin: "",
    mileage: "",
    color: "",
    licensePlate: "",
    oilType: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        if (vehicleId) {
          const response = await apiEndpoints.vehicles.getById(vehicleId);
          const vehicleData = response.data;
          setForm({
            customerId: vehicleData.customer_id?.toString() || "",
            make: vehicleData.make || "",
            model: vehicleData.model || "",
            year: vehicleData.year?.toString() || "",
            vin: vehicleData.vin || "",
            mileage: vehicleData.mileage?.toString() || "",
            color: vehicleData.color || "",
            licensePlate: vehicleData.license_plate || "",
            oilType: vehicleData.oil_type || "",
          });
          
          // Set customer search if we have customer data
          const customer = customers.find(c => c.id === vehicleData.customer_id);
          if (customer) {
            setCustomerSearch(`${customer.first_name} ${customer.last_name} - ${customer.phone}`);
          }
        } else if (customerId) {
          // Pre-select customer if passed via URL
          const customer = customers.find(c => c.id === parseInt(customerId));
          if (customer) {
            setCustomerSearch(`${customer.first_name} ${customer.last_name} - ${customer.phone}`);
          }
        }
      } catch (error) {
        alert("Failed to load vehicle data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (customers.length > 0) {
      fetchInitialData();
    } else {
      setLoading(false);
    }
  }, [vehicleId, customerId, customers]);

  // Filter customers based on search
  useEffect(() => {
    if (customerSearch.trim()) {
      const filtered = customers.filter(customer => {
        const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
        const phone = customer.phone?.toLowerCase() || '';
        const email = customer.email?.toLowerCase() || '';
        const search = customerSearch.toLowerCase();
        
        return fullName.includes(search) || 
               phone.includes(search) || 
               email.includes(search);
      });
      setFilteredCustomers(filtered.slice(0, 10)); // Limit to 10 results
    } else {
      setFilteredCustomers([]);
    }
  }, [customerSearch, customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCustomerSelect = (customer) => {
    setForm({ ...form, customerId: customer.id.toString() });
    setCustomerSearch(`${customer.first_name} ${customer.last_name} - ${customer.phone}`);
    setShowCustomerDropdown(false);
    setErrors(prev => ({ ...prev, customerId: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.customerId) newErrors.customerId = "Customer is required";
    if (!form.make.trim()) newErrors.make = "Make is required";
    if (!form.model.trim()) newErrors.model = "Model is required";
    if (!form.year) newErrors.year = "Year is required";
    else if (form.year < 1900 || form.year > new Date().getFullYear() + 2) {
      newErrors.year = "Year must be between 1900 and " + (new Date().getFullYear() + 2);
    }
    
    if (form.vin && form.vin.length !== 17) {
      newErrors.vin = "VIN must be exactly 17 characters";
    }
    
    if (form.mileage && form.mileage < 0) {
      newErrors.mileage = "Mileage cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);

    const dataToSend = {
      customer_id: parseInt(form.customerId),
      make: form.make.trim(),
      model: form.model.trim(),
      year: parseInt(form.year),
      vin: form.vin.trim() || null,
      mileage: form.mileage ? parseInt(form.mileage) : null,
      color: form.color.trim() || null,
      license_plate: form.licensePlate.trim() || null,
      oil_type: form.oilType.trim() || null,
    };

    try {
      if (vehicleId) {
        await apiEndpoints.vehicles.update(vehicleId, dataToSend);
        alert('Vehicle updated successfully!');
      } else {
        await apiEndpoints.vehicles.create(dataToSend);
        alert('Vehicle added successfully!');
      }

      // Refresh data to get latest vehicles
      await refreshData();
      
      // Navigate back to customer page if we have a customer ID
      if (form.customerId) {
        navigate(`/customers/${form.customerId}`);
      } else {
        navigate("/vehicles");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              {vehicleId ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h1>
            <p className="text-blue-100 mt-1">
              {vehicleId ? 'Update vehicle information' : 'Enter vehicle details below'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Customer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerDropdown(true);
                    if (!e.target.value.trim()) {
                      setForm({ ...form, customerId: "" });
                    }
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  placeholder="Search customers by name, phone, or email..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.customerId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                
                {showCustomerDropdown && filteredCustomers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => handleCustomerSelect(customer)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.phone} • {customer.email}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.customerId && (
                <p className="text-red-500 text-sm">{errors.customerId}</p>
              )}
            </div>

            {/* Vehicle Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Make */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="make"
                  value={form.make}
                  onChange={handleChange}
                  placeholder="e.g., Toyota, Ford, Honda"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.make ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.make && (
                  <p className="text-red-500 text-sm">{errors.make}</p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="e.g., Camry, F-150, Accord"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.model && (
                  <p className="text-red-500 text-sm">{errors.model}</p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 2}
                  placeholder={new Date().getFullYear().toString()}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.year ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.year && (
                  <p className="text-red-500 text-sm">{errors.year}</p>
                )}
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  placeholder="e.g., Red, Blue, Silver"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* License Plate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  License Plate
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={form.licensePlate}
                  onChange={handleChange}
                  placeholder="e.g., ABC123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Mileage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mileage
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={form.mileage}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 75000"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.mileage ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.mileage && (
                  <p className="text-red-500 text-sm">{errors.mileage}</p>
                )}
              </div>
            </div>

            {/* VIN and Oil Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* VIN */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  VIN (Vehicle Identification Number)
                </label>
                <input
                  type="text"
                  name="vin"
                  value={form.vin}
                  onChange={handleChange}
                  placeholder="17-character VIN"
                  maxLength={17}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                    errors.vin ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.vin && (
                  <p className="text-red-500 text-sm">{errors.vin}</p>
                )}
                <p className="text-xs text-gray-500">
                  Enter the 17-character VIN for accurate vehicle identification
                </p>
              </div>

              {/* Oil Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Oil Type
                </label>
                <select
                  name="oilType"
                  value={form.oilType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select oil type...</option>
                  <option value="Conventional">Conventional Oil</option>
                  <option value="High Mileage">High Mileage Oil</option>
                  <option value="Synthetic Blend">Synthetic Blend</option>
                  <option value="Full Synthetic">Full Synthetic</option>
                  <option value="Diesel">Diesel Oil</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {vehicleId ? 'Updating...' : 'Adding...'}
                  </div>
                ) : (
                  vehicleId ? 'Update Vehicle' : 'Add Vehicle'
                )}
              </button>
              
              {!vehicleId && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!validateForm()) return;
                    
                    setSubmitting(true);
                    try {
                      const dataToSend = {
                        customer_id: parseInt(form.customerId),
                        make: form.make.trim(),
                        model: form.model.trim(),
                        year: parseInt(form.year),
                        vin: form.vin.trim() || null,
                        mileage: form.mileage ? parseInt(form.mileage) : null,
                        color: form.color.trim() || null,
                        license_plate: form.licensePlate.trim() || null,
                        oil_type: form.oilType.trim() || null,
                      };
                      
                      await apiEndpoints.vehicles.create(dataToSend);
                      alert('Vehicle added successfully!');
                      
                      // Reset form for another vehicle
                      setForm({
                        customerId: form.customerId, // Keep same customer
                        make: "",
                        model: "",
                        year: "",
                        vin: "",
                        mileage: "",
                        color: "",
                        licensePlate: "",
                        oilType: "",
                      });
                      
                      await refreshData();
                    } catch (error) {
                      alert(`Error: ${error.response?.data?.message || error.message}`);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add & Add Another
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
