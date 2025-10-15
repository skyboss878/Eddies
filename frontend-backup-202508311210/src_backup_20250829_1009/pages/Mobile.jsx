import React from 'react';

const Mobile = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mobile Dashboard</h1>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-600 text-white p-3 rounded-lg text-sm font-medium">
              New Job
            </button>
            <button className="bg-green-600 text-white p-3 rounded-lg text-sm font-medium">
              Time Clock
            </button>
            <button className="bg-purple-600 text-white p-3 rounded-lg text-sm font-medium">
              Search
            </button>
            <button className="bg-orange-600 text-white p-3 rounded-lg text-sm font-medium">
              Reports
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3">
              <p className="text-sm font-medium">Job #1234 Updated</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <p className="text-sm font-medium">New Customer Added</p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mobile;
