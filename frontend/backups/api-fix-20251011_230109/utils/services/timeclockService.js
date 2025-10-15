// src/utils/services/timeclockService.js - Fixed version
import { api } from '../api';
import { apiEndpoints } from '../apiEndpoints';
import { showError } from '../toast';

const handleError = (error, fallbackMessage = 'Time clock request failed') => {
  console.error(fallbackMessage, error);
  const message = error.response?.data?.message || fallbackMessage;
  showError(message);
  throw error;
};

export const timeclockService = {
  // Clock in
  clockIn: async (employeeId) => {
    try {
      const response = await api.post(apiEndpoints.timeclock.clockIn, {
        employee_id: employeeId,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to clock in');
    }
  },

  // Clock out
  clockOut: async (employeeId) => {
    try {
      const response = await api.post(apiEndpoints.timeclock.clockOut, {
        employee_id: employeeId,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to clock out');
    }
  },

  // Get entries
  getEntries: async (startDate, endDate) => {
    try {
      const response = await api.get(apiEndpoints.timeclock.entries, {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch time entries');
    }
  },

  // Get current status
  getCurrentStatus: async (employeeId) => {
    try {
      const response = await api.get(apiEndpoints.timeclock.current, {
        params: { employee_id: employeeId }
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch current status');
    }
  },

  // Get summary
  getSummary: async (employeeId, startDate, endDate) => {
    try {
      const response = await api.get(apiEndpoints.timeclock.summary, {
        params: {
          employee_id: employeeId,
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch time summary');
    }
  }
};

export default timeclockService;
