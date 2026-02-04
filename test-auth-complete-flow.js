import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const backendEnvPath = join(__dirname, 'backend', '.env');
dotenv.config({ path: backendEnvPath });

const API_BASE_URL = 'http://localhost:5000/api';

console.log('='.repeat(70));
console.log('🧪 COMPLETE AUTHENTICATION FLOW TEST');
console.log('='.repeat(70));
console.log('');

let allTestsPassed = true;

function logTest(name, passed, message = '') {
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (message) console.log(`   ${message}`);
  if (!passed) allTestsPassed = false;
}

// Test Users
const testUsers = [
  { email: 'customer@test.com', password: 'TestPass123!', role: 'customer' },
  { email: 'doctor@test.com', password: 'TestPass123!', role: 'doctor' },
  { email: 'admin@test.com', password: 'TestPass123!', role: 'admin' }
];

async function testCompleteFlow() {
  // Test 1: Server Health
  console.log('📋 Step 1: Server Health');
  console.log('-'.repeat(70));
  try {
    const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, { timeout: 5000 });
    logTest('Server is running', healthResponse.data.status === 'OK');
  } catch (error) {
    logTest('Server is running', false, 'Server not running!');
    console.log('\n❌ Cannot continue - start backend server first!\n');
    process.exit(1);
  }

  console.log('');

  // Test 2: Registration
  console.log('📋 Step 2: Registration');
  console.log('-'.repeat(70));
  const testEmail = `test${Date.now()}@example.com`;
  try {
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      phone: '1234567890',
      password: 'TestPass123!',
      role: 'customer'
    }, { timeout: 10000 });
    
    if (registerResponse.data.success) {
      logTest('User registration', true, `User registered: ${testEmail}`);
    } else {
      logTest('User registration', false, registerResponse.data.message);
    }
  } catch (error) {
    if (error.response?.status === 409) {
      logTest('User registration', false, 'Email already exists (expected for test)');
    } else {
      logTest('User registration', false, error.response?.data?.message || error.message);
    }
  }

  console.log('');

  // Test 3: Login All Users
  console.log('📋 Step 3: Login All Users');
  console.log('-'.repeat(70));
  const loginResults = [];

  for (const user of testUsers) {
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: user.email,
        password: user.password
      }, { timeout: 10000 });

      if (loginResponse.data.success && loginResponse.data.data) {
        const { accessToken, refreshToken, user: userData } = loginResponse.data.data;
        if (accessToken && refreshToken && userData) {
          loginResults.push({
            ...user,
            accessToken,
            refreshToken,
            userData
          });
          logTest(`Login as ${user.role}`, true, `${user.email} - Role: ${userData.role}`);
        } else {
          logTest(`Login as ${user.role}`, false, 'Missing tokens or user data');
        }
      } else {
        logTest(`Login as ${user.role}`, false, 'Response not successful');
      }
    } catch (error) {
      logTest(`Login as ${user.role}`, false, error.response?.data?.message || error.message);
    }
  }

  if (loginResults.length !== 3) {
    logTest('All users can login', false, `Only ${loginResults.length}/3 users logged in`);
  } else {
    logTest('All users can login', true);
  }

  console.log('');

  // Test 4: Protected Routes
  console.log('📋 Step 4: Protected Routes');
  console.log('-'.repeat(70));
  for (const loginResult of loginResults) {
    try {
      const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${loginResult.accessToken}` },
        timeout: 10000
      });

      if (meResponse.data.success && meResponse.data.data) {
        logTest(`Protected route for ${loginResult.role}`, true, `User: ${meResponse.data.data.email}`);
      } else {
        logTest(`Protected route for ${loginResult.role}`, false, 'Missing user data');
      }
    } catch (error) {
      logTest(`Protected route for ${loginResult.role}`, false, error.response?.data?.message || error.message);
    }
  }

  console.log('');

  // Test 5: Token Refresh
  console.log('📋 Step 5: Token Refresh');
  console.log('-'.repeat(70));
  if (loginResults.length > 0) {
    const testUser = loginResults[0];
    try {
      const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken: testUser.refreshToken
      }, { timeout: 10000 });

      if (refreshResponse.data.success && refreshResponse.data.data.accessToken) {
        logTest('Token refresh', true, 'New access token generated');
      } else {
        logTest('Token refresh', false, 'Missing new token');
      }
    } catch (error) {
      logTest('Token refresh', false, error.response?.data?.message || error.message);
    }
  }

  console.log('');

  // Test 6: Logout
  console.log('📋 Step 6: Logout');
  console.log('-'.repeat(70));
  if (loginResults.length > 0) {
    const testUser = loginResults[0];
    try {
      const logoutResponse = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${testUser.accessToken}` },
        timeout: 10000
      });

      if (logoutResponse.data.success) {
        logTest('Logout', true, 'User logged out successfully');
      } else {
        logTest('Logout', false, 'Logout not successful');
      }
    } catch (error) {
      logTest('Logout', false, error.response?.data?.message || error.message);
    }
  }

  console.log('');
  console.log('='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));

  if (allTestsPassed && loginResults.length === 3) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('\n✅ Authentication system is 100% ready!');
    console.log('\nTest Users:');
    testUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    console.log('\n🚀 System is ready for demo!');
    process.exit(0);
  } else {
    console.log('\n❌ SOME TESTS FAILED');
    console.log('\n💡 Please check the errors above.');
    process.exit(1);
  }
}

testCompleteFlow().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});

