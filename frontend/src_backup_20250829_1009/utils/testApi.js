// src/utils/testApi.js - API Test Utility - Fixed to work with actual API
import { apiEndpoints } from './api';

export const testApiConnections = async () => {
  const results = {
    health: null,
    auth: null,
    dashboard: null,
    customers: null,
    backend: null
  };

  console.log('🧪 Testing API connections...');

  try {
    // Test raw backend connection
    try {
      const response = await fetch('http://192.168.1.26:5000/api/health');
      if (response.ok) {
        results.backend = '✅ Backend server responding';
        results.health = '✅ Health endpoint working';
      } else {
        results.backend = `❌ Backend returned ${response.status}`;
        results.health = `❌ Health check failed with status ${response.status}`;
      }
    } catch (error) {
      results.backend = `❌ Backend connection failed: ${error.message}`;
      results.health = '❌ Cannot reach health endpoint';
    }

    // Test auth endpoint (should return 401 if not logged in)
    try {
      const response = await apiEndpoints.auth.me();
      results.auth = '✅ Authentication working (logged in)';
    } catch (error) {
      if (error.response?.status === 401) {
        results.auth = '⚠️ Not authenticated (expected for logged out users)';
      } else {
        results.auth = `❌ Auth endpoint failed: ${error.message}`;
      }
    }

    // Test dashboard (requires auth)
    try {
      const response = await apiEndpoints.dashboard.stats();
      results.dashboard = '✅ Dashboard API working';
    } catch (error) {
      if (error.response?.status === 401) {
        results.dashboard = '⚠️ Dashboard requires authentication';
      } else {
        results.dashboard = `❌ Dashboard failed: ${error.message}`;
      }
    }

    // Test customers (requires auth)
    try {
      const response = await apiEndpoints.customers.getAll();
      results.customers = '✅ Customers API working';
    } catch (error) {
      if (error.response?.status === 401) {
        results.customers = '⚠️ Customers API requires authentication';
      } else {
        results.customers = `❌ Customers failed: ${error.message}`;
      }
    }

  } catch (error) {
    console.error('Test suite error:', error);
  }

  // Display results
  console.log('\n📊 API Test Results:');
  Object.entries(results).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  return results;
};

// Simple health check function
export const quickHealthCheck = async () => {
  try {
    const response = await fetch('http://192.168.1.26:5000/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is healthy:', data);
      return { healthy: true, data };
    } else {
      console.log('❌ Backend health check failed:', response.status);
      return { healthy: false, status: response.status };
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
    return { healthy: false, error: error.message };
  }
};

// Test specific endpoint
export const testEndpoint = async (endpointName, ...args) => {
  try {
    console.log(`🧪 Testing ${endpointName}...`);
    
    // Navigate to the endpoint function
    const parts = endpointName.split('.');
    let endpoint = apiEndpoints;
    
    for (const part of parts) {
      endpoint = endpoint[part];
      if (!endpoint) {
        throw new Error(`Endpoint ${endpointName} not found`);
      }
    }

    if (typeof endpoint !== 'function') {
      throw new Error(`${endpointName} is not a function`);
    }

    const result = await endpoint(...args);
    console.log(`✅ ${endpointName} working:`, result.data);
    return { success: true, data: result.data };
  } catch (error) {
    console.log(`❌ ${endpointName} failed:`, error.message);
    return { success: false, error: error.message };
  }
};

// Run test from console: window.testApi()
if (typeof window !== 'undefined') {
  window.testApi = testApiConnections;
  window.quickHealthCheck = quickHealthCheck;
  window.testEndpoint = testEndpoint;
}

export default testApiConnections;
