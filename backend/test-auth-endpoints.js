import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/auth';

async function testAuthEndpoints() {
  console.log('🧪 Testing Authentication Endpoints...\n');

  const testUsers = {
    customer: { email: 'customer@test.com', password: 'TestPass123!' },
    doctor: { email: 'doctor@test.com', password: 'TestPass123!' },
    admin: { email: 'admin@test.com', password: 'TestPass123!' }
  };

  for (const [role, credentials] of Object.entries(testUsers)) {
    console.log(`Testing ${role.toUpperCase()} login...`);
    try {
      const response = await axios.post(`${API_BASE}/login`, credentials);
      if (response.data.success) {
        console.log(`✅ ${role} login: SUCCESS`);
        console.log(`   User: ${response.data.data.user.firstName} ${response.data.data.user.lastName}`);
        console.log(`   Role: ${response.data.data.user.role}`);
        console.log(`   Token: ${response.data.data.accessToken.substring(0, 20)}...\n`);
      } else {
        console.log(`❌ ${role} login: FAILED - ${response.data.message}\n`);
      }
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${role} login: FAILED - ${error.response.data.message}\n`);
      } else if (error.request) {
        console.log(`❌ ${role} login: FAILED - Server not running\n`);
        console.log('💡 Start the server with: cd backend && npm run dev\n');
        process.exit(1);
      } else {
        console.log(`❌ ${role} login: FAILED - ${error.message}\n`);
      }
    }
  }

  console.log('✅ Authentication endpoint testing complete!');
  process.exit(0);
}

testAuthEndpoints();

