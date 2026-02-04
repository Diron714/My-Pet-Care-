import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const backendEnvPath = join(__dirname, 'backend', '.env');
dotenv.config({ path: backendEnvPath });

const API_BASE_URL = 'http://localhost:5000/api';

console.log('🔍 DEBUGGING LOGIN ISSUE\n');
console.log('='.repeat(70));

// Test 1: Check server
console.log('\n1. Testing Server Connection...');
try {
  const healthResponse = await axios.get('http://localhost:5000/health', { timeout: 5000 });
  console.log('✅ Server is running');
  console.log('   Response:', healthResponse.data);
} catch (error) {
  console.log('❌ Server is NOT running!');
  console.log('   Error:', error.message);
  console.log('\n💡 Start backend: cd backend && npm run dev');
  process.exit(1);
}

// Test 2: Test login endpoint directly
console.log('\n2. Testing Login Endpoint...');
try {
  const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
    email: 'customer@test.com',
    password: 'TestPass123!'
  }, { timeout: 10000 });

  console.log('✅ Login endpoint works!');
  console.log('   Status:', loginResponse.status);
  console.log('   Success:', loginResponse.data.success);
  console.log('   Has accessToken:', !!loginResponse.data.data?.accessToken);
  console.log('   Has refreshToken:', !!loginResponse.data.data?.refreshToken);
  console.log('   Has user:', !!loginResponse.data.data?.user);
  
  if (loginResponse.data.data?.user) {
    console.log('   User role:', loginResponse.data.data.user.role);
    console.log('   User email:', loginResponse.data.data.user.email);
  }
  
  console.log('\n   Full Response Structure:');
  console.log(JSON.stringify(loginResponse.data, null, 2));
} catch (error) {
  console.log('❌ Login endpoint failed!');
  if (error.response) {
    console.log('   Status:', error.response.status);
    console.log('   Message:', error.response.data?.message);
    console.log('   Data:', JSON.stringify(error.response.data, null, 2));
  } else if (error.request) {
    console.log('   No response received');
    console.log('   Error:', error.message);
    console.log('\n💡 Check if backend is running on port 5000');
  } else {
    console.log('   Error:', error.message);
  }
}

// Test 3: Check CORS
console.log('\n3. Testing CORS...');
try {
  const corsTest = await axios.post(`${API_BASE_URL}/auth/login`, {
    email: 'customer@test.com',
    password: 'TestPass123!'
  }, {
    headers: {
      'Origin': 'http://localhost:5173',
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });
  console.log('✅ CORS is working');
} catch (error) {
  if (error.response?.status === 401) {
    console.log('✅ CORS is working (got 401 which is expected for wrong credentials)');
  } else {
    console.log('⚠️  CORS might be an issue');
    console.log('   Error:', error.message);
  }
}

console.log('\n' + '='.repeat(70));
console.log('\n💡 If login endpoint works but frontend doesn\'t:');
console.log('   1. Check browser console for errors');
console.log('   2. Check Network tab in browser DevTools');
console.log('   3. Verify API_BASE_URL in frontend');
console.log('   4. Check CORS settings\n');

