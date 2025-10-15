// Auto-generated utility exports

// From apiEndpoints
export { apiEndpoints } from './apiEndpoints';

// From aiUtils
export { generateAIResponse, analyzeDiagnosticCodes } from './aiUtils';

// From calculations
export { 
  computeTotals, 
  calculateLaborCost, 
  calculatePartMarkup, 
  formatCurrency, 
  calculateEstimateAccuracy 
} from './calculations';

// From dateUtils
export { 
  formatDate, 
  formatTime, 
  formatDateTime, 
  getRelativeTime, 
  addDays, 
  addHours 
} from './dateUtils';

// From errorUtils
export { 
  handleApiError, 
  createErrorBoundary, 
  retryOperation, 
  validateRequiredFields 
} from './errorUtils.jsx';

// From messageUtils
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

// From socketUtils
export { 
  initializeSocket, 
  getSocket, 
  disconnectSocket, 
  socket, 
  emitSocketEvent, 
  onSocketEvent, 
  offSocketEvent 
} from './socketUtils';

// From statusUtils
export { 
  getStatusColor, 
  getStatusIcon, 
  getStatusText, 
  getStatusBadgeProps 
} from './statusUtils';

// From vehicleHelpers (if it exists)
export { vehicleHelpers } from './vehicleHelpers';


// From api
export {
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
  estimates_int_estimate_id_convert_to_job_post,
  invoices_get,
  invoices_post,
  invoices_int_invoice_id_get,
  invoices_int_invoice_id_put,
  invoices_int_invoice_id_mark_paid_post,
  dashboard_stats_get,
  dashboard_recent_activity_get,
  reports_sales_get,
  settings_get,
  settings_shop_get,
  settings_shop_put,
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
  migrationService,
  appointmentService,
  API_BASE_URL,
  apiUtils,
} from './api';

// Default export for backward compatibility
export { apiEndpoints as default } from './apiEndpoints';
