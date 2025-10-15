// src/utils/services/index.js
import customerService from './customerService';
import vehicleService from './vehicleService';
import jobService from './jobService';
import estimateService from './estimateService';
import invoiceService from './invoiceService';
import appointmentService from './appointmentService';
import timeclockService from './timeclockService';
import reportService from './reportService';
import diagnosticsService from './diagnosticsService';
import dashboardService from './dashboardService';

export {
  customerService,
  vehicleService,
  jobService,
  estimateService,
  invoiceService,
  appointmentService,
  timeclockService,
  reportService as reportsService,
  diagnosticsService,
  dashboardService
};

// AI Service
export { default as aiService } from './aiService';
