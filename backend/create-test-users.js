import pool from './config/database.js';
import { hashPassword } from './services/passwordService.js';
import dotenv from 'dotenv';

dotenv.config();

async function createTestUsers() {
  console.log('👤 Creating Test Users for Presentation...\n');

  try {
    // Test users data
    const testUsers = [
      {
        firstName: 'John',
        lastName: 'Customer',
        email: 'customer@test.com',
        phone: '1234567890',
        password: 'TestPass123!',
        role: 'customer'
      },
      {
        firstName: 'Dr. Sarah',
        lastName: 'Doctor',
        email: 'doctor@test.com',
        phone: '1234567891',
        password: 'TestPass123!',
        role: 'doctor'
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        phone: '1234567892',
        password: 'TestPass123!',
        role: 'admin'
      }
    ];

    for (const userData of testUsers) {
      // Check if user exists
      const [existing] = await pool.query(
        'SELECT user_id FROM users WHERE email = ?',
        [userData.email]
      );

      if (existing.length > 0) {
        console.log(`⚠️  User ${userData.email} already exists, updating...`);
        const userId = existing[0].user_id;
        
        // Update password
        const passwordHash = await hashPassword(userData.password);
        await pool.query(
          'UPDATE users SET password_hash = ?, is_verified = TRUE, is_active = TRUE WHERE user_id = ?',
          [passwordHash, userId]
        );
        console.log(`✅ Updated user: ${userData.email} (${userData.role})`);
      } else {
        // Create new user
        const passwordHash = await hashPassword(userData.password);
        
        const [result] = await pool.query(
          `INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_verified, is_active)
           VALUES (?, ?, ?, ?, ?, ?, TRUE, TRUE)`,
          [userData.firstName, userData.lastName, userData.email, userData.phone, passwordHash, userData.role]
        );

        const userId = result.insertId;

        // Create role-specific profile
        if (userData.role === 'customer') {
          await pool.query(
            `INSERT INTO customers (user_id, loyalty_points, loyalty_tier, total_spent)
             VALUES (?, 500, 'silver', 1500.00)`,
            [userId]
          );
        } else if (userData.role === 'doctor') {
          await pool.query(
            `INSERT INTO doctors (user_id, specialization, qualifications, experience_years, consultation_fee, is_available, rating, total_reviews)
             VALUES (?, 'Veterinary Medicine', 'DVM, PhD', 10, 50.00, TRUE, 4.8, 25)`,
            [userId]
          );
        } else if (userData.role === 'admin') {
          await pool.query(
            `INSERT INTO staff (user_id, department, position)
             VALUES (?, 'Administration', 'System Administrator')`,
            [userId]
          );
        }

        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      }
    }

    console.log('\n📋 Test Users Created:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('CUSTOMER:');
    console.log('  Email: customer@test.com');
    console.log('  Password: TestPass123!');
    console.log('  Role: customer');
    console.log('\nDOCTOR:');
    console.log('  Email: doctor@test.com');
    console.log('  Password: TestPass123!');
    console.log('  Role: doctor');
    console.log('\nADMIN:');
    console.log('  Email: admin@test.com');
    console.log('  Password: TestPass123!');
    console.log('  Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ All test users are ready for presentation!');
    console.log('💡 All users are pre-verified and active (no OTP needed)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error.message);
    process.exit(1);
  }
}

createTestUsers();

