const testExistingUsers = async () => {
  const API_BASE = 'http://localhost:5000/api';
  
  const existingUsers = [
    { email: 'admin@eddiesauto.com', passwords: ['admin123', 'password123', 'eddie123', 'admin', 'password'] },
    { email: 'admin@example.com', passwords: ['admin123', 'password123', 'admin', 'password'] },
    { email: 'test@example.com', passwords: ['test123', 'password123', 'test', 'password'] },
    { email: 'apitest@example.com', passwords: ['api123', 'test123', 'password123', 'password'] },
    { email: 'newtest@example.com', passwords: ['test123', 'password123', 'newtest', 'password'] }
  ];
  
  console.log('🔍 Testing with existing users from database...\n');
  
  for (const user of existingUsers) {
    console.log(`Testing user: ${user.email}`);
    
    for (const password of user.passwords) {
      try {
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: user.email, password: password })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ SUCCESS! Login worked with:`);
          console.log(`   Email: ${user.email}`);
          console.log(`   Password: ${password}`);
          console.log(`   Response:`, data);
          return { email: user.email, password: password };
        } else {
          const errorText = await response.text();
          console.log(`   ❌ ${password}: ${response.status}`);
        }
        
      } catch (error) {
        console.log(`   ❌ ${password}: Error - ${error.message}`);
      }
    }
    console.log(''); // Empty line between users
  }
  
  console.log('❌ None of the common passwords worked for existing users');
  return null;
};

testExistingUsers();
