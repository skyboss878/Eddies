// src/hooks/useApi.jsx - Enhanced API Management Hooks
import { useState, useEffect, useCallback, useRef } from 'react';
import { handleApiError } from "../utils";

// Custom hook for API calls with loading, error, and success states
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  const {
    immediate = true,
    onSuccess,
    onError,
    transform,
    retries = 0,
    retryDelay = 1000
  } = options;

  const execute = useCallback(async (...args) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    let attempt = 0;
    const maxAttempts = retries + 1;

    while (attempt < maxAttempts && mountedRef.current) {
      try {
        
        const response = await apiFunction(...args, {
          signal: abortControllerRef.current.signal
        });
        
        if (!mountedRef.current) return;

        const result = transform ? transform(response.data) : response.data;
        
        setData(result);
        setSuccess(true);
        onSuccess?.(result, response);
        
        break;

      } catch (err) {
        if (!mountedRef.current) return;
        
        // Don't retry if request was aborted
        if (err.name === 'AbortError') {
          break;
        }

        attempt++;
        
        if (attempt >= maxAttempts) {
          const errorInfo = handleApiError(err);
          setError(errorInfo);
          onError?.(errorInfo, err);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      } // Close the catch block
    } // Close the while loop
    
    setLoading(false);
  }, [apiFunction, ...dependencies, retries, retryDelay]);

  // Effect for immediate execution
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute, immediate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    success,
    execute,
    cancel: () => abortControllerRef.current?.abort()
  };
};
