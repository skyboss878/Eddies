// src/utils/testApi.js - Quick API Test Utility
import api from './api';

export const testApiConnections = async () => {
  const results = {
    health: null,
    auth: null,
    dashboard: null,
    customers: null
  };

  try {
    // Test health endpoint
    try {
      await api.utils.healthCheck();
      results.health = '✅ Backend healthy';
    } catch (error) {
      results.health = `❌ Health check failed: ${api.handleError(error)}`;
    }

    // Test auth endpoint (should fail if not logged in)
    try {
      await api.auth.getCurrentUser();
      results.auth = '✅ Authentication working';
    } catch (error) {
      results.auth = '⚠️ Not authenticated (expected)';
    }

    // Test dashboard (requires auth)
    try {
      await api.dashboard.getStats();
      results.dashboard = '✅ Dashboard API working';
    } catch (error) {
      results.dashboard = `❌ Dashboard failed: ${api.handleError(error)}`;
    }

    // Test customers (requires auth)
    try {
      await api.customers.getAll();
      results.customers = '✅ Customers API working';
    } catch (error) {
      results.customers = `❌ Customers failed: ${api.handleError(error)}`;
    }

  } catch (error) {
  }

  return results;
};

// Run test from console: window.testApi()
if (typeof window !== 'undefined') {
  window.testApi = testApiConnections;
}

export default testApiConnections;
