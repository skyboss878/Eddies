// Test script to verify API connection
import { apiEndpoints } from './src/utils/api.js';

async function testConnection() {
    console.log('🧪 Testing API connection...');
    
    try {
        const response = await apiEndpoints.healthCheck();
        console.log('✅ Health check passed:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

// Run test if this script is executed directly
if (typeof window === 'undefined') {
    testConnection().then(result => {
        process.exit(result ? 0 : 1);
    });
}

export { testConnection };
