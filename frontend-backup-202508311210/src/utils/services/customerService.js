// src/utils/services/customerService.js
import api from '../api'; // your api instance (axios or similar)
import { showError } from '../toast';

const baseURL = '/api/customers';

const handleError = (error, fallbackMessage = 'Customer request failed') => {
  console.error(fallbackMessage, error);
  showError(fallbackMessage);
  throw error;
};

export const getAll = async (params = {}) => {
  try {
    const response = await api.get(baseURL, { params });
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch customers');
  }
};

export const getById = async (id) => {
  try {
    const response = await api.get(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to fetch customer with ID ${id}`);
  }
};

export const create = async (customerData) => {
  try {
    const response = await api.post(baseURL, customerData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to create customer');
  }
};

export const update = async (id, customerData) => {
  try {
    const response = await api.put(`${baseURL}/${id}`, customerData);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to update customer with ID ${id}`);
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await api.delete(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to delete customer with ID ${id}`);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteCustomer
};
