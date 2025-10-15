// src/utils/index.js - Corrected exports
export { default as aiDiagnosticsService } from './aiDiagnosticsService';
export { generateAIResponse, analyzeDiagnosticCodes } from './aiUtils';
export { default as api, API_BASE_URL, apiCache, enhancedGet, uploadApi, healthApi } from './api';
export { apiEndpoints } from './apiEndpoints';

// Services
export { customerService } from './services/customerService';
export { default as vehicleService } from './services/vehicleService';
export { default as jobService } from './services/jobService';
export { default as estimateService } from './services/estimateService';
export { default as invoiceService } from './services/invoiceService';
export { default as appointmentService } from './services/appointmentService';
export { timeclockService } from './services/timeclockService';
export { default as reportService } from './services/reportService';
export { default as dashboardService } from './services/dashboardService';
export { migrationService } from './services/migrationServices';

// Utilities
export { calcPartsSubtotal, calcPartsMarkup, calcLaborSubtotal, calcShopSupplies, calcTax, computeTotals } from './billing';
export { calculateLaborCost, calculatePartMarkup, formatCurrency, calculateEstimateAccuracy } from './calculations';
export { formatDate, formatTime, formatDateTime, getRelativeTime, addDays, addHours } from './dateUtils';
export { handleApiError, createErrorBoundary, retryOperation, validateRequiredFields } from './errorUtils';
export { showMessage, showSuccess, showError, showLoading, dismissToast, dismissAllToasts, promiseToast } from './toast';
export { getToken, setToken, removeToken, getUserData, setUserData, removeUserData, clearAllAuthData, isAuthenticated, isTokenExpired } from './tokenManager';
