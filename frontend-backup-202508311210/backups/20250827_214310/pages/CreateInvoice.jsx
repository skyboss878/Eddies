// src/pages/CreateInvoice.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiEndpoints } from '../utils';
import { Plus, Trash2, Save, Calculator, User, Car } from 'lucide-react';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEditing = Boolean(editId);
  
  const [loading, setLoading] = useState(false);
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

  const loadCustomers = async () => {
    try {
      const data = await apiEndpoints.customers.getAll();
      setCustomers(data);
    } catch (error) {
    }
  };

  const loadVehicles = async () => {
    try {
      const data = await apiEndpoints.vehicles.getAll();
      setVehicles(data);
    } catch (error) {
    }
  };

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const invoice = await apiEndpoints.invoices.getById(editId);
      setInvoiceData(invoice);
    } catch (error) {
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
      // Fallback to timestamp-based number
      const number = `INV-${Date.now().toString().slice(-6)}`;
      setInvoiceData(prev => ({ ...prev, invoiceNumber: number }));
    }
  };

  const addItem = () => {
    if (!newItem.description || newItem.unitPrice <= 0) {
      alert('Please fill in all item details');
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

    setNewItem({
      type: 'service',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxable: true
    });
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
    discountAmount = invoiceData.discountAmount;
  }
  
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (taxableAmount - discountAmount) * (invoiceData.taxRate / 100);
  const total = afterDiscount + taxAmount + invoiceData.hazardousWasteFee + invoiceData.shopSuppliesFee;

  const handleSave = async (status = 'draft') => {
    if (!invoiceData.customerId || invoiceData.items.length === 0) {
      alert('Please select a customer and add at least one item');
      return;
    }

    try {
      setLoading(true);
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
      alert('Failed to save invoice. Please try again.');
    } finally {
      setLoading(false);
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
                {is{isEditing ? `Invoice #${invoiceData.invoiceNumber}` : `Invoice #${invoiceData.invoiceNumber || 'Generating...'}`}
              </p>
            </div>
            <button
              onClick={() => handleSave('draft')}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-1" />
              Save Draft
            </button>
          </div>
        </div>

        {/* Invoice Form */}
        <div className="p-6 space-y-6">
          {/* Customer & Vehicle Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                value={invoiceData.customerId}
                onChange={(e) =>
                  setInvoiceData((prev) => ({ ...prev, customerId: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle</label>
              <select
                value={invoiceData.vehicleId}
                onChange={(e) =>
                  setInvoiceData((prev) => ({ ...prev, vehicleId: e.target.value }))
                }
                disabled={!invoiceData.customerId}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select Vehicle</option>
                {selectedCustomerVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Invoice Items</h2>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                    <th className="px-3 py-2 text-right">Unit Price</th>
                    <th className="px-3 py-2 text-right">Total</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                          }
                          className="w-16 border-gray-300 rounded-md text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                          }
                          className="w-20 border-gray-300 rounded-md text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">${item.total.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* New item row */}
                  <tr className="bg-gray-50">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={newItem.description}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: parseFloat(e.target.value) || 1 }))}
                        className="w-16 border-gray-300 rounded-md text-right"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                        className="w-20 border-gray-300 rounded-md text-right"
                      />
                    </td>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={addItem}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({invoiceData.taxRate}%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => handleSave('draft')}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave('sent')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
