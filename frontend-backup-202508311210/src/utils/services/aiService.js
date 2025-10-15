// src/utils/services/aiService.js - AI Service API Client
import api from '../api';
import { generateAIResponse } from '../../components/ai/AIProvider';

// Main AI Service for chat and diagnostics
export const aiService = {
  // Send chat message to AI
  sendChatMessage: async ({ message, history = [], vehicle_context = null }) => {
    try {
      const response = await api.post('/api/ai/chat', {
        message,
        history,
        vehicle_context
      });
      
      return {
        success: true,
        message: response.data.message,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Fallback to client-side AI if backend fails
      try {
        const contextString = vehicle_context 
          ? `Vehicle: ${vehicle_context.year} ${vehicle_context.make} ${vehicle_context.model}\n`
          : '';
        
        const historyString = history
          .slice(-5) // Last 5 messages for context
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
        
        const prompt = `${contextString}${historyString}\nUser: ${message}\nAI Assistant:`;
        
        const aiResponse = await generateAIResponse(prompt, {
          model: 'gpt-4o-mini',
          max_tokens: 500,
          temperature: 0.7
        });
        
        return {
          success: true,
          message: aiResponse,
          timestamp: new Date().toISOString(),
          fallback: true
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: 'AI service temporarily unavailable'
        };
      }
    }
  },

  // Generate comprehensive diagnosis
  generateDiagnosis: async (diagnosticData) => {
    try {
      const response = await api.post('/api/ai/diagnostics', diagnosticData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('AI Diagnostics Error:', error);
      
      // Fallback to client-side AI
      try {
        const prompt = `
Vehicle: ${diagnosticData.vehicle?.year || ''} ${diagnosticData.vehicle?.make || ''} ${diagnosticData.vehicle?.model || ''}
Symptoms: ${diagnosticData.symptoms?.join?.(', ') || diagnosticData.symptoms || ''}
OBD Codes: ${diagnosticData.obd_codes || ''}
Additional Notes: ${diagnosticData.additional_notes || ''}

Please provide a structured JSON response with:
{
  "primary_issue": "main problem description",
  "confidence_level": "High/Medium/Low",
  "possible_causes": ["cause1", "cause2"],
  "recommended_actions": ["action1", "action2"],
  "estimated_cost": {"min": 100, "max": 500},
  "urgency": "High/Medium/Low",
  "estimated_repair_time": "2-4 hours"
}
        `;
        
        const aiResponse = await generateAIResponse(prompt);
        
        try {
          const parsedResponse = JSON.parse(aiResponse);
          return {
            success: true,
            data: {
              diagnosis: parsedResponse,
              generated_at: new Date().toISOString(),
              vehicle_info: diagnosticData.vehicle,
              fallback: true
            }
          };
        } catch (parseError) {
          return {
            success: true,
            data: {
              diagnosis: {
                primary_issue: "Unable to parse AI response",
                confidence_level: "Low",
                possible_causes: ["Multiple potential causes"],
                recommended_actions: ["Consult professional technician"],
                estimated_cost: { min: 100, max: 300 }
              },
              fallback: true
            }
          };
        }
      } catch (fallbackError) {
        return {
          success: false,
          error: 'Diagnostic service temporarily unavailable'
        };
      }
    }
  },

  // Get diagnostics history
  getDiagnosticsHistory: async () => {
    try {
      const response = await api.get('/api/auth/ai/diagnostics/history');
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error) {
      console.warn('Failed to fetch diagnostics history:', error);
      return [];
    }
  },

  // Create estimate from diagnosis
  createEstimateFromDiagnosis: async (diagnosis, customerId, vehicleId) => {
    try {
      const estimateData = {
        customer_id: customerId,
        vehicle_id: vehicleId,
        description: diagnosis.primary_issue || 'AI Generated Estimate',
        labor_cost: diagnosis.estimated_cost?.min || 0,
        parts_cost: diagnosis.estimated_cost?.max || 0,
        total_cost: (diagnosis.estimated_cost?.min || 0) + (diagnosis.estimated_cost?.max || 0),
        status: 'pending',
        ai_generated: true,
        diagnosis_data: diagnosis
      };

      const response = await api.post('/api/auth/estimates', estimateData);
      return response.data;
    } catch (error) {
      console.error('Failed to create estimate:', error);
      throw error;
    }
  }
};

// OBD2 Service for code lookups
export const obd2Service = {
  // Lookup OBD2 codes
  lookupCode: async (code) => {
    try {
      const response = await api.post('/api/obd2/lookup', { codes: code });
      return response.data;
    } catch (error) {
      console.error('OBD2 Lookup Error:', error);
      
      // Fallback to local OBD code database
      const commonCodes = {
        'P0300': {
          code: 'P0300',
          description: 'Random/Multiple Cylinder Misfire Detected',
          severity: 'high',
          causes: [
            'Faulty spark plugs or ignition coils',
            'Vacuum leak',
            'Low fuel pressure',
            'Dirty fuel injectors'
          ],
          solutions: [
            'Check and replace spark plugs',
            'Inspect ignition coils',
            'Test fuel pressure',
            'Check for vacuum leaks'
          ]
        },
        'P0171': {
          code: 'P0171',
          description: 'System Too Lean (Bank 1)',
          severity: 'medium',
          causes: [
            'Vacuum leak',
            'MAF sensor malfunction',
            'Dirty fuel injectors',
            'Low fuel pressure'
          ],
          solutions: [
            'Check for vacuum leaks',
            'Clean or replace MAF sensor',
            'Test fuel pressure',
            'Clean fuel injectors'
          ]
        },
        'P0420': {
          code: 'P0420',
          description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
          severity: 'medium',
          causes: [
            'Faulty catalytic converter',
            'Oxygen sensor malfunction',
            'Engine running rich or lean',
            'Exhaust leak'
          ],
          solutions: [
            'Replace catalytic converter',
            'Check oxygen sensors',
            'Diagnose fuel system',
            'Repair exhaust leaks'
          ]
        }
      };

      const codeData = commonCodes[code.toUpperCase()];
      if (codeData) {
        return codeData;
      } else {
        return {
          code: code.toUpperCase(),
          description: 'Unknown OBD code',
          severity: 'unknown',
          causes: ['Code not found in database'],
          solutions: ['Consult service manual or professional technician']
        };
      }
    }
  },

  // Validate OBD code format
  validateCode: (code) => {
    if (!code || typeof code !== 'string') return false;
    const obdPattern = /^[PBCU]\d{4}$/;
    return obdPattern.test(code.toUpperCase());
  },

  // Parse multiple codes from input
  parseCodes: (input) => {
    if (!input) return [];
    const pattern = /[PBCU]\d{4}/gi;
    const matches = input.match(pattern);
    return matches ? [...new Set(matches.map(code => code.toUpperCase()))] : [];
  }
};

// Export default aiService for backward compatibility
export default aiService;
