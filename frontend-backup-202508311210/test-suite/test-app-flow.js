#!/usr/bin/env node

/**
 * Automated App Flow & API Testing Script
 * Tests major user flows and API endpoints while your app is running
 * 
 * Usage: node test-app-flow.js
 * Make sure your frontend (localhost:5173) and backend (localhost:5000) are running
 */

const axios = require('axios');
const colors = require('colors');

// Configuration
const config = {
  frontend: 'http://localhost:5173',
  backend: 'http://localhost:5000',
  testUser: {
    email: 'test@eddiesauto.com',
    password: 'TestPassword123!',
    first_name: 'Test',
    last_name: 'User',
    role: 'admin'
  },
  testCustomer: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-0123',
    address: '123 Main St, City, ST 12345'
  },
  testVehicle: {
    year: 2020,
    make: 'Toyota',
    model: 'Camry',
    vin: '1HGBH41JXMN109186',
    license_plate: 'ABC123',
    color: 'Blue'
  }
};

let authToken = null;
let testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper Functions
const log = {
  info: (msg) => console.log('ℹ️ '.blue + msg),
  success: (msg) => console.log('✅'.green + ' ' + msg.green),
  error: (msg) => console.log('❌'.red + ' ' + msg.red),
  warn: (msg) => console.log('⚠️ '.yellow + msg.yellow),
  section: (msg) => console.log('\n' + '='.repeat(50).cyan + '\n' + msg.cyan.bold + '\n' + '='.repeat(50).cyan)
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = async (method, url, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      status: error.response?.status || 0
    };
  }
};

const testEndpoint = async (name, method, url, data = null, expectedStatus = 200) => {
  log.info(`Testing: ${name}`);
  const result = await makeRequest(method, url, data);
  
  if (result.success && result.status === expectedStatus) {
    testResults.passed++;
    log.success(`${name} - PASSED`);
    return result;
  } else {
    testResults.failed++;
    const errorMsg = `${name} - FAILED: ${result.error || 'Unknown error'} (Status: ${result.status})`;
    log.error(errorMsg);
    testResults.errors.push(errorMsg);
    return result;
  }
};

// Test Functions
const testHealthCheck = async () => {
  log.section('🏥 HEALTH CHECKS');
  
  // Test backend health
  await testEndpoint(
    'Backend Health Check',
    'GET',
    `${config.backend}/api/health`
  );
  
  // Test frontend accessibility
  try {
    const response = await axios.get(config.frontend, { timeout: 5000 });
    if (response.status === 200) {
      testResults.passed++;
      log.success('Frontend Accessibility - PASSED');
    } else {
      testResults.failed++;
      log.error('Frontend Accessibility - FAILED');
    }
  } catch (error) {
    testResults.failed++;
    log.error(`Frontend Accessibility - FAILED: ${error.message}`);
  }
};

const testAuthentication = async () => {
  log.section('🔐 AUTHENTICATION FLOW');
  
  // Test user registration (might fail if user exists, that's OK)
  const registerResult = await testEndpoint(
    'User Registration',
    'POST',
    `${config.backend}/api/auth/register`,
    config.testUser,
    201
  );
  
  // Test user login
  const loginResult = await testEndpoint(
    'User Login',
    'POST',
    `${config.backend}/api/auth/login`,
    {
      email: config.testUser.email,
      password: config.testUser.password
    }
  );
  
  if (loginResult.success && loginResult.data.token) {
    authToken = loginResult.data.token;
    log.success('Auth token obtained successfully');
  } else {
    log.error('Failed to obtain auth token - subsequent tests may fail');
  }
  
  // Test profile endpoint
  if (authToken) {
    await testEndpoint(
      'Get User Profile',
      'GET',
      `${config.backend}/api/auth/me`
    );
  }
};

