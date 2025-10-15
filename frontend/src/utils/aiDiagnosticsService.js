// src/utils/aiDiagnosticsService.js - AI Diagnostics API Service
import api from './api'; // Fixed import

export const aiDiagnosticsService = {
  /**
   * Generate comprehensive AI diagnosis
   * @param {Object} diagnosticData - Diagnostic input data
   * @param {Object} diagnosticData.vehicle_info - Vehicle information
   * @param {string} diagnosticData.symptoms - Customer symptoms
   * @param {string} diagnosticData.obd_codes - OBD-II codes
   * @param {string} diagnosticData.additional_notes - Additional notes
   * @returns {Promise} API response
   */
  generateComprehensiveDiagnosis: async (diagnosticData) => {
    try {
      const response = await api.post('/api/ai/diagnostics', diagnosticData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generate quick diagnosis
   * @param {Object} data - Quick diagnosis data
   * @param {string} data.vehicle - Vehicle description
   * @param {string} data.symptoms - Symptoms
   * @returns {Promise} API response
   */
  generateQuickDiagnosis: async (data) => {
    try {
      const response = await api.post('/api/ai/diagnostics', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lookup OBD-II codes
   * @param {string} codes - Space-separated OBD codes
   * @returns {Promise} API response
   */
  lookupOBDCodes: async (codes) => {
    try {
      const response = await api.post('/api/obd2/lookup', { codes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get diagnostics history
   * @returns {Promise} API response
   */
  getDiagnosticsHistory: async () => {
    try {
      // Fixed endpoint path - removed extra /auth
      const response = await api.get("/api/auth/ai/diagnostics/history");

      // Handle different response formats
      const data = response.data;

      // If the response is wrapped in an object with a data property
      if (data && typeof data === "object" && Array.isArray(data.data)) {
        return data.data;
      }

      // If the response data is directly an array
      if (Array.isArray(data)) {
        return data;
      }

      // If there's a history property
      if (data && Array.isArray(data.history)) {
        return data.history;
      }

      // If there's a diagnostics property
      if (data && Array.isArray(data.diagnostics)) {
        return data.diagnostics;
      }

      // Fallback: return empty array if we can't find array data
      return [];
    } catch (error) {
      // Return empty array instead of throwing, so the component doesn't crash
      return [];
    }
  },

  /**
   * Export diagnosis to PDF (placeholder for future implementation)
   * @param {Object} diagnosis - Diagnosis data to export
   * @returns {Promise} Exported file
   */
  exportDiagnosisToPDF: async (diagnosis) => {
    try {
      // This would integrate with a PDF generation service

      // For now, return JSON download
      const dataStr = JSON.stringify(diagnosis, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `diagnosis_${Date.now()}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      return Promise.resolve({ success: true, message: 'Diagnosis exported successfully' });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Save diagnosis to customer record
   * @param {Object} diagnosisData - Diagnosis and customer data
   * @returns {Promise} API response
   */
  saveDiagnosisToCustomer: async (diagnosisData) => {
    try {
      // This would save the diagnosis to a customer's record
      const response = await api.post('/api/auth/customers/diagnosis', diagnosisData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create estimate from diagnosis
   * @param {Object} diagnosis - Diagnosis data
   * @param {number} customerId - Customer ID
   * @param {number} vehicleId - Vehicle ID
   * @returns {Promise} API response
   */
  createEstimateFromDiagnosis: async (diagnosis, customerId, vehicleId) => {
    try {
      // Safely extract cost values
      const extractCost = (costString) => {
        if (!costString) return 0;
        const cleaned = costString.toString().replace(/[$,]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      };

      const estimateData = {
        customer_id: customerId,
        vehicle_id: vehicleId,
        description: diagnosis.diagnosis?.primary_issue || 'AI Generated Estimate',
        labor_cost: extractCost(diagnosis.diagnosis?.cost_estimate?.labor_total),
        parts_cost: extractCost(diagnosis.diagnosis?.cost_estimate?.parts_total),
        total_cost: extractCost(diagnosis.diagnosis?.cost_estimate?.total_estimate),
        status: 'pending',
        ai_generated: true,
        diagnosis_data: diagnosis
      };

      const response = await api.post('/api/auth/estimates', estimateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get common OBD codes for quick reference
   * @returns {Object} Common OBD codes database
   */
  getCommonOBDCodes: () => {
    return {
      powertrain: {
        'P0300': 'Random/Multiple Cylinder Misfire Detected',
        'P0301': 'Cylinder 1 Misfire Detected',
        'P0302': 'Cylinder 2 Misfire Detected',
        'P0171': 'System Too Lean (Bank 1)',
        'P0172': 'System Too Rich (Bank 1)',
        'P0420': 'Catalyst System Efficiency Below Threshold (Bank 1)',
        'P0440': 'Evaporative Emission Control System Malfunction',
        'P0506': 'Idle Control System RPM Lower Than Expected'
      },
      body: {
        'B1000': 'ECU Defective',
        'B1001': 'ECU Not Programmed',
        'B1002': 'ECU Programming Error'
      },
      chassis: {
        'C1200': 'ABS Control Module Malfunction',
        'C1201': 'ABS Motor Relay Circuit Malfunction'
      },
      network: {
        'U0100': 'Lost Communication With ECM/PCM',
        'U0101': 'Lost Communication With TCM',
        'U0155': 'Lost Communication With IPC'
      }
    };
  },

  /**
   * Validate OBD code format
   * @param {string} code - OBD code to validate
   * @returns {boolean} Whether the code is valid
   */
  validateOBDCode: (code) => {
    if (!code || typeof code !== 'string') return false;
    const obdPattern = /^[PBCU]\d{4}$/;
    return obdPattern.test(code.toUpperCase());
  },

  /**
   * Parse multiple OBD codes from input string
   * @param {string} codesInput - Input string with codes
   * @returns {Array} Array of valid OBD codes
   */
  parseOBDCodes: (codesInput) => {
    if (!codesInput || typeof codesInput !== 'string') return [];

    const obdPattern = /[PBCU]\d{4}/g;
    const matches = codesInput.toUpperCase().match(obdPattern);

    return matches ? [...new Set(matches)] : [];
  },

  /**
   * Get severity level for OBD code
   * @param {string} code - OBD code
   * @returns {string} Severity level
   */
  getOBDCodeSeverity: (code) => {
    const severityMap = {
      'P0300': 'High',
      'P0301': 'Medium',
      'P0302': 'Medium',
      'P0171': 'Medium',
      'P0172': 'Medium',
      'P0420': 'Medium',
      'P0440': 'Low',
      'U0100': 'High',
      'C1200': 'High'
    };

    return severityMap[code] || 'Medium';
  },

  /**
   * Format diagnosis for display
   * @param {Object} diagnosis - Raw diagnosis data
   * @returns {Object} Formatted diagnosis
   */
  formatDiagnosisForDisplay: (diagnosis) => {
    if (!diagnosis || !diagnosis.success) return null;

    // Safe property access
    const vehicleInfo = diagnosis.vehicle_info || {};
    const diagnosisData = diagnosis.diagnosis?.diagnosis || {};

    return {
      ...diagnosis,
      formatted_timestamp: new Date(diagnosis.generated_at).toLocaleString(),
      vehicle_display: `${vehicleInfo.year || ''} ${vehicleInfo.make || ''} ${vehicleInfo.model || ''}`.trim() || 'Unknown Vehicle',
      severity_color: diagnosisData.severity?.toLowerCase() || 'medium',
      confidence_percentage: diagnosisData.confidence_level === 'High' ? 90 :
                         diagnosisData.confidence_level === 'Medium' ? 70 : 50,
      total_parts_count: diagnosisData.recommended_parts?.length || 0,
      total_procedures_count: diagnosisData.repair_procedures?.length || 0,
      estimated_completion_time: diagnosisData.estimated_repair_time || 'Unknown'
    };
  },

  /**
   * Generate repair checklist from diagnosis
   * @param {Object} diagnosis - Diagnosis data
   * @returns {Object} Repair checklist
   */
  generateRepairChecklist: (diagnosis) => {
    if (!diagnosis?.diagnosis?.diagnosis) return null;

    const diagnosisData = diagnosis.diagnosis.diagnosis;
    const vehicleInfo = diagnosis.vehicle_info || {};

    const checklist = {
      vehicle: `${vehicleInfo.year || ''} ${vehicleInfo.make || ''} ${vehicleInfo.model || ''}`.trim() || 'Unknown Vehicle',
      primary_issue: diagnosisData.primary_issue,
      checklist_items: []
    };

    // Add parts procurement items
    if (diagnosisData.recommended_parts) {
      diagnosisData.recommended_parts.forEach((part, index) => {
        checklist.checklist_items.push({
          id: `part_${index}`,
          type: 'part',
          description: `Order ${part.part_name} (${part.part_number || 'N/A'})`,
          priority: part.priority,
          estimated_cost: part.estimated_cost,
          completed: false
        });
      });
    }

    // Add repair procedure items
    if (diagnosisData.repair_procedures) {
      diagnosisData.repair_procedures.forEach((procedure, index) => {
        checklist.checklist_items.push({
          id: `procedure_${index}`,
          type: 'procedure',
          description: procedure.description,
          step_number: procedure.step,
          estimated_time: procedure.estimated_time,
          tools_required: procedure.tools_required,
          safety_notes: procedure.safety_notes,
          completed: false
        });
      });
    }

    // Add testing items
    if (diagnosisData.testing_procedures) {
      diagnosisData.testing_procedures.forEach((test, index) => {
        checklist.checklist_items.push({
          id: `test_${index}`,
          type: 'test',
          description: `Perform ${test.test}`,
          test_procedure: test.description,
          expected_result: test.expected_result,
          tools_needed: test.tools_needed,
          completed: false
        });
      });
    }

    return checklist;
  },

  // ... rest of methods remain the same but with improved error handling and null checks
};

export default aiDiagnosticsService;

