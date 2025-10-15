// src/utils/services/jobService.js
import api from '../api';
import { showError } from '../toast';

const baseURL = '/api/auth/jobs';

const handleError = (error, fallbackMessage = 'Job request failed') => {
  console.error(fallbackMessage, error);
  showError(fallbackMessage);
  throw error;
};

export const getAll = async (params = {}) => {
  try {
    const response = await api.get(baseURL, { params });
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch jobs');
  }
};

export const getById = async (id) => {
  try {
    const response = await api.get(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to fetch job with ID ${id}`);
  }
};

export const create = async (jobData) => {
  try {
    const response = await api.post(baseURL, jobData);
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to create job');
  }
};

export const update = async (id, jobData) => {
  try {
    const response = await api.put(`${baseURL}/${id}`, jobData);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to update job with ID ${id}`);
  }
};

export const updateStatus = async (id, statusData) => {
  try {
    const response = await api.patch(`${baseURL}/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to update status for job ID ${id}`);
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await api.delete(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error, `Failed to delete job with ID ${id}`);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  updateStatus,
  delete: deleteJob
};
