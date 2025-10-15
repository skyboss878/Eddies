// src/utils/services/estimateService.js
import api from '../api';
import { showError } from '../toast';

const baseURL = '/api/auth/estimates';

const handleError = (error, fallbackMessage = 'Estimate request failed') => {
  console.error(fallbackMessage, error);
  showError(fallbackMessage);
  throw error;
};

export const getAll = async (params = {}) => {
  try {
    const response = await api.get(baseURL, { params });
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch estimates');
  }
};

export const getById = async (id) => {
  try {
    const response = await api.get(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to fetch estimate with ID ${id}`);
  }
};

export const create = async (estimateData) => {
  try {
    const response = await api.post(baseURL, estimateData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to create estimate');
  }
};

export const update = async (id, estimateData) => {
  try {
    const response = await api.put(`${baseURL}/${id}`, estimateData);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to update estimate with ID ${id}`);
  }
};

export const deleteEstimate = async (id) => {
  try {
    const response = await api.delete(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to delete estimate with ID ${id}`);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteEstimate
};
