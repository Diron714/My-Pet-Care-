import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from backend/.env
const backendEnvPath = join(dirname(fileURLToPath(import.meta.url)), 'backend', '.env');
dotenv.config({ path: backendEnvPath });

// Create database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mypetcare_db',
  waitForConnections: true,
  connectionLimit: 10
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('='.repeat(70));
console.log('🧪 COMPREHENSIVE VERIFICATION: STEPS 0-1');
console.log('='.repeat(70));
console.log('');

let allTestsPassed = true;
const results = {
  step0: { name: 'STEP 0: Project Setup', tests: [] },
  step1: { name: 'STEP 1: Database Design', tests: [] }
};

function addTest(step, name, passed, details = '') {
  results[step].tests.push({ name, passed, details });
  if (!passed) allTestsPassed = false;
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (details) console.log(`   ${details}`);
}

// ============================================
// STEP 0: PROJECT SETUP TESTS
// ============================================
console.log('📋 STEP 0: PROJECT SETUP');
console.log('-'.repeat(70));

const backendPath = join(__dirname, 'backend');
const frontendPath = join(__dirname, 'frontend');

// Test 0.1: Backend directory exists
if (existsSync(backendPath)) {
  addTest('step0', 'Backend directory exists', true);
} else {
  addTest('step0', 'Backend directory exists', false, 'Backend folder not found');
}

// Test 0.2: Frontend directory exists
if (existsSync(frontendPath)) {
  addTest('step0', 'Frontend directory exists', true);
} else {
  addTest('step0', 'Frontend directory exists', false, 'Frontend folder not found');
}

// Test 0.3: Backend package.json exists
const backendPackageJson = join(backendPath, 'package.json');
if (existsSync(backendPackageJson)) {
  addTest('step0', 'Backend package.json exists', true);
  try {
    const pkg = JSON.parse(readFileSync(backendPackageJson, 'utf8'));
    const criticalDeps = ['express', 'mysql2', 'jsonwebtoken', 'bcrypt', 'dotenv'];
    const missing = criticalDeps.filter(d => !pkg.dependencies[d]);
    if (missing.length === 0) {
      addTest('step0', 'Backend critical dependencies in package.json', true);
    } else {
      addTest('step0', 'Backend critical dependencies in package.json', false, `Missing: ${missing.join(', ')}`);
    }
  } catch (e) {
    addTest('step0', 'Backend package.json valid', false, e.message);
  }
} else {
  addTest('step0', 'Backend package.json exists', false);
}

// Test 0.4: Frontend package.json exists
const frontendPackageJson = join(frontendPath, 'package.json');
if (existsSync(frontendPackageJson)) {
  addTest('step0', 'Frontend package.json exists', true);
  try {
    const pkg = JSON.parse(readFileSync(frontendPackageJson, 'utf8'));
    const criticalDeps = ['react', 'react-dom', 'react-router-dom', 'axios'];
    const missing = criticalDeps.filter(d => !pkg.dependencies[d]);
    if (missing.length === 0) {
      addTest('step0', 'Frontend critical dependencies in package.json', true);
    } else {
      addTest('step0', 'Frontend critical dependencies in package.json', false, `Missing: ${missing.join(', ')}`);
    }
  } catch (e) {
    addTest('step0', 'Frontend package.json valid', false, e.message);
  }
} else {
  addTest('step0', 'Frontend package.json exists', false);
}

// Test 0.5: Backend node_modules exists
const backendNodeModules = join(backendPath, 'node_modules');
if (existsSync(backendNodeModules)) {
  addTest('step0', 'Backend node_modules installed', true);
  // Check if express is actually installed
  if (existsSync(join(backendNodeModules, 'express'))) {
    addTest('step0', 'Backend dependencies installed (express verified)', true);
  } else {
    addTest('step0', 'Backend dependencies installed (express verified)', false, 'Run: cd backend && npm install');
  }
} else {
  addTest('step0', 'Backend node_modules installed', false, 'Run: cd backend && npm install');
}

// Test 0.6: Frontend node_modules exists
const frontendNodeModules = join(frontendPath, 'node_modules');
if (existsSync(frontendNodeModules)) {
  addTest('step0', 'Frontend node_modules installed', true);
  // Check if react is actually installed
  if (existsSync(join(frontendNodeModules, 'react'))) {
    addTest('step0', 'Frontend dependencies installed (react verified)', true);
  } else {
    addTest('step0', 'Frontend dependencies installed (react verified)', false, 'Run: cd frontend && npm install');
  }
} else {
  addTest('step0', 'Frontend node_modules installed', false, 'Run: cd frontend && npm install');
}

// Test 0.7: .env file exists
const envPath = join(backendPath, '.env');
if (existsSync(envPath)) {
  addTest('step0', '.env file exists', true);
} else {
  addTest('step0', '.env file exists', false, 'Create .env file in backend directory');
}

