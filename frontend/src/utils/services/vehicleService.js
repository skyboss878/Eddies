// src/utils/services/vehicleService.js
import api from '../api';
import { showError } from '../toast';

const baseURL = '/api/auth/vehicles';

const handleError = (error, fallbackMessage = 'Vehicle request failed') => {
  console.error(fallbackMessage, error);
  showError(fallbackMessage);
  throw error;
};

export const getAll = async (params = {}) => {
  try {
    const response = await api.get(baseURL, { params });
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch vehicles');
  }
};

export const getById = async (id) => {
  try {
    const response = await api.get(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to fetch vehicle with ID ${id}`);
  }
};

export const create = async (vehicleData) => {
  try {
    const response = await api.post(baseURL, vehicleData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to create vehicle');
  }
};

export const update = async (id, vehicleData) => {
  try {
    const response = await api.put(`${baseURL}/${id}`, vehicleData);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to update vehicle with ID ${id}`);
  }
};

export const deleteVehicle = async (id) => {
  try {
    const response = await api.delete(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to delete vehicle with ID ${id}`);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteVehicle
};
