const testAPI = async () => {
  try {
    console.log('🔍 Testing API call...');
    
    const response = await fetch('http://192.168.1.26:5000/initial-data', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response content-type:', response.headers.get('content-type'));
    
    const text = await response.text();
    console.log('📡 Raw response (first 100 chars):', text.substring(0, 100));
    
    try {
      const json = JSON.parse(text);
      console.log('✅ JSON parsed successfully:', json);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('❌ Text that failed:', text.substring(0, 200));
    }
    
  } catch (error) {
    console.error('❌ Fetch error:', error);
  }
};

testAPI();
