// src/utils/services/timeclockService.js
import api from '../api';
import { showError } from '../toast';

const baseURL = '/api/timeclock';

const handleError = (error, fallbackMessage = 'Time clock request failed') => {
  console.error(fallbackMessage, error);
  showError(fallbackMessage);
  throw error;
};

export const status = async () => {
  try {
    const response = await api.get(`${baseURL}/status`);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch time clock status');
  }
};

export const clockIn = async () => {
  try {
    const response = await api.post(`${baseURL}/clock-in`);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to clock in');
  }
};

export const clockOut = async () => {
  try {
    const response = await api.post(`${baseURL}/clock-out`);
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
