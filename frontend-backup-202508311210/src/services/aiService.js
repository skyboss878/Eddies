// src/services/aiService.js - Complete service for your AI backend routes
import { apiClient } from './apiClient';

export const aiService = {
  // =============================================================================
  // AI DIAGNOSTICS - Match your /api/ai/diagnostics route
  // =============================================================================
  async generateDiagnostics(diagnosticsData) {
    try {
      const response = await apiClient.post('/ai/diagnostics', {
        symptoms: diagnosticsData.symptoms || '',
        codes: diagnosticsData.codes || [],
        vehicle_info: diagnosticsData.vehicle_info || {},
        additional_info: diagnosticsData.additional_info || ''
      });
      return response.data;
    } catch (error) {
      console.error('AI diagnostics error:', error);
      throw error;
    }
  },

  // =============================================================================
  // AI ESTIMATE - Match your /api/ai/estimate route  
  // =============================================================================
  async generateEstimate(estimateData) {
    try {
      const response = await apiClient.post('/ai/estimate', {
        description: estimateData.description || '',
        vehicle_info: estimateData.vehicle_info || {},
        services: estimateData.services || [],
        budget: estimateData.budget || null
      });
      return response.data;
    } catch (error) {
      console.error('AI estimate error:', error);
      throw error;
    }
  },

  // =============================================================================
  // AI CHAT - Match your /api/ai/chat route
  // =============================================================================
  async sendChatMessage(messageData) {
    try {
      const response = await apiClient.post('/ai/chat', {
        message: messageData.message,
        history: messageData.history || [],
        vehicle_context: messageData.vehicle_context || {}
      });
      return response.data;
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  },

  // =============================================================================
  // AI STATUS - Check AI service availability
  // =============================================================================
  async getAIStatus() {
    try {
      const response = await apiClient.get('/ai/status');
      return response.data;
    } catch (error) {
      console.error('AI status error:', error);
      return { success: false, error: 'AI service unavailable' };
    }
  }
};

// =============================================================================
// OBD2 SERVICE - Match your /api/obd2/lookup route
// =============================================================================
export const obd2Service = {
  async lookupCode(code) {
    try {
      const response = await apiClient.get(`/obd2/lookup/${code.toUpperCase()}`);
      return response.data;
    } catch (error) {
      console.error('OBD2 lookup error:', error);
      throw error;
    }
  },

  async lookupMultipleCodes(codes) {
    try {
      const results = await Promise.all(
        codes.map(code => this.lookupCode(code))
      );
      return results;
    } catch (error) {
      console.error('Multiple OBD2 lookup error:', error);
      throw error;
    }
  }
};

export default aiService;
