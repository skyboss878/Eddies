// src/utils/services/shopService.js
import api from './index'; // your axios instance
import { showError } from '../toast'; // optional error handling

export const getShopSettings = async () => {
  try {
    const response = await api.get('/auth/settings/shop');
    return response.data;
  } catch (err) {
    showError('Failed to load shop settings');
    throw err;
  }
};

export const updateShopSettings = async (settings) => {
  try {
    const response = await api.put('/auth/settings/shop', settings);
    return response.data;
  } catch (err) {
    showError('Failed to update shop settings');
    throw err;
  }
};
