# STEP 03: Authentication Flow

## 📋 Overview

This document details the complete authentication and authorization flow for **My Pet Care+**, including user registration, OTP verification, login, password reset, JWT token management, and role-based access control.

## 🔐 Authentication Components

### 1. User Registration Flow

#### Step 1: Registration Request
**Frontend:** `pages/public/Register.jsx`
- User fills registration form:
  - First Name, Last Name
  - Email
  - Phone Number
  - Password, Confirm Password
  - Role Selection (Customer, Doctor, Staff if allowed)

**Validation (Frontend - Zod):**
```javascript
- Email: Valid email format, not empty
- Password: Min 8 chars, uppercase, lowercase, number, special char
- Phone: Valid format
- Role: Must be one of: customer, doctor, staff
```

**API Call:** `POST /api/auth/register`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123!",
  "role": "customer"
}
```

#### Step 2: Backend Processing
**Backend:** `controllers/authController.js` → `register()`

**Process:**
1. Validate request data (Zod validation)
2. Check if email already exists
3. Validate password strength
4. Hash password using bcrypt (10 rounds)
5. Create user record in `users` table:
   - `is_verified = false`
   - `is_active = true`
   - `role` = selected role
6. Generate 6-digit OTP
7. Store OTP in `otp_verifications` table:
   - `otp_type = 'email_verification'`
   - `expires_at = NOW() + 10 minutes`
   - `is_used = false`
8. Send OTP email via Nodemailer
9. Create role-specific profile:
   - If `role = 'customer'` → Create record in `customers` table
   - If `role = 'doctor'` → Create record in `doctors` table
   - If `role = 'staff'` or `'admin'` → Create record in `staff` table
10. Return success response

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. OTP sent to email.",
  "data": {
    "userId": 123,
    "email": "john@example.com"
  }
}
```

#### Step 3: OTP Verification
**Frontend:** `pages/public/OTPVerification.jsx`
- User enters 6-digit OTP
- Timer countdown (10 minutes)
- Resend OTP button (max 3 retries)

**API Call:** `POST /api/auth/verify-otp`
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "type": "email_verification"
}
```

**Backend Processing:**
1. Find OTP record by email and OTP code
2. Check if OTP exists
3. Check if OTP is already used
4. Check if OTP is expired
5. If valid:
   - Mark OTP as used (`is_used = true`)
   - Update user: `is_verified = true`, `email_verified_at = NOW()`
   - Return success
6. If invalid/expired:
   - Return error message

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Frontend Action:**
- Redirect to Login page
- Show success message

---

### 2. Login Flow

#### Step 1: Login Request
**Frontend:** `pages/public/Login.jsx`
- User enters email and password
- Optional: "Remember Me" checkbox

**API Call:** `POST /api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Step 2: Backend Processing
**Backend:** `controllers/authController.js` → `login()`

**Process:**
1. Validate request data
2. Find user by email
3. Check if user exists
4. Check if user is verified (`is_verified = true`)
5. Check if user is active (`is_active = true`)
6. Verify password using bcrypt.compare()
7. If valid:
   - Generate JWT access token (expires in 15 minutes)
   - Generate JWT refresh token (expires in 7 days)
   - Store refresh token in `refresh_tokens` table
   - Get user role and profile data
   - Log login action in `audit_logs`
   - Return tokens and user data
