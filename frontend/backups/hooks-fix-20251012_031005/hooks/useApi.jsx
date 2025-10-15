import { useState, useCallback } from 'react';
import { api, uploadApi } from '../utils/api';
import { apiEndpoints } from '../utils/apiEndpoints';
import { showError, showSuccess } from '../utils/toast';

export const useApi = (endpoint = null, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { onSuccess, onError, showSuccessMessage = false, showErrorMessage = true, successMessage = 'Success' } = options;

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
      const errorMsg = err.response?.data?.message || 'Failed to fetch';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

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
      const errorMsg = err.response?.data?.message || 'Failed to create';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

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
      const errorMsg = err.response?.data?.message || 'Failed to update';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

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
      const errorMsg = err.response?.data?.message || 'Failed to delete';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  const upload = useCallback(async (formData, onProgress = null, customEndpoint = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = customEndpoint || endpoint;
      const response = await uploadApi.post(url, formData, {
        onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total))
      });
      setData(response.data);
      if (showSuccessMessage) showSuccess(successMessage);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Upload failed';
      setError(errorMsg);
      if (showErrorMessage) showError(errorMsg);
      if (onError) onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError, showSuccessMessage, showErrorMessage, successMessage]);

  return { data, loading, error, get, post, put, delete: del, upload, setData, setError, setLoading, reset: () => { setData(null); setError(null); setLoading(false); } };
};

export { apiEndpoints };
export default useApi;
