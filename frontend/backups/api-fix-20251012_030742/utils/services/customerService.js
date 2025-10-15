// src/utils/services/customerService.js - Fixed version
import { api } from '../api';
import { apiEndpoints } from '../apiEndpoints';
import { showError } from '../toast';

const handleError = (error, fallbackMessage = 'Customer request failed') => {
  console.error(fallbackMessage, error);
  const message = error.response?.data?.message || fallbackMessage;
  showError(message);
  throw error;
};

export const customerService = {
  // Get all customers
  getAll: async () => {
    try {
      const response = await api.get(apiEndpoints.customers.list);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch customers');
    }
  },

  // Get customer by ID
  getById: async (id) => {
    try {
      const response = await api.get(apiEndpoints.customers.get(id));
      return response.data;
    } catch (error) {
      handleError(error, `Failed to fetch customer ${id}`);
    }
  },

  // Create customer
  create: async (customerData) => {
    try {
      const response = await api.post(apiEndpoints.customers.create, customerData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to create customer');
    }
  },

  // Update customer
  update: async (id, customerData) => {
    try {
      const response = await api.put(apiEndpoints.customers.update(id), customerData);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to update customer ${id}`);
    }
  },

  // Delete customer
  delete: async (id) => {
    try {
      const response = await api.delete(apiEndpoints.customers.delete(id));
      return response.data;
    } catch (error) {
      handleError(error, `Failed to delete customer ${id}`);
    }
  },

  // Search customers
  search: async (query) => {
    try {
      const response = await api.get(apiEndpoints.customers.search, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to search customers');
    }
  }
};

export default customerService;
