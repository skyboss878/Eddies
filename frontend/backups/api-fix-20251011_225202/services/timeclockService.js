// src/utils/services/timeclockService.js
import { apiEndpoints } from '../api';
import { showError } from '../toast';

const handleError = (error, fallbackMessage = 'Time clock request failed') => {
  console.error(fallbackMessage, error);
  showError(fallbackMessage);
  throw error;
};

export const status = async () => {
  try {
    const response = await apiEndpoints.timeclock.getStatus();
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch time clock status');
  }
};

export const clockIn = async () => {
  try {
    const response = await apiEndpoints.timeclock.clockIn();
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to clock in');
  }
};

export const clockOut = async () => {
  try {
    const response = await apiEndpoints.timeclock.clockOut();
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to clock out');
  }
};

export default {
  status,
  clockIn,
  clockOut
};
