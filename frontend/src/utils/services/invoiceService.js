// src/utils/services/invoiceService.js
import api from '../api';
import { showError } from '../toast';

const baseURL = '/api/auth/invoices';

const handleError = (error, fallbackMessage = 'Invoice request failed') => {
  console.error(fallbackMessage, error);
  showError(fallbackMessage);
  throw error;
};

export const getAll = async (params = {}) => {
  try {
    const response = await api.get(baseURL, { params });
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch invoices');
  }
};

export const getById = async (id) => {
  try {
    const response = await api.get(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to fetch invoice with ID ${id}`);
  }
};

export const create = async (invoiceData) => {
  try {
    const response = await api.post(baseURL, invoiceData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to create invoice');
  }
};

export const update = async (id, invoiceData) => {
  try {
    const response = await api.put(`${baseURL}/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to update invoice with ID ${id}`);
  }
};

export const deleteInvoice = async (id) => {
  try {
    const response = await api.delete(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to delete invoice with ID ${id}`);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteInvoice
};
