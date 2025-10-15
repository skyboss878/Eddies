import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { FaPlus, FaFileCsv, FaFilePdf, FaEdit, FaTrash, FaWrench } from 'react-icons/fa';
import { format } from 'date-fns';
import { useData } from '../contexts/DataContext';
import { useSearchFilter } from '../hooks/useSearchFilter';
import { estimateService } from '../utils/api';
import ConfirmModal from '../components/modals/ConfirmModal';
import { showMessage } from '../utils/toast';
import { Parser } from 'json2csv';

export default function EstimatesList() {
  const navigate = useNavigate();
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const {
    searchTerm,
    setSearchTerm,
    filteredItems,
    sortConfig,
    handleSort
  } = useSearchFilter(estimates || [], ['customerName', 'vehicleInfo', 'status', 'total', 'date']);

  useEffect(() => {
    loadEstimates();
  }, []);

  const loadEstimates = async () => {
    try {
      setLoading(true);
      const response = await estimateService.getAll();
      const estimatesData = Array.isArray(response?.data) ? response.data : [];
      setEstimates(estimatesData);
      setError('');
    } catch (err) {
      console.error('Error loading estimates:', err);
      setError('Failed to load estimates');
      showMessage('Failed to load estimates', 'error');
      setEstimates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await estimateService.delete(id);
      setEstimates(prev => prev.filter(est => est.id !== id));
      showMessage('Estimate deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting estimate:', err);
      showMessage('Failed to delete estimate', 'error');
    }
  };

  const handleConvertToJob = async (estimate) => {
    try {
      showMessage('Converting estimate to job...', 'info');
      navigate(`/jobs/new?from_estimate=${estimate.id}`);
    } catch (err) {
      console.error('Error converting estimate:', err);
      showMessage('Failed to convert estimate to job', 'error');
    }
  };

  const exportToPDF = () => {
    const itemsToExport = filteredItems || [];
    const doc = new jsPDF();
    const tableData = itemsToExport.map(est => [
      est.customerName || '',
      est.vehicleInfo || '',
      est.status || 'draft',
      parseFloat(est.total || 0).toFixed(2),
      est.date ? format(new Date(est.date), 'MM/dd/yyyy') : ''
    ]);

    doc.autoTable({
      head: [['Customer', 'Vehicle', 'Status', 'Total', 'Date']],
      body: tableData,
      startY: 20,
    });

    doc.save('estimates.pdf');
    showMessage('PDF exported successfully', 'success');
  };

  const exportToCSV = () => {
    try {
      const itemsToExport = filteredItems || [];
      const parser = new Parser({ fields: ['customerName', 'vehicleInfo', 'status', 'total', 'date'] });
      const csv = parser.parse(itemsToExport.map(est => ({
        customerName: est.customerName || '',
        vehicleInfo: est.vehicleInfo || '',
        status: est.status || 'draft',
        total: parseFloat(est.total || 0).toFixed(2),
        date: est.date ? format(new Date(est.date), 'MM/dd/yyyy') : ''
      })));

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "estimates.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showMessage('CSV exported successfully', 'success');
    } catch (err) {
      console.error('CSV export error:', err);
      showMessage('Failed to export CSV', 'error');
    }
  };

  const renderSkeleton = () => (
    <tr>
      {Array.from({ length: 6 }).map((_, idx) => (
        <td key={idx} className="px-6 py-4 whitespace-nowrap animate-pulse bg-gray-100">&nbsp;</td>
      ))}
    </tr>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Estimates</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/estimates/new')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <FaPlus /> New Estimate
          </button>
          <button
            onClick={exportToPDF}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <FaFilePdf /> Export PDF
          </button>
          <button
            onClick={exportToCSV}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-2"
          >
            <FaFileCsv /> Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search estimates..."
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              {['Customer', 'Vehicle', 'Status', 'Total', 'Date', 'Actions'].map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => col !== 'Actions' && handleSort(col.toLowerCase())}
                >
                  {col}
                  {sortConfig?.key === col.toLowerCase() ? (
                    sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'
                  ) : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => renderSkeleton())
              : (!filteredItems || filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No estimates found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((estimate) => (
                    <tr key={estimate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/estimates/${estimate.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {estimate.customerName || 'N/A'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {estimate.vehicleInfo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          estimate.status === 'approved' ? 'bg-green-100 text-green-800' :
                          estimate.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {estimate.status || 'draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${parseFloat(estimate.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {estimate.date ? format(new Date(estimate.date), 'MM/dd/yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            aria-label="Edit Estimate"
                            onClick={() => navigate(`/estimates/${estimate.id}/edit`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          {estimate.status === 'approved' && (
                            <button
                              aria-label="Convert to Job"
                              onClick={() => handleConvertToJob(estimate)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <FaWrench />
                            </button>
                          )}
                          <button
                            aria-label="Delete Estimate"
                            onClick={() => {
                              setConfirmMessage(`Are you sure you want to delete this estimate?`);
                              setConfirmAction(() => () => handleDelete(estimate.id));
                              setShowConfirm(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ))
            }
          </tbody>
        </table>
      </div>

      {showConfirm && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={() => {
            if (confirmAction) confirmAction();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
