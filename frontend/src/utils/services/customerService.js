// src/utils/services/customerService.js - Fixed version
import { api } from '../api';
import { showError } from '../toast';

// Define URLs locally or import from apiEndpoints
const URLS = {
  customers: {
    list: '/api/auth/customers',
    get: (id) => `/api/auth/customers/${id}`,
    create: '/api/auth/customers',
    update: (id) => `/api/auth/customers/${id}`,
    delete: (id) => `/api/auth/customers/${id}`,
    search: '/api/auth/customers/search'
  }
};

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
      const response = await api.get(URLS.customers.list);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to fetch customers');
    }
  },

  // Get customer by ID
  getById: async (id) => {
    try {
      const response = await api.get(URLS.customers.get(id));
      return response.data;
    } catch (error) {
      handleError(error, `Failed to fetch customer ${id}`);
    }
  },

  // Create customer
  create: async (customerData) => {
    try {
      const response = await api.post(URLS.customers.create, customerData);
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to create customer');
    }
  },

  // Update customer
  update: async (id, customerData) => {
    try {
      const response = await api.put(URLS.customers.update(id), customerData);
      return response.data;
    } catch (error) {
      handleError(error, `Failed to update customer ${id}`);
    }
  },

  // Delete customer
  delete: async (id) => {
    try {
      const response = await api.delete(URLS.customers.delete(id));
      return response.data;
    } catch (error) {
      handleError(error, `Failed to delete customer ${id}`);
    }
  },

  // Search customers
  search: async (query) => {
    try {
      const response = await api.get(URLS.customers.search, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      handleError(error, 'Failed to search customers');
    }
  }
};

export default customerService;
