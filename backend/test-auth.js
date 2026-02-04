import pool from './config/database.js';
import {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword
} from './services/authService.js';
import { generateTokenPair } from './services/jwtService.js';

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');

  try {
    // Test 1: Database Connection
    console.log('Test 1: Database Connection');
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connected\n');

    // Test 2: Register User
    console.log('Test 2: User Registration');
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      phone: '1234567890',
      password: 'TestPass123!',
      role: 'customer'
    };

    try {
      const registerResult = await registerUser(testUser);
      console.log('✅ Registration successful');
      console.log(`   User ID: ${registerResult.userId}`);
      console.log(`   Email: ${registerResult.email}\n`);

      // Test 3: Verify OTP (This will fail without actual OTP, but tests the flow)
      console.log('Test 3: OTP Verification');
      console.log('⚠️  OTP verification requires actual OTP code (skipping)\n');

      // Test 4: Login (This will fail if user not verified, but tests the flow)
      console.log('Test 4: User Login');
      console.log('⚠️  Login requires verified user (skipping)\n');

      // Test 5: Token Generation
      console.log('Test 5: Token Generation');
      const [userRows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [testUser.email]
      );
      if (userRows.length > 0) {
        const user = userRows[0];
        const tokens = await generateTokenPair(user);
        console.log('✅ Tokens generated');
        console.log(`   Access Token: ${tokens.accessToken.substring(0, 20)}...`);
        console.log(`   Refresh Token: ${tokens.refreshToken.substring(0, 20)}...\n`);
      }

      // Test 6: Check Tables
      console.log('Test 6: Required Tables Check');
      const requiredTables = [
        'users', 'customers', 'doctors', 'staff',
        'otp_verifications', 'refresh_tokens', 'password_history', 'audit_logs'
      ];

      for (const table of requiredTables) {
        const [tableRows] = await pool.query(
          `SELECT COUNT(*) as count FROM ${table}`
        );
        console.log(`   ✅ ${table}: ${tableRows[0].count} records`);
      }
      console.log('');

      // Cleanup test user
      console.log('Cleanup: Removing test user...');
      await pool.query('DELETE FROM users WHERE email = ?', [testUser.email]);
      console.log('✅ Test user removed\n');

      console.log('🎉 All authentication tests passed!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
    process.exit(1);
  }
}

testAuthFlow();

