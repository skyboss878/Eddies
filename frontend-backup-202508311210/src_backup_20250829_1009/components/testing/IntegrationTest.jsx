import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../../utils/apiEndpoints';
import { handleApiError } from '../../utils/errorUtils.jsx';
import { showSuccess, showError } from '../../utils/messageUtils';
import { initializeSocket, getSocket } from '../../utils/socketUtils';

const IntegrationTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [backendHealth, setBackendHealth] = useState(null);

  const addResult = (testName, success, message, data = null) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { success, message, data, timestamp: new Date().toLocaleTimeString() }
    }));
  };

  // Test 1: Backend Health Check
  const testBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:3001/health');
      const data = await response.json();
      setBackendHealth(true);
      addResult('health', true, 'Backend is running', data);
      return true;
    } catch (error) {
      setBackendHealth(false);
      addResult('health', false, 'Backend not accessible: ' + error.message);
      return false;
    }
  };

  // Test 2: API Endpoints
  const testApiEndpoints = async () => {
    const endpoints = [
      { name: 'vehicles', url: apiEndpoints.vehicles.list },
      { name: 'customers', url: apiEndpoints.customers.list },
      { name: 'workOrders', url: apiEndpoints.workOrders.list },
      { name: 'estimates', url: apiEndpoints.estimates.list }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        if (response.ok) {
          const data = await response.json();
          addResult(`api-${endpoint.name}`, true, 
            `${endpoint.name} API working (${response.status})`, 
            Array.isArray(data) ? `${data.length} items` : 'Data received');
        } else {
          addResult(`api-${endpoint.name}`, false, 
            `${endpoint.name} API failed: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        const errorInfo = handleApiError(error, endpoint.name);
        addResult(`api-${endpoint.name}`, false, 
          `${endpoint.name} API error: ${errorInfo.message}`);
      }
    }
  };

  // Test 3: Socket.IO Connection
  const testSocketConnection = async () => {
    try {
      const socket = initializeSocket();
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          addResult('socket', false, 'Socket connection timeout');
          resolve(false);
        }, 5000);

        socket.on('connect', () => {
          clearTimeout(timeout);
          addResult('socket', true, 'Socket.IO connected', socket.id);
          resolve(true);
        });

        socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          addResult('socket', false, 'Socket connection error: ' + error.message);
          resolve(false);
        });

        socket.connect();
      });
    } catch (error) {
      addResult('socket', false, 'Socket initialization error: ' + error.message);
      return false;
    }
  };

  // Test 4: Authentication (if endpoint exists)
  const testAuthentication = async () => {
    try {
      // Test auth verification endpoint
      const response = await fetch(apiEndpoints.auth.verify, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add token if you have one stored
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });

      if (response.status === 401) {
        addResult('auth', true, 'Auth endpoint working (no token)', 'Properly returns 401');
      } else if (response.ok) {
        const data = await response.json();
        addResult('auth', true, 'Auth endpoint working (with token)', data);
      } else {
        addResult('auth', false, `Auth endpoint error: ${response.status}`);
      }
    } catch (error) {
      addResult('auth', false, 'Auth test error: ' + error.message);
    }
  };

  // Test 5: CRUD Operations
  const testCrudOperations = async () => {
    // Test creating a test vehicle
    try {
      const testVehicle = {
        make: 'Test',
        model: 'Integration',
        year: 2024,
        vin: 'TEST123456789',
        customer_id: 1
      };

      const response = await fetch(apiEndpoints.vehicles.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testVehicle)
      });

      if (response.ok) {
        const data = await response.json();
        addResult('crud-create', true, 'Vehicle creation works', data);
        
        // Try to delete the test vehicle
        if (data.id) {
          const deleteResponse = await fetch(apiEndpoints.vehicles.delete(data.id), {
            method: 'DELETE'
          });
          
          if (deleteResponse.ok) {
            addResult('crud-delete', true, 'Vehicle deletion works');
          } else {
            addResult('crud-delete', false, `Delete failed: ${deleteResponse.status}`);
          }
        }
      } else {
        addResult('crud-create', false, `Create failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addResult('crud-create', false, 'CRUD test error: ' + error.message);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});

    addResult('start', true, 'Starting integration tests...');

    // Test 1: Health Check
    const healthOk = await testBackendHealth();
    
    if (healthOk) {
      // Test 2: API Endpoints
      await testApiEndpoints();
      
      // Test 3: Socket.IO
      await testSocketConnection();
      
      // Test 4: Authentication
      await testAuthentication();
      
      // Test 5: CRUD Operations
      await testCrudOperations();
    } else {
      addResult('skipped', false, 'Skipping other tests - backend not available');
    }

    addResult('complete', true, 'Integration tests completed');
    setIsRunning(false);
  };

  const getStatusIcon = (success) => {
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Frontend-Backend Integration Test
        </h2>

        {/* Backend Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Backend Status</h3>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${backendHealth === null ? 'text-yellow-500' : getStatusColor(backendHealth)}`}>
              {backendHealth === null ? '⏳' : getStatusIcon(backendHealth)}
            </span>
            <span>
              {backendHealth === null ? 'Not tested yet' : 
               backendHealth ? 'Backend is running' : 'Backend not accessible'}
            </span>
          </div>
        </div>

        {/* Test Controls */}
        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className={`px-6 py-2 rounded text-white font-medium ${
              isRunning 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? 'Running Tests...' : 'Run Integration Tests'}
          </button>
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Test Results</h3>
          
          {Object.keys(testResults).length === 0 && !isRunning && (
            <p className="text-gray-500 italic">No tests run yet. Click "Run Integration Tests" to start.</p>
          )}

          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className="border rounded p-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">{getStatusIcon(result.success)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">
                      {testName.replace('-', ' ').replace(/([A-Z])/g, ' $1')}
                    </h4>
                    <span className="text-sm text-gray-500">{result.timestamp}</span>
                  </div>
                  <p className={`text-sm mt-1 ${getStatusColor(result.success)}`}>
                    {result.message}
                  </p>
                  {result.data && (
                    <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-x-auto">
                      {typeof result.data === 'object' ? JSON.stringify(result.data, null, 2) : result.data}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h4 className="font-semibold text-blue-800 mb-2">Before Running Tests:</h4>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Make sure your backend is running: <code className="bg-blue-100 px-1 rounded">python app.py</code></li>
            <li>Backend should be accessible at <code className="bg-blue-100 px-1 rounded">http://localhost:3001</code></li>
            <li>Check browser console for any additional error details</li>
            <li>Ensure CORS is enabled in your backend for localhost:3000</li>
          </ol>
        </div>

        {/* Troubleshooting */}
        <div className="mt-4 p-4 bg-yellow-50 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">Common Issues:</h4>
          <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
            <li><strong>CORS errors:</strong> Add CORS headers in your Flask app.py</li>
            <li><strong>404 errors:</strong> Check if API routes match your backend endpoints</li>
            <li><strong>Connection refused:</strong> Backend not running or wrong port</li>
            <li><strong>Socket.IO errors:</strong> Backend may not have Socket.IO configured</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTest;
