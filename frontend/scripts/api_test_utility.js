#!/usr/bin/env node

// API Test Utility for Eddie's Asian Automotive
const axios = require('axios').default;

const API_BASE = 'http://localhost:5000/api';
const BACKEND_BASE = 'http://localhost:5000';

console.log('🌐 API Test Utility');
console.log('===================');

async function testEndpoint(endpoint, description) {
    try {
        const response = await axios.get(`${API_BASE}${endpoint}`, {
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`✅ ${description}: Status ${response.status}`);
        return true;
    } catch (error) {
        console.log(`❌ ${description}: ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log('Testing API endpoints...\n');
    
    const tests = [
        ['/', 'API Root'],
        ['/health', 'Health Check'],
        ['/auth/test', 'Auth Test'],
        ['/customers', 'Customers Endpoint'],
        ['/vehicles', 'Vehicles Endpoint'],
        ['/jobs', 'Jobs Endpoint']
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const [endpoint, description] of tests) {
        const result = await testEndpoint(endpoint, description);
        if (result) passed++;
        else failed++;
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    
    if (failed > 0) {
        console.log('\n💡 Troubleshooting Tips:');
        console.log('  - Ensure Flask backend is running on port 5000');
        console.log('  - Check CORS configuration in backend');
        console.log('  - Verify API routes are properly registered');
    }
}

runTests().catch(console.error);
