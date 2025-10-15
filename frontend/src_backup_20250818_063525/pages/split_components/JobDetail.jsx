export default function JobDetail() {
  const { id } = useParams();
  const { jobs } = useData();
  const job = jobs.find(j => j.id === parseInt(id));

  if (!job) {
    return <div className="p-6">Job not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Detail #{job.id}</h1>
      <p>{job.description}</p>
      {/* Add more job details as needed */}
    </div>
  );
}

// src/pages/EstimateDetail.jsx - Basic structure (you can expand this)
import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

