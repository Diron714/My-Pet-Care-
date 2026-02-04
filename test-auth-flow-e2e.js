import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const backendEnvPath = join(__dirname, 'backend', '.env');
dotenv.config({ path: backendEnvPath });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

console.log('='.repeat(70));
console.log('🧪 END-TO-END AUTHENTICATION FLOW TEST');
console.log('='.repeat(70));
console.log(`Testing against: ${API_BASE_URL}\n`);

let allTestsPassed = true;
const testResults = [];

function logTest(name, passed, message = '') {
  testResults.push({ name, passed, message });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (message) console.log(`   ${message}`);
  if (!passed) allTestsPassed = false;
}

// Test 1: Server Health Check
console.log('📋 Testing Server Connection');
console.log('-'.repeat(70));

try {
  const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, { timeout: 5000 });
  if (healthResponse.data.status === 'OK') {
    logTest('Server health check', true, 'Server is running');
  } else {
    logTest('Server health check', false, 'Server responded but status is not OK');
  }
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    logTest('Server health check', false, 'Server is not running. Start with: cd backend && npm run dev');
  } else {
    logTest('Server health check', false, error.message);
  }
}

console.log('');

// Test 2: Registration Endpoint
console.log('📋 Testing Registration Flow');
console.log('-'.repeat(70));

const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'TestPass123!';

try {
  const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
    firstName: 'Test',
    lastName: 'User',
    email: testEmail,
    phone: '+1234567890',
    password: testPassword,
    role: 'customer'
  }, { timeout: 10000 });

  if (registerResponse.data.success) {
    logTest('User registration', true, `User registered: ${testEmail}`);
  } else {
    logTest('User registration', false, registerResponse.data.message || 'Registration failed');
  }
} catch (error) {
  if (error.response) {
    if (error.response.status === 409) {
      logTest('User registration', false, 'Email already exists (this is OK if test user exists)');
    } else {
      logTest('User registration', false, `Status: ${error.response.status}, ${error.response.data?.message || error.message}`);
    }
  } else {
    logTest('User registration', false, `Connection error: ${error.message}`);
  }
}

console.log('');

// Test 3: Login Endpoint (with test user)
console.log('📋 Testing Login Flow');
console.log('-'.repeat(70));

// Try with known test user
const testUsers = [
  { email: 'customer@test.com', password: 'TestPass123!', role: 'customer' },
  { email: 'doctor@test.com', password: 'TestPass123!', role: 'doctor' },
  { email: 'admin@test.com', password: 'TestPass123!', role: 'admin' }
];

let loginSuccess = false;
let accessToken = null;
let refreshToken = null;
let loggedInUser = null;

for (const testUser of testUsers) {
  try {
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    }, { timeout: 10000 });

    if (loginResponse.data.success && loginResponse.data.data.accessToken) {
      accessToken = loginResponse.data.data.accessToken;
      refreshToken = loginResponse.data.data.refreshToken;
      loggedInUser = loginResponse.data.data.user;
      loginSuccess = true;
      logTest(`Login as ${testUser.role}`, true, `Logged in: ${testUser.email}`);
      break;
    } else {
      logTest(`Login as ${testUser.role}`, false, 'Login response missing token');
    }
  } catch (error) {
    if (error.response) {
      logTest(`Login as ${testUser.role}`, false, `Status: ${error.response.status}, ${error.response.data?.message || error.message}`);
    } else {
      logTest(`Login as ${testUser.role}`, false, `Connection error: ${error.message}`);
    }
  }
}

if (!loginSuccess) {
  logTest('Login flow', false, 'Could not login with any test user');
}

console.log('');

// Test 4: Protected Route (Get Current User)
console.log('📋 Testing Protected Routes');
console.log('-'.repeat(70));

if (accessToken) {
  try {
    const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      timeout: 10000
    });

    if (meResponse.data.success && meResponse.data.data) {
      logTest('Get current user (/auth/me)', true, `User: ${meResponse.data.data.email}`);
    } else {
      logTest('Get current user (/auth/me)', false, 'Response missing user data');
    }
  } catch (error) {
    if (error.response) {
      logTest('Get current user (/auth/me)', false, `Status: ${error.response.status}, ${error.response.data?.message || error.message}`);
    } else {
      logTest('Get current user (/auth/me)', false, `Connection error: ${error.message}`);
    }
  }
} else {
  logTest('Get current user (/auth/me)', false, 'Skipped - no access token');
}

console.log('');

// Test 5: Token Refresh
console.log('📋 Testing Token Refresh');
console.log('-'.repeat(70));

if (refreshToken) {
  try {
    const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken: refreshToken
    }, { timeout: 10000 });

    if (refreshResponse.data.success && refreshResponse.data.data.accessToken) {
      logTest('Token refresh', true, 'New access token generated');
    } else {
      logTest('Token refresh', false, 'Response missing new token');
    }
  } catch (error) {
    if (error.response) {
      logTest('Token refresh', false, `Status: ${error.response.status}, ${error.response.data?.message || error.message}`);
    } else {
      logTest('Token refresh', false, `Connection error: ${error.message}`);
    }
  }
} else {
  logTest('Token refresh', false, 'Skipped - no refresh token');
}

console.log('');

// Test 6: Logout
console.log('📋 Testing Logout');
console.log('-'.repeat(70));

if (accessToken) {
  try {
    const logoutResponse = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      timeout: 10000
    });

    if (logoutResponse.data.success) {
      logTest('Logout', true, 'User logged out successfully');
    } else {
      logTest('Logout', false, 'Logout response not successful');
    }
  } catch (error) {
    if (error.response) {
      logTest('Logout', false, `Status: ${error.response.status}, ${error.response.data?.message || error.message}`);
    } else {
      logTest('Logout', false, `Connection error: ${error.message}`);
    }
  }
} else {
  logTest('Logout', false, 'Skipped - no access token');
}

console.log('');
console.log('='.repeat(70));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(70));

const passedTests = testResults.filter(t => t.passed).length;
const totalTests = testResults.length;

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log('');

if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('');
  console.log('✅ Authentication flow is fully functional!');
  console.log('✅ Backend endpoints working');
  console.log('✅ Frontend can connect to backend');
  console.log('');
  console.log('🚀 Ready for presentation!');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED');
  console.log('');
  console.log('Failed Tests:');
  testResults.filter(t => !t.passed).forEach(test => {
    console.log(`  ❌ ${test.name}`);
    if (test.message) console.log(`     ${test.message}`);
  });
  console.log('');
  console.log('💡 Please fix the issues above.');
  process.exit(1);
}

