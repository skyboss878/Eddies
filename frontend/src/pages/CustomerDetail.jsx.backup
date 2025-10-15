// src/pages/CustomerDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from "../contexts/DataContext";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  TruckIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClipboardDocumentListIcon,
  PrinterIcon,
  ShareIcon,
  ClockIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    customers, 
    vehicles, 
    jobs, 
    estimates, 
    vehicleOps, 
    loading,
    isLoading 
  } = useData();

  const [activeTab, setActiveTab] = useState('vehicles');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const customer = customers.find(c => c.id === parseInt(id));
  const customerVehicles = vehicles.filter(v => v.customer_id === parseInt(id));
  const customerJobs = jobs.filter(j => {
    const vehicle = vehicles.find(v => v.id === j.vehicle_id);
    return vehicle && vehicle.customer_id === parseInt(id);
  });
  const customerEstimates = estimates.filter(e => {
    const vehicle = vehicles.find(v => v.id === e.vehicle_id);
    return vehicle && vehicle.customer_id === parseInt(id);
  });

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Not Found</h2>
          <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/customers')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      try {
        await vehicleOps.delete(vehicleId);
        setShowDeleteConfirm(null);
      } catch (error) {
        alert('Failed to delete vehicle: ' + error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {customer.first_name} {customer.last_name}
                </h1>
                <p className="text-gray-600 mt-1">Customer since {formatDate(customer.created_at)}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/customers/${id}/edit`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Customer
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                >
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Customer Info Grid */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    <a href={`tel:${customer.phone}`} className="hover:text-blue-600">
                      {customer.phone}
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    <a href={`mailto:${customer.email}`} className="hover:text-blue-600">
                      {customer.email}
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{customer.address || 'No address on file'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{customerVehicles.length}</div>
                <div className="text-sm text-gray-500">Vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{customerJobs.length}</div>
                <div className="text-sm text-gray-500">Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{customerEstimates.length}</div>
                <div className="text-sm text-gray-500">Estimates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(customerJobs.reduce((sum, job) => sum + (job.total || 0), 0))}
                </div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'vehicles', name: 'Vehicles', icon: TruckIcon },
              { id: 'jobs', name: 'Service History', icon: WrenchScrewdriverIcon },
              { id: 'estimates', name: 'Estimates', icon: ClipboardDocumentListIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Vehicles</h2>
                <button
                  onClick={() => navigate(`/vehicles/add?customerId=${id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Vehicle
                </button>
              </div>

              {customerVehicles.length === 0 ? (
                <div className="text-center py-12">
                  <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding a vehicle.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate(`/vehicles/add?customerId=${id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add First Vehicle
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customerVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-sm text-gray-500">{vehicle.color}</p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => navigate(`/vehicles/add?id=${vehicle.id}`)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        {vehicle.license_plate && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">License:</span>
                            <span className="font-mono">{vehicle.license_plate}</span>
                          </div>
                        )}
                        {vehicle.vin && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">VIN:</span>
                            <span className="font-mono text-xs">{vehicle.vin}</span>
                          </div>
                        )}
                        {vehicle.mileage && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Mileage:</span>
                            <span>{vehicle.mileage?.toLocaleString()} miles</span>
                          </div>
                        )}
                        {vehicle.oil_type && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Oil Type:</span>
                            <span>{vehicle.oil_type}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => navigate(`/jobs/create?vehicleId=${vehicle.id}`)}
                          className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Create Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Service History</h2>
                <button
                  onClick={() => navigate('/jobs/create')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Job
                </button>
              </div>

              {customerJobs.length === 0 ? (
                <div className="text-center py-12">
                  <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No service history</h3>
                  <p className="mt-1 text-sm text-gray-500">No jobs have been created for this customer yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerJobs.map((job) => {
                    const vehicle = vehicles.find(v => v.id === job.vehicle_id);
                    return (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {formatDate(job.created_at)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(job.total || 0)}
                            </div>
                            <div className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              job.status === 'completed' ? 'bg-green-100 text-green-800' :
                              job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {job.status?.replace('_', ' ') || 'pending'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Estimates Tab */}
          {activeTab === 'estimates' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Estimates</h2>
                <button
                  onClick={() => navigate('/estimates/new')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Estimate
                </button>
              </div>

              {customerEstimates.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No estimates</h3>
                  <p className="mt-1 text-sm text-gray-500">No estimates have been created for this customer yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerEstimates.map((estimate) => {
                    const vehicle = vehicles.find(v => v.id === estimate.vehicle_id);
                    return (
                      <div key={estimate.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Estimate #{estimate.id}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {formatDate(estimate.created_at)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(estimate.total || 0)}
                            </div>
                            <div className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              estimate.status === 'approved' ? 'bg-green-100 text-green-800' :
                              estimate.status === 'declined' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {estimate.status || 'pending'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
