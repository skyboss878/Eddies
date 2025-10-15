// src/pages/PartsLaborManagement.jsx
import React, { useState, useEffect } from 'react';
import { partService, laborService } from '../utils/api';
import { useSearchFilter } from '../hooks/useSearchFilter';
import ConfirmModal from '../components/modals/ConfirmModal';
import { showMessage } from '../utils/toast';
import {
  Package, Wrench, Plus, Search, Edit, Trash2, AlertTriangle
} from 'lucide-react';

const PartsLaborManagement = () => {
  const [activeTab, setActiveTab] = useState('parts');
  const [parts, setParts] = useState([]);
  const [laborRates, setLaborRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [lowStockParts, setLowStockParts] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Form state
  const [partForm, setPartForm] = useState({ name: '', partNumber: '', cost: '', stockQuantity: '', minStockLevel: '' });
  const [laborForm, setLaborForm] = useState({ serviceName: '', description: '', rate: '' });

  const { filteredData: filteredParts, setSearchTerm: setPartsSearchTerm } = useSearchFilter(parts, {
    searchableFields: ['name', 'partNumber'],
  });

  const { filteredData: filteredLaborRates, setSearchTerm: setLaborSearchTerm } = useSearchFilter(laborRates, {
    searchableFields: ['serviceName'],
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setLowStockParts(parts.filter(p => Number(p.stockQuantity) <= Number(p.minStockLevel)));
  }, [parts]);

  const handleSearchChange = (e) => {
    if (activeTab === 'parts') setPartsSearchTerm(e.target.value);
    else setLaborSearchTerm(e.target.value);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [partsRes, laborRes] = await Promise.all([
        partService.getAll(),
        laborService.getAll(),
      ]);
      setParts(partsRes);
      setLaborRates(laborRes);
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isPartsTab = activeTab === 'parts';
      const endpoint = isPartsTab ? API_ENDPOINTS.parts : API_ENDPOINTS.laborRates;
      const form = isPartsTab ? partForm : laborForm;

      if (editingItem) {
        await (activeTab === "parts" ? partService : laborService).update(editingItem.id, form);
      } else {
        await (activeTab === "parts" ? partService : laborService).create(form);
      }

      await loadData();
      setShowModal(false);
      setEditingItem(null);
      showMessage(`Item ${editingItem ? 'updated' : 'saved'} successfully!`, 'success');
    } catch (error) {
      console.error('Error saving item:', error);
      showMessage('Failed to save item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'parts') setPartForm(item);
    else setLaborForm(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setConfirmAction(() => async () => {
      try {
        const endpoint = activeTab === 'parts' ? API_ENDPOINTS.parts : API_ENDPOINTS.laborRates;
        await (activeTab === "parts" ? partService : laborService).delete(id);
        await loadData();
        showMessage('Item deleted successfully.', 'success');
      } catch (error) {
        console.error('Error deleting item:', error);
        showMessage('Failed to delete item.', 'error');
      }
    });
    setShowConfirm(true);
  };

  const handleConfirmResponse = (confirmed) => {
    setShowConfirm(false);
    if (confirmed && confirmAction) confirmAction();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Parts & Labor Management</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setPartForm({ name: '', partNumber: '', cost: '', stockQuantity: '', minStockLevel: '' });
            setLaborForm({ serviceName: '', description: '', rate: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus size={18} /> Add {activeTab === 'parts' ? 'Part' : 'Labor Rate'}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="inline-flex rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => setActiveTab('parts')}
            className={`px-4 py-2 font-medium ${activeTab === 'parts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <Package size={16} className="inline mr-1" /> Parts
          </button>
          <button
            onClick={() => setActiveTab('labor')}
            className={`px-4 py-2 font-medium ${activeTab === 'labor' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            <Wrench size={16} className="inline mr-1" /> Labor Rates
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          onChange={handleSearchChange}
          placeholder={`Search ${activeTab === 'parts' ? 'Parts' : 'Labor'}`}
          className="w-full max-w-md px-4 py-2 border rounded shadow-sm"
        />
      </div>

      {/* Low stock warning */}
      {activeTab === 'parts' && lowStockParts.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded flex items-center gap-2">
          <AlertTriangle size={20} />
          <span>{lowStockParts.length} part(s) are below minimum stock level!</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">{activeTab === 'parts' ? 'Part Number' : 'Description'}</th>
              <th className="text-left p-3">{activeTab === 'parts' ? 'Stock' : 'Rate/hr'}</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'parts' ? filteredParts : filteredLaborRates).map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{activeTab === 'parts' ? item.name : item.serviceName}</td>
                <td className="p-3">{activeTab === 'parts' ? item.partNumber : item.description}</td>
                <td className="p-3">
                  {activeTab === 'parts' ? `${item.stockQuantity} pcs` : `$${item.rate}/hr`}
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this item? This action cannot be undone."
          onConfirm={() => handleConfirmResponse(true)}
          onCancel={() => handleConfirmResponse(false)}
        />
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} {activeTab === 'parts' ? 'Part' : 'Labor Rate'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'parts' ? (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    value={partForm.name}
                    onChange={(e) => setPartForm({ ...partForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Part Number"
                    value={partForm.partNumber}
                    onChange={(e) => setPartForm({ ...partForm, partNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Cost"
                    value={partForm.cost}
                    onChange={(e) => setPartForm({ ...partForm, cost: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={partForm.stockQuantity}
                    onChange={(e) => setPartForm({ ...partForm, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Minimum Stock Level"
                    value={partForm.minStockLevel}
                    onChange={(e) => setPartForm({ ...partForm, minStockLevel: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Service Name"
                    value={laborForm.serviceName}
                    onChange={(e) => setLaborForm({ ...laborForm, serviceName: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={laborForm.description}
                    onChange={(e) => setLaborForm({ ...laborForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Rate per hour"
                    value={laborForm.rate}
                    onChange={(e) => setLaborForm({ ...laborForm, rate: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartsLaborManagement;
