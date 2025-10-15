// src/pages/VehicleDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from "../contexts";
import { vehicleHelpers } from "../utils";
import { 
  PencilIcon, 
  TrashIcon, 
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  PrinterIcon,
  ShareIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, customers, jobs, estimates, vehicleOps } = useData();

  const vehicle = vehicles.find(v => v.id === parseInt(id));
  const customer = vehicle ? customers.find(c => c.id === vehicle.customer_id) : null;
  const vehicleJobs = jobs.filter(j => j.vehicle_id === parseInt(id));
  const vehicleEstimates = estimates.filter(e => e.vehicle_id === parseInt(id));

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h2>
          <button
            onClick={() => navigate('/vehicles')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleOps.delete(vehicle.id);
        navigate('/vehicles');
      } catch (error) {
        alert('Failed to delete vehicle: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {vehicleHelpers.formatVehicleName(vehicle)}
                </h1>
                {customer && (
                  <p className="text-gray-600 mt-2">
                    Owner: <span className="font-medium">{customer.first_name} {customer.last_name}</span>
                  </p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/vehicles/${id}/edit`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                >
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print
                </button>
                
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Make:</span>
                <span className="font-medium">{vehicle.make}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Model:</span>
                <span className="font-medium">{vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Year:</span>
                <span className="font-medium">{vehicle.year}</span>
              </div>
              {vehicle.color && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Color:</span>
                  <span className="font-medium">{vehicle.color}</span>
                </div>
              )}
              {vehicle.mileage && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Mileage:</span>
                  <span className="font-medium">{vehicleHelpers.formatMileage(vehicle.mileage)}</span>
                </div>
              )}
              {vehicle.license_plate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">License Plate:</span>
                  <span className="font-medium font-mono">{vehicle.license_plate}</span>
                </div>
              )}
              {vehicle.vin && (
                <div className="flex justify-between">
                  <span className="text-gray-500">VIN:</span>
                  <span className="font-medium font-mono text-sm">{vehicle.vin}</span>
                </div>
              )}
              {vehicle.oil_type && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Oil Type:</span>
                  <span className="font-medium">{vehicle.oil_type}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/jobs/create?vehicleId=${vehicle.id}`)}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
                Create Service Job
              </button>
              
              <button
                onClick={() => navigate(`/estimates/new?vehicleId=${vehicle.id}`)}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
              >
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                Create Estimate
              </button>
              
              {customer && (
                <button
                  onClick={() => navigate(`/customers/${customer.id}`)}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  View Owner Details
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Service History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service History ({vehicleJobs.length})</h2>
          {vehicleJobs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No service history for this vehicle yet.</p>
          ) : (
            <div className="space-y-4">
              {vehicleJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{job.description}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${job.total || 0}</div>
                      <div className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.status || 'pending'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


