// src/pages/PartsLaborManagement.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { apiEndpoints } from "../utils";
import { useSearchFilter } from "../hooks";
import ConfirmModal from '../components/modals/ConfirmModal';
import { showMessage } from "../utils";
import { Package, Wrench, Plus, Search, Edit, Trash2, AlertTriangle, X, ChevronUp, ChevronDown } from 'lucide-react';
import { debounce } from 'lodash';

// ---------- Validation ----------
const validatePartForm = (form) => {
  const errors = {};
  if (!form.name?.trim()) errors.name = 'Part name is required';
  if (form.cost && (isNaN(form.cost) || parseFloat(form.cost) < 0)) errors.cost = 'Cost must be a positive number';
  if (form.stockQuantity && (isNaN(form.stockQuantity) || parseInt(form.stockQuantity) < 0)) errors.stockQuantity = 'Stock quantity must be a positive number';
  if (form.minStockLevel && (isNaN(form.minStockLevel) || parseInt(form.minStockLevel) < 0)) errors.minStockLevel = 'Minimum stock level must be a positive number';
  return errors;
};

const validateLaborForm = (form) => {
  const errors = {};
  if (!form.serviceName?.trim()) errors.serviceName = 'Service name is required';
  if (!form.rate || isNaN(form.rate) || parseFloat(form.rate) <= 0) errors.rate = 'Rate must be a positive number';
  return errors;
};

// ---------- Custom Hook for Form ----------
const useFormValidation = (initialForm, validateFn) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = validateFn(form);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const reset = () => {
    setForm(initialForm);
    setErrors({});
  };

  return { form, errors, validate, updateField, reset, setForm };
};