8. If invalid:
   - Return error message

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 123,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    }
  }
}
```

#### Step 3: Frontend Token Storage
**Frontend:** `context/AuthContext.jsx`

**Process:**
1. Store access token in memory (React state)
2. Store refresh token in `localStorage` (or httpOnly cookie)
3. Store user data in context
4. Redirect based on role:
   - `customer` → `/customer/dashboard`
   - `doctor` → `/doctor/dashboard`
   - `staff` or `admin` → `/admin/dashboard`

---

### 3. Token Refresh Flow

#### Purpose
Access tokens expire in 15 minutes. Refresh tokens (7 days) are used to obtain new access tokens without re-login.

#### Step 1: Access Token Expired
**Frontend:** `services/api.js` (Axios interceptor)

**Process:**
1. API request fails with 401 Unauthorized
2. Axios interceptor catches error
3. Check if refresh token exists
4. If exists:
   - Call refresh token API
   - Get new access token
   - Retry original request
5. If refresh token invalid/expired:
   - Clear tokens
   - Redirect to Login page

#### Step 2: Refresh Token API
**API Call:** `POST /api/auth/refresh-token`
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Backend Processing:**
1. Verify refresh token signature
2. Check if token exists in `refresh_tokens` table
3. Check if token is revoked
4. Check if token is expired
5. If valid:
   - Generate new access token
   - Optionally rotate refresh token (generate new one)
   - Return new tokens
6. If invalid:
   - Return 401 error

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token...",
    "refreshToken": "new_refresh_token..." // if rotated
  }
}
```

---

### 4. Password Reset Flow

#### Step 1: Forgot Password Request
**Frontend:** `pages/public/ForgotPassword.jsx`
- User enters email

**API Call:** `POST /api/auth/forgot-password`
```json
{
  "email": "john@example.com"
}
```

**Backend Processing:**
1. Find user by email
2. Check if user exists and is verified
3. Generate 6-digit OTP
4. Store OTP in `otp_verifications` table:
   - `otp_type = 'password_reset'`
   - `expires_at = NOW() + 10 minutes`
5. Send OTP email
6. Return success

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```

#### Step 2: Reset Password
**Frontend:** `pages/public/ResetPassword.jsx`
- User enters OTP, new password, confirm password

**API Call:** `POST /api/auth/reset-password`
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Backend Processing:**
1. Validate request data
2. Verify OTP (same as email verification)
3. Check password strength
4. Check password history (prevent reuse of last 5 passwords)
5. If valid:
   - Hash new password
   - Update user password
   - Add old password to `password_history` table
   - Mark OTP as used
   - Revoke all refresh tokens for user
   - Return success
6. If invalid:
   - Return error

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Frontend Action:**
- Redirect to Login page
- Show success message

---

### 5. Logout Flow

#### Step 1: Logout Request
**Frontend:** User clicks logout button

**API Call:** `POST /api/auth/logout`
**Headers:**
```
Authorization: Bearer <access_token>
```

**Backend Processing:**
1. Verify access token
2. Revoke refresh token in `refresh_tokens` table:
   - `is_revoked = true`
3. Log logout action in `audit_logs`
4. Return success

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Frontend Action:**
- Clear tokens from storage
- Clear user data from context
- Redirect to Home/Login page

---

### 6. Protected Route Access

#### Frontend Route Protection
**File:** `routes/AppRoutes.jsx`

**Process:**
1. Check if user is authenticated (token exists)
2. Check user role
3. Compare route requirement with user role
4. If authorized:
   - Render protected component
5. If not authorized:
   - Redirect to Login page
   - Store intended destination for post-login redirect

**Route Guards:**
```javascript
// Customer Routes
<Route element={<RequireAuth roles={['customer']} />}>
  <Route path="/customer/*" element={<CustomerRoutes />} />
</Route>

// Doctor Routes
<Route element={<RequireAuth roles={['doctor']} />}>
  <Route path="/doctor/*" element={<DoctorRoutes />} />
</Route>

// Admin Routes
<Route element={<RequireAuth roles={['staff', 'admin']} />}>
  <Route path="/admin/*" element={<AdminRoutes />} />
</Route>
```

#### Backend Route Protection
**File:** `middleware/auth.js` and `middleware/rbac.js`

**Process:**
1. Extract token from `Authorization` header
2. Verify token signature
3. Check token expiration
4. Attach user data to `req.user`
5. Check user role against route requirement
6. If authorized:
   - Call `next()`
7. If not authorized:
   - Return 403 Forbidden

**Middleware Usage:**
```javascript
// Require authentication
router.get('/profile', authenticateToken, getProfile);

