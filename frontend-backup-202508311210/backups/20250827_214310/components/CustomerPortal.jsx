import React, { useState, useEffect } from 'react';

const CustomerPortal = () => {
  const [customerData, setCustomerData] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);

  useEffect(() => {
    // Simulate fetching customer data
    setCustomerData({
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      vehicles: [
        { id: 1, make: 'Toyota', model: 'Camry', year: 2020, vin: 'ABC123' },
        { id: 2, make: 'Honda', model: 'Civic', year: 2019, vin: 'DEF456' }
      ]
    });

    setActiveJobs([
      {
        id: 1,
        jobNumber: 'JOB-2024-001',
        vehicle: '2020 Toyota Camry',
        status: 'In Progress',
        description: 'Oil change and brake inspection',
        estimatedCompletion: '2024-08-14T15:00:00',
        progress: 75
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {customerData.name}!</h1>
          <p className="text-gray-600">Track your vehicle services and schedule appointments</p>
        </div>

        {/* Active Jobs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Services</h2>
          {activeJobs.length > 0 ? (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{job.jobNumber}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{job.vehicle}</p>
                  <p className="text-sm text-gray-800 mb-3">{job.description}</p>
                  
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Estimated completion: {new Date(job.estimatedCompletion).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No active services at this time.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Schedule Service</h3>
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Book Appointment
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Service History</h3>
            <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
              View History
            </button>
          </div>
        </div>

        {/* My Vehicles */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Vehicles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {customerData.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                <p className="text-sm text-gray-600">VIN: {vehicle.vin}</p>
                <button className="mt-2 text-blue-600 text-sm hover:text-blue-800">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;
