// src/utils/services/appointmentService.js
import api from '../api';
import { showError } from '../toast';

const baseURL = '/api/auth/appointments';

const handleError = (error, fallbackMessage = 'Appointment request failed') => {
  console.error(fallbackMessage, error);
  showError(fallbackMessage);
  throw error;
};

export const getAll = async (params = {}) => {
  try {
    const response = await api.get(baseURL, { params });
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch appointments');
  }
};

export const getById = async (id) => {
  try {
    const response = await api.get(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to fetch appointment with ID ${id}`);
  }
};

export const create = async (appointmentData) => {
  try {
    const response = await api.post(baseURL, appointmentData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to create appointment');
  }
};

export const update = async (id, appointmentData) => {
  try {
    const response = await api.put(`${baseURL}/${id}`, appointmentData);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to update appointment with ID ${id}`);
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await api.delete(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to delete appointment with ID ${id}`);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteAppointment
};
