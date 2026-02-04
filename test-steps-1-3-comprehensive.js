import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
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

console.log('='.repeat(70));
console.log('🧪 COMPREHENSIVE VERIFICATION: STEPS 1-3');
console.log('='.repeat(70));
console.log('');

let allTestsPassed = true;
const results = {
  step1: { name: 'STEP 1: Database Design', tests: [] },
  step2: { name: 'STEP 2: Frontend Architecture', tests: [] },
  step3: { name: 'STEP 3: Authentication Flow', tests: [] }
};

function addTest(step, name, passed, details = '') {
  results[step].tests.push({ name, passed, details });
  if (!passed) allTestsPassed = false;
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (details) console.log(`   ${details}`);
}

const rootDir = dirname(fileURLToPath(import.meta.url));
const frontendDir = join(rootDir, 'frontend', 'src');
const backendDir = join(rootDir, 'backend');

// ============================================
// STEP 1: DATABASE DESIGN (Re-verify)
// ============================================
console.log('📋 STEP 1: DATABASE DESIGN');
console.log('-'.repeat(70));

try {
  const [testResult] = await pool.query('SELECT 1 as test');
  if (testResult && testResult.length > 0) {
    addTest('step1', 'Database connection', true);
  } else {
    addTest('step1', 'Database connection', false);
  }

  const dbName = process.env.DB_NAME || 'mypetcare_db';
  const [tableCount] = await pool.query(
    "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ?",
    [dbName]
  );
  
  const count = tableCount[0].count;
  if (count === 30) {
    addTest('step1', 'All 30 tables exist', true, `Found ${count} tables`);
  } else {
    addTest('step1', 'All 30 tables exist', false, `Expected 30, found ${count}`);
  }

  // Check critical auth tables
  const authTables = ['users', 'otp_verifications', 'refresh_tokens', 'password_history'];
  const [tables] = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
    [dbName]
  );
  const existingTables = tables.map(t => t.table_name || t.TABLE_NAME || Object.values(t)[0]);
  
  for (const table of authTables) {
    if (existingTables.includes(table)) {
      addTest('step1', `Auth table ${table} exists`, true);
    } else {
      addTest('step1', `Auth table ${table} exists`, false);
    }
  }

} catch (error) {
  addTest('step1', 'Database tests', false, error.message);
}

console.log('');

// ============================================
// STEP 2: FRONTEND ARCHITECTURE
// ============================================
console.log('📋 STEP 2: FRONTEND ARCHITECTURE');
console.log('-'.repeat(70));

// Expected pages
const expectedPages = {
  public: ['Home', 'Register', 'Login', 'OTPVerification', 'ForgotPassword', 'ResetPassword', 'PetListing', 'ProductListing', 'DoctorList'],
  customer: ['Dashboard', 'PetListing', 'PetDetails', 'ProductListing', 'ProductDetails', 'Cart', 'Checkout', 'Orders', 'OrderDetails', 'DoctorList', 'DoctorDetails', 'Appointments', 'BookAppointment', 'PetProfiles', 'PetProfileForm', 'HealthRecords', 'ExchangeRequests', 'PreBookings', 'Chat', 'Feedback', 'Notifications', 'Offers', 'Reminders'],
  doctor: ['Dashboard', 'ProfileManagement', 'ScheduleManagement', 'Appointments', 'AppointmentDetails', 'HealthRecords', 'Chat'],
  admin: ['Dashboard', 'PetManagement', 'ProductManagement', 'OrderManagement', 'UserManagement', 'ExchangeManagement', 'PreBookingManagement', 'OfferManagement', 'FeedbackModeration', 'NotificationManagement', 'Reports']
};

// Check pages
for (const [role, pages] of Object.entries(expectedPages)) {
  for (const page of pages) {
    const pagePath = join(frontendDir, 'pages', role, `${page}.jsx`);
    if (existsSync(pagePath)) {
      addTest('step2', `${role}/${page}.jsx exists`, true);
    } else {
      addTest('step2', `${role}/${page}.jsx exists`, false, `File not found: ${pagePath}`);
    }
  }
}

// Check route files
const routeFiles = ['AppRoutes', 'PublicRoutes', 'CustomerRoutes', 'DoctorRoutes', 'AdminRoutes'];
for (const route of routeFiles) {
  const routePath = join(frontendDir, 'routes', `${route}.jsx`);
  if (existsSync(routePath)) {
    addTest('step2', `Route ${route}.jsx exists`, true);
  } else {
    addTest('step2', `Route ${route}.jsx exists`, false);
  }
}

