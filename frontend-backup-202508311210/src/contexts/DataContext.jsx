// src/contexts/DataContext.jsx - Enhanced with AI integration
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  customerService,
  vehicleService,
  jobService,
  estimateService,
  invoiceService,
  appointmentService
} from '../utils/api';
import { aiService, obd2Service } from '../utils/services/aiService';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState({
    customers: [],
    vehicles: [],
    jobs: [],
    estimates: [],
    invoices: [],
    appointments: [],
    // AI-related data
    aiDiagnosticsHistory: [],
    aiChatHistory: [],
    obdLookupHistory: [],
    loading: {
      customers: false,
      vehicles: false,
      jobs: false,
      estimates: false,
      invoices: false,
      appointments: false,
      // AI loading states
      aiDiagnostics: false,
      aiChat: false,
      obdLookup: false,
      aiHistory: false
    },
    errors: {},
    lastFetch: {}
  });

  const setLoading = useCallback((resource, loading) => {
    setState(prev => ({ ...prev, loading: { ...prev.loading, [resource]: loading } }));
  }, []);

  const setError = useCallback((resource, error) => {
    setState(prev => ({ ...prev, errors: { ...prev.errors, [resource]: error } }));
  }, []);

  // Generic fetch function
  const createFetcher = (serviceMethod, resource) => async (params = {}) => {
    if (!isAuthenticated) return;
    setLoading(resource, true);
    setError(resource, null);
    try {
      const response = await serviceMethod(params);
      setState(prev => ({
        ...prev,
        [resource]: response.data,
        lastFetch: { ...prev.lastFetch, [resource]: new Date() }
      }));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || `Failed to fetch ${resource}`;
      setError(resource, errorMsg);
      console.error(`Failed to fetch ${resource}:`, error);
    } finally {
      setLoading(resource, false);
    }
  };

  // Create all existing fetchers
  const fetchCustomers = createFetcher(customerService.getAll, 'customers');
  const fetchVehicles = createFetcher(vehicleService.getAll, 'vehicles');
  const fetchJobs = createFetcher(jobService.getAll, 'jobs');
  const fetchEstimates = createFetcher(estimateService.getAll, 'estimates');
  const fetchInvoices = createFetcher(invoiceService.getAll, 'invoices');
  const fetchAppointments = createFetcher(appointmentService.getAll, 'appointments');

  // AI-specific fetch functions
  const fetchAIDiagnosticsHistory = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading('aiHistory', true);
    setError('aiHistory', null);
    try {
      const history = await aiService.getDiagnosticsHistory();
      setState(prev => ({
        ...prev,
        aiDiagnosticsHistory: history,
        lastFetch: { ...prev.lastFetch, aiDiagnosticsHistory: new Date() }
      }));
      return history;
    } catch (error) {
      const errorMsg = 'Failed to fetch AI diagnostics history';
      setError('aiHistory', errorMsg);
      console.error('Failed to fetch AI diagnostics history:', error);
      return [];
    } finally {
      setLoading('aiHistory', false);
    }
  }, [isAuthenticated]);

  // AI Chat function
  const sendAIChatMessage = useCallback(async ({ message, vehicleContext = null }) => {
    if (!isAuthenticated) return null;
    setLoading('aiChat', true);
    setError('aiChat', null);
    
    try {
      // Get recent chat history from state
      const history = state.aiChatHistory.slice(-10);
      
      const response = await aiService.sendChatMessage({
        message,
        history,
        vehicle_context: vehicleContext
      });

      if (response.success) {
        // Add both user message and AI response to history
        const userMessage = {
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        };
        
        const aiMessage = {
          role: 'assistant',
          content: response.message,
          timestamp: response.timestamp,
          fallback: response.fallback
        };

        setState(prev => ({
          ...prev,
          aiChatHistory: [...prev.aiChatHistory, userMessage, aiMessage].slice(-50) // Keep last 50 messages
        }));

        return response;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to send AI chat message';
      setError('aiChat', errorMsg);
      console.error('AI Chat error:', error);
      return { success: false, error: errorMsg };
    } finally {
      setLoading('aiChat', false);
    }
  }, [isAuthenticated, state.aiChatHistory]);

  // AI Diagnostics function
  const generateAIDiagnosis = useCallback(async (diagnosticData) => {
    if (!isAuthenticated) return null;
    setLoading('aiDiagnostics', true);
    setError('aiDiagnostics', null);
    
    try {
      const response = await aiService.generateDiagnosis(diagnosticData);

      if (response.success) {
        // Add to history
        setState(prev => ({
          ...prev,
          aiDiagnosticsHistory: [response.data, ...prev.aiDiagnosticsHistory].slice(0, 100) // Keep last 100 diagnoses
        }));

        return response;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to generate AI diagnosis';
      setError('aiDiagnostics', errorMsg);
      console.error('AI Diagnosis error:', error);
      return { success: false, error: errorMsg };
    } finally {
      setLoading('aiDiagnostics', false);
    }
  }, [isAuthenticated]);

  // OBD Code Lookup function
  const lookupOBDCode = useCallback(async (code) => {
    setLoading('obdLookup', true);
    setError('obdLookup', null);
    
    try {
      const result = await obd2Service.lookupCode(code);
      
      // Add to lookup history
      const historyEntry = {
        code,
        result,
        timestamp: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        obdLookupHistory: [historyEntry, ...prev.obdLookupHistory].slice(0, 50) // Keep last 50 lookups
      }));

      return result;
    } catch (error) {
      const errorMsg = error.message || 'Failed to lookup OBD code';
      setError('obdLookup', errorMsg);
      console.error('OBD Lookup error:', error);
      throw error;
    } finally {
      setLoading('obdLookup', false);
    }
  }, []);

  // Create estimate from AI diagnosis
  const createEstimateFromAIDiagnosis = useCallback(async (diagnosis, customerId, vehicleId) => {
    if (!isAuthenticated) return null;
    setLoading('estimates', true);
    setError('estimates', null);
    
    try {
      const estimate = await aiService.createEstimateFromDiagnosis(diagnosis, customerId, vehicleId);
      
      // Add to estimates list
      setState(prev => ({
        ...prev,
        estimates: [estimate, ...prev.estimates]
      }));

      return estimate;
    } catch (error) {
      const errorMsg = error.message || 'Failed to create estimate from diagnosis';
      setError('estimates', errorMsg);
      console.error('Create estimate error:', error);
      throw error;
    } finally {
      setLoading('estimates', false);
    }
  }, [isAuthenticated]);

  // Clear AI chat history
  const clearAIChatHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      aiChatHistory: []
    }));
  }, []);

  // Get AI insights for dashboard
  const getAIInsights = useCallback(() => {
    const recentDiagnoses = state.aiDiagnosticsHistory.slice(0, 10);
    const recentOBDLookups = state.obdLookupHistory.slice(0, 10);
    
    // Calculate insights
    const totalDiagnoses = state.aiDiagnosticsHistory.length;
    const highConfidenceDiagnoses = recentDiagnoses.filter(d => 
      d.diagnosis?.confidence_level === 'High'
    ).length;
    
    const commonOBDCodes = recentOBDLookups.reduce((acc, lookup) => {
      acc[lookup.code] = (acc[lookup.code] || 0) + 1;
      return acc;
    }, {});

    const estimatesFromAI = state.estimates.filter(e => e.ai_generated).length;

    return {
      totalDiagnoses,
      highConfidenceDiagnoses,
      commonOBDCodes: Object.entries(commonOBDCodes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      estimatesFromAI,
      recentActivity: {
        diagnoses: recentDiagnoses.length,
        obdLookups: recentOBDLookups.length,
        chatMessages: state.aiChatHistory.filter(m => {
          const messageTime = new Date(m.timestamp);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return messageTime > dayAgo;
        }).length
      }
    };
  }, [state.aiDiagnosticsHistory, state.obdLookupHistory, state.estimates, state.aiChatHistory]);

  // Enhanced refresh all data to include AI data
  const refreshAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    await Promise.allSettled([
      fetchCustomers(),
      fetchVehicles(),
      fetchJobs(),
      fetchEstimates(),
      fetchInvoices(),
      fetchAppointments(),
      fetchAIDiagnosticsHistory()
    ]);
  }, [isAuthenticated, fetchCustomers, fetchVehicles, fetchJobs, fetchEstimates, fetchInvoices, fetchAppointments, fetchAIDiagnosticsHistory]);

  // Enhanced clear data to include AI data
  const clearData = useCallback(() => {
    setState({
      customers: [],
      vehicles: [],
      jobs: [],
      estimates: [],
      invoices: [],
      appointments: [],
      // Clear AI data
      aiDiagnosticsHistory: [],
      aiChatHistory: [],
      obdLookupHistory: [],
      loading: {
        customers: false,
        vehicles: false,
        jobs: false,
        estimates: false,
        invoices: false,
        appointments: false,
        aiDiagnostics: false,
        aiChat: false,
        obdLookup: false,
        aiHistory: false
      },
      errors: {},
      lastFetch: {}
    });
  }, []);

  const value = {
    ...state,
    // Existing methods
    fetchCustomers,
    fetchVehicles,
    fetchJobs,
    fetchEstimates,
    fetchInvoices,
    fetchAppointments,
    refreshAllData,
    clearData,
    setLoading,
    setError,
    // AI methods
    fetchAIDiagnosticsHistory,
    sendAIChatMessage,
    generateAIDiagnosis,
    lookupOBDCode,
    createEstimateFromAIDiagnosis,
    clearAIChatHistory,
    getAIInsights,
    // AI validation helpers
    validateOBDCode: obd2Service.validateCode,
    parseOBDCodes: obd2Service.parseCodes
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

// AI-specific hook for easier access to AI functionality
export const useAI = () => {
  const {
    aiDiagnosticsHistory,
    aiChatHistory,
    obdLookupHistory,
    loading,
    errors,
    sendAIChatMessage,
    generateAIDiagnosis,
    lookupOBDCode,
    createEstimateFromAIDiagnosis,
    clearAIChatHistory,
    getAIInsights,
    validateOBDCode,
    parseOBDCodes,
    fetchAIDiagnosticsHistory
  } = useData();

  return {
    // Data
    diagnosticsHistory: aiDiagnosticsHistory,
    chatHistory: aiChatHistory,
    obdHistory: obdLookupHistory,
    insights: getAIInsights(),
    // Loading states
    loading: {
      diagnostics: loading.aiDiagnostics,
      chat: loading.aiChat,
      obd: loading.obdLookup,
      history: loading.aiHistory
    },
    // Errors
    errors: {
      diagnostics: errors.aiDiagnostics,
      chat: errors.aiChat,
      obd: errors.obdLookup,
      history: errors.aiHistory
    },
    // Methods
    sendChatMessage: sendAIChatMessage,
    generateDiagnosis: generateAIDiagnosis,
    lookupOBD: lookupOBDCode,
    createEstimate: createEstimateFromAIDiagnosis,
    clearChat: clearAIChatHistory,
    validateOBD: validateOBDCode,
    parseOBD: parseOBDCodes,
    refreshHistory: fetchAIDiagnosticsHistory
  };
};
