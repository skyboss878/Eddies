// src/utils/services/reportService.js
import api from '../api';
import { showError } from '../toast';

const baseURL = '/api/auth/reports';

const handleError = (error, fallbackMessage = 'Report request failed') => {
  console.error(fallbackMessage, error);
  showError(fallbackMessage);
  throw error;
};

// Fetch a list of available reports
export const getAll = async (params = {}) => {
  try {
    const response = await api.get(baseURL, { params });
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch reports');
  }
};

// Fetch a specific report by type (e.g., payroll, jobs, invoices)
export const getByType = async (reportType, params = {}) => {
  try {
    const response = await api.get(`${baseURL}/${reportType}`, { params });
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to fetch ${reportType} report`);
  }
};

// Export helper for custom report generation if backend supports POST
export const generateCustomReport = async (reportData) => {
  try {
    const response = await api.post(`${baseURL}/custom`, reportData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to generate custom report');
  }
};

export default {
  getAll,
  getByType,
  generateCustomReport
};
