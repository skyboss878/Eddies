// src/hooks/useApi.jsx
import { useState, useCallback } from 'react';
import { api, enhancedGet, handleApiError } from '../utils';
import { showError } from '../utils/toast';

/**
 * useApi - Custom hook for making API requests with unified loading and error handling
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * request - Generic API request handler
   * @param {object} config - Axios request configuration
   * @returns {Promise<any>}
   */
  const request = useCallback(async (config) => {
    if (!apiUtils.requireAuth()) {
      const msg = 'User not authenticated';
      setError(msg);
      showError(msg);
      throw new Error(msg);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api(config);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * get - Performs a GET request with optional caching
   * @param {string} url
   * @param {object} options
   * @returns {Promise<any>}
   */
  const get = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await enhancedGet(url, options);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // HTTP convenience methods
  const post = useCallback((url, data, config = {}) => 
    request({ method: 'POST', url, data, ...config }), [request]
  );

  const put = useCallback((url, data, config = {}) => 
    request({ method: 'PUT', url, data, ...config }), [request]
  );

  const patch = useCallback((url, data, config = {}) => 
    request({ method: 'PATCH', url, data, ...config }), [request]
  );

  const del = useCallback((url, config = {}) => 
    request({ method: 'DELETE', url, ...config }), [request]
  );

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  };
};
