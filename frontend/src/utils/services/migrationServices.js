import { api, uploadApi } from '../api';
import { apiEndpoints } from '../apiEndpoints';
import { showError } from '../toast';

const cache = new Map();
const CACHE_DURATION = 5000;

export const migrationService = {
  analyzeFile: async (formData) => {
    try {
      return { success: true, data: (await uploadApi.post(apiEndpoints.migration.analyze, formData)).data };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to analyze file';
      showError(msg);
      return { success: false, error: msg };
    }
  },
  uploadFile: async (formData, onProgress = null) => {
    try {
      return (await uploadApi.post(apiEndpoints.migration.upload, formData, {
        onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total))
      })).data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to upload file';
      showError(msg);
      throw error;
    }
  },
  importData: async (importConfig) => {
    try {
      return (await api.post(apiEndpoints.migration.import, importConfig)).data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to import data';
      showError(msg);
      throw error;
    }
  },
  getStatus: async (migrationId) => {
    const key = `migration_status_${migrationId}`;
    if (cache.has(key)) {
      const c = cache.get(key);
      if (Date.now() - c.timestamp < CACHE_DURATION) return c.data;
    }
    const data = (await api.get(`${apiEndpoints.migration.status}/${migrationId}`)).data;
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  },
  clearCache: () => cache.clear(),
  getCache: (key) => {
    if (cache.has(key)) {
      const c = cache.get(key);
      if (Date.now() - c.timestamp < CACHE_DURATION) return c.data;
      cache.delete(key);
    }
    return null;
  },
  setCache: (key, data) => cache.set(key, { data, timestamp: Date.now() })
};

export default migrationService;
