// src/hooks/useApi.js - Enhanced API Management Hooks
import { useState, useEffect, useCallback, useRef } from 'react';
import { handleApiError } from '../utils/api';

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
        console.log(`🚀 API call attempt ${attempt + 1}/${maxAttempts}`);
        
        const response = await apiFunction(...args, {
          signal: abortControllerRef.current.signal
        });
        
        if (!mountedRef.current) return;

        const result = transform ? transform(response.data) : response.data;
        
        setData(result);
        setSuccess(true);
        onSuccess?.(result, response);
        
        console.log('✅ API call successful');
        break;

      } catch (err) {
        if (!mountedRef.current) return;
        
        // Don't retry if request was aborted
        if (err.name === 'AbortError') {
          console.log('🚫 Request aborted');
          break;
        }

        attempt++;
        
        if (attempt >= maxAttempts) {
          const errorInfo = handleApiError(err);
          setError(errorInfo);
          onError?.(errorInfo, err);
          console.error('❌ API call failed after all retries:', errorInfo);
        } else {
          console.log(`⏳ Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
