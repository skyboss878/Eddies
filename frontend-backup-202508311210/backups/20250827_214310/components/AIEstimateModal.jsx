// src/components/AIEstimateModal.jsx
import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  SparklesIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  PrinterIcon,
} from '@heroicons/react/24/solid';

const AIEstimateModal = ({ 
  isOpen, 
  onClose, 
  onEstimateGenerated,
  initialData = null 
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleMileage: '',
    serviceType: '',
    description: '',
    urgency: 'normal',
  });
  const [estimate, setEstimate] = useState(null);

  const serviceTypes = [
    { id: 'oil_change', name: 'Oil Change', basePrice: 45 },
    { id: 'brake_service', name: 'Brake Service', basePrice: 200 },
    { id: 'transmission', name: 'Transmission Service', basePrice: 350 },
    { id: 'engine_repair', name: 'Engine Repair', basePrice: 500 },
    { id: 'electrical', name: 'Electrical Diagnostics', basePrice: 150 },
    { id: 'ac_service', name: 'A/C Service', basePrice: 120 },
    { id: 'tire_service', name: 'Tire Service', basePrice: 80 },
    { id: 'inspection', name: 'Vehicle Inspection', basePrice: 25 },
    { id: 'other', name: 'Other Service', basePrice: 100 },
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low Priority', multiplier: 0.9 },
    { value: 'normal', label: 'Normal Priority', multiplier: 1.0 },
    { value: 'high', label: 'High Priority', multiplier: 1.2 },
    { value: 'emergency', label: 'Emergency', multiplier: 1.5 },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const generateAIEstimate = async () => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const selectedService = serviceTypes.find(s => s.id === formData.serviceType);
    const urgencyMultiplier = urgencyOptions.find(u => u.value === formData.urgency)?.multiplier || 1.0;
    
    // Simulate AI calculations with some randomness
    const basePrice = selectedService?.basePrice || 100;
    const complexityFactor = Math.random() * 0.5 + 0.75; // 0.75 - 1.25
    const vehicleAgeFactor = formData.vehicleYear ? (2024 - parseInt(formData.vehicleYear)) / 20 + 1 : 1.2;
    const mileageFactor = formData.vehicleMileage ? Math.max(1, parseInt(formData.vehicleMileage) / 100000) : 1.1;
    
    const laborCost = Math.round(basePrice * complexityFactor * urgencyMultiplier);
    const partsCost = Math.round(laborCost * 0.6 * vehicleAgeFactor * mileageFactor);
    const subtotal = laborCost + partsCost;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + tax;
    
    const estimatedHours = Math.max(0.5, Math.round((laborCost / 85) * 10) / 10);
    
    const newEstimate = {
      id: Date.now(),
      customer: formData.customerName,
      vehicle: `${formData.vehicleYear} ${formData.vehicleMake} ${formData.vehicleModel}`,
      service: selectedService?.name || 'Custom Service',
      laborCost,
      partsCost,
      subtotal,
      tax,
      total,
      estimatedHours,
      urgency: formData.urgency,
      description: formData.description,
      createdAt: new Date().toISOString(),
      breakdown: [
        { item: 'Labor', description: `${estimatedHours} hours @ $85/hour`, cost: laborCost },
        { item: 'Parts & Materials', description: 'Estimated parts cost', cost: partsCost },
        { item: 'Shop Supplies', description: 'Fluids, filters, etc.', cost: Math.round(subtotal * 0.05) },
      ],
      notes: [
        'This is an AI-generated estimate based on typical repair costs.',
        'Final costs may vary based on actual diagnosis and parts availability.',
        'Estimate valid for 30 days.',
        urgencyMultiplier > 1 ? 'Rush job pricing applied due to urgency level.' : null,
      ].filter(Boolean),
    };
    
    setEstimate(newEstimate);
    setStep(3);
    setLoading(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Service Estimate - Eddie's Automotive</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .section { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .total { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Eddie's Askan Automotive</h1>
            <p>Service Estimate</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${estimate.customer}</p>
            <p><strong>Vehicle:</strong> ${estimate.vehicle}</p>
            <p><strong>Service:</strong> ${estimate.service}</p>
          </div>
          
          <div class="section">
            <h3>Estimate Breakdown</h3>
            <table>
              <tr><th>Item</th><th>Description</th><th>Cost</th></tr>
              ${estimate.breakdown.map(item => 
                `<tr><td>${item.item}</td><td>${item.description}</td><td>$${item.cost}</td></tr>`
              ).join('')}
              <tr class="total"><td colspan="2">Total</td><td>$${estimate.total}</td></tr>
            </table>
          </div>
          
          <div class="section">
            <h3>Notes</h3>
            ${estimate.notes.map(note => `<p>• ${note}</p>`).join('')}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const resetModal = () => {
    setStep(1);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      vehicleMileage: '',
      serviceType: '',
      description: '',
      urgency: 'normal',
    });
    setEstimate(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <SparklesIcon className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">AI Service Estimate</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= num ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step > num ? 'bg-purple-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span>Vehicle Info</span>
            <span className="mx-8">Service Details</span>
            <span>AI Estimate</span>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Vehicle Information */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TruckIcon className="w-5 h-5 mr-2" />
                Vehicle & Customer Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Make *</label>
                  <input
                    type="text"
                    value={formData.vehicleMake}
                    onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Honda, Toyota, Ford..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model *</label>
                  <input
                    type="text"
                    value={formData.vehicleModel}
                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Civic, Camry, F-150..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={formData.vehicleYear}
                    onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="2020"
                    min="1990"
                    max="2025"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                  <input
                    type="number"
                    value={formData.vehicleMileage}
                    onChange={(e) => handleInputChange('vehicleMileage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="75000"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.customerName || !formData.vehicleMake || !formData.vehicleModel}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next: Service Details
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
                Service Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {serviceTypes.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleInputChange('serviceType', service.id)}
                        className={`p-3 text-left border rounded-md transition-colors ${
                          formData.serviceType === service.id
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">Starting at ${service.basePrice}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {urgencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                        {option.multiplier !== 1.0 && ` (${option.multiplier > 1 ? '+' : ''}${Math.round((option.multiplier - 1) * 100)}%)`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Problem Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    placeholder="Describe the issue, symptoms, or specific service needed..."
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={generateAIEstimate}
                  disabled={!formData.serviceType}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Generate AI Estimate
                </button>
              </div>
            </div>
          )}

          {/* Step 3: AI Estimate Results */}
          {step === 3 && (
            <div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">AI is analyzing your service request...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : estimate && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Generated Estimate
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Customer</p>
                        <p className="font-medium">{estimate.customer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Vehicle</p>
                        <p className="font-medium">{estimate.vehicle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service</p>
                        <p className="font-medium">{estimate.service}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Time</p>
                        <p className="font-medium flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {estimate.estimatedHours} hours
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden mb-6">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Item</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {estimate.breakdown.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.item}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                            <td className="px-4 py-3 text-sm text-right">${item.cost}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td colSpan="2" className="px-4 py-3 text-sm font-medium text-gray-900">Subtotal</td>
                          <td className="px-4 py-3 text-sm font-medium text-right">${estimate.subtotal}</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td colSpan="2" className="px-4 py-3 text-sm text-gray-600">Tax (8%)</td>
                          <td className="px-4 py-3 text-sm text-right">${estimate.tax}</td>
                        </tr>
                        <tr className="bg-purple-50">
                          <td colSpan="2" className="px-4 py-3 text-lg font-bold text-purple-900">Total</td>
                          <td className="px-4 py-3 text-lg font-bold text-right text-purple-900">${estimate.total}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {estimate.notes.map((note, index) => (
                        <li key={index}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back to Edit
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handlePrint}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <PrinterIcon className="w-4 h-4 mr-2" />
                        Print
                      </button>
                      
                      <button
                        onClick={() => {
                          onEstimateGenerated(estimate);
                          handleClose();
                        }}
                        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                      >
                        <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                        Save Estimate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIEstimateModal;
