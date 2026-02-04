import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const backendEnvPath = join(__dirname, 'backend', '.env');
dotenv.config({ path: backendEnvPath });

const API_BASE_URL = 'http://localhost:5000/api';

console.log('🧪 Testing Login Flow\n');

// Test login
async function testLogin() {
  try {
    console.log('Testing login with customer@test.com...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'customer@test.com',
      password: 'TestPass123!'
    });

    console.log('✅ Login Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.data) {
      console.log('\n✅ Login successful!');
      console.log('Access Token:', response.data.data.accessToken ? 'Present' : 'Missing');
      console.log('Refresh Token:', response.data.data.refreshToken ? 'Present' : 'Missing');
      console.log('User Data:', response.data.data.user ? 'Present' : 'Missing');
      
      if (response.data.data.user) {
        console.log('User Role:', response.data.data.user.role);
        console.log('User Email:', response.data.data.user.email);
      }
    } else {
      console.log('❌ Login response missing data');
    }
  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data?.message);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();

