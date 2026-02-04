import pool from './config/database.js';
import { loginUser } from './services/authService.js';
import { generateTokenPair } from './services/jwtService.js';

async function finalSystemTest() {
  console.log('🧪 FINAL SYSTEM TEST - Steps 0-3\n');
  console.log('=' .repeat(60));
  
  let allTestsPassed = true;

  // Test 1: Database
  console.log('\n📊 TEST 1: Database Connection');
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    const [tables] = await pool.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'mypetcare_db'"
    );
    if (tables[0].count === 30) {
      console.log('✅ Database: Connected');
      console.log('✅ Tables: 30 tables found');
    } else {
      console.log('❌ Database: Wrong table count');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ Database: Connection failed');
    allTestsPassed = false;
  }

  // Test 2: Test Users
  console.log('\n👤 TEST 2: Test Users');
  const testUsers = [
    { email: 'customer@test.com', role: 'customer' },
    { email: 'doctor@test.com', role: 'doctor' },
    { email: 'admin@test.com', role: 'admin' }
  ];

  for (const testUser of testUsers) {
    try {
      const [users] = await pool.query(
        'SELECT user_id, email, role, is_verified, is_active FROM users WHERE email = ?',
        [testUser.email]
      );
      if (users.length > 0 && users[0].is_verified && users[0].is_active) {
        console.log(`✅ ${testUser.role}: ${testUser.email} (verified, active)`);
      } else {
        console.log(`❌ ${testUser.role}: ${testUser.email} (not ready)`);
        allTestsPassed = false;
      }
    } catch (error) {
      console.log(`❌ ${testUser.role}: Check failed`);
      allTestsPassed = false;
    }
  }

  // Test 3: Authentication
  console.log('\n🔐 TEST 3: Authentication Flow');
  try {
    const result = await loginUser('customer@test.com', 'TestPass123!');
    if (result.accessToken && result.refreshToken && result.user) {
      console.log('✅ Login: Working');
      console.log(`✅ Token Generation: Working`);
      console.log(`✅ User Data: ${result.user.firstName} ${result.user.lastName} (${result.user.role})`);
    } else {
      console.log('❌ Login: Failed');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('❌ Login: ' + error.message);
    allTestsPassed = false;
  }

  // Test 4: Required Tables
  console.log('\n📋 TEST 4: Required Tables');
  const requiredTables = [
    'users', 'customers', 'doctors', 'staff',
    'otp_verifications', 'refresh_tokens', 'password_history',
    'pets', 'products', 'orders', 'appointments'
  ];

  for (const table of requiredTables) {
    try {
      const [rows] = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`✅ ${table}: ${rows[0].count} records`);
    } catch (error) {
      console.log(`❌ ${table}: Not found or error`);
      allTestsPassed = false;
    }
  }

  // Final Result
  console.log('\n' + '='.repeat(60));
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ System is READY for presentation!');
    console.log('\n📋 Test Users:');
    console.log('   Customer: customer@test.com / TestPass123!');
    console.log('   Doctor:   doctor@test.com / TestPass123!');
    console.log('   Admin:    admin@test.com / TestPass123!');
    console.log('\n🚀 Start servers and navigate to: http://localhost:5173');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('⚠️  Please fix issues before presentation');
  }
  console.log('='.repeat(60) + '\n');

  process.exit(allTestsPassed ? 0 : 1);
}

finalSystemTest();