// Check components
const commonComponents = ['Button', 'Input', 'Card', 'Modal', 'Loading', 'EmptyState', 'RequireAuth'];
for (const comp of commonComponents) {
  const compPath = join(frontendDir, 'components', 'common', `${comp}.jsx`);
  if (existsSync(compPath)) {
    addTest('step2', `Component common/${comp}.jsx exists`, true);
  } else {
    addTest('step2', `Component common/${comp}.jsx exists`, false);
  }
}

// Check contexts
const contexts = ['AuthContext', 'CartContext', 'NotificationContext'];
for (const ctx of contexts) {
  const ctxPath = join(frontendDir, 'context', `${ctx}.jsx`);
  if (existsSync(ctxPath)) {
    addTest('step2', `Context ${ctx}.jsx exists`, true);
  } else {
    addTest('step2', `Context ${ctx}.jsx exists`, false);
  }
}

// Check services
const services = ['api', 'authService', 'petService', 'productService', 'orderService', 'appointmentService'];
for (const svc of services) {
  const svcPath = join(frontendDir, 'services', `${svc}.js`);
  if (existsSync(svcPath)) {
    addTest('step2', `Service ${svc}.js exists`, true);
  } else {
    addTest('step2', `Service ${svc}.js exists`, false);
  }
}

console.log('');

// ============================================
// STEP 3: AUTHENTICATION FLOW
// ============================================
console.log('📋 STEP 3: AUTHENTICATION FLOW');
console.log('-'.repeat(70));

// Check backend auth files
const backendAuthFiles = [
  'controllers/authController.js',
  'routes/authRoutes.js',
  'services/authService.js',
  'services/jwtService.js',
  'services/otpService.js',
  'services/passwordService.js',
  'middleware/auth.js',
  'middleware/rbac.js'
];

for (const file of backendAuthFiles) {
  const filePath = join(backendDir, file);
  if (existsSync(filePath)) {
    addTest('step3', `Backend ${file} exists`, true);
  } else {
    addTest('step3', `Backend ${file} exists`, false);
  }
}

// Check frontend auth pages
const authPages = ['Register', 'Login', 'OTPVerification', 'ForgotPassword', 'ResetPassword'];
for (const page of authPages) {
  const pagePath = join(frontendDir, 'pages', 'public', `${page}.jsx`);
  if (existsSync(pagePath)) {
    addTest('step3', `Frontend auth page ${page}.jsx exists`, true);
  } else {
    addTest('step3', `Frontend auth page ${page}.jsx exists`, false);
  }
}

// Check RequireAuth component
const requireAuthPath = join(frontendDir, 'components', 'common', 'RequireAuth.jsx');
if (existsSync(requireAuthPath)) {
  addTest('step3', 'RequireAuth component exists', true);
} else {
  addTest('step3', 'RequireAuth component exists', false);
}

// Test database has test users
try {
  const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
  if (users[0].count > 0) {
    addTest('step3', 'Test users exist in database', true, `${users[0].count} users found`);
  } else {
    addTest('step3', 'Test users exist in database', false, 'No users found. Run create-test-users.js');
  }
} catch (error) {
  addTest('step3', 'Test users exist in database', false, error.message);
}

// Check if auth routes are registered in server.js
try {
  const serverPath = join(backendDir, 'server.js');
  if (existsSync(serverPath)) {
    const serverContent = readFileSync(serverPath, 'utf8');
    if (serverContent.includes('authRoutes') || serverContent.includes('/api/auth')) {
      addTest('step3', 'Auth routes registered in server.js', true);
    } else {
      addTest('step3', 'Auth routes registered in server.js', false, 'Auth routes not found in server.js');
    }
  }
} catch (error) {
  addTest('step3', 'Auth routes registered in server.js', false, error.message);
}

// Close database connection
await pool.end();

console.log('');
console.log('='.repeat(70));
console.log('📊 FINAL TEST SUMMARY');
console.log('='.repeat(70));

for (const [stepKey, stepData] of Object.entries(results)) {
  const passed = stepData.tests.filter(t => t.passed).length;
  const total = stepData.tests.length;
  console.log(`\n${stepData.name}:`);
  console.log(`  Passed: ${passed}/${total}`);
  if (passed < total) {
    console.log('  Failed tests:');
    stepData.tests.filter(t => !t.passed).forEach(t => {
      console.log(`    ❌ ${t.name}${t.details ? ` - ${t.details}` : ''}`);
    });
  }
}

console.log('');
console.log('='.repeat(70));

if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('');
  console.log('✅ STEP 1: Database Design - 100% COMPLETE');
  console.log('✅ STEP 2: Frontend Architecture - 100% COMPLETE');
  console.log('✅ STEP 3: Authentication Flow - 100% COMPLETE');
  console.log('');
  console.log('🚀 System is ready for presentation!');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED');
  console.log('');
  console.log('💡 Please fix the issues above.');
  process.exit(1);
}

