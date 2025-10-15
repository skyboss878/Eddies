import React, { useState, useEffect, useRef } from 'react';
import { Search, Car, User, Wrench, DollarSign, Plus, X, Bot, CheckCircle } from 'lucide-react';

const EnhancedJobCreation = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [parts, setParts] = useState([]);
  const [laborCost, setLaborCost] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [aiDiagnosing, setAiDiagnosing] = useState(false);
  const [aiResults, setAiResults] = useState(null);

  const customerInputRef = useRef(null);
  const vehicleInputRef = useRef(null);

  // Mock data - replace with your actual API calls
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Smith', phone: '555-0123', email: 'john@email.com' },
    { id: 2, name: 'Sarah Johnson', phone: '555-0456', email: 'sarah@email.com' },
    { id: 3, name: 'Mike Davis', phone: '555-0789', email: 'mike@email.com' },
    { id: 4, name: 'Lisa Wilson', phone: '555-0101', email: 'lisa@email.com' },
  ]);

  const [vehicles, setVehicles] = useState([
    { id: 1, customerId: 1, year: '2020', make: 'Toyota', model: 'Camry', vin: '1234567890' },
    { id: 2, customerId: 1, year: '2018', make: 'Honda', model: 'Civic', vin: '0987654321' },
    { id: 3, customerId: 2, year: '2019', make: 'Ford', model: 'F-150', vin: '1122334455' },
    { id: 4, customerId: 3, year: '2021', make: 'BMW', model: 'X3', vin: '5544332211' },
  ]);

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Filter vehicles based on selected customer and search
  const filteredVehicles = vehicles.filter(vehicle => {
    if (!selectedCustomer) return false;
    const matchesCustomer = vehicle.customerId === selectedCustomer.id;
    const matchesSearch = vehicleSearch === '' || 
      `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(vehicleSearch.toLowerCase());
    return matchesCustomer && matchesSearch;
  });

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
    setSelectedVehicle(null);
    setVehicleSearch('');
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleSearch(`${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    setShowVehicleDropdown(false);
  };

  // Add part
  const addPart = () => {
    setParts([...parts, { id: Date.now(), name: '', cost: '', quantity: 1 }]);
  };

  // Remove part
  const removePart = (id) => {
    setParts(parts.filter(part => part.id !== id));
  };

  // Update part
  const updatePart = (id, field, value) => {
    setParts(parts.map(part => 
      part.id === id ? { ...part, [field]: value } : part
    ));
  };

  // AI Diagnosis
  const handleAiDiagnosis = async () => {
    if (!problemDescription.trim() || !selectedVehicle) {
      alert('Please select a vehicle and describe the problem first');
      return;
    }

    setAiDiagnosing(true);
    
    // Simulate AI API call
    setTimeout(() => {
      const mockDiagnosis = {
        diagnosis: "Based on the symptoms described, this appears to be a brake system issue. Common causes include:",
        recommendations: [
          "Replace brake pads - estimated $150-200",
          "Brake fluid flush - estimated $80-120", 
          "Inspect brake rotors for warping - potential $200-400 if replacement needed"
        ],
        estimatedTotal: "$230-$720",
        confidence: "85%"
      };
      
      setAiResults(mockDiagnosis);
      
      // Auto-populate parts based on AI diagnosis
      const suggestedParts = [
        { id: Date.now(), name: 'Brake Pads (Front)', cost: '175', quantity: 1 },
        { id: Date.now() + 1, name: 'Brake Fluid', cost: '25', quantity: 1 }
      ];
      setParts(suggestedParts);
      setLaborCost('150');
      
      setAiDiagnosing(false);
    }, 3000);
  };

  // Calculate total
  const calculateTotal = () => {
    const partsTotal = parts.reduce((sum, part) => sum + (parseFloat(part.cost || 0) * part.quantity), 0);
    const labor = parseFloat(laborCost || 0);
    return partsTotal + labor;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Create New Job
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className="w-4 h-4" />
            Smart AI-Powered Workflow
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer & Vehicle */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Search */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <User className="w-4 h-4 text-blue-400" />
                Customer
              </label>
              <div className="relative">
                <input
                  ref={customerInputRef}
                  type="text"
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerDropdown(true);
                    if (!e.target.value) {
                      setSelectedCustomer(null);
                      setSelectedVehicle(null);
                      setVehicleSearch('');
                    }
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  placeholder="Search by name, phone, or email..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                
                {showCustomerDropdown && filteredCustomers.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => handleCustomerSelect(customer)}
                        className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                      >
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-400">{customer.phone} • {customer.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedCustomer && (
                <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-400">{selectedCustomer.name}</div>
                      <div className="text-sm text-gray-400">{selectedCustomer.phone}</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Search */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Car className="w-4 h-4 text-blue-400" />
                Vehicle
              </label>
              <div className="relative">
                <input
                  ref={vehicleInputRef}
                  type="text"
                  value={vehicleSearch}
                  onChange={(e) => {
                    setVehicleSearch(e.target.value);
                    setShowVehicleDropdown(true);
                  }}
                  onFocus={() => selectedCustomer && setShowVehicleDropdown(true)}
                  disabled={!selectedCustomer}
                  placeholder={selectedCustomer ? "Search vehicle..." : "Select a customer first"}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                
                {showVehicleDropdown && filteredVehicles.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {filteredVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        onClick={() => handleVehicleSelect(vehicle)}
                        className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                      >
                        <div className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                        <div className="text-sm text-gray-400">VIN: {vehicle.vin}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedVehicle && (
                <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-400">
                        {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                      </div>
                      <div className="text-sm text-gray-400">VIN: {selectedVehicle.vin}</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Problem Description */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Wrench className="w-4 h-4 text-blue-400" />
                Problem Description
              </label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe the vehicle's problem in detail..."
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
              
              {/* AI Diagnosis Button */}
              <button
                onClick={handleAiDiagnosis}
                disabled={aiDiagnosing || !problemDescription.trim() || !selectedVehicle}
                className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {aiDiagnosing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    Get AI Diagnosis
                  </>
                )}
              </button>
            </div>

            {/* AI Results */}
            {aiResults && (
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-lg font-semibold mb-3 text-purple-300">AI Diagnosis Results</h3>
                <p className="text-gray-300 mb-4">{aiResults.diagnosis}</p>
                <div className="space-y-2 mb-4">
                  {aiResults.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{rec}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-purple-300">Confidence: {aiResults.confidence}</span>
                  <span className="font-semibold text-green-400">Est. Total: {aiResults.estimatedTotal}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Parts & Costs */}
          <div className="space-y-6">
            {/* Parts Needed */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  Parts Needed
                </label>
                <button
                  onClick={addPart}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Part
                </button>
              </div>

              <div className="space-y-3">
                {parts.map((part) => (
                  <div key={part.id} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={part.name}
                        onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                        placeholder="Part name"
                        className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removePart(part.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={part.quantity}
                        onChange={(e) => updatePart(part.id, 'quantity', parseInt(e.target.value) || 1)}
                        placeholder="Qty"
                        min="1"
                        className="w-16 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex-1 relative">
                        <DollarSign className="absolute left-2 top-1.5 w-3 h-3 text-gray-400" />
                        <input
                          type="number"
                          value={part.cost}
                          onChange={(e) => updatePart(part.id, 'cost', e.target.value)}
                          placeholder="Cost"
                          step="0.01"
                          className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 pl-6 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {parts.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No parts added yet. Use AI Diagnosis to auto-populate!
                  </div>
                )}
              </div>
            </div>

            {/* Labor Cost */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <DollarSign className="w-4 h-4 text-blue-400" />
                Labor Cost
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-lg p-6 border border-green-500/30">
              <h3 className="text-lg font-semibold mb-2 text-green-300">Estimate Total</h3>
              <div className="text-3xl font-bold text-green-400">
                ${calculateTotal().toFixed(2)}
              </div>
            </div>

            {/* Create Job Button */}
            <button
              onClick={() => {
                if (!selectedCustomer || !selectedVehicle || !problemDescription.trim()) {
                  alert('Please fill in all required fields');
                  return;
                }
                alert('Job created successfully! (This would integrate with your backend)');
              }}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Create Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJobCreation;
