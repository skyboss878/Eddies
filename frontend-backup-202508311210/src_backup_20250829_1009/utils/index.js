// Auto-generated utility exports - Updated and cleaned

// Core API exports
export {
  default as api,
  API_BASE_URL,
  apiEndpoints,
  migrationService,

  // Service objects (recommended for new code)
  customerService,
  vehicleService,
  jobService,
  estimateService,
  invoiceService,
  dashboardService,
  settingsService,
  partsService,
  inventoryService,
  timeclockService,
  reportsService,
  appointmentService,

  // Legacy function exports (for backward compatibility)
  register_post,
  login_post,
  register_with_code_post,
  me_get,
  change_password_put,
  logout_post,
  refresh_post,
  customers_get,
  customers_post,
  customers_int_customer_id_get,
  customers_int_customer_id_put,
  customers_int_customer_id_delete,
  customers_int_customer_id_vehicles_get,
  customers_search_get,
  vehicles_get,
  vehicles_post,
  vehicles_int_vehicle_id_get,
  vehicles_int_vehicle_id_put,
  vehicles_int_vehicle_id_delete,
  vehicles_vin_lookup_vin_get,
  jobs_get,
  jobs_post,
  jobs_int_job_id_get,
  jobs_int_job_id_status_patch,
  jobs_int_job_id_parts_post,
  jobs_int_job_id_labor_post,
  timeclock_clock_in_post,
  timeclock_clock_out_post,
  timeclock_status_get,
  timeclock_history_get,
  parts_get,
  parts_post,
  inventory_low_stock_get,
  estimates_get,
  estimates_post,
  estimates_int_estimate_id_get,
  estimates_int_estimate_id_put,
  estimates_int_estimate_id_convert_to_job_post,
  invoices_get,
  invoices_post,
  invoices_int_invoice_id_get,
  invoices_int_invoice_id_put,
  invoices_int_invoice_id_mark_paid_post,
  appointments_get,
  appointments_post,
  appointments_int_id_get,
  appointments_int_id_put,
  appointments_int_id_delete,
  dashboard_stats_get,
  dashboard_recent_activity_get,
  reports_sales_get,
  settings_get,
  settings_shop_get,
  settings_shop_put
} from './api';

// Token management
export {
  getToken,
  setToken,
  removeToken,
  getUserData,
  setUserData,
  removeUserData,
  clearAllAuthData,
  isAuthenticated,
  isTokenExpired
} from './tokenManager';

// API Testing utilities
export {
  testApiConnections,
  quickHealthCheck,
  testEndpoint
} from './testApi';

// AI utilities (updated to named exports)
export {
  generateAIResponse,
  analyzeDiagnosticCodes
} from './aiUtils';

// Calculation utilities
export {
  computeTotals,
  calculateLaborCost,
  calculatePartMarkup,
  formatCurrency,
  calculateEstimateAccuracy
} from './calculations';

// Date utilities
export {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  addDays,
  addHours
} from './dateUtils';

// Error handling utilities
export {
  handleApiError,
  createErrorBoundary,
  retryOperation,
  validateRequiredFields
} from './errorUtils.jsx';

// Message utilities
export {
  showMessage,
  hideMessage,
  clearAllMessages,
  getActiveMessages,
  showSuccess,
  showError,
  showWarning,
  showInfo
} from './messageUtils';

// Socket utilities
export {
  initializeSocket,
  getSocket,
  disconnectSocket,
  socket,
  emitSocketEvent,
  onSocketEvent,
  offSocketEvent
} from './socketUtils';

// Status utilities
export {
  getStatusColor,
  getStatusIcon,
  getStatusText,
  getStatusBadgeProps
} from './statusUtils';

// Vehicle utilities
export { vehicleHelpers } from './vehicleHelpers';

// Toast notifications
export * from './toast';

// Billing utilities
export * from './billing';

// Employee service
export * from './employeeService';

// Utility service
export * from './utilityService';

// AI diagnostics service
export * from './aiDiagnosticsService';

// Re-export apiEndpoints for backward compatibility
export { apiEndpoints as endpoints } from './apiEndpoints';

// Additional AI / diagnostics services
export * from './aiService';
export * from '../services/diagnosticsService';
