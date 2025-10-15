// src/contexts/ShopContext.jsx - Complete Shop Management Context
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  customerService, 
  vehicleService, 
  jobService, 
  estimateService,
  invoiceService,
  settingsService,
  timeClockService,
  employeeService,
  dashboardService
} from '../utils/api';
import { useAuth } from './AuthContext';
import { showMessage } from '../utils/toast';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [shopData, setShopData] = useState({
    // Shop Information
    shopInfo: {
      name: "Eddie's Askan Automotive",
      address: "123 Main St, Bakersfield, CA 93301",
      phone: "(661) 555-0123",
      email: "admin@eddiesauto.com",
      website: "www.eddiesauto.com",
      taxId: "XX-XXXXXXX",
      licenseNumber: "CA-AUTO-123456"
    },
    
    // Business Settings
    businessSettings: {
      laborRate: 140.00,
      taxRate: 0.0875,
      currency: "USD",
      timezone: "America/Los_Angeles",
      businessHours: {
        monday: { open: "08:00", close: "17:00", closed: false },
        tuesday: { open: "08:00", close: "17:00", closed: false },
        wednesday: { open: "08:00", close: "17:00", closed: false },
        thursday: { open: "08:00", close: "17:00", closed: false },
        friday: { open: "08:00", close: "17:00", closed: false },
        saturday: { open: "09:00", close: "15:00", closed: false },
        sunday: { open: "00:00", close: "00:00", closed: true }
      },
      appointmentSlots: 30, // minutes per slot
      maxDailyAppointments: 16
    },

    // Dashboard Stats
    dashboardStats: {
      todaysJobs: 0,
      activeEstimates: 0,
      pendingInvoices: 0,
      dailyRevenue: 0,
      weeklyRevenue: 0,
      monthlyRevenue: 0,
      totalCustomers: 0,
      vehiclesInShop: 0,
      employeesPresent: 0
    },

    // Recent Activity
    recentActivity: [],
    
    // System Status
    systemStatus: {
      database: 'connected',
      backup: 'success',
      lastBackup: null,
      uptime: 0
    },

    // UI State
    loading: {},
    error: null,
    lastUpdated: null
  });

  const loadingRef = useRef(false);

  // Utility functions
  const setLoading = useCallback((key, value) => {
    setShopData(prev => ({
      ...prev,
      loading: { ...prev.loading, [key]: value }
    }));
  }, []);

  const setError = useCallback((error) => {
    setShopData(prev => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setShopData(prev => ({ ...prev, error: null }));
  }, []);

  // Load shop information
  const loadShopInfo = useCallback(async () => {
    if (loadingRef.current) return;
    
    setLoading('shopInfo', true);
    try {
      const settings = await settingsService.getShopInfo();
      setShopData(prev => ({
        ...prev,
        shopInfo: { ...prev.shopInfo, ...(settings.data || {}) }
      }));
    } catch (error) {
      console.warn('Could not load shop info:', error);
    } finally {
      setLoading('shopInfo', false);
    }
  }, [setLoading]);

  // Load dashboard statistics
  const loadDashboardStats = useCallback(async () => {
    setLoading('dashboardStats', true);
    try {
      const stats = await dashboardService.getStats();
      setShopData(prev => ({
        ...prev,
        dashboardStats: { ...prev.dashboardStats, ...(stats.data || {}) }
      }));
    } catch (error) {
      console.warn('Could not load dashboard stats:', error);
    } finally {
      setLoading('dashboardStats', false);
    }
  }, [setLoading]);

  // Load recent activity
  const loadRecentActivity = useCallback(async () => {
    setLoading('recentActivity', true);
    try {
      const activity = await dashboardService.getRecentActivity();
      setShopData(prev => ({
        ...prev,
        recentActivity: activity.data || []
      }));
    } catch (error) {
      console.warn('Could not load recent activity:', error);
    } finally {
      setLoading('recentActivity', false);
    }
  }, [setLoading]);

  // Calculate labor cost
  const calculateLaborCost = useCallback((hours, rate = null) => {
    const laborRate = rate || shopData.businessSettings.laborRate;
    return parseFloat((hours * laborRate).toFixed(2));
  }, [shopData.businessSettings.laborRate]);

  // Calculate tax amount
  const calculateTax = useCallback((subtotal, taxRate = null) => {
    const rate = taxRate || shopData.businessSettings.taxRate;
    return parseFloat((subtotal * rate).toFixed(2));
  }, [shopData.businessSettings.taxRate]);

  // Calculate total with tax
  const calculateTotal = useCallback((subtotal, taxRate = null) => {
    const tax = calculateTax(subtotal, taxRate);
    return parseFloat((subtotal + tax).toFixed(2));
  }, [calculateTax]);

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: shopData.businessSettings.currency
    }).format(amount);
  }, [shopData.businessSettings.currency]);

  // Update shop information
  const updateShopInfo = useCallback(async (updates) => {
    setLoading('updateShopInfo', true);
    try {
      const result = await settingsService.updateShopInfo(updates);
      setShopData(prev => ({
        ...prev,
        shopInfo: { ...prev.shopInfo, ...updates }
      }));
      showMessage('Shop information updated successfully!', 'success');
      return { success: true, data: result.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update shop information';
      setError(message);
      showMessage(message, 'error');
      return { success: false, error: message };
    } finally {
      setLoading('updateShopInfo', false);
    }
  }, [setLoading, setError]);

  // Update business settings
  const updateBusinessSettings = useCallback(async (updates) => {
    setLoading('updateBusinessSettings', true);
    try {
      const result = await settingsService.updateMultiple(updates);
      setShopData(prev => ({
        ...prev,
        businessSettings: { ...prev.businessSettings, ...updates }
      }));
      showMessage('Business settings updated successfully!', 'success');
      return { success: true, data: result.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update business settings';
      setError(message);
      showMessage(message, 'error');
      return { success: false, error: message };
    } finally {
      setLoading('updateBusinessSettings', false);
    }
  }, [setLoading, setError]);

  // Get business hours for a specific day
  const getBusinessHours = useCallback((day = null) => {
    const today = day || new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return shopData.businessSettings.businessHours[today] || { open: "08:00", close: "17:00", closed: false };
  }, [shopData.businessSettings.businessHours]);

  // Check if shop is currently open
  const isShopOpen = useCallback(() => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = getBusinessHours(currentDay);
    
    if (hours.closed) return false;
    
    const currentTime = now.toTimeString().slice(0, 5);
    return currentTime >= hours.open && currentTime <= hours.close;
  }, [getBusinessHours]);

  // Get next business day
  const getNextBusinessDay = useCallback(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let date = new Date();
    
    for (let i = 1; i <= 7; i++) {
      date.setDate(date.getDate() + 1);
      const dayName = days[date.getDay()];
      const hours = shopData.businessSettings.businessHours[dayName];
      
      if (!hours.closed) {
        return {
          date: date.toDateString(),
          hours: hours
        };
      }
    }
    
    return null;
  }, [shopData.businessSettings.businessHours]);

  // Generate invoice number
  const generateInvoiceNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${year}${month}-${timestamp}`;
  }, []);

  // Generate estimate number
  const generateEstimateNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    return `EST-${year}${month}-${timestamp}`;
  }, []);

  // Generate job number
  const generateJobNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `JOB-${year}-${timestamp}`;
  }, []);

  // Create quick job from estimate
  const createJobFromEstimate = useCallback(async (estimateId) => {
    setLoading('createJobFromEstimate', true);
    try {
      const result = await estimateService.convertToJob(estimateId);
      showMessage('Job created from estimate successfully!', 'success');
      return { success: true, data: result.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create job from estimate';
      setError(message);
      showMessage(message, 'error');
      return { success: false, error: message };
    } finally {
      setLoading('createJobFromEstimate', false);
    }
  }, [setLoading, setError]);

  // Create invoice from job
  const createInvoiceFromJob = useCallback(async (jobId) => {
    setLoading('createInvoiceFromJob', true);
    try {
      const result = await jobService.createInvoice(jobId);
      showMessage('Invoice created from job successfully!', 'success');
      return { success: true, data: result.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create invoice from job';
      setError(message);
      showMessage(message, 'error');
      return { success: false, error: message };
    } finally {
      setLoading('createInvoiceFromJob', false);
    }
  }, [setLoading, setError]);

  // Get current time clock status
  const getTimeClockStatus = useCallback(async () => {
    try {
      const result = await timeClockService.getStatus();
      return result.data || {};
    } catch (error) {
      console.warn('Could not get timeclock status:', error);
      return {};
    }
  }, []);

  // Refresh all shop data
  const refreshShopData = useCallback(async () => {
    loadingRef.current = true;
    setLoading('refreshAll', true);
    
    try {
      await Promise.all([
        loadShopInfo(),
        loadDashboardStats(),
        loadRecentActivity()
      ]);
      
      setShopData(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString()
      }));
      
      showMessage('Shop data refreshed successfully!', 'success');
    } catch (error) {
      console.error('Failed to refresh shop data:', error);
      showMessage('Failed to refresh shop data', 'error');
    } finally {
      setLoading('refreshAll', false);
      loadingRef.current = false;
    }
  }, [loadShopInfo, loadDashboardStats, loadRecentActivity, setLoading]);

  // Auto-refresh dashboard stats periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial load
    refreshShopData();

    // Set up auto-refresh every 5 minutes for stats only
    const statsInterval = setInterval(() => {
      loadDashboardStats();
      loadRecentActivity();
    }, 5 * 60 * 1000);

    return () => clearInterval(statsInterval);
  }, [isAuthenticated, loadDashboardStats, loadRecentActivity, refreshShopData]);

  // Computed values
  const computedValues = useMemo(() => ({
    isShopOpen: isShopOpen(),
    todaysHours: getBusinessHours(),
    nextBusinessDay: getNextBusinessDay(),
    formattedRevenue: {
      daily: formatCurrency(shopData.dashboardStats.dailyRevenue),
      weekly: formatCurrency(shopData.dashboardStats.weeklyRevenue),
      monthly: formatCurrency(shopData.dashboardStats.monthlyRevenue)
    }
  }), [isShopOpen, getBusinessHours, getNextBusinessDay, formatCurrency, shopData.dashboardStats]);

  // Context value
  const contextValue = useMemo(() => ({
    // Shop data
    shopInfo: shopData.shopInfo,
    businessSettings: shopData.businessSettings,
    dashboardStats: shopData.dashboardStats,
    recentActivity: shopData.recentActivity,
    systemStatus: shopData.systemStatus,
    
    // Computed values
    ...computedValues,
    
    // UI state
    loading: shopData.loading,
    error: shopData.error,
    lastUpdated: shopData.lastUpdated,
    
    // Shop operations
    updateShopInfo,
    updateBusinessSettings,
    refreshShopData,
    clearError,
    
    // Business hours utilities
    getBusinessHours,
    getNextBusinessDay,
    
    // Calculation utilities
    calculateLaborCost,
    calculateTax,
    calculateTotal,
    formatCurrency,
    
    // Number generation
    generateInvoiceNumber,
    generateEstimateNumber,
    generateJobNumber,
    
    // Workflow utilities
    createJobFromEstimate,
    createInvoiceFromJob,
    getTimeClockStatus,
    
    // Utility functions
    isLoading: (key) => !!shopData.loading[key]
  }), [
    shopData,
    computedValues,
    updateShopInfo,
    updateBusinessSettings,
    refreshShopData,
    clearError,
    getBusinessHours,
    getNextBusinessDay,
    calculateLaborCost,
    calculateTax,
    calculateTotal,
    formatCurrency,
    generateInvoiceNumber,
    generateEstimateNumber,
    generateJobNumber,
    createJobFromEstimate,
    createInvoiceFromJob,
    getTimeClockStatus
  ]);

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

// Custom hook to use shop context
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

// Utility hooks for specific shop functionality
export const useShopHours = () => {
  const { businessSettings, getBusinessHours, isShopOpen, getNextBusinessDay } = useShop();
  return {
    businessHours: businessSettings.businessHours,
    getBusinessHours,
    isShopOpen,
    getNextBusinessDay
  };
};

export const useShopCalculations = () => {
  const { calculateLaborCost, calculateTax, calculateTotal, formatCurrency, businessSettings } = useShop();
  return {
    calculateLaborCost,
    calculateTax,
    calculateTotal,
    formatCurrency,
    laborRate: businessSettings.laborRate,
    taxRate: businessSettings.taxRate
  };
};

export const useShopNumbers = () => {
  const { generateInvoiceNumber, generateEstimateNumber, generateJobNumber } = useShop();
  return {
    generateInvoiceNumber,
    generateEstimateNumber,
    generateJobNumber
  };
};

export default ShopContext;
