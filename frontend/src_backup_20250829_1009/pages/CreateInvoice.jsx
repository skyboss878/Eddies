// src/pages/CreateInvoice.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiEndpoints } from '../utils';
import { Plus, Trash2, Save, Calculator, User, Car, Calendar, FileText, AlertCircle } from 'lucide-react';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEditing = Boolean(editId);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedCustomerVehicles, setSelectedCustomerVehicles] = useState([]);

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    customerId: '',
    vehicleId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'draft', // draft, sent, paid, overdue
    items: [],
    notes: '',
    taxRate: 8.75,
    discountAmount: 0,
    discountType: 'amount', // amount or percentage
    hazardousWasteFee: 0,
    shopSuppliesFee: 0
  });

  const [newItem, setNewItem] = useState({
    type: 'service', // service, part, labor
    description: '',
    quantity: 1,
    unitPrice: 0,
    taxable: true
  });

  // Load initial data
  useEffect(() => {
    loadCustomers();
    loadVehicles();
    if (isEditing) {
      loadInvoice();
    } else {
      generateInvoiceNumber();
    }
  }, [isEditing, editId]);

  // Filter vehicles when customer changes
  useEffect(() => {
    if (invoiceData.customerId) {
      const customerVehicles = vehicles.filter(v => v.customerId === invoiceData.customerId);
      setSelectedCustomerVehicles(customerVehicles);
      if (!customerVehicles.find(v => v.id === invoiceData.vehicleId)) {
        setInvoiceData(prev => ({ ...prev, vehicleId: '' }));
      }
    } else {
      setSelectedCustomerVehicles([]);
    }
  }, [invoiceData.customerId, vehicles]);

  // Auto-set due date when invoice date changes
  useEffect(() => {
    if (invoiceData.invoiceDate && !invoiceData.dueDate) {
      const invoiceDate = new Date(invoiceData.invoiceDate);
      const dueDate = new Date(invoiceDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days later
      setInvoiceData(prev => ({ 
        ...prev, 
        dueDate: dueDate.toISOString().split('T')[0] 
      }));
    }
  }, [invoiceData.invoiceDate]);

  const loadCustomers = async () => {
    try {
      const data = await apiEndpoints.customers.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
      setErrors(prev => ({ ...prev, customers: 'Failed to load customers' }));
    }
  };

  const loadVehicles = async () => {
    try {
      const data = await apiEndpoints.vehicles.getAll();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
      setErrors(prev => ({ ...prev, vehicles: 'Failed to load vehicles' }));
    }
  };

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const invoice = await apiEndpoints.invoices.getById(editId);
      setInvoiceData(invoice);
    } catch (error) {
      console.error('Failed to load invoice:', error);
      setErrors(prev => ({ ...prev, invoice: 'Failed to load invoice' }));
      navigate('/app/invoices');
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceNumber = async () => {
    try {
      const response = await apiEndpoints.invoices.generateNumber();
      setInvoiceData(prev => ({ ...prev, invoiceNumber: response.number }));
    } catch (error) {
      console.error('Failed to generate invoice number:', error);
      // Fallback to timestamp-based number
      const number = `INV-${Date.now().toString().slice(-6)}`;
      setInvoiceData(prev => ({ ...prev, invoiceNumber: number }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!invoiceData.customerId) {
      newErrors.customerId = 'Please select a customer';
    }
    
    if (invoiceData.items.length === 0) {
      newErrors.items = 'Please add at least one item';
    }
    
    if (!invoiceData.invoiceDate) {
      newErrors.invoiceDate = 'Please select an invoice date';
    }
    
    if (!invoiceData.dueDate) {
      newErrors.dueDate = 'Please select a due date';
    }

    // Validate items
    const itemErrors = invoiceData.items.some(item => 
      !item.description.trim() || item.quantity <= 0 || item.unitPrice < 0
    );
    
    if (itemErrors) {
      newErrors.items = 'Please ensure all items have valid description, quantity, and price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    if (!newItem.description.trim()) {
      alert('Please enter a description for the item');
      return;
    }
    
    if (newItem.unitPrice < 0) {
      alert('Unit price cannot be negative');
      return;
    }

    if (newItem.quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    const item = {
      ...newItem,
      id: Date.now(),
      total: newItem.quantity * newItem.unitPrice
    };

    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    // Clear the form
    setNewItem({
      type: 'service',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxable: true
    });

    // Clear item errors if they exist
    if (errors.items) {
      setErrors(prev => ({ ...prev, items: undefined }));
    }
  };

  const removeItem = (itemId) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (itemId, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  // Calculations
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
  const taxableAmount = invoiceData.items
    .filter(item => item.taxable)
    .reduce((sum, item) => sum + item.total, 0);

  let discountAmount = 0;
  if (invoiceData.discountType === 'percentage') {
    discountAmount = subtotal * (invoiceData.discountAmount / 100);
  } else {
    discountAmount = Math.min(invoiceData.discountAmount, subtotal); // Discount can't exceed subtotal
  }

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.max(0, (taxableAmount - discountAmount) * (invoiceData.taxRate / 100));
  const total = afterDiscount + taxAmount + invoiceData.hazardousWasteFee + invoiceData.shopSuppliesFee;

  const handleSave = async (status = 'draft') => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const invoiceToSave = {
        ...invoiceData,
        status,
        subtotal,
        discountAmount,
        taxAmount,
        total
      };

      if (isEditing) {
        await apiEndpoints.invoices.update(editId, invoiceToSave);
      } else {
        await apiEndpoints.invoices.create(invoiceToSave);
      }

      navigate('/app/invoices');
    } catch (error) {
      console.error('Failed to save invoice:', error);
      alert('Failed to save invoice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
    // Clear related errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedCustomer = customers.find(c => c.id === invoiceData.customerId);
  const selectedVehicle = selectedCustomerVehicles.find(v => v.id === invoiceData.vehicleId);

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Invoice' : 'Create New Invoice'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? `Invoice #${invoiceData.invoiceNumber}` 
                  : `Invoice #${invoiceData.invoiceNumber || 'Generating...'}`
                }
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/app/invoices')}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-1" />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Form */}
        <div className="p-6 space-y-6">
          {/* Customer & Vehicle Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Customer *
              </label>
              <select
                value={invoiceData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.customerId ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.customerId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Car className="w-4 h-4 inline mr-1" />
                Vehicle
              </label>
              <select
                value={invoiceData.vehicleId}
                onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                disabled={!invoiceData.customerId}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
              >
                <option value="">Select Vehicle</option>
                {selectedCustomerVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Invoice Date *
              </label>
              <input
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.invoiceDate ? 'border-red-500' : ''
                }`}
              />
              {errors.invoiceDate && (
                <p className="mt-1 text-sm text-red-600">{errors.invoiceDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date *
              </label>
              <input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.dueDate ? 'border-red-500' : ''
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Items Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Invoice Items</h2>
              {errors.items && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.items}
                </p>
              )}
            </div>
            
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-3 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">
                      Taxable
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceData.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Item description"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 border-gray-300 rounded-md text-right focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                          }
                          className="w-24 border-gray-300 rounded-md text-right focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={item.taxable}
                          onChange={(e) => updateItem(item.id, 'taxable', e.target.checked)}
                          className="rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {/* New item row */}
                  <tr className="bg-gray-50 border-t-2">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Enter description..."
                        value={newItem.description}
                        onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 1 }))}
                        className="w-16 border-gray-300 rounded-md text-right focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                        className="w-24 border-gray-300 rounded-md text-right focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={newItem.taxable}
                        onChange={(e) => setNewItem(prev => ({ ...prev, taxable: e.target.checked }))}
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      ${(newItem.quantity * newItem.unitPrice).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={addItem}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Add item"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Fees and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-md font-semibold">Additional Fees</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hazardous Waste Fee
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={invoiceData.hazardousWasteFee}
                  onChange={(e) => handleInputChange('hazardousWasteFee', parseFloat(e.target.value) || 0)}
                  className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Supplies Fee
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={invoiceData.shopSuppliesFee}
                  onChange={(e) => handleInputChange('shopSuppliesFee', parseFloat(e.target.value) || 0)}
                  className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-semibold">Discount & Tax</h3>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={invoiceData.discountAmount}
                    onChange={(e) => handleInputChange('discountAmount', parseFloat(e.target.value) || 0)}
                    className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={invoiceData.discountType}
                    onChange={(e) => handleInputChange('discountType', e.target.value)}
                    className="border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="amount">$</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={invoiceData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                  className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 inline mr-1" />
              Notes
            </label>
            <textarea
              rows={3}
              value={invoiceData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              placeholder="Additional notes for this invoice..."
            />
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end">
              <div className="w-80 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Invoice Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax ({invoiceData.taxRate}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  {invoiceData.hazardousWasteFee > 0 && (
                    <div className="flex justify-between">
                      <span>Hazardous Waste Fee:</span>
                      <span>${invoiceData.hazardousWasteFee.toFixed(2)}</span>
                    </div>
                  )}
                  {invoiceData.shopSuppliesFee > 0 && (
                    <div className="flex justify-between">
                      <span>Shop Supplies Fee:</span>
                      <span>${invoiceData.shopSuppliesFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave('sent')}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save & Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