// Test 0.8: Environment variables configured
if (process.env.DB_HOST && process.env.DB_NAME) {
  addTest('step0', 'Environment variables configured', true);
} else {
  addTest('step0', 'Environment variables configured', false, 'Configure DB_HOST, DB_NAME in .env');
}

console.log('');

// ============================================
// STEP 1: DATABASE DESIGN TESTS
// ============================================
console.log('📋 STEP 1: DATABASE DESIGN');
console.log('-'.repeat(70));

try {
  // Test 1.1: Database connection
  const [testResult] = await pool.query('SELECT 1 as test');
  if (testResult && testResult.length > 0) {
    addTest('step1', 'Database connection', true);
  } else {
    addTest('step1', 'Database connection', false, 'Cannot connect to database');
  }

  // Test 1.2: Database exists
  const dbName = process.env.DB_NAME || 'mypetcare_db';
  const [dbs] = await pool.query(
    "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?",
    [dbName]
  );
  
  if (dbs.length > 0) {
    addTest('step1', 'Database exists', true, `Database: ${dbName}`);
  } else {
    addTest('step1', 'Database exists', false, `Database ${dbName} not found. Run schema.sql`);
  }

  // Test 1.3: Count tables
  const [tableCount] = await pool.query(
    "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ?",
    [dbName]
  );
  
  const count = tableCount[0].count;
  if (count === 30) {
    addTest('step1', 'All 30 tables exist', true, `Found ${count} tables`);
  } else {
    addTest('step1', 'All 30 tables exist', false, `Expected 30, found ${count}. Run schema.sql`);
  }

  // Test 1.4: Verify all expected tables
  const [tables] = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name",
    [dbName]
  );
  
  const expectedTables = [
    'appointments', 'audit_logs', 'carts', 'chat_messages', 'chat_rooms',
    'customer_pets', 'customers', 'doctor_schedules', 'doctors', 'exchange_requests',
    'feedback', 'health_records', 'notifications', 'offer_redemptions', 'offers',
    'order_items', 'orders', 'otp_verifications', 'password_history', 'pet_feeding_schedules',
    'pet_images', 'pet_vaccinations', 'pets', 'pre_bookings', 'product_images',
    'products', 'refresh_tokens', 'reminders', 'staff', 'users'
  ];
  
  const existingTables = tables.map(t => t.table_name || t.TABLE_NAME || Object.values(t)[0]);
  const missingTables = expectedTables.filter(t => !existingTables.includes(t));
  
  if (missingTables.length === 0) {
    addTest('step1', 'All expected tables present', true);
  } else {
    addTest('step1', 'All expected tables present', false, `Missing: ${missingTables.join(', ')}`);
  }

  // Test 1.5: Test table queries
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    addTest('step1', 'Table queries work', true, `Users table: ${users[0].count} records`);
  } catch (error) {
    addTest('step1', 'Table queries work', false, error.message);
  }

  // Test 1.6: Verify foreign keys
  try {
    const [fks] = await pool.query(
      `SELECT COUNT(*) as count FROM information_schema.KEY_COLUMN_USAGE 
       WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
      [dbName]
    );
    if (fks[0].count > 0) {
      addTest('step1', 'Foreign keys configured', true, `Found ${fks[0].count} foreign keys`);
    } else {
      addTest('step1', 'Foreign keys configured', false, 'No foreign keys found');
    }
  } catch (error) {
    addTest('step1', 'Foreign keys configured', false, error.message);
  }

} catch (error) {
  addTest('step1', 'Database tests', false, error.message);
  console.error('Database error:', error);
}

// Close database connection
await pool.end();

console.log('');
console.log('='.repeat(70));
console.log('📊 FINAL TEST SUMMARY');
console.log('='.repeat(70));

const step0Passed = results.step0.tests.filter(t => t.passed).length;
const step0Total = results.step0.tests.length;
const step1Passed = results.step1.tests.filter(t => t.passed).length;
const step1Total = results.step1.tests.length;

console.log(`\n${results.step0.name}:`);
console.log(`  Passed: ${step0Passed}/${step0Total}`);
if (step0Passed < step0Total) {
  console.log('  Failed tests:');
  results.step0.tests.filter(t => !t.passed).forEach(t => {
    console.log(`    ❌ ${t.name}${t.details ? ` - ${t.details}` : ''}`);
  });
}

console.log(`\n${results.step1.name}:`);
console.log(`  Passed: ${step1Passed}/${step1Total}`);
if (step1Passed < step1Total) {
  console.log('  Failed tests:');
  results.step1.tests.filter(t => !t.passed).forEach(t => {
    console.log(`    ❌ ${t.name}${t.details ? ` - ${t.details}` : ''}`);
  });
}

console.log('');
console.log('='.repeat(70));

if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('');
  console.log('✅ STEP 0: Project Setup - 100% COMPLETE');
  console.log('✅ STEP 1: Database Design - 100% COMPLETE');
  console.log('');
  console.log('🚀 System is ready to proceed to Step 2!');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED');
  console.log('');
  console.log('💡 Please fix the issues above before proceeding.');
  process.exit(1);
}