const testCustomerFlow = async () => {
  log.section('👥 CUSTOMER MANAGEMENT FLOW');
  
  if (!authToken) {
    log.warn('Skipping customer tests - no auth token');
    return null;
  }
  
  // Create customer
  const createResult = await testEndpoint(
    'Create Customer',
    'POST',
    `${config.backend}/api/auth/customers`,
    config.testCustomer,
    201
  );
  
  let customerId = null;
  if (createResult.success && createResult.data.customer_id) {
    customerId = createResult.data.customer_id;
    log.info(`Created customer with ID: ${customerId}`);
  }
  
  // Get all customers
  await testEndpoint(
    'Get All Customers',
    'GET',
    `${config.backend}/api/auth/customers`
  );
  
  // Get specific customer
  if (customerId) {
    await testEndpoint(
      'Get Customer by ID',
      'GET',
      `${config.backend}/api/auth/customers/${customerId}`
    );
    
    // Update customer
    await testEndpoint(
      'Update Customer',
      'PUT',
      `${config.backend}/api/auth/customers/${customerId}`,
      { ...config.testCustomer, phone: '555-9999' }
    );
  }
  
  // Search customers
  await testEndpoint(
    'Search Customers',
    'GET',
    `${config.backend}/api/auth/customers/search?q=John`
  );
  
  return customerId;
};

const testVehicleFlow = async (customerId) => {
  log.section('🚗 VEHICLE MANAGEMENT FLOW');
  
  if (!authToken) {
    log.warn('Skipping vehicle tests - no auth token');
    return null;
  }
  
  // Create vehicle
  const vehicleData = { ...config.testVehicle, customer_id: customerId };
  const createResult = await testEndpoint(
    'Create Vehicle',
    'POST',
    `${config.backend}/api/auth/vehicles`,
    vehicleData,
    201
  );
  
  let vehicleId = null;
  if (createResult.success && createResult.data.vehicle_id) {
    vehicleId = createResult.data.vehicle_id;
    log.info(`Created vehicle with ID: ${vehicleId}`);
  }
  
  // Get all vehicles
  await testEndpoint(
    'Get All Vehicles',
    'GET',
    `${config.backend}/api/auth/vehicles`
  );
  
  // Get specific vehicle
  if (vehicleId) {
    await testEndpoint(
      'Get Vehicle by ID',
      'GET',
      `${config.backend}/api/auth/vehicles/${vehicleId}`
    );
  }
  
  // Test VIN lookup (this might fail if external service is down)
  await testEndpoint(
    'VIN Lookup',
    'GET',
    `${config.backend}/api/auth/vehicles/vin-lookup/1HGBH41JXMN109186`
  );
  
  return vehicleId;
};

const testJobFlow = async (customerId, vehicleId) => {
  log.section('🔧 JOB MANAGEMENT FLOW');
  
  if (!authToken || !customerId || !vehicleId) {
    log.warn('Skipping job tests - missing requirements');
    return null;
  }
  
  const jobData = {
    customer_id: customerId,
    vehicle_id: vehicleId,
    description: 'Oil change and inspection',
    status: 'pending',
    priority: 'medium'
  };
  
  // Create job
  const createResult = await testEndpoint(
    'Create Job',
    'POST',
    `${config.backend}/api/auth/jobs`,
    jobData,
    201
  );
  
  let jobId = null;
  if (createResult.success && createResult.data.job_id) {
    jobId = createResult.data.job_id;
    log.info(`Created job with ID: ${jobId}`);
  }
  
  // Get all jobs
  await testEndpoint(
    'Get All Jobs',
    'GET',
    `${config.backend}/api/auth/jobs`
  );
  
  // Get specific job
  if (jobId) {
    await testEndpoint(
      'Get Job by ID',
      'GET',
      `${config.backend}/api/auth/jobs/${jobId}`
    );
    
    // Update job status
    await testEndpoint(
      'Update Job Status',
      'PATCH',
      `${config.backend}/api/auth/jobs/${jobId}/status`,
      { status: 'in_progress' }
    );
  }
  
  return jobId;
};

