// src/utils/aiDiagnosticsService.js - AI Diagnostics API Service

import apiClient from './api';

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
      const response = await apiClient.post('/api/ai/diagnostics/comprehensive', diagnosticData);
      return response.data;
    } catch (error) {
      console.error('Comprehensive diagnosis error:', error);
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
      const response = await apiClient.post('/api/ai/diagnostics/quick-diagnosis', data);
      return response.data;
    } catch (error) {
      console.error('Quick diagnosis error:', error);
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
      const response = await apiClient.post('/api/ai/diagnostics/obd-lookup', { codes });
      return response.data;
    } catch (error) {
      console.error('OBD lookup error:', error);
      throw error;
    }
  },

  /**
   * Get diagnostics history
   * @returns {Promise} API response
   */
  /**
   * Get diagnostics history
   * @returns {Promise} API response
   */
  getDiagnosticsHistory: async () => {
    try {
      const response = await apiClient.get("/api/ai/diagnostics/history");
      
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
      console.warn("Unexpected diagnostics history response format:", data);
      return [];
    } catch (error) {
      console.error("Diagnostics history error:", error);
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
    // This would integrate with a PDF generation service
    console.log('Exporting diagnosis to PDF:', diagnosis);
    
    // For now, return JSON download
    const dataStr = JSON.stringify(diagnosis, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `diagnosis_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return Promise.resolve({ success: true, message: 'Diagnosis exported successfully' });
  },

  /**
   * Save diagnosis to customer record
   * @param {Object} diagnosisData - Diagnosis and customer data
   * @returns {Promise} API response
   */
  saveDiagnosisToCustomer: async (diagnosisData) => {
    try {
      // This would save the diagnosis to a customer's record
      const response = await apiClient.post('/api/customers/diagnosis', diagnosisData);
      return response.data;
    } catch (error) {
      console.error('Save diagnosis error:', error);
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
      const estimateData = {
        customer_id: customerId,
        vehicle_id: vehicleId,
        description: diagnosis.diagnosis?.primary_issue || 'AI Generated Estimate',
        labor_cost: parseFloat(diagnosis.diagnosis?.cost_estimate?.labor_total?.replace('$', '')) || 0,
        parts_cost: parseFloat(diagnosis.diagnosis?.cost_estimate?.parts_total?.replace('$', '')) || 0,
        total_cost: parseFloat(diagnosis.diagnosis?.cost_estimate?.total_estimate?.replace('$', '')) || 0,
        status: 'pending',
        ai_generated: true,
        diagnosis_data: diagnosis
      };

      const response = await apiClient.post('/api/estimates', estimateData);
      return response.data;
    } catch (error) {
      console.error('Create estimate from diagnosis error:', error);
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
    const obdPattern = /^[PBCU]\d{4}$/;
    return obdPattern.test(code.toUpperCase());
  },

  /**
   * Parse multiple OBD codes from input string
   * @param {string} codesInput - Input string with codes
   * @returns {Array} Array of valid OBD codes
   */
  parseOBDCodes: (codesInput) => {
    if (!codesInput) return [];
    
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

    return {
      ...diagnosis,
      formatted_timestamp: new Date(diagnosis.generated_at).toLocaleString(),
      vehicle_display: `${diagnosis.vehicle_info?.year} ${diagnosis.vehicle_info?.make} ${diagnosis.vehicle_info?.model}`,
      severity_color: diagnosis.diagnosis?.diagnosis?.severity?.toLowerCase() || 'medium',
      confidence_percentage: diagnosis.diagnosis?.diagnosis?.confidence_level === 'High' ? 90 :
                         diagnosis.diagnosis?.diagnosis?.confidence_level === 'Medium' ? 70 : 50,
      total_parts_count: diagnosis.diagnosis?.diagnosis?.recommended_parts?.length || 0,
      total_procedures_count: diagnosis.diagnosis?.diagnosis?.repair_procedures?.length || 0,
      estimated_completion_time: diagnosis.diagnosis?.diagnosis?.estimated_repair_time || 'Unknown'
    };
  },

  /**
   * Generate repair checklist from diagnosis
   * @param {Object} diagnosis - Diagnosis data
   * @returns {Object} Repair checklist
   */
  generateRepairChecklist: (diagnosis) => {
    if (!diagnosis?.diagnosis?.diagnosis) return null;

    const checklist = {
      vehicle: `${diagnosis.vehicle_info?.year} ${diagnosis.vehicle_info?.make} ${diagnosis.vehicle_info?.model}`,
      primary_issue: diagnosis.diagnosis.diagnosis.primary_issue,
      checklist_items: []
    };

    // Add parts procurement items
    if (diagnosis.diagnosis.diagnosis.recommended_parts) {
      diagnosis.diagnosis.diagnosis.recommended_parts.forEach((part, index) => {
        checklist.checklist_items.push({
          id: `part_${index}`,
          type: 'part',
          description: `Order ${part.part_name} (${part.part_number})`,
          priority: part.priority,
          estimated_cost: part.estimated_cost,
          completed: false
        });
      });
    }

    // Add repair procedure items
    if (diagnosis.diagnosis.diagnosis.repair_procedures) {
      diagnosis.diagnosis.diagnosis.repair_procedures.forEach((procedure, index) => {
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
    if (diagnosis.diagnosis.diagnosis.testing_procedures) {
      diagnosis.diagnosis.diagnosis.testing_procedures.forEach((test, index) => {
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

  /**
   * Calculate diagnosis confidence score
   * @param {Object} diagnosis - Diagnosis data
   * @returns {Object} Confidence analysis
   */
  calculateConfidenceScore: (diagnosis) => {
    let score = 50; // Base score
    let factors = [];

    if (diagnosis.obd_codes && diagnosis.obd_codes.length > 0) {
      score += 20;
      factors.push(`+20: ${diagnosis.obd_codes.length} OBD code(s) provided`);
    }

    if (diagnosis.vehicle_info?.year && diagnosis.vehicle_info?.make && diagnosis.vehicle_info?.model) {
      score += 15;
      factors.push('+15: Complete vehicle information provided');
    }

    if (diagnosis.diagnosis?.diagnosis?.confidence_level === 'High') {
      score += 20;
      factors.push('+20: AI analysis confidence is high');
    } else if (diagnosis.diagnosis?.diagnosis?.confidence_level === 'Medium') {
      score += 10;
      factors.push('+10: AI analysis confidence is medium');
    }

    if (diagnosis.diagnosis?.diagnosis?.recommended_parts?.length > 0) {
      score += 10;
      factors.push('+10: Specific parts recommendations provided');
    }

    if (diagnosis.diagnosis?.diagnosis?.repair_procedures?.length > 0) {
      score += 10;
      factors.push('+10: Detailed repair procedures provided');
    }

    return {
      score: Math.min(score, 100),
      level: score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low',
      factors: factors
    };
  },

  /**
   * Get wiring diagram recommendations
   * @param {Object} diagnosis - Diagnosis data
   * @returns {Array} Wiring diagram recommendations
   */
  getWiringDiagramRecommendations: (diagnosis) => {
    if (!diagnosis?.diagnosis?.diagnosis?.wiring_diagrams) return [];

    return diagnosis.diagnosis.diagnosis.wiring_diagrams.map(diagram => ({
      system: diagram.system,
      description: diagram.description,
      key_components: diagram.key_components || [],
      common_failures: diagram.common_failure_points,
      diagram_sources: [
        'AllData Pro',
        'Mitchell OnDemand',
        'AutoZone Pro',
        'Manufacturer Service Manual'
      ],
      search_terms: [
        `${diagnosis.vehicle_info?.year} ${diagnosis.vehicle_info?.make} ${diagnosis.vehicle_info?.model} ${diagram.system}`,
        `${diagram.system} wiring diagram`,
        ...diagram.key_components.map(comp => `${comp} wiring`)
      ]
    }));
  },

  /**
   * Generate parts order list
   * @param {Object} diagnosis - Diagnosis data
   * @returns {Object} Parts order information
   */
  generatePartsOrderList: (diagnosis) => {
    if (!diagnosis?.diagnosis?.diagnosis?.recommended_parts) return null;

    const parts = diagnosis.diagnosis.diagnosis.recommended_parts;
    const totalCost = parts.reduce((sum, part) => {
      const cost = parseFloat(part.estimated_cost.replace('$', '')) || 0;
      return sum + cost;
    }, 0);

    return {
      vehicle: `${diagnosis.vehicle_info?.year} ${diagnosis.vehicle_info?.make} ${diagnosis.vehicle_info?.model}`,
      vin: diagnosis.vehicle_info?.vin || '',
      parts: parts.map(part => ({
        name: part.part_name,
        part_number: part.part_number,
        quantity: part.quantity,
        estimated_cost: part.estimated_cost,
        priority: part.priority,
        reason: part.reason,
        suppliers: [
          'AutoZone',
          'O\'Reilly Auto Parts', 
          'NAPA Auto Parts',
          'Amazon Automotive',
          'RockAuto'
        ]
      })),
      total_parts: parts.length,
      total_estimated_cost: `$${totalCost.toFixed(2)}`,
      order_priority: parts.some(p => p.priority === 'Critical') ? 'Rush' : 'Standard'
    };
  },

  /**
   * Generate customer explanation
   * @param {Object} diagnosis - Diagnosis data
   * @returns {Object} Customer-friendly explanation
   */
  generateCustomerExplanation: (diagnosis) => {
    if (!diagnosis?.diagnosis?.diagnosis) return null;

    const d = diagnosis.diagnosis.diagnosis;
    
    return {
      summary: {
        problem: d.primary_issue,
        cause: d.root_cause,
        severity: d.severity,
        urgency: d.severity === 'Critical' ? 'Immediate attention required' :
                d.severity === 'High' ? 'Should be addressed soon' :
                d.severity === 'Medium' ? 'Can be scheduled within a week' :
                'Can be addressed at next service'
      },
      what_it_means: `Your ${diagnosis.vehicle_info?.year} ${diagnosis.vehicle_info?.make} ${diagnosis.vehicle_info?.model} is experiencing ${d.primary_issue.toLowerCase()}. ${d.root_cause}`,
      what_we_recommend: d.recommended_parts?.map(part => 
        `Replace ${part.part_name} - ${part.reason}`
      ) || [],
      cost_breakdown: {
        parts: d.cost_estimate?.parts_total || '$0.00',
        labor: d.cost_estimate?.labor_total || '$0.00', 
        total: d.cost_estimate?.total_estimate || '$0.00',
        time_needed: d.estimated_repair_time || 'TBD'
      },
      next_steps: [
        'Schedule an appointment for detailed inspection',
        'Order necessary parts',
        'Perform recommended repairs',
        'Conduct post-repair testing',
        'Return vehicle to customer'
      ]
    };
  }
};

export default aiDiagnosticsService;
