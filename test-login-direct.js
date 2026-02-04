import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

console.log('🧪 Testing Login Directly\n');
console.log('API URL:', API_URL);
console.log('='.repeat(70));

async function testLogin() {
  try {
    console.log('\n1. Testing server connection...');
    const healthCheck = await axios.get('http://localhost:5000/health', { timeout: 3000 });
    console.log('✅ Server is running');
    console.log('   Response:', healthCheck.data);

    console.log('\n2. Testing login endpoint...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'customer@test.com',
      password: 'TestPass123!'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful!');
    console.log('\nResponse Structure:');
    console.log('  success:', loginResponse.data.success);
    console.log('  message:', loginResponse.data.message);
    console.log('  has data:', !!loginResponse.data.data);
    
    if (loginResponse.data.data) {
      console.log('  has accessToken:', !!loginResponse.data.data.accessToken);
      console.log('  has refreshToken:', !!loginResponse.data.data.refreshToken);
      console.log('  has user:', !!loginResponse.data.data.user);
      
      if (loginResponse.data.data.user) {
        console.log('  user role:', loginResponse.data.data.user.role);
        console.log('  user email:', loginResponse.data.data.user.email);
      }
    }

    console.log('\n✅ Login endpoint is working correctly!');
    console.log('\n💡 If frontend login still fails:');
    console.log('   1. Check browser console (F12) for errors');
    console.log('   2. Check Network tab (F12) for failed requests');
    console.log('   3. Verify API_BASE_URL in frontend/src/services/api.js');
    console.log('   4. Make sure frontend is using the api service correctly\n');

  } catch (error) {
    console.error('\n❌ Login test failed!');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Backend server is NOT running!');
      console.error('   Start it: cd backend && npm run dev');
    } else if (error.response) {
      console.error('\nResponse Error:');
      console.error('  Status:', error.response.status);
      console.error('  Message:', error.response.data?.message);
      console.error('  Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('\nNo response received');
      console.error('  Error:', error.message);
      console.error('\n💡 Check if backend is running on port 5000');
    } else {
      console.error('\nError:', error.message);
    }
  }
}

testLogin();

