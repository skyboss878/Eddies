// src/utils/services/diagnosticsService.js
import api from '../api';
import { showError } from '../toast';

const baseURL = '/api/diagnostics';

const handleError = (error, fallbackMessage = 'Diagnostics request failed') => {
  console.error(fallbackMessage, error);
  showError(fallbackMessage);
  throw error;
};

// Fetch system health/status
export const getSystemStatus = async () => {
  try {
    const response = await api.get(`${baseURL}/status`);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch system status');
  }
};

// Run a diagnostic test
export const runTest = async (testType) => {
  try {
    const response = await api.post(`${API_BASE_URL}/api/diagnostics/test`, { testType });
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to run diagnostic test: ${testType}`);
  }
};

// Export all functions
export default {
  getSystemStatus,
  runTest
};
