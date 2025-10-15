// test-all-pages.mjs - Comprehensive testing script for Eddie's Automotive
// Run with: node test-all-pages.mjs

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_BASE = 'http://localhost:5173';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m', 
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

const log = (message, color = 'white') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const testAPI = async (method, endpoint, data = null, token = null, description) => {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
    
    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const text = await response.text();
    
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = text;
    }

    return {
      success: response.ok,
      status: response.status,
      data: result,
      error: response.ok ? null : result
    };
  } catch (error) {
    return {
      success: false,
      status: 'CONNECTION_ERROR',
      error: error.message
    };
  }
};

const testFrontendPage = async (path, description) => {
  try {
    const response = await fetch(`${FRONTEND_BASE}${path}`);
    return {
      success: response.ok,
      status: response.status,
      accessible: response.ok
    };
  } catch (error) {
    return {
      success: false,
      status: 'CONNECTION_ERROR',
      error: error.message
    };
  }
};

const runComprehensiveTests = async () => {
  log('🚀 EDDIE\'S ASKAN AUTOMOTIVE - COMPREHENSIVE TEST SUITE', 'bold');
  log('=' .repeat(70), 'cyan');
  
  const results = {
    backend: {},
    auth: {},
    pages: {},
    api: {},
    summary: { passed: 0, failed: 0, total: 0 }
  };

  // ===== BACKEND CONNECTIVITY TESTS =====
  log('\n🔧 BACKEND CONNECTIVITY TESTS', 'bold');
  log('-' .repeat(40), 'blue');
  
  const backendTests = [
    { endpoint: '/health', method: 'GET', desc: 'Health Check' },
    { endpoint: '/test-initial-data', method: 'GET', desc: 'Public Test Endpoint' }
  ];
  
  for (const test of backendTests) {
    const result = await testAPI(test.method, test.endpoint, null, null, test.desc);
    results.backend[test.desc] = result;
    results.summary.total++;
    
    if (result.success) {
      log(`   ✅ ${test.desc}: PASS (${result.status})`, 'green');
      results.summary.passed++;
    } else {
      log(`   ❌ ${test.desc}: FAIL (${result.status})`, 'red');
      results.summary.failed++;
    }
  }

  // ===== AUTHENTICATION TESTS =====
  log('\n🔐 AUTHENTICATION TESTS', 'bold');
  log('-' .repeat(40), 'blue');
  
  // Test admin login
  const adminLogin = await testAPI('POST', '/auth/login', 
    { email: 'admin@example.com', password: 'admin123' }, null, 'Admin Login');
  results.auth['Admin Login'] = adminLogin;
  results.summary.total++;
  
  let authToken = null;
  if (adminLogin.success) {
    log(`   ✅ Admin Login: PASS`, 'green');
    authToken = adminLogin.data.accessToken || adminLogin.data.token;
    results.summary.passed++;
  } else {
    log(`   ❌ Admin Login: FAIL (${adminLogin.status})`, 'red');
    results.summary.failed++;
  }
  
  // Test username login
  const usernameLogin = await testAPI('POST', '/auth/login',
    { email: 'admin', password: 'admin123' }, null, 'Username Login');
  results.auth['Username Login'] = usernameLogin;
  results.summary.total++;
  
  if (usernameLogin.success) {
    log(`   ✅ Username Login: PASS`, 'green');
    if (!authToken) authToken = usernameLogin.data.accessToken || usernameLogin.data.token;
    results.summary.passed++;
  } else {
    log(`   ❌ Username Login: FAIL (${usernameLogin.status})`, 'red');
    results.summary.failed++;
  }
  
  // Test registration
  const testUser = {
    username: 'systemtest',
    email: 'systemtest@example.com',
    password: 'test123'
  };
  
  const registration = await testAPI('POST', '/auth/register', testUser, null, 'User Registration');
  results.auth['Registration'] = registration;
  results.summary.total++;
  
  if (registration.success) {
    log(`   ✅ User Registration: PASS`, 'green');
    results.summary.passed++;
    
    // Test login with new user
    const newUserLogin = await testAPI('POST', '/auth/login',
      { email: testUser.email, password: testUser.password }, null, 'New User Login');
    results.auth['New User Login'] = newUserLogin;
    results.summary.total++;
    
    if (newUserLogin.success) {
      log(`   ✅ New User Login: PASS`, 'green');
      if (!authToken) authToken = newUserLogin.data.accessToken || newUserLogin.data.token;
      results.summary.passed++;
    } else {
      log(`   ❌ New User Login: FAIL (${newUserLogin.status})`, 'red');
      results.summary.failed++;
    }
  } else {
    log(`   ❌ User Registration: FAIL (${registration.status})`, 'red');
    results.summary.failed++;
  }

  // ===== API ENDPOINT TESTS =====
  log('\n📡 API ENDPOINT TESTS', 'bold');
  log('-' .repeat(40), 'blue');
  
  const apiTests = [
    { endpoint: '/initial-data', method: 'GET', desc: 'Initial Data', protected: true },
    { endpoint: '/customers', method: 'GET', desc: 'Get Customers', protected: true },
    { endpoint: '/vehicles', method: 'GET', desc: 'Get Vehicles', protected: true },
    { endpoint: '/jobs', method: 'GET', desc: 'Get Jobs', protected: true },
    { endpoint: '/parts', method: 'GET', desc: 'Get Parts', protected: true },
    { endpoint: '/labor-rates', method: 'GET', desc: 'Get Labor Rates', protected: true }
  ];
  
  for (const test of apiTests) {
    const token = test.protected ? authToken : null;
    const result = await testAPI(test.method, test.endpoint, null, token, test.desc);
    results.api[test.desc] = result;
    results.summary.total++;
    
    if (result.success) {
      log(`   ✅ ${test.desc}: PASS (${result.status})`, 'green');
      results.summary.passed++;
    } else {
      log(`   ❌ ${test.desc}: FAIL (${result.status})`, 'red');
      if (test.protected && result.status === 401) {
        log(`      (Authentication required - this is expected if login failed)`, 'yellow');
      }
      results.summary.failed++;
    }
  }

  // ===== FRONTEND PAGE TESTS =====
  log('\n🌐 FRONTEND PAGE ACCESSIBILITY TESTS', 'bold');
  log('-' .repeat(40), 'blue');
  
  const pages = [
    { path: '/', desc: 'Landing Page' },
    { path: '/login', desc: 'Login Page' },
    { path: '/register', desc: 'Register Page' },
    { path: '/dashboard', desc: 'Dashboard' },
    { path: '/customers', desc: 'Customer List' },
    { path: '/add-customer', desc: 'Add Customer' },
    { path: '/vehicles', desc: 'Vehicle List' },
    { path: '/add-vehicle', desc: 'Add Vehicle' },
    { path: '/jobs', desc: 'Jobs/Work Orders' },
    { path: '/create-job', desc: 'Create Job' },
    { path: '/estimates', desc: 'Estimates List' },
    { path: '/estimates/create', desc: 'Create Estimate' },
    { path: '/parts-labor', desc: 'Parts & Labor Management' },
    { path: '/diagnosis', desc: 'AI Diagnosis Tool' },
    { path: '/reports', desc: 'Reports & Analytics' },
    { path: '/settings', desc: 'Settings' },
    { path: '/migration', desc: 'Data Migration' }
  ];
  
  for (const page of pages) {
    const result = await testFrontendPage(page.path, page.desc);
    results.pages[page.desc] = result;
    results.summary.total++;
    
    if (result.success) {
      log(`   ✅ ${page.desc}: ACCESSIBLE`, 'green');
      results.summary.passed++;
    } else {
      log(`   ❌ ${page.desc}: NOT ACCESSIBLE (${result.status})`, 'red');
      results.summary.failed++;
    }
  }

  // ===== CRUD OPERATION TESTS =====
  if (authToken) {
    log('\n📝 CRUD OPERATION TESTS', 'bold');
    log('-' .repeat(40), 'blue');
    
    // Test Customer CRUD
    const customerData = {
      name: 'Test Customer',
      email: 'testcustomer@example.com',
      phone: '555-0123',
      address: '123 Test St'
    };
    
    const createCustomer = await testAPI('POST', '/customers', customerData, authToken, 'Create Customer');
    results.api['Create Customer'] = createCustomer;
    results.summary.total++;
    
    if (createCustomer.success) {
      log(`   ✅ Create Customer: PASS`, 'green');
      results.summary.passed++;
      
      const customerId = createCustomer.data.id;
      if (customerId) {
        // Test update customer
        const updateData = { ...customerData, name: 'Updated Test Customer' };
        const updateCustomer = await testAPI('PUT', `/customers/${customerId}`, updateData, authToken, 'Update Customer');
        results.api['Update Customer'] = updateCustomer;
        results.summary.total++;
        
        if (updateCustomer.success) {
          log(`   ✅ Update Customer: PASS`, 'green');
          results.summary.passed++;
        } else {
          log(`   ❌ Update Customer: FAIL (${updateCustomer.status})`, 'red');
          results.summary.failed++;
        }
        
        // Test delete customer
        const deleteCustomer = await testAPI('DELETE', `/customers/${customerId}`, null, authToken, 'Delete Customer');
        results.api['Delete Customer'] = deleteCustomer;
        results.summary.total++;
        
        if (deleteCustomer.success) {
          log(`   ✅ Delete Customer: PASS`, 'green');
          results.summary.passed++;
        } else {
          log(`   ❌ Delete Customer: FAIL (${deleteCustomer.status})`, 'red');
          results.summary.failed++;
        }
      }
    } else {
      log(`   ❌ Create Customer: FAIL (${createCustomer.status})`, 'red');
      results.summary.failed++;
    }
  }

  // ===== FINAL REPORT =====
  log('\n📊 COMPREHENSIVE TEST REPORT', 'bold');
  log('=' .repeat(70), 'cyan');
  
  const passRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);
  log(`🎯 Overall Score: ${results.summary.passed}/${results.summary.total} (${passRate}%)`, 
    passRate >= 80 ? 'green' : passRate >= 60 ? 'yellow' : 'red');
  
  // Category breakdown
  const categories = [
    { name: 'Backend Connectivity', tests: results.backend },
    { name: 'Authentication', tests: results.auth },
    { name: 'API Endpoints', tests: results.api },
    { name: 'Frontend Pages', tests: results.pages }
  ];
  
  categories.forEach(category => {
    const tests = Object.values(category.tests);
    const passed = tests.filter(t => t.success).length;
    const total = tests.length;
    const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
    
    log(`\n📂 ${category.name}: ${passed}/${total} (${rate}%)`, 
      rate >= 80 ? 'green' : rate >= 60 ? 'yellow' : 'red');
    
    Object.entries(category.tests).forEach(([name, result]) => {
      const status = result.success ? '✅' : '❌';
      const color = result.success ? 'green' : 'red';
      log(`   ${status} ${name}`, color);
    });
  });
  
  // ===== RECOMMENDATIONS =====
  log('\n💡 RECOMMENDATIONS', 'bold');
  log('-' .repeat(40), 'blue');
  
  if (results.summary.passed === 0 || !results.backend['Health Check']?.success) {
    log('🚨 CRITICAL: Backend server is not responding', 'red');
    log('   → Ensure backend is running: python app.py', 'yellow');
    log('   → Check backend is on port 5000', 'yellow');
  } else if (!authToken) {
    log('🚨 CRITICAL: Authentication is completely broken', 'red');
    log('   → Check backend user database', 'yellow');
    log('   → Verify password hashing logic', 'yellow');
    log('   → Review authentication middleware', 'yellow');
  } else if (passRate >= 80) {
    log('🎉 EXCELLENT: Your system is working well!', 'green');
    log('   → Focus on fixing the remaining failed tests', 'yellow');
    log('   → Your app should be functional for users', 'green');
  } else if (passRate >= 60) {
    log('⚠️  MODERATE: Core functionality works but needs attention', 'yellow');
    log('   → Authentication is working - good foundation', 'green');
    log('   → Fix API endpoints and page routing', 'yellow');
  } else {
    log('🚨 POOR: Multiple critical issues need fixing', 'red');
    log('   → Start with backend connectivity and auth', 'yellow');
    log('   → Then work on API endpoints', 'yellow');
  }
  
  log('\n🔧 NEXT STEPS:', 'bold');
  log('1. Fix any CRITICAL issues first', 'yellow');
  log('2. Test login on your frontend manually', 'yellow');
  log('3. Focus on the lowest-scoring categories', 'yellow');
  log('4. Re-run this test after each fix', 'yellow');
  
  log('\n🎯 Test completed! Review the results above.', 'cyan');
};

runComprehensiveTests().catch(console.error);
