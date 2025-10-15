// Simple API Health Check
const axios = require('axios');

const API_URL = process.env.VITE_API_BASE_URL || 'http://192.168.1.26:5000/api';

async function checkAPI() {
    try {
        console.log('🔍 Checking API at:', API_URL);
        const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
        console.log('✅ API is healthy:', response.data);
        return true;
    } catch (error) {
        console.log('❌ API check failed:', error.message);
        return false;
    }
}

checkAPI().then(healthy => {
    process.exit(healthy ? 0 : 1);
});
