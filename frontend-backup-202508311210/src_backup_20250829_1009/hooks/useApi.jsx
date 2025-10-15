import { useState, useCallback } from 'react';
import api, { apiUtils } from '../utils/api';
import { showError } from '../utils/toast';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api(config);
      return response.data;
    } catch (err) {
      const errorMessage = apiUtils.formatError(err);
      setError(errorMessage);
      if (toast?.error) {
        showError(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(async (url, config = {}) => {
    return request({ method: 'GET', url, ...config });
  }, [request]);

  const post = useCallback(async (url, data, config = {}) => {
    return request({ method: 'POST', url, data, ...config });
  }, [request]);

  const put = useCallback(async (url, data, config = {}) => {
    return request({ method: 'PUT', url, data, ...config });
  }, [request]);

  const patch = useCallback(async (url, data, config = {}) => {
    return request({ method: 'PATCH', url, data, ...config });
  }, [request]);

  const del = useCallback(async (url, config = {}) => {
    return request({ method: 'DELETE', url, ...config });
  }, [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del
  };
};