const testTimeclockFlow = async () => {
  log.section('⏰ TIMECLOCK FLOW');
  
  if (!authToken) {
    log.warn('Skipping timeclock tests - no auth token');
    return;
  }
  
  // Get current status
  await testEndpoint(
    'Get Timeclock Status',
    'GET',
    `${config.backend}/api/auth/timeclock/status`
  );
  
  // Clock in
  await testEndpoint(
    'Clock In',
    'POST',
    `${config.backend}/api/auth/timeclock/clock-in`,
    null,
    200
  );
  
  await sleep(2000); // Wait 2 seconds
  
  // Clock out
  await testEndpoint(
    'Clock Out',
    'POST',
    `${config.backend}/api/auth/timeclock/clock-out`,
    null,
    200
  );
  
  // Get history
  await testEndpoint(
    'Get Timeclock History',
    'GET',
    `${config.backend}/api/auth/timeclock/history`
  );
};

const testDashboardFlow = async () => {
  log.section('📊 DASHBOARD & REPORTS');
  
  if (!authToken) {
    log.warn('Skipping dashboard tests - no auth token');
    return;
  }
  
  // Dashboard stats
  await testEndpoint(
    'Dashboard Stats',
    'GET',
    `${config.backend}/api/auth/dashboard/stats`
  );
  
  // Recent activity
  await testEndpoint(
    'Dashboard Recent Activity',
    'GET',
    `${config.backend}/api/auth/dashboard/recent-activity`
  );
  
  // Sales reports
  await testEndpoint(
    'Sales Report',
    'GET',
    `${config.backend}/api/auth/reports/sales`
  );
};

const testSettingsFlow = async () => {
  log.section('⚙️ SETTINGS FLOW');
  
  if (!authToken) {
    log.warn('Skipping settings tests - no auth token');
    return;
  }
  
  // Get settings
  await testEndpoint(
    'Get Settings',
    'GET',
    `${config.backend}/api/auth/settings`
  );
  
  // Get shop settings
  await testEndpoint(
    'Get Shop Settings',
    'GET',
    `${config.backend}/api/auth/settings/shop`
  );
  
  // Update shop settings
  await testEndpoint(
    'Update Shop Settings',
    'PUT',
    `${config.backend}/api/auth/settings/shop`,
    {
      name: "Eddie's Automotive Test",
      address: "123 Test St",
      phone: "555-TEST",
      email: "test@eddiesauto.com"
    }
  );
};

const printResults = () => {
  log.section('📋 TEST RESULTS SUMMARY');
  
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`.white);
  console.log(`Passed: ${testResults.passed}`.green);
  console.log(`Failed: ${testResults.failed}`.red);
  console.log(`Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.errors.length > 0) {
    log.section('❌ FAILED TESTS');
    testResults.errors.forEach(error => {
      console.log(`  • ${error}`.red);
    });
  }
  
  if (testResults.failed === 0) {
    log.success('\n🎉 All tests passed! Your app is working correctly.');
  } else if (testResults.failed < testResults.passed) {
    log.warn('\n⚠️  Some tests failed, but most functionality is working.');
  } else {
    log.error('\n🚨 Many tests failed. Check your app and API configuration.');
  }
};

// Main test execution
const runTests = async () => {
  console.log('🚀 Starting Eddie\'s Automotive App Testing Suite\n'.rainbow.bold);
  
  try {
    await testHealthCheck();
    await testAuthentication();
    
    const customerId = await testCustomerFlow();
    const vehicleId = await testVehicleFlow(customerId);
    const jobId = await testJobFlow(customerId, vehicleId);
    
    await testTimeclockFlow();
    await testDashboardFlow();
    await testSettingsFlow();
    
    printResults();
    
  } catch (error) {
    log.error(`Test suite crashed: ${error.message}`);
    process.exit(1);
  }
};

// Execute tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
