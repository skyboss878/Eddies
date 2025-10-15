// src/utils/services/migrationService.js
import { uploadApi, apiCache } from '../api';

// --- Migration Service ---
const migrationService = {
  /**
   * Analyze a file for migration.
   * @param {FormData} formData - File to analyze
   * @returns {Promise<{success: boolean, data: object}>}
   */
  analyze: async (formData) => {
    try {
      const response = await uploadApi.post('/api/migration/analyze', formData);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('[MigrationService] analyze error:', err);
      return { success: false, error: err.response?.data || err.message };
    }
  },

  /**
   * Import data using user mapping.
   * @param {object} payload - { filename: string, mapping: object }
   * @returns {Promise<{success: boolean, data: object}>}
   */
  importData: async (payload) => {
    try {
      const response = await uploadApi.post('/api/migration/import', payload);
      apiCache.clear(); // clear cache after import
      return { success: true, data: response.data };
    } catch (err) {
      console.error('[MigrationService] importData error:', err);
      return { success: false, error: err.response?.data || err.message };
    }
  }
};

export default migrationService;
