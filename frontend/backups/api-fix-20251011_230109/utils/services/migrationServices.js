// src/utils/services/migrationServices.js - Fixed version
import { api, uploadApi } from '../api';
import { apiEndpoints } from '../apiEndpoints';
import { showError } from '../toast';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5000; // 5 seconds

export const migrationService = {
  /**
   * Analyze a file for migration
   * @param {FormData} formData - File to analyze
   * @returns {Promise<{success: boolean, data: object}>}
   */
  analyzeFile: async (formData) => {
    try {
      const response = await uploadApi.post(apiEndpoints.migration.analyze, formData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('File analysis failed:', error);
      const message = error.response?.data?.message || 'Failed to analyze file';
      showError(message);
      return {
        success: false,
        error: message
      };
    }
  },

  /**
   * Upload file for migration
   * @param {FormData} formData - File to upload
   * @param {Function} onProgress - Progress callback
   */
  uploadFile: async (formData, onProgress = null) => {
    try {
      const response = await uploadApi.post(apiEndpoints.migration.upload, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
          if (onProgress) {
            onProgress(percentCompleted);
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('File upload failed:', error);
      const message = error.response?.data?.message || 'Failed to upload file';
      showError(message);
      throw error;
    }
  },

  /**
   * Import analyzed data
   * @param {Object} importConfig - Import configuration
   */
  importData: async (importConfig) => {
    try {
      const response = await api.post(apiEndpoints.migration.import, importConfig);
      return response.data;
    } catch (error) {
      console.error('Data import failed:', error);
      const message = error.response?.data?.message || 'Failed to import data';
      showError(message);
      throw error;
    }
  },

  /**
   * Get migration status
   * @param {string} migrationId - Migration ID
   */
  getStatus: async (migrationId) => {
    try {
      // Check cache first
      const cacheKey = `migration_status_${migrationId}`;
      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
          return cached.data;
        }
      }

      const response = await api.get(`${apiEndpoints.migration.status}/${migrationId}`);
      
      // Update cache
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get migration status:', error);
      throw error;
    }
  },

  /**
   * Clear cache
   */
  clearCache: () => {
    cache.clear();
  },

  /**
   * Get cached data
   */
  getCache: (key) => {
    if (cache.has(key)) {
      const cached = cache.get(key);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
      cache.delete(key);
    }
    return null;
  },

  /**
   * Set cache data
   */
  setCache: (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
};

export default migrationService;
