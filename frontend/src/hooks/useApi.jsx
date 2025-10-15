// src/hooks/useApi.jsx - Standardized API Hook
import { useState, useCallback } from 'react';
import { api, uploadApi } from '../utils/api';
import { apiEndpoints } from '../utils/apiEndpoints';
import { showError, showSuccess } from '../utils/toast';

/**
 * Custom hook for API calls with loading and error states
 * @param {string} endpoint - API endpoint (can use apiEndpoints)
 * @param {object} options - Configuration options
 */
export const useApi = (endpoint = null, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    onSuccess = null,
    onError = null,
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = 'Operation successful',
  } = options;

  // GET request
  const get = useCallback(async (params = {}, customEndpoint = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = customEndpoint || endpoint;
      const response = await api.get(url, { params });
      setData(response.data);
      if (showSuccessMessage) showSuccess(successMessage);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch data';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  // POST request
  const post = useCallback(async (body, customEndpoint = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = customEndpoint || endpoint;
      const response = await api.post(url, body);
      setData(response.data);
      if (showSuccessMessage) showSuccess(successMessage);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create data';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  // PUT request
  const put = useCallback(async (body, customEndpoint = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = customEndpoint || endpoint;
      const response = await api.put(url, body);
      setData(response.data);
      if (showSuccessMessage) showSuccess(successMessage);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update data';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  // PATCH request
  const patch = useCallback(async (body, customEndpoint = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = customEndpoint || endpoint;
      const response = await api.patch(url, body);
      setData(response.data);
      if (showSuccessMessage) showSuccess(successMessage);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to patch data';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  // DELETE request
  const del = useCallback(async (customEndpoint = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = customEndpoint || endpoint;
      const response = await api.delete(url);
      setData(response.data);
      if (showSuccessMessage) showSuccess(successMessage);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete data';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  // File upload
  const upload = useCallback(async (formData, onProgress = null, customEndpoint = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = customEndpoint || endpoint;
      const response = await uploadApi.post(url, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) onProgress(percentCompleted);
        }
      });
      setData(response.data);
      if (showSuccessMessage) showSuccess(successMessage);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to upload file';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  // Reset state
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    setData,
    setError,
    setLoading,
    reset,
  };
};

// Export apiEndpoints for convenience
export { apiEndpoints };

export default useApi;
