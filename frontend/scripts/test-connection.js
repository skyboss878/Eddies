// Quick test to verify API connection
const testAPI = async () => {
  try {
    // Test the health endpoint
    const response = await fetch('http://192.168.1.26:5000/api/health');
    if (response.ok) {
      console.log('✅ API Health check passed');
    } else {
      console.log('❌ API Health check failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }

  try {
    // Test auth login endpoint structure
    const response = await fetch('http://192.168.1.26:5000/api/auth/login', {
      method: 'OPTIONS'
    });
    console.log('🔍 Auth endpoint status:', response.status);
  } catch (error) {
    console.log('❌ Auth endpoint test failed:', error.message);
  }
};

testAPI();
