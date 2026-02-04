import pool from '../config/database.js';
import { hashPassword, comparePassword, checkPasswordHistory, savePasswordHistory } from './passwordService.js';
import { storeOTP, verifyOTP } from './otpService.js';
import { sendOTPEmail } from './emailService.js';
import { generateTokenPair, storeRefreshToken, revokeAllUserTokens } from './jwtService.js';

// Check if email exists
export const emailExists = async (email) => {
  const [rows] = await pool.query(
    'SELECT user_id FROM users WHERE email = ?',
    [email]
  );
  return rows.length > 0;
};

// Get user by email
export const getUserByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Get user by ID
export const getUserById = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE user_id = ?',
    [userId]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Get user with role profile
export const getUserWithProfile = async (userId) => {
  const [userRows] = await pool.query(
    'SELECT * FROM users WHERE user_id = ?',
    [userId]
  );

  if (userRows.length === 0) {
    return null;
  }

  const user = userRows[0];
  let profile = null;

  // Get role-specific profile
  if (user.role === 'customer') {
    const [profileRows] = await pool.query(
      'SELECT * FROM customers WHERE user_id = ?',
      [userId]
    );
    profile = profileRows.length > 0 ? profileRows[0] : null;
  } else if (user.role === 'doctor') {
    const [profileRows] = await pool.query(
      'SELECT * FROM doctors WHERE user_id = ?',
      [userId]
    );
    profile = profileRows.length > 0 ? profileRows[0] : null;
  } else if (user.role === 'staff' || user.role === 'admin') {
    const [profileRows] = await pool.query(
      'SELECT * FROM staff WHERE user_id = ?',
      [userId]
    );
    profile = profileRows.length > 0 ? profileRows[0] : null;
  }

  return { ...user, profile };
};

// Register new user
export const registerUser = async (userData) => {
  const { firstName, lastName, email, phone, password, role } = userData;

  // Check if email exists
  if (await emailExists(email)) {
    throw new Error('Email already registered');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const [result] = await pool.query(
    `INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_verified, is_active)
     VALUES (?, ?, ?, ?, ?, ?, FALSE, TRUE)`,
    [firstName, lastName, email, phone, passwordHash, role]
  );

  const userId = result.insertId;

  // Create role-specific profile
  if (role === 'customer') {
    await pool.query(
      `INSERT INTO customers (user_id, loyalty_points, loyalty_tier, total_spent)
       VALUES (?, 0, 'bronze', 0.00)`,
      [userId]
    );
  } else if (role === 'doctor') {
    await pool.query(
      `INSERT INTO doctors (user_id, specialization, consultation_fee, is_available)
       VALUES (?, ?, 0.00, FALSE)`,
      [userId, 'General'] // Default specialization
    );
  } else if (role === 'staff' || role === 'admin') {
    await pool.query(
      'INSERT INTO staff (user_id) VALUES (?)',
      [userId]
    );
  }

  // Generate and store OTP
  const otpCode = await storeOTP(userId, email, 'email_verification', 10);

  // Send OTP email
  await sendOTPEmail(email, otpCode, 'email_verification');

  return { userId, email };
};

// Verify email with OTP
export const verifyEmail = async (email, otpCode) => {
  const result = await verifyOTP(email, otpCode, 'email_verification');

  if (!result.valid) {
    throw new Error(result.message);
  }

  // Update user as verified
  await pool.query(
    'UPDATE users SET is_verified = TRUE, email_verified_at = NOW() WHERE user_id = ?',
    [result.userId]
  );

  return { success: true };
};

// Login user
export const loginUser = async (email, password) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.is_verified) {
    throw new Error('Please verify your email first');
  }

  if (!user.is_active) {
    throw new Error('Account is deactivated');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateTokenPair(user);

  // Store refresh token
  const tokenId = await storeRefreshToken(user.user_id, refreshToken);

  // Get user with profile
  const userWithProfile = await getUserWithProfile(user.user_id);

  // Log login action
  await pool.query(
    `INSERT INTO audit_logs (user_id, action_type, entity_type, description)
     VALUES (?, 'login', 'user', 'User logged in')`,
    [user.user_id]
  );

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user.user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      profile: userWithProfile?.profile
    }
  };
};

// Forgot password - send OTP
export const forgotPassword = async (email) => {
  const user = await getUserByEmail(email);

  if (!user) {
    // Don't reveal if email exists for security
    return { success: true };
  }

  if (!user.is_verified) {
    throw new Error('Please verify your email first');
  }

  // Generate and store OTP
  const otpCode = await storeOTP(user.user_id, email, 'password_reset', 10);

  // Send OTP email
  await sendOTPEmail(email, otpCode, 'password_reset');

  return { success: true };
};

// Reset password
export const resetPassword = async (email, otpCode, newPassword) => {
  // Verify OTP
  const result = await verifyOTP(email, otpCode, 'password_reset');

  if (!result.valid) {
    throw new Error(result.message);
  }

  const userId = result.userId;

  // Get current password hash
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check password strength (basic check)
  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Check password history
  const canUsePassword = await checkPasswordHistory(userId, newPassword);
  if (!canUsePassword) {
    throw new Error('Cannot reuse one of your last 5 passwords');
  }

  // Save old password to history
  await savePasswordHistory(userId, user.password_hash);

  // Update password
  await pool.query(
    'UPDATE users SET password_hash = ? WHERE user_id = ?',
    [newPasswordHash, userId]
  );

  // Revoke all refresh tokens
  await revokeAllUserTokens(userId);

  // Log password reset
  await pool.query(
    `INSERT INTO audit_logs (user_id, action_type, entity_type, description)
     VALUES (?, 'password_reset', 'user', 'Password reset via OTP')`,
    [userId]
  );

  return { success: true };
};

// Logout user
export const logoutUser = async (tokenId) => {
  if (tokenId) {
    const { revokeRefreshToken } = await import('./jwtService.js');
    await revokeRefreshToken(tokenId);
  }

  return { success: true };
};

