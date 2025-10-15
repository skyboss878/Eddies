
// src/components/JobCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  WrenchScrewdriverIcon, 
  ClockIcon, 
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import api from "../utils/api";

const JobCard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await api.get('/jobs?status=pending,in_progress&limit=5');
      setJobs(response.data.items || []);
    } catch (error) {
      // Fallback data
      setJobs([
        {
          id: 1,
          job_number: 'JOB-2024-156',
          title: 'Oil Change Service',
          customer: { name: 'John Smith' },
          vehicle: { year: 2020, make: 'Honda', model: 'Civic' },
          status: 'in_progress',
          total_amount: 85.50,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          job_number: 'JOB-2024-157',
          title: 'Brake Inspection',
          customer: { name: 'Sarah Wilson' },
          vehicle: { year: 2018, make: 'Toyota', model: 'Camry' },
          status: 'pending',
          total_amount: 125.00,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <WrenchScrewdriverIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <WrenchScrewdriverIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No active jobs</p>
        <Link
          to="/jobs/new"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Create New Job
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                {getStatusIcon(job.status)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">#{job.job_number}</h4>
                <p className="text-sm text-gray-600">{job.title}</p>
                <p className="text-xs text-gray-500">
                  {job.customer?.name} • {job.vehicle?.year} {job.vehicle?.make} {job.vehicle?.model}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                {job.status.replace('_', ' ')}
              </span>
              <p className="text-sm font-medium text-gray-900 mt-1">
                ${parseFloat(job.total_amount || 0).toFixed(2)}
              </p>
              <Link
                to={`/jobs/${job.id}`}
                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-500 mt-1"
              >
                <EyeIcon className="h-3 w-3 mr-1" />
                View
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-4">
        <Link
          to="/jobs"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          View all jobs →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
