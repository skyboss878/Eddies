// Test login functionality directly
const testLogin = async () => {
  const API_BASE = 'http://localhost:5000/api';
  
  console.log('🔍 Testing login endpoint...');
  
  try {
    // Test OPTIONS request (CORS preflight)
    const optionsResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'OPTIONS'
    });
    console.log(`✅ OPTIONS /auth/login: ${optionsResponse.status}`);
    
    // Test actual login request
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    console.log(`🔍 POST /auth/login: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('✅ Login successful!', data);
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
};

testLogin();
