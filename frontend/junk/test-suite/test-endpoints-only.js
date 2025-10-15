#!/usr/bin/env node

/**
 * Quick API Endpoints Test
 * Tests all API endpoints without creating test data
 */

const axios = require('axios');
const colors = require('colors');

const config = {
  backend: 'http://192.168.1.26:5000',
  frontend: 'http://localhost:5173'
};

let results = { passed: 0, failed: 0, errors: [] };

const log = {
  info: (msg) => console.log('ℹ️ '.blue + msg),
  success: (msg) => console.log('✅'.green + ' ' + msg.green),
  error: (msg) => console.log('❌'.red + ' ' + msg.red),
  section: (msg) => console.log('\n' + msg.cyan.bold)
};

const testEndpoint = async (name, method, endpoint) => {
  try {
    const url = `${config.backend}${endpoint}`;
    const response = await axios({
      method,
      url,
      timeout: 5000,
      validateStatus: () => true // Accept all status codes
    });
    
    if (response.status < 500) {
      results.passed++;
      log.success(`${name} (${response.status})`);
    } else {
      results.failed++;
      log.error(`${name} - Server Error (${response.status})`);
    }
  } catch (error) {
    results.failed++;
    log.error(`${name} - ${error.message}`);
  }
};

const runEndpointTests = async () => {
  console.log('🔍 Testing API Endpoints\n'.rainbow.bold);
  
  log.section('🏥 Health & Frontend');
  await testEndpoint('Health Check', 'GET', '/api/health');
  
  try {
    const frontendResponse = await axios.get(config.frontend, { timeout: 5000 });
    results.passed++;
    log.success(`Frontend Accessible (${frontendResponse.status})`);
  } catch (error) {
    results.failed++;
    log.error(`Frontend - ${error.message}`);
  }
  
  log.section('🔐 Authentication Endpoints');
  await testEndpoint('Login', 'POST', '/api/auth/login');
  await testEndpoint('Register', 'POST', '/api/auth/register');
  await testEndpoint('Profile', 'GET', '/api/auth/me');
  
  log.section('👥 Customer Endpoints');
  await testEndpoint('Get Customers', 'GET', '/api/auth/customers');
  await testEndpoint('Create Customer', 'POST', '/api/auth/customers');
  await testEndpoint('Search Customers', 'GET', '/api/auth/customers/search');
  
  log.section('🚗 Vehicle Endpoints');
  await testEndpoint('Get Vehicles', 'GET', '/api/auth/vehicles');
  await testEndpoint('Create Vehicle', 'POST', '/api/auth/vehicles');
  
  log.section('🔧 Job Endpoints');
  await testEndpoint('Get Jobs', 'GET', '/api/auth/jobs');
  await testEndpoint('Create Job', 'POST', '/api/auth/jobs');
  
  log.section('⏰ Timeclock Endpoints');
  await testEndpoint('Timeclock Status', 'GET', '/api/auth/timeclock/status');
  await testEndpoint('Clock In', 'POST', '/api/auth/timeclock/clock-in');
  await testEndpoint('Timeclock History', 'GET', '/api/auth/timeclock/history');
  
  log.section('📊 Dashboard Endpoints');
  await testEndpoint('Dashboard Stats', 'GET', '/api/auth/dashboard/stats');
  await testEndpoint('Recent Activity', 'GET', '/api/auth/dashboard/recent-activity');
  
  log.section('💰 Financial Endpoints');
  await testEndpoint('Get Estimates', 'GET', '/api/auth/estimates');
  await testEndpoint('Get Invoices', 'GET', '/api/auth/invoices');
  
  log.section('⚙️ Settings Endpoints');
  await testEndpoint('Get Settings', 'GET', '/api/auth/settings');
  await testEndpoint('Shop Settings', 'GET', '/api/auth/settings/shop');
  
  log.section('📋 Results');
  console.log(`Total: ${results.passed + results.failed}`.white);
  console.log(`Reachable: ${results.passed}`.green);
  console.log(`Failed: ${results.failed}`.red);
  
  if (results.failed === 0) {
    log.success('\n🎉 All endpoints are reachable!');
  } else {
    console.log('\n⚠️  Some endpoints failed - this is normal for protected routes without auth'.yellow);
  }
};

runEndpointTests();
