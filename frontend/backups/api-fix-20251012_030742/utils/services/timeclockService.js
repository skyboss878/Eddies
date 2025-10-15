import { api } from '../api';
import { apiEndpoints } from '../apiEndpoints';
import { showError } from '../toast';

const handleError = (error, msg = 'Time clock request failed') => {
  console.error(msg, error);
  showError(error.response?.data?.message || msg);
  throw error;
};

export const timeclockService = {
  clockIn: async (employeeId) => {
    try {
      return (await api.post(apiEndpoints.timeclock.clockIn, {
        employee_id: employeeId,
        timestamp: new Date().toISOString()
      })).data;
    } catch (error) {
      handleError(error, 'Failed to clock in');
    }
  },
  clockOut: async (employeeId) => {
    try {
      return (await api.post(apiEndpoints.timeclock.clockOut, {
        employee_id: employeeId,
        timestamp: new Date().toISOString()
      })).data;
    } catch (error) {
      handleError(error, 'Failed to clock out');
    }
  },
  getEntries: async (startDate, endDate) => {
    try {
      return (await api.get(apiEndpoints.timeclock.entries, {
        params: { start_date: startDate, end_date: endDate }
      })).data;
    } catch (error) {
      handleError(error, 'Failed to fetch time entries');
    }
  },
  getCurrentStatus: async (employeeId) => {
    try {
      return (await api.get(apiEndpoints.timeclock.current, {
        params: { employee_id: employeeId }
      })).data;
    } catch (error) {
      handleError(error, 'Failed to fetch current status');
    }
  },
  getSummary: async (employeeId, startDate, endDate) => {
    try {
      return (await api.get(apiEndpoints.timeclock.summary, {
        params: { employee_id: employeeId, start_date: startDate, end_date: endDate }
      })).data;
    } catch (error) {
      handleError(error, 'Failed to fetch time summary');
    }
  }
};

export default timeclockService;
