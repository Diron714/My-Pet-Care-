import pool from './config/database.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('='.repeat(60));
console.log('🧪 COMPREHENSIVE TEST: STEPS 0-1 VERIFICATION');
console.log('='.repeat(60));
console.log('');

let allTestsPassed = true;
const testResults = [];

function logTest(name, passed, message = '') {
  const status = passed ? '✅' : '❌';
  testResults.push({ name, passed, message });
  console.log(`${status} ${name}`);
  if (message) console.log(`   ${message}`);
  if (!passed) allTestsPassed = false;
}

// STEP 0: Project Setup Tests
console.log('📋 STEP 0: PROJECT SETUP');
console.log('-'.repeat(60));

// Test 0.1: Check .env file exists
const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
  logTest('0.1: .env file exists', true);
} else {
  logTest('0.1: .env file exists', false, 'Create .env file in backend directory');
}

// Test 0.2: Check required environment variables
const requiredEnvVars = [
  'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
  'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'
];

let envVarsOk = true;
for (const varName of requiredEnvVars) {
  if (!process.env[varName] || process.env[varName] === 'your_password' || process.env[varName] === 'your_access_secret_key') {
    envVarsOk = false;
    logTest(`0.2: Environment variable ${varName}`, false, `${varName} is not configured`);
  }
}
if (envVarsOk) {
  logTest('0.2: Required environment variables configured', true);
}

// Test 0.3: Check package.json exists
import { readFileSync } from 'fs';
try {
  const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
  logTest('0.3: package.json exists', true);
  
  // Check critical dependencies
  const criticalDeps = ['express', 'mysql2', 'jsonwebtoken', 'bcrypt', 'dotenv'];
  const missingDeps = criticalDeps.filter(dep => !packageJson.dependencies[dep]);
  if (missingDeps.length === 0) {
    logTest('0.4: Critical dependencies in package.json', true);
  } else {
    logTest('0.4: Critical dependencies in package.json', false, `Missing: ${missingDeps.join(', ')}`);
  }
} catch (error) {
  logTest('0.3: package.json exists', false, error.message);
}

console.log('');

// STEP 1: Database Design Tests
console.log('📋 STEP 1: DATABASE DESIGN');
console.log('-'.repeat(60));

try {
  // Test 1.1: Database connection
  const [testQuery] = await pool.query('SELECT 1 as test');
  if (testQuery && testQuery.length > 0) {
    logTest('1.1: Database connection', true);
  } else {
    logTest('1.1: Database connection', false, 'Connection test query failed');
  }

  // Test 1.2: Database exists
  const [databases] = await pool.query(
    "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?",
    [process.env.DB_NAME || 'mypetcare_db']
  );
  
  if (databases.length > 0) {
    logTest('1.2: Database exists', true, `Database: ${process.env.DB_NAME || 'mypetcare_db'}`);
  } else {
    logTest('1.2: Database exists', false, `Database ${process.env.DB_NAME || 'mypetcare_db'} not found`);
  }

  // Test 1.3: Count tables
  const [tableCount] = await pool.query(
    "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ?",
    [process.env.DB_NAME || 'mypetcare_db']
  );
  
  const count = tableCount[0].count;
  if (count === 30) {
    logTest('1.3: All 30 tables exist', true, `Found ${count} tables`);
  } else {
    logTest('1.3: All 30 tables exist', false, `Expected 30 tables, found ${count}`);
  }

  // Test 1.4: List all tables
  const [tables] = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name",
    [process.env.DB_NAME || 'mypetcare_db']
  );
  
  const expectedTables = [
    'appointments', 'audit_logs', 'carts', 'chat_messages', 'chat_rooms',
    'customer_pets', 'customers', 'doctor_schedules', 'doctors', 'exchange_requests',
    'feedback', 'health_records', 'notifications', 'offer_redemptions', 'offers',
    'order_items', 'orders', 'otp_verifications', 'password_history', 'pet_feeding_schedules',
    'pet_images', 'pet_vaccinations', 'pets', 'pre_bookings', 'product_images',
    'products', 'refresh_tokens', 'reminders', 'staff', 'users'
  ];
  
  const existingTableNames = tables.map(t => t.table_name || t.TABLE_NAME || Object.values(t)[0]);
  const missingTables = expectedTables.filter(t => !existingTableNames.includes(t));
  
  if (missingTables.length === 0) {
    logTest('1.4: All expected tables present', true);
  } else {
    logTest('1.4: All expected tables present', false, `Missing: ${missingTables.join(', ')}`);
  }

  // Test 1.5: Verify key tables structure
  const keyTables = ['users', 'customers', 'doctors', 'pets', 'products', 'orders'];
  let structureOk = true;
  
  for (const tableName of keyTables) {
    try {
      const [columns] = await pool.query(
        `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
        [process.env.DB_NAME || 'mypetcare_db', tableName]
      );
      if (columns.length === 0) {
        structureOk = false;
        logTest(`1.5: Table ${tableName} structure`, false, 'Table has no columns');
      }
    } catch (error) {
      structureOk = false;
      logTest(`1.5: Table ${tableName} structure`, false, error.message);
    }
  }
  
  if (structureOk) {
    logTest('1.5: Key tables structure verified', true);
  }

  // Test 1.6: Test database queries
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    logTest('1.6: Database queries work', true, `Users table accessible (${users[0].count} records)`);
  } catch (error) {
    logTest('1.6: Database queries work', false, error.message);
  }

} catch (error) {
  logTest('Database tests', false, error.message);
  console.error('Error:', error);
}

console.log('');
console.log('='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));

const passedTests = testResults.filter(t => t.passed).length;
const totalTests = testResults.length;

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log('');

if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('✅ STEP 0: Project Setup - COMPLETE');
  console.log('✅ STEP 1: Database Design - COMPLETE');
  console.log('');
  console.log('✅ System is ready to proceed!');
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
  console.log('💡 Please fix the issues above before proceeding.');
  process.exit(1);
}

