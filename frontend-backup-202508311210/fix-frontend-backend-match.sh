#!/bin/bash

cd ~/eddies-asian-automotive/frontend

echo "🔧 Updating frontend to match backend API structure..."

# 1. Update .env file with correct backend URL
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
echo "✅ Updated .env with correct backend URL"

# 2. Update apiEndpoints.js to match your actual backend routes
cat > src/utils/apiEndpoints.js << 'EOF'
// API endpoint configuration - matches backend app.py routes
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiEndpoints = {
  // Health check
  health: `${BASE_URL}/health`,
  
  // Authentication (all require auth token)
  auth: {
    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/auth/logout`,
    register: `${BASE_URL}/auth/register`,
    registerWithCode: `${BASE_URL}/auth/register-with-code`,
    me: `${BASE_URL}/auth/me`,
    changePassword: `${BASE_URL}/auth/change-password`,
    refresh: `${BASE_URL}/auth/refresh`
  },
  
  // Customers (all under /api/auth/)
  customers: {
    list: `${BASE_URL}/auth/customers`,
    create: `${BASE_URL}/auth/customers`,
    update: (id) => `${BASE_URL}/auth/customers/${id}`,
    delete: (id) => `${BASE_URL}/auth/customers/${id}`,
    get: (id) => `${BASE_URL}/auth/customers/${id}`,
    vehicles: (id) => `${BASE_URL}/auth/customers/${id}/vehicles`,
    search: `${BASE_URL}/auth/customers/search`
  },
  
  // Vehicles (all under /api/auth/)
  vehicles: {
    list: `${BASE_URL}/auth/vehicles`,
    create: `${BASE_URL}/auth/vehicles`,
    get: (id) => `${BASE_URL}/auth/vehicles/${id}`,
    vinLookup: (vin) => `${BASE_URL}/auth/vehicles/vin-lookup/${vin}`
  },
  
  // Jobs (Work Orders - called 'jobs' in backend)
  jobs: {
    list: `${BASE_URL}/auth/jobs`,
    create: `${BASE_URL}/auth/jobs`,
    get: (id) => `${BASE_URL}/auth/jobs/${id}`,
    updateStatus: (id) => `${BASE_URL}/auth/jobs/${id}/status`,
    addParts: (id) => `${BASE_URL}/auth/jobs/${id}/parts`,
    addLabor: (id) => `${BASE_URL}/auth/jobs/${id}/labor`
  },
  
  // Work Orders (alias for jobs for frontend consistency)
  workOrders: {
    list: `${BASE_URL}/auth/jobs`,
    create: `${BASE_URL}/auth/jobs`,
    get: (id) => `${BASE_URL}/auth/jobs/${id}`,
    updateStatus: (id) => `${BASE_URL}/auth/jobs/${id}/status`,
    addParts: (id) => `${BASE_URL}/auth/jobs/${id}/parts`,
    addLabor: (id) => `${BASE_URL}/auth/jobs/${id}/labor`
  },
  
  // Estimates
  estimates: {
    list: `${BASE_URL}/auth/estimates`,
    create: `${BASE_URL}/auth/estimates`,
    convertToJob: (id) => `${BASE_URL}/auth/estimates/${id}/convert-to-job`
  },
  
  // Invoices
  invoices: {
    list: `${BASE_URL}/auth/invoices`,
    create: `${BASE_URL}/auth/invoices`,
    get: (id) => `${BASE_URL}/auth/invoices/${id}`,
    update: (id) => `${BASE_URL}/auth/invoices/${id}`,
    markPaid: (id) => `${BASE_URL}/auth/invoices/${id}/mark-paid`
  },
  
  // Parts & Inventory
  parts: {
    list: `${BASE_URL}/auth/parts`,
    create: `${BASE_URL}/auth/parts`,
    lowStock: `${BASE_URL}/auth/inventory/low-stock`
  },
  
  // Time Clock
  timeClock: {
    clockIn: `${BASE_URL}/auth/timeclock/clock-in`,
    clockOut: `${BASE_URL}/auth/timeclock/clock-out`,
    status: `${BASE_URL}/auth/timeclock/status`,
    history: `${BASE_URL}/auth/timeclock/history`
  },
  
  // Dashboard
  dashboard: {
    stats: `${BASE_URL}/auth/dashboard/stats`,
    recentActivity: `${BASE_URL}/auth/dashboard/recent-activity`
  },
  
  // Reports
  reports: {
    sales: `${BASE_URL}/auth/reports/sales`
  },
  
  // Settings
  settings: {
    get: `${BASE_URL}/auth/settings`,
    shop: {
      get: `${BASE_URL}/auth/settings/shop`,
      update: `${BASE_URL}/auth/settings/shop`
    }
  }
};
EOF

echo "✅ Updated apiEndpoints.js to match backend routes"

# 3. Update socketUtils.js to use correct port
sed -i 's/localhost:3001/localhost:5000/g' src/utils/socketUtils.js
echo "✅ Updated socketUtils.js to use port 5000"

# 4. Update integration test to use correct endpoints
cat > src/components/testing/IntegrationTest.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../../utils/apiEndpoints';
import { handleApiError } from '../../utils/errorUtils';
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
      const response = await fetch(apiEndpoints.health);
      if (response.ok) {
        const data = await response.json();
        setBackendHealth(true);
        addResult('health', true, 'Backend health check passed', data);
        return true;
      } else {
        setBackendHealth(false);
        addResult('health', false, `Health check failed: ${response.status}`);
        return false;
      }
    } catch (error) {
      setBackendHealth(false);
      addResult('health', false, 'Backend not accessible: ' + error.message);
      return false;
    }
  };

  // Test 2: API Endpoints (These require auth, so expect 401)
  const testApiEndpoints = async () => {
    const endpoints = [
      { name: 'customers', url: apiEndpoints.customers.list },
      { name: 'vehicles', url: apiEndpoints.vehicles.list },
      { name: 'jobs', url: apiEndpoints.jobs.list },
      { name: 'estimates', url: apiEndpoints.estimates.list }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        if (response.status === 401) {
          addResult(`api-${endpoint.name}`, true, 
            `${endpoint.name} API accessible (401 - auth required)`, 'Properly secured');
        } else if (response.ok) {
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

  // Test 3: Authentication Flow
  const testAuthentication = async () => {
    try {
      // Test login endpoint with invalid credentials (should return 400/401)
      const response = await fetch(apiEndpoints.auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: 'test' })
      });

      if (response.status === 400 || response.status === 401) {
        addResult('auth', true, 'Auth endpoint working (rejects invalid creds)', 'Login endpoint accessible');
      } else if (response.ok) {
        const data = await response.json();
        addResult('auth', true, 'Auth endpoint working (accepted creds)', data);
      } else {
        addResult('auth', false, `Auth endpoint error: ${response.status}`);
      }
    } catch (error) {
      addResult('auth', false, 'Auth test error: ' + error.message);
    }
  };

  // Test 4: Socket.IO Connection (if backend supports it)
  const testSocketConnection = async () => {
    try {
      // Just test if socket.io endpoint exists
      const response = await fetch('http://localhost:5000/socket.io/');
      if (response.ok || response.status === 400) {
        addResult('socket', true, 'Socket.IO endpoint exists');
      } else {
        addResult('socket', false, 'Socket.IO not configured on backend');
      }
    } catch (error) {
      addResult('socket', false, 'Socket.IO not available: ' + error.message);
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
      
      // Test 3: Authentication
      await testAuthentication();
      
      // Test 4: Socket.IO
      await testSocketConnection();
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
               backendHealth ? 'Backend is running on port 5000' : 'Backend not accessible'}
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

        {/* Backend Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h4 className="font-semibold text-blue-800 mb-2">Backend Configuration:</h4>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            <li>Backend running on: <code className="bg-blue-100 px-1 rounded">http://localhost:5000</code></li>
            <li>All API endpoints require authentication (under /api/auth/)</li>
            <li>Health check available at: <code className="bg-blue-100 px-1 rounded">/api/health</code></li>
            <li>Authentication uses JWT tokens</li>
          </ul>
        </div>

        {/* Note about Auth */}
        <div className="mt-4 p-4 bg-yellow-50 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">Note:</h4>
          <p className="text-sm text-yellow-700">
            Most API endpoints return 401 (Unauthorized) when accessed without a valid JWT token. 
            This is expected behavior for a secured API.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTest;
EOF

echo "✅ Updated IntegrationTest component for auth-based backend"

# 5. Update test script to use correct port and endpoints
sed -i 's/localhost:3001/localhost:5000/g' test-backend-integration.sh

# Test the health endpoint
echo ""
echo "🧪 Testing updated configuration..."
echo "Testing health endpoint:"
curl -s http://localhost:5000/api/health | head -5

echo ""
echo "Testing protected endpoint (should return 401):"
curl -s -w "HTTP Status: %{http_code}\n" http://localhost:5000/api/auth/customers | head -3

echo ""
echo "✅ Frontend configuration updated to match backend!"
echo ""
echo "📋 Changes made:"
echo "  ✅ Updated .env to use port 5000"
echo "  ✅ Updated apiEndpoints.js with actual backend routes"
echo "  ✅ Updated socketUtils.js to use port 5000" 
echo "  ✅ Updated IntegrationTest component"
echo "  ✅ Updated test script"
echo ""
echo "🚀 Next steps:"
echo "  1. Start frontend: npm start"
echo "  2. Visit: http://localhost:3000/integration-test"
echo "  3. Run the integration tests"
echo ""
echo "💡 Expected results:"
echo "  ✅ Health check should pass"
echo "  ✅ API endpoints should return 401 (auth required) - this is correct!"
echo "  ✅ Auth endpoint should reject invalid credentials"