// ---------- Form Input ----------
const FormInput = ({ label, error, className = "", ...props }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${className}`}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${props.name}-error` : undefined}
      {...props}
    />
    {error && (
      <p id={`${props.name}-error`} className="text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
);

// ---------- Forms ----------
const PartForm = ({ form, errors, updateField, onSubmit, loading, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <FormInput label="Part Name *" name="name" value={form.name} onChange={e => updateField('name', e.target.value)} error={errors.name} required />
    <FormInput label="Part Number" name="partNumber" value={form.partNumber} onChange={e => updateField('partNumber', e.target.value)} error={errors.partNumber} />
    <FormInput label="Cost ($)" name="cost" type="number" min="0" step="0.01" value={form.cost} onChange={e => updateField('cost', e.target.value)} error={errors.cost} />
    <FormInput label="Stock Quantity" name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={e => updateField('stockQuantity', e.target.value)} error={errors.stockQuantity} />
    <FormInput label="Minimum Stock Level" name="minStockLevel" type="number" min="0" value={form.minStockLevel} onChange={e => updateField('minStockLevel', e.target.value)} error={errors.minStockLevel} />
    <div className="flex justify-end gap-2 pt-4">
      <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">Cancel</button>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 transition-colors">
        {loading ? 'Saving...' : 'Save Part'}
      </button>
    </div>
  </form>
);

const LaborForm = ({ form, errors, updateField, onSubmit, loading, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <FormInput label="Service Name *" name="serviceName" value={form.serviceName} onChange={e => updateField('serviceName', e.target.value)} error={errors.serviceName} required />
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={e => updateField('description', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={3}
        aria-describedby={errors.description ? 'description-error' : undefined}
      />
      {errors.description && <p id="description-error" className="text-sm text-red-600" role="alert">{errors.description}</p>}
    </div>
    <FormInput label="Rate per Hour ($) *" name="rate" type="number" min="0" step="0.01" value={form.rate} onChange={e => updateField('rate', e.target.value)} error={errors.rate} required />
    <div className="flex justify-end gap-2 pt-4">
      <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">Cancel</button>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 transition-colors">
        {loading ? 'Saving...' : 'Save Labor Rate'}
      </button>
    </div>
  </form>
);

// ---------- Modal ----------
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef();
  useEffect(() => { if (isOpen) modalRef.current?.focus(); }, [isOpen]);
  useEffect(() => {
    const handleEscape = e => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1" aria-label="Close modal"><X size={24} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ---------- Main Component ----------
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

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Forms
  const initialPartForm = { name: '', partNumber: '', cost: '', stockQuantity: '', minStockLevel: '' };
  const initialLaborForm = { serviceName: '', description: '', rate: '' };

  const { form: partForm, errors: partErrors, validate: validatePart, updateField: updatePartField,reset: resetPartForm, setForm: setPartForm } = useFormValidation(initialPartForm, validatePartForm);
  const { form: laborForm, errors: laborErrors, validate: validateLabor, updateField: updateLaborField, reset: resetLaborForm, setForm: setLaborForm } = useFormValidation(initialLaborForm, validateLaborForm);

  // Search filter hooks
  const { filteredData: filteredParts, setSearchTerm: setPartsSearchTerm } = useSearchFilter(parts, { searchableFields: ['name', 'partNumber'] });
  const { filteredData: filteredLaborRates, setSearchTerm: setLaborSearchTerm } = useSearchFilter(laborRates, { searchableFields: ['serviceName'] });

  // Load parts & labor rates
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [partsRes, laborRes] = await Promise.all([
        apiEndpoints.parts.getAll(),
        apiEndpoints.labor.getAll(),
      ]);
      setParts(partsRes);
      setLaborRates(laborRes);
    } catch (error) {
      showMessage('Failed to load data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    setLowStockParts(parts.filter(p => Number(p.stockQuantity) <= Number(p.minStockLevel)));
  }, [parts]);

  // ADDED: Reset state on tab change
  useEffect(() => {
    setCurrentPage(1);
    setSortField('');
    setSortOrder('asc');
  }, [activeTab]);

  // Debounced search
  const handleSearchChange = debounce((value) => {
    if (activeTab === 'parts') setPartsSearchTerm(value);
    else setLaborSearchTerm(value);
  }, 300);

  // ---------- Sorting ----------
  const sortedData = useMemo(() => {
    const data = activeTab === 'parts' ? filteredParts : filteredLaborRates;
    if (!sortField) return data;

    // IMPROVED: Define numeric fields for robust sorting
    const numericFields = ['cost', 'stockQuantity', 'minStockLevel', 'rate'];

    return [...data].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';

      if (numericFields.includes(sortField)) {
        const numA = parseFloat(aVal) || 0;
        const numB = parseFloat(bVal) || 0;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }
      
      return sortOrder === 'asc' 
        ? String(aVal).localeCompare(String(bVal)) 
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredParts, filteredLaborRates, activeTab, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  // ---------- Form Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = activeTab === 'parts' ? partForm : laborForm;
    const isValid = activeTab === 'parts' ? validatePart() : validateLabor();
    if (!isValid) { showMessage('Please fix the errors before submitting.', 'error'); return; }

    setLoading(true);
    try {
      const api = activeTab === "parts" ? apiEndpoints.parts : apiEndpoints.labor;
      if (editingItem) await api.update(editingItem.id, form);
      else await api.create(form);

      await loadData();
      handleCloseModal();
      showMessage(`${activeTab === 'parts' ? 'Part' : 'Labor rate'} ${editingItem ? 'updated' : 'saved'} successfully!`, 'success');
    } catch (error) {
      showMessage(`Failed to save ${activeTab === 'parts' ? 'part' : 'labor rate'}.`, 'error');
    } finally { setLoading(false); }
  };

  // ---------- Edit / Delete ----------
  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'parts') setPartForm(item);
    else setLaborForm(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setConfirmAction(() => async () => {
      try {
        const api = activeTab === "parts" ? apiEndpoints.parts : apiEndpoints.labor;
        await api.delete(id);
        await loadData();
        showMessage(`${activeTab === 'parts' ? 'Part' : 'Labor rate'} deleted successfully.`, 'success');
      } catch (error) {
        showMessage(`Failed to delete ${activeTab === 'parts' ? 'part' : 'labor rate'}.`, 'error');
      }
    });
    setShowConfirm(true);
  };

  const handleConfirmResponse = (confirmed) => { setShowConfirm(false); if (confirmed && confirmAction) confirmAction(); };
  const handleCloseModal = () => { setShowModal(false); setEditingItem(null); resetPartForm(); resetLaborForm(); };
  const handleAddNew = () => { setEditingItem(null); resetPartForm(); resetLaborForm(); setShowModal(true); };

  // ---------- Stats ----------
  const stats = useMemo(() => [
    { name: 'Total Parts', value: parts.length, color: 'bg-blue-500' },
    { name: 'Low Stock', value: lowStockParts.length, color: 'bg-yellow-500' },
    { name: 'Total Labor Rates', value: laborRates.length, color: 'bg-green-500' },
    { name: 'Average Labor Rate', value: laborRates.length ? `$${(laborRates.reduce((sum,l)=>sum+parseFloat(l.rate||0),0)/laborRates.length).toFixed(2)}/hr` : '$0', color: 'bg-purple-500' }
  ], [parts, lowStockParts, laborRates]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Parts & Labor Management</h1>
        <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" aria-label={`Add new ${activeTab}`}>
          <Plus size={18} /> Add {activeTab === 'parts' ? 'Part' : 'Labor Rate'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.name} className={`${stat.color} text-white p-4 rounded-lg shadow-sm flex justify-between items-center`}>
            <span className="font-medium">{stat.name}</span>
            <span className="font-bold text-lg">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="inline-flex rounded-lg shadow-sm overflow-hidden" role="tablist">
          <button onClick={() => setActiveTab('parts')} className={`px-4 py-2 font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-inset ${activeTab === 'parts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} role="tab" aria-selected={activeTab==='parts'} aria-controls="parts-panel"><Package size={16} className="inline mr-1" /> Parts</button>
          <button onClick={() => setActiveTab('labor')} className={`px-4 py-2 font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-inset ${activeTab === 'labor' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} role="tab" aria-selected={activeTab==='labor'} aria-controls="labor-panel"><Wrench size={16} className="inline mr-1" /> Labor Rates</button>
        </div>
        <div className="flex items-center gap-2 w-full md:max-w-md">
          <Search size={18} className="text-gray-500" />
          <input type="text" onChange={e=>handleSearchChange(e.target.value)} placeholder={`Search ${activeTab==='parts'?'parts':'labor rates'}`} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      {/* Low stock alert */}
      {activeTab==='parts' && lowStockParts.length>0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg flex items-center gap-2" role="alert">
          <AlertTriangle size={20} className="flex-shrink-0" />
          <span><strong>{lowStockParts.length}</strong> part{lowStockParts.length!==1?'s are':' is'} below minimum stock level!</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full text-sm" role="table">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-900 cursor-pointer" onClick={()=>handleSort(activeTab==='parts'?'name':'serviceName')}>
                <div className="flex items-center gap-1"> {/* IMPROVED: Icon alignment */}
                  {activeTab==='parts'?'Part Name':'Service Name'}
                  {sortField === (activeTab==='parts'?'name':'serviceName') && (sortOrder==='asc'?<ChevronUp size={14}/>:<ChevronDown size={14}/> )}
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 cursor-pointer" onClick={()=>handleSort(activeTab==='parts'?'partNumber':'description')}>
                <div className="flex items-center gap-1"> {/* IMPROVED: Icon alignment */}
                  {activeTab==='parts'?'Part Number':'Description'}
                  {sortField === (activeTab==='parts'?'partNumber':'description') && (sortOrder==='asc'?<ChevronUp size={14}/>:<ChevronDown size={14}/> )}
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900 cursor-pointer" onClick={()=>handleSort(activeTab==='parts'?'stockQuantity':'rate')}>
                <div className="flex items-center gap-1"> {/* IMPROVED: Icon alignment */}
                  {activeTab==='parts'?'Stock Quantity':'Rate per Hour'}
                  {sortField === (activeTab==='parts'?'stockQuantity':'rate') && (sortOrder==='asc'?<ChevronUp size={14}/>:<ChevronDown size={14}/> )}
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : (
              paginatedData.map(item => (
                <tr key={item.id} className={`border-t hover:bg-gray-50 ${activeTab==='parts' && item.stockQuantity<=item.minStockLevel?'bg-yellow-50 border-yellow-200':'border-gray-200'}`}>
                  <td className="p-4 font-medium text-gray-900">{activeTab==='parts'?item.name:item.serviceName}</td>
                  <td className="p-4 text-gray-700">{activeTab==='parts'?item.partNumber||'—':item.description||'—'}</td>
                  <td className="p-4 text-gray-700">{activeTab==='parts'?`${item.stockQuantity} ${item.stockQuantity<=item.minStockLevel?'⚠️':''}`:`$${parseFloat(item.rate).toFixed(2)}/hr`}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={()=>handleEdit(item)} className="text-blue-600 hover:text-blue-800 p-1 rounded focus:ring-2 focus:ring-blue-500"><Edit size={18} /></button>
                    <button onClick={()=>handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-1 rounded focus:ring-2 focus:ring-red-500"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination */}
        {sortedData.length > pageSize && (
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
            {Array.from({length: Math.ceil(sortedData.length/pageSize)}, (_, i) => i+1).map(p=>(
              <button key={p} onClick={()=>setCurrentPage(p)} className={`px-3 py-1 border rounded transition-colors ${p===currentPage?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Confirm & Form Modals */}
      {showConfirm && <ConfirmModal message="Are you sure you want to delete this item?" onConfirm={()=>handleConfirmResponse(true)} onCancel={()=>handleConfirmResponse(false)} />}
      <Modal isOpen={showModal} onClose={handleCloseModal} title={`${editingItem?'Edit':'Add'} ${activeTab==='parts'?'Part':'Labor Rate'}`}>
        {activeTab==='parts'?<PartForm form={partForm} errors={partErrors} updateField={updatePartField} onSubmit={handleSubmit} onCancel={handleCloseModal} loading={loading} />:<LaborForm form={laborForm} errors={laborErrors} updateField={updateLaborField} onSubmit={handleSubmit} onCancel={handleCloseModal} loading={loading} />}
      </Modal>
    </div>
  );
};

export default PartsLaborManagement;