// Require specific role
router.get('/dashboard', authenticateToken, requireRole('customer'), getDashboard);

// Multiple roles
router.get('/admin/users', authenticateToken, requireRole('staff', 'admin'), getUsers);
```

---

### 7. JWT Token Structure

#### Access Token Payload
```json
{
  "userId": 123,
  "email": "john@example.com",
  "role": "customer",
  "iat": 1234567890,
  "exp": 1234568790  // 15 minutes from iat
}
```

#### Refresh Token Payload
```json
{
  "userId": 123,
  "tokenId": 456,  // ID from refresh_tokens table
  "type": "refresh",
  "iat": 1234567890,
  "exp": 1235173890  // 7 days from iat
}
```

---

### 8. Security Measures

#### Password Security
- **Hashing:** bcrypt with 10 salt rounds
- **Strength Requirements:**
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **History:** Prevent reuse of last 5 passwords

#### Token Security
- **Access Token:** Short-lived (15 minutes), stored in memory
- **Refresh Token:** Longer-lived (7 days), stored securely
- **Token Rotation:** Optional refresh token rotation on use
- **Revocation:** Tokens can be revoked (logout, password reset)

#### OTP Security
- **Expiry:** 10 minutes
- **One-time Use:** OTP marked as used after verification
- **Rate Limiting:** Max 3 resend attempts per email
- **Random Generation:** Cryptographically secure random OTP

#### API Security
- **HTTPS:** All API calls over HTTPS (production)
- **CORS:** Configured for frontend origin only
- **Rate Limiting:** Prevent brute force attacks
- **Input Validation:** All inputs validated (Zod)
- **SQL Injection Prevention:** Parameterized queries

---

### 9. Error Handling

#### Authentication Errors

| Error Code | Message | Action |
|------------|---------|--------|
| 400 | Invalid request data | Show validation errors |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden (wrong role) | Show access denied message |
| 404 | User not found | Show error message |
| 409 | Email already exists | Show error message |
| 422 | OTP expired/invalid | Show error, allow resend |
| 500 | Server error | Show generic error |

#### Frontend Error Handling
- Display user-friendly error messages
- Handle token expiration gracefully
- Auto-refresh tokens when possible
- Redirect to login on 401 errors

---

### 10. Session Management

#### Active Sessions
- Tracked via refresh tokens in database
- Multiple devices allowed (multiple refresh tokens per user)
- Revocation on logout or password reset

#### Session Timeout
- Access token: 15 minutes
- Refresh token: 7 days
- User must re-login after refresh token expiry

---

## ✅ Implementation Checklist

### Backend
- [ ] User registration endpoint
- [ ] OTP generation and storage
- [ ] OTP verification endpoint
- [ ] Email service (Nodemailer)
- [ ] Login endpoint with JWT
- [ ] Refresh token endpoint
- [ ] Password reset endpoints
- [ ] Logout endpoint
- [ ] Authentication middleware
- [ ] RBAC middleware
- [ ] Password history check
- [ ] Token revocation logic

### Frontend
- [ ] Registration form with validation
- [ ] OTP verification page with timer
- [ ] Login form
- [ ] Forgot password flow
- [ ] Reset password form
- [ ] Auth context for state management
- [ ] Token storage (memory + localStorage)
- [ ] Axios interceptors for token refresh
- [ ] Protected route components
- [ ] Role-based route guards
- [ ] Auto-logout on token expiry
- [ ] Error handling and user feedback

### Security
- [ ] Password hashing (bcrypt)
- [ ] JWT token signing
- [ ] OTP expiry enforcement
- [ ] Rate limiting on auth endpoints
- [ ] Input validation (Zod)
- [ ] SQL injection prevention
- [ ] CORS configuration
- [ ] HTTPS enforcement (production)

---

**Next Step:** [STEP 04: Backend Architecture](./STEP-04-BACKEND-ARCHITECTURE.md)

