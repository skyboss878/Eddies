// src/pages/ViewJobs.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaEdit, FaTrash, FaClipboardList } from 'react-icons/fa';
import { format } from 'date-fns';

import { useDataOperations } from "../hooks";
import { useSearchFilter } from "../hooks"; // ✨ 1. We import our powerful hook
import ConfirmModal from '../components/modals/ConfirmModal';

// (Pagination component can remain the same)

const ViewJobs = () => {
  const navigate = useNavigate();
  const { enrichedJobs, loading: initialLoading, jobOps, utils } = useDataOperations();

  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // ✨ 2. We initialize the hook with our job data and define which fields are searchable.
  // This is the core of the implementation.
  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredJobs,
  } = useSearchFilter(enrichedJobs || [], {
    searchableFields: ['id', 'description', 'customerName', 'vehicleInfo', 'status'],
  });

  // Paginate the *filtered* data
  const currentJobs = useMemo(() => {
    const firstIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(firstIndex, firstIndex + itemsPerPage);
  }, [filteredJobs, currentPage, itemsPerPage]);

  const handleConfirmDelete = async () => {
    if (jobToDelete) {
      await jobOps.delete(jobToDelete.id);
      setJobToDelete(null);
    }
  };

  const getStatusBadge = (status) => { /*... same as before... */ };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Work Orders ({filteredJobs.length})
        </h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* ✨ 3. The search input is directly connected to the hook's state. */}
          <input
            type="search"
            placeholder="Search work orders..."
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
          />
          <button
            onClick={() => navigate('/create-job')}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            Create Job
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full text-sm text-left">
          {/*... (Table Head remains the same)... */}
          <tbody className="divide-y divide-gray-200">
            {initialLoading? (
              <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
            ) : currentJobs.length > 0? (
              // ✨ 4. We render the `currentJobs` which is the paginated version of the hook's `filteredData`.
              currentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{job.id}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{job.description}</td>
                  <td className="px-4 py-3 text-gray-600">{job.customerName}</td>
                  <td className="px-4 py-3 text-gray-600">{job.vehicleInfo}</td>
                  <td className="px-4 py-3 text-gray-600">{format(new Date(job.created_at), 'PP')}</td>
                  <td className="px-4 py-3">{getStatusBadge(job.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/create-job/${job.id}`} className="text-blue-600 hover:text-blue-800 p-1" title="Edit Job">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => setJobToDelete(job)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Job"
                        disabled={utils.isLoading(`deleteJob_${job.id}`)}
                      >
                        <FaTrash />
                      </button>
                      <Link to={`/invoice/${job.id}`} className="text-green-600 hover:text-green-800 p-1" title="View Invoice">
                        <FaClipboardList />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="p-8 text-center text-gray-500">No jobs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/*... (Pagination and ConfirmModal remain the same, powered by filteredJobs.length)... */}
    </div>
  );
};

export default ViewJobs;

