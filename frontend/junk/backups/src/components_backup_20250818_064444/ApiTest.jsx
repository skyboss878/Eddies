import React, { useState, useEffect } from 'react';
import { apiEndpoints } from "../utils/api".js';

const ApiTest = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const result = await apiUtils.testConnection();
      setStatus(result.connected ? 'connected' : 'disconnected');
      setError(result.connected ? null : result.message);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      case 'checking': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">API Connection Test</h3>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'connected' ? 'bg-green-500' : 
          status === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
        <span className={`font-medium ${getStatusColor()}`}>
          {status === 'checking' ? 'Checking...' : 
           status === 'connected' ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      <button
        onClick={testConnection}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Again
      </button>
    </div>
  );
};

export default ApiTest;
