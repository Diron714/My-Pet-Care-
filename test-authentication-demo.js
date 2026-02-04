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
console.log('🧪 AUTHENTICATION SYSTEM DEMO TEST');
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

// Test Users
const testUsers = [
  { email: 'customer@test.com', password: 'TestPass123!', role: 'customer' },
  { email: 'doctor@test.com', password: 'TestPass123!', role: 'doctor' },
  { email: 'admin@test.com', password: 'TestPass123!', role: 'admin' }
];

// Test 1: Server Health
console.log('📋 Step 1: Server Health Check');
console.log('-'.repeat(70));

try {
  const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, { timeout: 5000 });
  if (healthResponse.data.status === 'OK') {
    logTest('Server is running', true, 'Backend server is accessible');
  } else {
    logTest('Server is running', false, 'Server responded but status is not OK');
  }
} catch (error) {
  logTest('Server is running', false, 'Server is not running. Start with: cd backend && npm run dev');
  console.log('\n❌ Cannot continue - server is not running!\n');
  process.exit(1);
}

console.log('');

// Test 2: Test All 3 Users Can Login
console.log('📋 Step 2: Test All 3 Users Can Login');
console.log('-'.repeat(70));

const loginResults = [];

for (const user of testUsers) {
  try {
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: user.email,
      password: user.password
    }, { timeout: 10000 });

    if (loginResponse.data.success && loginResponse.data.data.accessToken) {
      const userData = loginResponse.data.data.user;
      loginResults.push({
        ...user,
        accessToken: loginResponse.data.data.accessToken,
        refreshToken: loginResponse.data.data.refreshToken,
        userData
      });
      logTest(`Login as ${user.role}`, true, `✅ ${user.email} - Role: ${userData.role}`);
    } else {
      logTest(`Login as ${user.role}`, false, 'Login response missing token');
    }
  } catch (error) {
    if (error.response) {
      logTest(`Login as ${user.role}`, false, `Status: ${error.response.status}, ${error.response.data?.message || error.message}`);
    } else {
      logTest(`Login as ${user.role}`, false, `Connection error: ${error.message}`);
    }
  }
}

if (loginResults.length !== 3) {
  logTest('All 3 users can login', false, `Only ${loginResults.length}/3 users can login`);
} else {
  logTest('All 3 users can login', true, 'Customer, Doctor, and Admin can all login');
}

console.log('');

// Test 3: Test Protected Routes for Each Role
console.log('📋 Step 3: Test Protected Routes (/auth/me)');
console.log('-'.repeat(70));

for (const loginResult of loginResults) {
  try {
    const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${loginResult.accessToken}`
      },
      timeout: 10000
    });

    if (meResponse.data.success && meResponse.data.data) {
      const userData = meResponse.data.data;
      logTest(`Protected route for ${loginResult.role}`, true, `User: ${userData.email}, Role: ${userData.role}`);
    } else {
      logTest(`Protected route for ${loginResult.role}`, false, 'Response missing user data');
    }
  } catch (error) {
    if (error.response) {
      logTest(`Protected route for ${loginResult.role}`, false, `Status: ${error.response.status}`);
    } else {
      logTest(`Protected route for ${loginResult.role}`, false, `Connection error: ${error.message}`);
    }
  }
}

console.log('');

// Test 4: Test Token Refresh
console.log('📋 Step 4: Test Token Refresh');
console.log('-'.repeat(70));

if (loginResults.length > 0) {
  const testUser = loginResults[0];
  try {
    const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken: testUser.refreshToken
    }, { timeout: 10000 });

    if (refreshResponse.data.success && refreshResponse.data.data.accessToken) {
      logTest('Token refresh works', true, 'New access token generated successfully');
    } else {
      logTest('Token refresh works', false, 'Response missing new token');
    }
  } catch (error) {
    if (error.response) {
      logTest('Token refresh works', false, `Status: ${error.response.status}, ${error.response.data?.message || error.message}`);
    } else {
      logTest('Token refresh works', false, `Connection error: ${error.message}`);
    }
  }
} else {
  logTest('Token refresh works', false, 'Skipped - no logged in users');
}

console.log('');

// Test 5: Test Logout
console.log('📋 Step 5: Test Logout');
console.log('-'.repeat(70));

if (loginResults.length > 0) {
  const testUser = loginResults[0];
  try {
    const logoutResponse = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${testUser.accessToken}`
      },
      timeout: 10000
    });

    if (logoutResponse.data.success) {
      logTest('Logout works', true, 'User logged out successfully');
    } else {
      logTest('Logout works', false, 'Logout response not successful');
    }
  } catch (error) {
    if (error.response) {
      logTest('Logout works', false, `Status: ${error.response.status}, ${error.response.data?.message || error.message}`);
    } else {
      logTest('Logout works', false, `Connection error: ${error.message}`);
    }
  }
} else {
  logTest('Logout works', false, 'Skipped - no logged in users');
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

if (allTestsPassed && loginResults.length === 3) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('');
  console.log('✅ Authentication system is fully functional!');
  console.log('✅ All 3 users can login:');
  console.log('   - Customer: customer@test.com');
  console.log('   - Doctor: doctor@test.com');
  console.log('   - Admin: admin@test.com');
  console.log('');
  console.log('✅ Protected routes work for all roles');
  console.log('✅ Token refresh works');
  console.log('✅ Logout works');
  console.log('');
  console.log('🚀 System is ready for demo!');
  console.log('');
  console.log('📋 Demo Flow:');
  console.log('   1. Show registration & OTP verification');
  console.log('   2. Login as Customer → Show customer features');
  console.log('   3. Logout → Login as Doctor → Show doctor features');
  console.log('   4. Logout → Login as Admin → Show admin features');
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
  if (loginResults.length !== 3) {
    console.log('⚠️  Not all test users can login!');
    console.log('   Run: cd backend && node create-test-users.js');
  }
  console.log('💡 Please fix the issues above.');
  process.exit(1);
}

