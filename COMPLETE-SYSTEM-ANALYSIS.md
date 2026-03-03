# 🐾 MY PET CARE+ - COMPLETE SYSTEM ANALYSIS

## 📋 TABLE OF CONTENTS
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Database Architecture](#database-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Authentication System](#authentication-system)
6. [API Endpoints](#api-endpoints)
7. [User Roles & Permissions](#user-roles--permissions)
8. [Key Features by Role](#key-features-by-role)
9. [Security Implementation](#security-implementation)
10. [System Integration](#system-integration)

---

## 1. SYSTEM OVERVIEW

**My Pet Care+** is a comprehensive pet care management platform that enables:
- Pet adoption and product sales
- Veterinary appointment booking and management
- Health record tracking
- Real-time chat communication
- Loyalty rewards program
- Administrative management tools

### **System Architecture**
- **Frontend**: React.js SPA (Single Page Application)
- **Backend**: RESTful API built with Node.js/Express
- **Database**: MySQL with 30 tables
- **Authentication**: JWT-based with refresh token rotation
- **Email Service**: Nodemailer for OTP and notifications

### **Ports & URLs**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Database**: MySQL on port 3306

---

## 2. TECHNOLOGY STACK

### **Frontend Stack**
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.3.1 | UI Library |
| Vite | 5.0.0 | Build Tool & Dev Server |
| React Router DOM | 6.20.0 | Client-side Routing |
| Tailwind CSS | 3.4.0 | Styling Framework |
| Axios | 1.6.2 | HTTP Client |
| React Hook Form | 7.49.0 | Form Management |
| Zod | 3.22.4 | Validation Schema |
| React Hot Toast | 2.4.1 | Toast Notifications |
| Lucide React | Latest | Icon Library |

### **Backend Stack**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime Environment |
| Express.js | 4.18.2 | Web Framework |
| MySQL2 | 3.6.5 | Database Driver |
| JWT | jsonwebtoken@9.0.2 | Authentication |
| bcryptjs | 2.4.3 | Password Hashing |
| Nodemailer | 6.9.7 | Email Service |
| Helmet | 7.1.0 | Security Headers |
| CORS | 2.8.5 | Cross-Origin Resource Sharing |
| dotenv | 16.3.1 | Environment Variables |
| compression | 1.7.4 | Response Compression |
| express-rate-limit | 7.1.5 | Rate Limiting |

### **Development Tools**
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Nodemon**: Auto-restart backend
- **PostCSS**: CSS processing

---

## 3. DATABASE ARCHITECTURE

### **Database Overview**
- **Name**: `mypetcare_db`
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Total Tables**: 30
- **Engine**: InnoDB

### **Tables by Category**

#### **A. User Management (5 Tables)**

**1. users** - Core user information
```sql
Columns:
- user_id (PK, AUTO_INCREMENT)
- first_name, last_name
- email (UNIQUE)
- phone
- password_hash
- role (ENUM: customer, doctor, staff, admin)
- is_active (BOOLEAN)
- is_verified (BOOLEAN)
- email_verified_at (DATETIME)
- created_at, updated_at

Indexes: role, is_active, is_verified
```

**2. customers** - Customer-specific data
```sql
Columns:
- customer_id (PK)
- user_id (FK → users, UNIQUE)
- loyalty_points (INT, DEFAULT 0)
- loyalty_tier (ENUM: bronze, silver, gold, platinum)
- total_spent (DECIMAL)
- created_at, updated_at
```

**3. doctors** - Doctor profiles
```sql
Columns:
- doctor_id (PK)
- user_id (FK → users, UNIQUE)
- specialization
- qualifications (TEXT)
- experience_years (INT)
- consultation_fee (DECIMAL)
- rating (DECIMAL 3,2)
- total_reviews (INT)
- is_available (BOOLEAN)
- created_at, updated_at
```

**4. staff** - Staff/Admin records
```sql
Columns:
- staff_id (PK)
- user_id (FK → users, UNIQUE)
- department, position
- created_at, updated_at
```

**5. otp_verifications** - OTP management
```sql
Columns:
- otp_id (PK)
- user_id (FK → users, NULL for new registrations)
- email
- otp_code (VARCHAR 6)
- otp_type (ENUM: email_verification, password_reset)
- expires_at (TIMESTAMP)
- is_used (BOOLEAN)
- created_at

Indexes: email, otp_code, expires_at, is_used
```

#### **B. Authentication & Security (3 Tables)**

**6. refresh_tokens** - Token management
```sql
Columns:
- token_id (PK)
- user_id (FK → users)
- refresh_token (VARCHAR 500)
- expires_at (TIMESTAMP)
- is_revoked (BOOLEAN)
- created_at

Indexes: user_id, refresh_token, expires_at, is_revoked
```

**7. password_history** - Password change tracking
```sql
Columns:
- history_id (PK)
- user_id (FK → users)
- password_hash
- created_at

Purpose: Prevent password reuse (last 5 passwords)
```

**8. audit_logs** - System activity tracking
```sql
Columns:
- log_id (PK)
- user_id (FK → users, NULL for system actions)
- action_type (VARCHAR 100)
- entity_type, entity_id
- description (TEXT)
- ip_address (VARCHAR 45)
- user_agent (VARCHAR 500)
- created_at

Indexes: user_id, action_type, entity_type, created_at
```

#### **C. Inventory Management (4 Tables)**

**9. pets** - Pet inventory
```sql
Columns:
- pet_id (PK)
- name, species, breed
- age (INT - in months)
- gender (ENUM: male, female, other)
- description (TEXT)
- price (DECIMAL)
- stock_quantity (INT)
- is_available (BOOLEAN)
- image_url (VARCHAR 500)
- created_by (FK → users)
- created_at, updated_at

Indexes: species, breed, is_available, price
```

**10. pet_images** - Multiple images per pet
```sql
Columns:
- image_id (PK)
- pet_id (FK → pets)
- image_url
- is_primary (BOOLEAN)
- display_order (INT)
- created_at
```

**11. products** - Product inventory
```sql
Columns:
- product_id (PK)
- name, category
- description (TEXT)
- price (DECIMAL)
- stock_quantity (INT)
- is_available (BOOLEAN)
- image_url
- created_by (FK → users)
- created_at, updated_at

Indexes: category, is_available, price
```

**12. product_images** - Multiple images per product
```sql
Columns:
- image_id (PK)
- product_id (FK → products)
- image_url
- is_primary (BOOLEAN)
- display_order (INT)
- created_at
```

#### **D. Customer Pets & Care (4 Tables)**

**13. customer_pets** - Customer's owned pets
```sql
Columns:
- customer_pet_id (PK)
- customer_id (FK → customers)
- name, species, breed
- age, gender
- image_url
- created_at, updated_at
```

**14. pet_vaccinations** - Vaccination records
```sql
Columns:
- vaccination_id (PK)
- customer_pet_id (FK → customer_pets)
- vaccine_name
- vaccination_date (DATE)
- next_due_date (DATE)
- notes (TEXT)
- created_at
```

**15. pet_feeding_schedules** - Feeding schedules
```sql
Columns:
- schedule_id (PK)
- customer_pet_id (FK → customer_pets)
- food_type
- feeding_time (TIME)
- quantity
- notes (TEXT)
- created_at, updated_at
```

**16. health_records** - Medical history
```sql
Columns:
- record_id (PK)
- appointment_id (FK → appointments, NULL)
- customer_pet_id (FK → customer_pets)
- doctor_id (FK → doctors)
- diagnosis (TEXT)
- prescription (TEXT)
- treatment_notes (TEXT)
- record_date (DATE)
- created_at, updated_at
```

#### **E. Orders & Transactions (4 Tables)**

**17. carts** - Shopping cart
```sql
Columns:
- cart_id (PK)
- customer_id (FK → customers)
- item_type (ENUM: pet, product)
- item_id (INT - references pets or products)
- quantity (INT)
- created_at, updated_at

Indexes: customer_id, item_type, item_id
```

**18. orders** - Order records
```sql
Columns:
- order_id (PK)
- order_number (UNIQUE, VARCHAR 50)
- customer_id (FK → customers)
- total_amount (DECIMAL)
- discount_amount (DECIMAL)
- loyalty_points_used (INT)
- final_amount (DECIMAL)
- shipping_address (TEXT)
- payment_method (ENUM: card, bank_transfer, cash_on_delivery)
- payment_status (ENUM: pending, paid, failed, refunded)
- order_status (ENUM: pending, confirmed, processing, shipped, delivered, cancelled)
- transaction_reference
- loyalty_points_earned (INT)
- created_at, updated_at

Indexes: customer_id, order_status, payment_status, created_at
```

**19. order_items** - Order line items
```sql
Columns:
- order_item_id (PK)
- order_id (FK → orders)
- item_type (ENUM: pet, product)
- item_id (INT)
- item_name
- quantity (INT)
- unit_price (DECIMAL)
- subtotal (DECIMAL)
- created_at
```

**20. pre_bookings** - Pre-order requests
```sql
Columns:
- pre_booking_id (PK)
- customer_id (FK → customers)
- item_type (ENUM: pet, product)
- item_id (INT)
- quantity (INT)
- status (ENUM: pending, fulfilled, cancelled)
- fulfilled_at, notified_at
- created_at, updated_at

Indexes: customer_id, item_type, item_id, status
```

#### **F. Appointments & Schedules (3 Tables)**

**21. doctor_schedules** - Doctor availability
```sql
Columns:
- schedule_id (PK)
- doctor_id (FK → doctors)
- day_of_week (ENUM: monday-sunday)
- start_time (TIME)
- end_time (TIME)
- slot_duration (INT - minutes, DEFAULT 30)
- is_active (BOOLEAN)
- created_at, updated_at

Indexes: doctor_id, day_of_week, is_active
```

**22. appointments** - Appointment bookings
```sql
Columns:
- appointment_id (PK)
- appointment_number (UNIQUE)
- customer_id (FK → customers)
- doctor_id (FK → doctors)
- customer_pet_id (FK → customer_pets)
- appointment_date (DATE)
- appointment_time (TIME)
- status (ENUM: pending, accepted, rejected, completed, cancelled)
- consultation_fee (DECIMAL)
- payment_status (ENUM: pending, paid, refunded)
- doctor_notes (TEXT)
- created_at, updated_at

Indexes: customer_id, doctor_id, appointment_date, status
```

#### **G. Communication (2 Tables)**

**23. chat_rooms** - Chat channels
```sql
Columns:
- room_id (PK)
- room_type (ENUM: customer_staff, customer_doctor, appointment, order)
- customer_id (FK → customers)
- staff_id (FK → users, NULL)
- doctor_id (FK → doctors, NULL)
- appointment_id (FK → appointments, NULL)
- order_id (FK → orders, NULL)
- is_active (BOOLEAN)
- created_at, updated_at

Indexes: customer_id, room_type, is_active
```

**24. chat_messages** - Messages
```sql
Columns:
- message_id (PK)
- room_id (FK → chat_rooms)
- sender_id (FK → users)
- message_text (TEXT)
- is_read (BOOLEAN)
- read_at (DATETIME)
- created_at

Indexes: room_id, sender_id, created_at, is_read
```

#### **H. Engagement & Feedback (5 Tables)**

**25. feedback** - Customer feedback
```sql
Columns:
- feedback_id (PK)
- customer_id (FK → customers)
- feedback_type (ENUM: product, service, doctor)
- item_id (INT)
- rating (INT 1-5)
- comment (TEXT)
- status (ENUM: pending, approved, rejected)
- admin_response (TEXT)
- created_at, updated_at

Indexes: customer_id, feedback_type, item_id, status, rating
```

**26. offers** - Promotions & discounts
```sql
Columns:
- offer_id (PK)
- title, description (TEXT)
- discount_type (ENUM: percentage, fixed_amount, loyalty_points)
- discount_value (DECIMAL)
- min_purchase (DECIMAL)
- max_discount (DECIMAL)
- valid_from (DATETIME)
- valid_until (DATETIME)
- is_active (BOOLEAN)
- created_by (FK → users)
- created_at, updated_at

Indexes: is_active, valid_from, valid_until
```

**27. offer_redemptions** - Offer usage tracking
```sql
Columns:
- redemption_id (PK)
- offer_id (FK → offers)
- customer_id (FK → customers)
- order_id (FK → orders)
- discount_applied (DECIMAL)
- redeemed_at (TIMESTAMP)

Indexes: offer_id, customer_id, order_id
```

**28. notifications** - User notifications
```sql
Columns:
- notification_id (PK)
- user_id (FK → users)
- notification_type (ENUM: order, appointment, pre_booking, offer, loyalty, reminder, system)
- title, message (TEXT)
- related_id (INT - references related entity)
- is_read (BOOLEAN)
- read_at (DATETIME)
- created_at

Indexes: user_id, notification_type, is_read, created_at
```

**29. reminders** - Custom reminders
```sql
Columns:
- reminder_id (PK)
- customer_id (FK → customers)
- reminder_type (ENUM: vaccination, medication, food, appointment)
- title, description (TEXT)
- reminder_date (DATE)
- reminder_time (TIME)
- is_completed (BOOLEAN)
- completed_at (DATETIME)
- created_at, updated_at

Indexes: customer_id, reminder_type, reminder_date, is_completed
```

#### **I. Returns & Exchanges (1 Table)**

**30. exchange_requests** - Pet exchange requests
```sql
Columns:
- exchange_id (PK)
- customer_id (FK → customers)
- order_id (FK → orders)
- pet_id (FK → pets)
- reason (TEXT)
- status (ENUM: pending, approved, rejected, completed)
- approved_by (FK → users, NULL)
- approved_at (DATETIME)
- created_at, updated_at

Indexes: customer_id, status, created_at
```

### **Database Relationships**

**Key Foreign Key Relationships:**
- **users** → customers, doctors, staff (1:1)
- **customers** → orders, appointments, cart, feedback (1:N)
- **doctors** → appointments, health_records, schedules (1:N)
- **pets** / **products** → order_items, cart (1:N)
- **customer_pets** → vaccinations, feeding_schedules, health_records (1:N)
- **orders** → order_items, exchange_requests (1:N)
- **appointments** → health_records, chat_rooms (1:1 or 1:N)
- **chat_rooms** → chat_messages (1:N)

---

## 4. FRONTEND ARCHITECTURE

### **Project Structure**
```
frontend/
├── src/
│   ├── assets/              # Images, icons, styles
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── layout/          # Navbar, Sidebar, Footer
│   │   ├── admin/           # Admin-specific components
│   │   ├── customer/        # Customer-specific components
│   │   └── doctor/          # Doctor-specific components
│   ├── pages/
│   │   ├── public/          # Login, Register, Home (9 pages)
│   │   ├── customer/        # Customer dashboard & features (20 pages)
│   │   ├── doctor/          # Doctor dashboard & features (7 pages)
│   │   └── admin/           # Admin management pages (12 pages)
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state
│   │   ├── CartContext.jsx  # Shopping cart state
│   │   └── NotificationContext.jsx  # Notification state
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   ├── routes/              # Route configuration
│   ├── utils/               # Utilities & helpers
│   ├── App.jsx              # Main app component
│   └── main.jsx             # React entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### **Total Pages by Role**

**PUBLIC PAGES (9)**
1. Home - Landing page with featured pets/products
2. Register - User registration with role selection
3. OTP Verification - Email verification
4. Login - User authentication
5. Forgot Password - Password reset request
6. Reset Password - Password reset with OTP
7. Pet Listing (Public) - Browse pets (read-only)
8. Product Listing (Public) - Browse products (read-only)
9. Doctor List (Public) - View available doctors

**CUSTOMER PAGES (20)**
1. Dashboard - Overview with quick stats
2. Pet Listing - Browse pets with filters
3. Pet Details - Detailed pet information
4. Product Listing - Browse products with filters
5. Product Details - Detailed product information
6. Cart - Shopping cart management
7. Checkout - Order placement
8. Orders - Order history
9. Order Details - Individual order details
10. Doctor List - Browse veterinarians
11. Doctor Details - Doctor profile & reviews
12. Book Appointment - Appointment booking
13. Appointments - Appointment management
14. Pet Profiles - Customer's pet profiles
15. Pet Profile Form - Add/Edit pet profile
16. Health Records - Pet medical history
17. Exchange Requests - Request pet exchanges
18. Pre-Bookings - Pre-order unavailable items
19. Chat - Communicate with staff/doctors
20. Feedback - Submit ratings & reviews
21. Notifications - View system notifications
22. Offers - Browse promotions
23. Reminders - Manage custom reminders

**DOCTOR PAGES (7)**
1. Dashboard - Doctor overview
2. Profile Management - Update doctor profile
3. Schedule Management - Manage availability
4. Appointments - View & manage appointments
5. Appointment Details - Detailed appointment view
6. Health Records - Create/view health records
7. Chat - Communicate with customers

**ADMIN PAGES (12)**
1. Dashboard - System analytics
2. User Management - Manage all users
3. Pet Management - Inventory management
4. Product Management - Inventory management
5. Order Management - Process orders
6. Feedback Moderation - Review feedback
7. Offer Management - Create/manage promotions
8. Exchange Management - Handle exchange requests
9. Pre-Booking Management - Fulfill pre-bookings
10. Notification Management - Send broadcasts
11. Reports - Sales, appointments, customer analytics
12. Chat - Support communication

**Total: 48+ Pages**

### **Common Components**

**Layout Components:**
- `Navbar.jsx` - Top navigation (role-based menu)
- `Sidebar.jsx` - Side navigation (admin/doctor)
- `Footer.jsx` - Page footer
- `Layout.jsx` - Page wrapper

**Reusable UI Components:**
- `Button.jsx` - Styled button with variants
- `Input.jsx` - Form input with validation
- `Card.jsx` - Card container
- `Modal.jsx` - Modal dialog
- `Loading.jsx` - Loading spinner
- `EmptyState.jsx` - Empty data display
- `Pagination.jsx` - Page navigation

**Domain-Specific Components:**
- `PetCard.jsx` - Pet display card
- `ProductCard.jsx` - Product display card
- `OrderCard.jsx` - Order summary card
- `AppointmentCard.jsx` - Appointment card
- `StatsCard.jsx` - Dashboard statistics card
- `DataTable.jsx` - Admin data table

### **Context Providers**

**1. AuthContext**
- User authentication state
- Login/logout functions
- Token management
- Role checking helpers

**2. CartContext**
- Cart items state
- Add/remove/update cart functions
- Cart total calculation
- LocalStorage persistence

**3. NotificationContext**
- Unread notification count
- Notification polling
- Mark as read functionality

### **Custom Hooks**

- `useAuth.js` - Authentication utilities
- `useApi.js` - API call wrapper
- `useLocalStorage.js` - LocalStorage sync
- `useDebounce.js` - Debounce input values

### **Routing System**

**Route Protection:**
- Public routes - Accessible to all
- Customer routes - `requireRole(['customer'])`
- Doctor routes - `requireRole(['doctor'])`
- Admin routes - `requireRole(['staff', 'admin'])`

**Route Files:**
- `AppRoutes.jsx` - Main route configuration
- `PublicRoutes.jsx` - Public route definitions
- `CustomerRoutes.jsx` - Customer route definitions
- `DoctorRoutes.jsx` - Doctor route definitions
- `AdminRoutes.jsx` - Admin route definitions

### **Styling with Tailwind CSS**

**Design System:**
- Primary color: Blue (#3B82F6)
- Secondary color: Green (#10B981)
- Accent color: Purple (#8B5CF6)
- Responsive breakpoints: sm, md, lg, xl, 2xl
- Dark mode support (optional)

**Responsive Design:**
- Mobile-first approach
- Collapsible sidebar on mobile
- Stacked layouts for small screens
- Touch-friendly buttons and inputs

---

## 5. AUTHENTICATION SYSTEM

### **Authentication Flow Overview**

**Registration → OTP Verification → Login → Token Management → Logout**

### **1. User Registration**

**Process:**
1. User submits registration form (first name, last name, email, phone, password, role)
2. Frontend validates data using Zod schema
3. Backend checks if email exists
4. Password is hashed using bcrypt (10 salt rounds)
5. User record created in `users` table with `is_verified = false`
6. Role-specific profile created (customers/doctors/staff table)
7. 6-digit OTP generated and stored in `otp_verifications` table
8. OTP sent via email using Nodemailer
9. Response includes user ID and email for next step

**Frontend:** `pages/public/Register.jsx`
**Backend:** `POST /api/auth/register`
**Controller:** `authController.js → register()`
**Service:** `authService.js`, `otpService.js`, `emailService.js`

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### **2. OTP Verification**

**Process:**
1. User enters 6-digit OTP received via email
2. Frontend submits OTP with email and type
3. Backend validates OTP:
   - Checks if OTP exists
   - Verifies not expired (10-minute window)
   - Confirms not already used
4. If valid:
   - Mark OTP as used (`is_used = true`)
   - Update user: `is_verified = true`, `email_verified_at = NOW()`
   - Return success
5. User redirected to login page

**Frontend:** `pages/public/OTPVerification.jsx`
**Backend:** `POST /api/auth/verify-otp`
**Controller:** `authController.js → verifyOTP()`

**OTP Features:**
- 10-minute expiration
- Resend OTP option (max 3 attempts)
- One-time use enforcement
- Countdown timer display

### **3. Login**

**Process:**
1. User submits email and password
2. Backend validates credentials:
   - Find user by email
   - Check if user exists
   - Check if email is verified (`is_verified = true`)
   - Check if account is active (`is_active = true`)
   - Verify password using bcrypt.compare()
3. If valid:
   - Generate JWT access token (15-minute expiry)
   - Generate JWT refresh token (7-day expiry)
   - Store refresh token in `refresh_tokens` table
   - Return tokens and user data
4. Frontend stores tokens:
   - Access token in memory (React state)
   - Refresh token in localStorage
   - User data in localStorage
5. Redirect based on role:
   - Customer → `/customer/dashboard`
   - Doctor → `/doctor/dashboard`
   - Staff/Admin → `/admin/dashboard`

**Frontend:** `pages/public/Login.jsx`
**Backend:** `POST /api/auth/login`
**Controller:** `authController.js → login()`
**Service:** `jwtService.js`, `passwordService.js`

### **4. Token Management**

**Access Token:**
- **Expiry:** 15 minutes
- **Storage:** React state (memory)
- **Payload:**
  ```json
  {
    "userId": 123,
    "email": "user@example.com",
    "role": "customer",
    "iat": 1234567890,
    "exp": 1234568790
  }
  ```

**Refresh Token:**
- **Expiry:** 7 days
- **Storage:** localStorage (or httpOnly cookie in production)
- **Payload:**
  ```json
  {
    "userId": 123,
    "tokenId": 456,
    "type": "refresh",
    "iat": 1234567890,
    "exp": 1235173890
  }
  ```

**Token Refresh Flow:**
1. API request fails with 401 Unauthorized
2. Axios interceptor catches error
3. Call refresh token endpoint with refresh token
4. Backend validates refresh token:
   - Verify signature
   - Check if exists in `refresh_tokens` table
   - Check if not revoked
   - Check if not expired
5. If valid:
   - Generate new access token
   - Optionally rotate refresh token
   - Return new tokens
6. Frontend updates access token
7. Retry original request
8. If refresh fails:
   - Clear all tokens
   - Redirect to login

**Backend:** `POST /api/auth/refresh-token`
**Frontend Interceptor:** `services/api.js`

### **5. Password Reset**

**Step 1: Forgot Password**
1. User enters email
2. Backend generates OTP
3. OTP stored in `otp_verifications` with type `password_reset`
4. OTP sent via email
5. User redirected to reset password page

**Step 2: Reset Password**
1. User enters OTP, new password, confirm password
2. Backend validates OTP (same as email verification)
3. Validate password strength
4. Check password history (prevent reuse of last 5 passwords)
5. If valid:
   - Hash new password
   - Update user password
   - Add old password to `password_history` table
   - Mark OTP as used
   - Revoke all refresh tokens for user
   - Return success
6. User redirected to login page

**Frontend:** `pages/public/ForgotPassword.jsx`, `pages/public/ResetPassword.jsx`
**Backend:** `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`

### **6. Logout**

**Process:**
1. User clicks logout
2. Frontend sends logout request with access token
3. Backend:
   - Verify access token
   - Revoke refresh token in database (`is_revoked = true`)
   - Log action in audit_logs
4. Frontend:
   - Clear access token from state
   - Clear refresh token from localStorage
   - Clear user data from localStorage
   - Redirect to home or login page

**Backend:** `POST /api/auth/logout`
**Frontend:** `AuthContext.jsx → logout()`

### **7. Route Protection**

**Frontend Route Guards:**
```javascript
<Route element={<RequireAuth roles={['customer']} />}>
  <Route path="/customer/*" element={<CustomerRoutes />} />
</Route>
```

**Backend Middleware:**
```javascript
// Require authentication
router.get('/profile', authenticate, getProfile);

// Require specific role
router.get('/dashboard', authenticate, requireRole('customer'), getDashboard);

// Multiple roles
router.get('/admin/users', authenticate, requireRole('staff', 'admin'), getUsers);
```

**Middleware Files:**
- `middleware/auth.js` - JWT verification
- `middleware/rbac.js` - Role-based access control

---

## 6. API ENDPOINTS

### **Base URL**
`http://localhost:5000/api`

### **Authentication Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| POST | `/auth/register` | Register new user | Public | `{ firstName, lastName, email, phone, password, role }` |
| POST | `/auth/verify-otp` | Verify email with OTP | Public | `{ email, otpCode, otpType }` |
| POST | `/auth/resend-otp` | Resend OTP | Public | `{ email, otpType }` |
| POST | `/auth/login` | User login | Public | `{ email, password }` |
| POST | `/auth/refresh-token` | Refresh access token | Public | `{ refreshToken }` |
| POST | `/auth/logout` | User logout | Authenticated | `{ refreshToken }` |
| POST | `/auth/forgot-password` | Request password reset | Public | `{ email }` |
| POST | `/auth/reset-password` | Reset password with OTP | Public | `{ email, otpCode, newPassword, confirmPassword }` |
| GET | `/auth/me` | Get current user | Authenticated | - |

### **Admin Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/admin/dashboard` | Dashboard statistics | Admin/Staff |
| GET | `/admin/users` | List all users | Admin/Staff |
| PUT | `/admin/users/:id/status` | Activate/deactivate user | Admin/Staff |
| PUT | `/admin/users/:id/role` | Change user role | Admin only |
| GET | `/admin/reports/sales` | Sales report | Admin/Staff |
| GET | `/admin/reports/appointments` | Appointment report | Admin/Staff |
| GET | `/admin/reports/customers` | Customer growth report | Admin/Staff |
| GET | `/admin/reports/loyalty` | Loyalty program report | Admin/Staff |
| GET | `/admin/audit-logs` | View audit logs | Admin only |

### **Pet Endpoints**

| Method | Endpoint | Description | Access | Query Params |
|--------|----------|-------------|--------|--------------|
| GET | `/pets` | List all pets | Public | `species, breed, minPrice, maxPrice, available, page, limit` |
| GET | `/pets/:id` | Get pet details | Public | - |
| POST | `/pets` | Create new pet | Admin/Staff | `{ name, species, breed, age, gender, description, price, stock_quantity, is_available }` |
| PUT | `/pets/:id` | Update pet | Admin/Staff | Same as POST |
| DELETE | `/pets/:id` | Delete pet | Admin/Staff | - |
| POST | `/pets/:id/images` | Upload pet images | Admin/Staff | FormData with image file |
| GET | `/pets/filters` | Get filter options | Public | - |

### **Product Endpoints**

| Method | Endpoint | Description | Access | Query Params |
|--------|----------|-------------|--------|--------------|
| GET | `/products` | List all products | Public | `category, minPrice, maxPrice, available, page, limit` |
| GET | `/products/:id` | Get product details | Public | - |
| POST | `/products` | Create new product | Admin/Staff | `{ name, category, description, price, stock_quantity, is_available }` |
| PUT | `/products/:id` | Update product | Admin/Staff | Same as POST |
| DELETE | `/products/:id` | Delete product | Admin/Staff | - |
| POST | `/products/:id/images` | Upload product images | Admin/Staff | FormData |
| GET | `/products/categories` | Get product categories | Public | - |

### **Cart Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/cart` | Get cart items | Customer | - |
| POST | `/cart/add` | Add item to cart | Customer | `{ item_type, item_id, quantity }` |
| PUT | `/cart/:cartId` | Update cart item quantity | Customer | `{ quantity }` |
| DELETE | `/cart/:cartId` | Remove item from cart | Customer | - |
| DELETE | `/cart/clear` | Clear entire cart | Customer | - |

### **Order Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/orders` | List orders | Authenticated | Query: `status, payment_status, from, to, page, limit` |
| GET | `/orders/:id` | Get order details | Authenticated | - |
| POST | `/orders/create` | Create order from cart | Customer | `{ shipping_address, payment_method, offer_id?, loyalty_points_used? }` |
| PUT | `/orders/:id/status` | Update order status | Admin/Staff | `{ order_status }` |
| PUT | `/orders/:id/payment` | Update payment status | Admin/Staff | `{ payment_status, transaction_reference? }` |
| POST | `/orders/:id/cancel` | Cancel order | Customer/Staff | - |
| GET | `/orders/:id/invoice` | Download invoice | Customer/Staff | - |
| GET | `/orders/stats` | Order statistics | Admin/Staff | Query: `from, to` |

### **Appointment Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/appointments` | List appointments | Customer/Doctor/Staff | Query: `status, doctor_id, customer_id, from, to` |
| GET | `/appointments/:id` | Get appointment details | Authenticated | - |
| POST | `/appointments` | Book appointment | Customer | `{ doctor_id, customer_pet_id, appointment_date, appointment_time }` |
| PUT | `/appointments/:id/accept` | Accept appointment | Doctor | - |
| PUT | `/appointments/:id/reject` | Reject appointment | Doctor | `{ rejection_reason }` |
| PUT | `/appointments/:id/complete` | Mark completed | Doctor | - |
| POST | `/appointments/:id/notes` | Add doctor notes | Doctor | `{ doctor_notes }` |
| POST | `/appointments/:id/cancel` | Cancel appointment | Customer/Doctor | `{ cancellation_reason }` |

### **Doctor Endpoints**

| Method | Endpoint | Description | Access | Query Params |
|--------|----------|-------------|--------|--------------|
| GET | `/doctors` | List all doctors | Public | `specialization, rating, available, page, limit` |
| GET | `/doctors/:id` | Get doctor details | Public | - |
| GET | `/doctors/:id/schedule` | Get doctor schedule | Public | - |
| GET | `/doctors/:id/available-slots` | Get available slots | Public | Query: `date` |
| PUT | `/doctors/profile` | Update doctor profile | Doctor | `{ specialization, qualifications, experience_years, consultation_fee }` |
| POST | `/doctors/schedule` | Add schedule slot | Doctor | `{ day_of_week, start_time, end_time, slot_duration }` |
| PUT | `/doctors/schedule/:id` | Update schedule slot | Doctor | Same as POST |
| DELETE | `/doctors/schedule/:id` | Delete schedule slot | Doctor | - |
| GET | `/doctors/dashboard` | Doctor dashboard | Doctor | - |

### **Customer Pet Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/customer-pets` | Get customer's pets | Customer | - |
| GET | `/customer-pets/:id` | Get pet details | Customer | - |
| POST | `/customer-pets` | Create pet profile | Customer | `{ name, species, breed, age, gender, image }` |
| PUT | `/customer-pets/:id` | Update pet profile | Customer | Same as POST |
| DELETE | `/customer-pets/:id` | Delete pet profile | Customer | - |
| GET | `/customer-pets/:id/vaccinations` | Get vaccination records | Customer | - |
| POST | `/customer-pets/:id/vaccinations` | Add vaccination record | Customer | `{ vaccine_name, vaccination_date, next_due_date, notes }` |
| GET | `/customer-pets/:id/feeding-schedules` | Get feeding schedules | Customer | - |
| POST | `/customer-pets/:id/feeding-schedules` | Add feeding schedule | Customer | `{ food_type, feeding_time, quantity, notes }` |

### **Health Record Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/health-records` | List health records | Customer/Doctor | Query: `customer_pet_id, from, to` |
| GET | `/health-records/:id` | Get record details | Customer/Doctor | - |
| POST | `/health-records` | Create health record | Doctor | `{ customer_pet_id, appointment_id?, diagnosis, prescription, treatment_notes, record_date }` |
| PUT | `/health-records/:id` | Update health record | Doctor | Same as POST |
| GET | `/health-records/pet/:petId` | Get records for pet | Customer/Doctor | - |
| GET | `/health-records/:id/download` | Download record PDF | Customer/Doctor | - |

### **Exchange Request Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/exchanges` | List exchange requests | Customer/Staff | Query: `status, customer_id` |
| POST | `/exchanges` | Submit exchange request | Customer | `{ order_id, pet_id, reason }` |
| PUT | `/exchanges/:id/approve` | Approve exchange | Admin/Staff | - |
| PUT | `/exchanges/:id/reject` | Reject exchange | Admin/Staff | `{ rejection_reason }` |
| DELETE | `/exchanges/:id` | Cancel exchange request | Customer | - |

### **Pre-Booking Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/pre-bookings` | List pre-booking requests | Customer/Staff | Query: `status, customer_id, item_type` |
| POST | `/pre-bookings` | Create pre-booking request | Customer | `{ item_type, item_id, quantity }` |
| PUT | `/pre-bookings/:id/fulfill` | Fulfill pre-booking | Admin/Staff | - |
| DELETE | `/pre-bookings/:id` | Cancel pre-booking | Customer | - |

### **Chat Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/chat/rooms` | List chat rooms | Authenticated | - |
| GET | `/chat/rooms/:id` | Get room details | Authenticated | - |
| POST | `/chat/rooms` | Create chat room | Authenticated | `{ room_type, recipient_id }` |
| GET | `/chat/rooms/:id/messages` | Get messages | Authenticated | Query: `page, limit` |
| POST | `/chat/rooms/:id/messages` | Send message | Authenticated | `{ message_text }` |
| PUT | `/chat/messages/:id/read` | Mark message as read | Authenticated | - |
| GET | `/chat/unread-count` | Get unread message count | Authenticated | - |

### **Feedback Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/feedback` | List feedback | Authenticated | Query: `feedback_type, status, rating, item_id` |
| POST | `/feedback` | Submit feedback | Customer | `{ feedback_type, item_id, rating, comment }` |
| GET | `/feedback/:id` | Get feedback details | Authenticated | - |
| PUT | `/feedback/:id/status` | Update feedback status | Admin/Staff | `{ status }` |
| POST | `/feedback/:id/response` | Add admin response | Admin/Staff | `{ admin_response }` |
| GET | `/feedback/stats` | Feedback statistics | Admin/Staff | - |

### **Notification Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/notifications` | List notifications | Authenticated | Query: `notification_type, is_read` |
| GET | `/notifications/unread` | Get unread notifications | Authenticated | - |
| PUT | `/notifications/:id/read` | Mark as read | Authenticated | - |
| PUT | `/notifications/read-all` | Mark all as read | Authenticated | - |
| DELETE | `/notifications/:id` | Delete notification | Authenticated | - |
| POST | `/notifications/broadcast` | Send broadcast notification | Admin/Staff | `{ target_role?, title, message, notification_type }` |

### **Offer Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/offers` | List available offers | Public/Customer | Query: `is_active` |
| GET | `/offers/:id` | Get offer details | Public | - |
| POST | `/offers` | Create offer | Admin/Staff | `{ title, description, discount_type, discount_value, min_purchase, max_discount, valid_from, valid_until, is_active }` |
| PUT | `/offers/:id` | Update offer | Admin/Staff | Same as POST |
| DELETE | `/offers/:id` | Delete offer | Admin/Staff | - |
| GET | `/offers/redemptions` | Get offer redemptions | Admin/Staff | Query: `offer_id, from, to` |

### **Reminder Endpoints**

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| GET | `/reminders` | List reminders | Customer | Query: `reminder_type, is_completed` |
| GET | `/reminders/:id` | Get reminder details | Customer | - |
| POST | `/reminders` | Create reminder | Customer | `{ reminder_type, title, description, reminder_date, reminder_time }` |
| PUT | `/reminders/:id` | Update reminder | Customer | Same as POST |
| DELETE | `/reminders/:id` | Delete reminder | Customer | - |
| PUT | `/reminders/:id/complete` | Mark as completed | Customer | - |
| GET | `/reminders/upcoming` | Get upcoming reminders | Customer | Query: `days` |

### **Total Endpoints**
- **Authentication:** 9 endpoints
- **Admin:** 9 endpoints
- **Pets:** 7 endpoints
- **Products:** 7 endpoints
- **Cart:** 5 endpoints
- **Orders:** 8 endpoints
- **Appointments:** 8 endpoints
- **Doctors:** 9 endpoints
- **Customer Pets:** 10 endpoints
- **Health Records:** 6 endpoints
- **Exchanges:** 5 endpoints
- **Pre-Bookings:** 4 endpoints
- **Chat:** 8 endpoints
- **Feedback:** 7 endpoints
- **Notifications:** 7 endpoints
- **Offers:** 6 endpoints
- **Reminders:** 7 endpoints

**Total: 120+ API Endpoints**

---

## 7. USER ROLES & PERMISSIONS

### **Role Hierarchy**
```
admin (highest privilege)
  ↓
staff (administrative access)
  ↓
doctor (medical professional)
  ↓
customer (end user)
```

### **Role Definitions**

**1. CUSTOMER**
- Default role for public registration
- Access to shopping features
- Can book appointments
- Can manage pet profiles
- Can submit feedback and requests
- Cannot access admin or doctor features

**2. DOCTOR**
- Requires admin approval or special registration
- Can view and manage appointments
- Can create health records
- Can manage schedule
- Cannot access admin features
- Cannot place orders (optional restriction)

**3. STAFF**
- Administrative role (lower than admin)
- Can manage inventory (pets, products)
- Can process orders
- Can moderate feedback
- Can handle customer requests
- Cannot change user roles
- Cannot view sensitive audit logs

**4. ADMIN**
- Highest privilege level
- Full system access
- Can change user roles
- Can view audit logs
- Can create/delete admin accounts
- Complete management control

### **Permission Matrix**

| Feature | Customer | Doctor | Staff | Admin |
|---------|----------|--------|-------|-------|
| Browse Pets/Products | ✅ | ✅ | ✅ | ✅ |
| Add to Cart | ✅ | ❌ | ❌ | ❌ |
| Place Orders | ✅ | ❌ | ❌ | ❌ |
| Book Appointments | ✅ | ❌ | ❌ | ❌ |
| Manage Pet Profiles | ✅ | ❌ | ❌ | ❌ |
| View Health Records | ✅ (own pets) | ✅ (patients) | ❌ | ✅ |
| Create Health Records | ❌ | ✅ | ❌ | ❌ |
| Manage Schedule | ❌ | ✅ | ❌ | ✅ |
| Accept/Reject Appointments | ❌ | ✅ | ❌ | ✅ |
| Chat | ✅ | ✅ | ✅ | ✅ |
| Submit Feedback | ✅ | ❌ | ❌ | ❌ |
| Moderate Feedback | ❌ | ❌ | ✅ | ✅ |
| Create Pets/Products | ❌ | ❌ | ✅ | ✅ |
| Manage Inventory | ❌ | ❌ | ✅ | ✅ |
| Process Orders | ❌ | ❌ | ✅ | ✅ |
| Approve Exchanges | ❌ | ❌ | ✅ | ✅ |
| Fulfill Pre-Bookings | ❌ | ❌ | ✅ | ✅ |
| Create Offers | ❌ | ❌ | ✅ | ✅ |
| View Reports | ❌ | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ (View only) | ✅ |
| Change User Roles | ❌ | ❌ | ❌ | ✅ |
| View Audit Logs | ❌ | ❌ | ❌ | ✅ |
| Broadcast Notifications | ❌ | ❌ | ✅ | ✅ |

---

## 8. KEY FEATURES BY ROLE

### **CUSTOMER FEATURES**

**1. Shopping & Orders**
- Browse pets and products with advanced filtering
- Add items to cart
- Apply offers and redeem loyalty points
- Place orders with multiple payment methods
- Track order status (pending → shipped → delivered)
- Download invoices
- Cancel orders (if pending)
- Request pet exchanges (within policy)

**2. Appointment Management**
- Browse available doctors
- View doctor profiles and reviews
- Check doctor availability and schedules
- Book appointments with selected doctor
- Track appointment status
- Cancel appointments
- View appointment history

**3. Pet Care**
- Create pet profiles
- Upload pet photos
- Track vaccinations with reminders
- Set feeding schedules
- View health records
- Add custom reminders (vaccination, medication, etc.)

**4. Communication**
- Chat with customer support
- Chat with doctors (appointment-based)
- Receive real-time notifications
- Submit feedback and ratings

**5. Loyalty Program**
- Earn points on purchases
- Track loyalty tier (bronze/silver/gold/platinum)
- View tier benefits
- Redeem points for discounts
- View points history

**6. Pre-Booking**
- Request unavailable pets/products
- Get notified when available
- Track pre-booking status

### **DOCTOR FEATURES**

**1. Profile Management**
- Update specialization
- Add/edit qualifications
- Set consultation fee
- Upload profile photo
- Set availability status

**2. Schedule Management**
- Set weekly availability
- Define time slots by day
- Set slot duration (e.g., 30 minutes)
- Enable/disable specific slots
- View booking calendar

**3. Appointment Management**
- View appointment requests
- Accept or reject appointments
- View appointment details
- Add consultation notes
- Mark appointments as completed
- Cancel appointments with reason

**4. Medical Records**
- View patient history
- Create health records
- Add diagnosis and prescriptions
- Write treatment notes
- Generate medical reports

**5. Communication**
- Chat with patients
- Respond to queries
- Receive appointment notifications

### **ADMIN/STAFF FEATURES**

**1. Dashboard Analytics**
- Total sales (today/week/month)
- Order count and status
- Active customer count
- Pending appointments
- Revenue trends
- Popular pets/products
- Customer growth charts
- Appointment trends

**2. Inventory Management**
- Add/edit/delete pets
- Manage pet details and pricing
- Upload multiple pet images
- Set availability status
- Track stock quantity
- Add/edit/delete products
- Manage product categories
- Bulk operations

**3. Order Management**
- View all orders
- Filter by status and date range
- Update order status
- Update payment status
- Process refunds
- Generate invoices
- Track shipping
- Order statistics

**4. User Management**
- View all users (customers, doctors, staff)
- Filter by role and status
- Activate/deactivate users
- Change user roles (admin only)
- View user details
- Track user activity

**5. Feedback Moderation**
- View all feedback
- Filter by type, rating, status
- Approve or reject feedback
- Add admin responses
- View feedback statistics
- Moderate inappropriate content

**6. Offer Management**
- Create promotional offers
- Set discount types (percentage/fixed/loyalty)
- Define validity periods
- Set minimum purchase requirements
- Track offer redemptions
- Activate/deactivate offers

**7. Exchange Management**
- View exchange requests
- Approve or reject exchanges
- View customer and order details
- Process exchanges
- Track exchange history

**8. Pre-Booking Management**
- View pre-booking requests
- Fulfill requests when available
- Notify customers
- Track fulfillment status

**9. Reports & Analytics**
- Sales report (revenue, orders, items sold)
- Appointment report (bookings, completions, cancellations)
- Customer growth report (new registrations, active users)
- Loyalty program report (points issued, tier distribution)
- Export to PDF/Excel

**10. Notification Management**
- Send broadcast notifications
- Target specific user groups (customers, doctors, all)
- View sent notifications
- Track delivery status

**11. Chat Support**
- View all chat rooms
- Respond to customer queries
- Filter by chat type
- View message history

**12. Audit & Security**
- View audit logs (admin only)
- Track user actions
- Monitor system activity
- Review security events

---

## 9. SECURITY IMPLEMENTATION

### **Password Security**

**Hashing:**
- **Algorithm:** bcrypt
- **Salt Rounds:** 10
- **Storage:** `password_hash` in users table

**Password Requirements:**
```javascript
{
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true
}
```

**Password History:**
- Last 5 passwords tracked in `password_history` table
- Prevents password reuse
- Enforced on password reset

### **JWT Token Security**

**Access Token:**
- **Expiry:** 15 minutes
- **Algorithm:** HS256 (HMAC with SHA-256)
- **Secret:** Environment variable `JWT_ACCESS_SECRET`
- **Storage:** React state (memory only)
- **Transmission:** Authorization header (`Bearer <token>`)

**Refresh Token:**
- **Expiry:** 7 days
- **Algorithm:** HS256
- **Secret:** Environment variable `JWT_REFRESH_SECRET`
- **Storage:** localStorage (client), `refresh_tokens` table (server)
- **Rotation:** Optional on each use
- **Revocation:** On logout, password reset

### **OTP Security**

**Generation:**
- Cryptographically secure random 6-digit code
- Function: `crypto.randomInt(100000, 999999)`

**Storage:**
- `otp_verifications` table
- Associated with email and type

**Expiration:**
- 10-minute validity
- Enforced by `expires_at` timestamp

**One-Time Use:**
- `is_used` flag set to true after verification
- Cannot be reused

**Rate Limiting:**
- Max 3 OTP resend requests per email
- Time-based cooldown between resends

### **Email Security**

**Nodemailer Configuration:**
```javascript
{
  service: 'gmail', // or custom SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // App-specific password
  },
  secure: true, // TLS
  port: 587
}
```

**Email Templates:**
- HTML templates for OTP emails
- Professional styling
- No sensitive data exposure

### **API Security**

**CORS Configuration:**
```javascript
{
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

**Rate Limiting:**
```javascript
{
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window per IP
  message: 'Too many requests'
}
```

**Helmet.js:**
- Sets security-related HTTP headers
- XSS protection
- Content Security Policy
- Hide X-Powered-By header
- Prevent clickjacking

**Input Validation:**
- **Frontend:** Zod schemas
- **Backend:** Express-validator or Zod
- Sanitize user inputs
- Prevent SQL injection (parameterized queries)
- Prevent XSS attacks

**SQL Injection Prevention:**
- Use parameterized queries (mysql2 prepared statements)
- Never concatenate user input into queries
- Example:
  ```javascript
  // SAFE
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  
  // UNSAFE (never do this)
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
  ```

### **Session Management**

**Active Sessions:**
- Tracked via `refresh_tokens` table
- Multiple devices supported (one refresh token per device)
- Revoke on logout or password reset

**Session Timeout:**
- Access token: 15 minutes
- Refresh token: 7 days
- Automatic re-authentication required after refresh token expiry

### **File Upload Security**

**File Type Validation:**
- Only allow image types (jpg, jpeg, png, gif, webp)
- MIME type checking
- File extension verification

**File Size Limits:**
- Max 5MB per file
- Enforced by multer middleware

**Storage:**
- Files stored in `backend/uploads/` directory
- Organized by type (pets, products, profiles)
- Unique filename generation (UUID + timestamp)

**Access Control:**
- Public access to uploaded images (served via Express static)
- No direct file system access

### **Audit Logging**

**Logged Actions:**
- User registration, login, logout
- Password changes
- Role changes (admin only)
- Critical data modifications
- Failed authentication attempts

**Audit Log Fields:**
```sql
{
  user_id,
  action_type,
  entity_type,
  entity_id,
  description,
  ip_address,
  user_agent,
  created_at
}
```

**Retention:**
- Permanent storage (or configurable retention period)
- Admin-only access

### **Environment Variables**

**Security Best Practices:**
- Never commit `.env` files to version control
- Use `.gitignore` to exclude `.env`
- Use strong, unique secrets for production
- Rotate secrets periodically
- Use different credentials for dev/staging/production

**Required Environment Variables:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secure_password
DB_NAME=mypetcare_db

# JWT
JWT_ACCESS_SECRET=strong_random_secret_32_chars_or_more
JWT_REFRESH_SECRET=different_strong_secret_32_chars_or_more

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## 10. SYSTEM INTEGRATION

### **Frontend-Backend Communication**

**Axios Instance Configuration:**
```javascript
// services/api.js
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Request Interceptor:**
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor:**
```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/auth/refresh-token', { refreshToken });
      
      // Update token and retry
      const { accessToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);
```

### **Service Layer Pattern**

**Example: petService.js**
```javascript
import api from './api';

export const petService = {
  getAllPets: (filters) => api.get('/pets', { params: filters }),
  getPetById: (id) => api.get(`/pets/${id}`),
  createPet: (data) => api.post('/pets', data),
  updatePet: (id, data) => api.put(`/pets/${id}`, data),
  deletePet: (id) => api.delete(`/pets/${id}`)
};
```

**Usage in Components:**
```javascript
import { petService } from '../services/petService';

const PetListing = () => {
  const [pets, setPets] = useState([]);
  
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await petService.getAllPets({ available: true });
        setPets(response.data.data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
    
    fetchPets();
  }, []);
  
  return (/* JSX */);
};
```

### **Backend Route Structure**

**Example: petRoutes.js**
```javascript
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
} from '../controllers/petController.js';

const router = express.Router();

// Public routes
router.get('/', getAllPets);
router.get('/:id', getPetById);

// Protected routes
router.post('/', authenticate, requireRole('staff', 'admin'), createPet);
router.put('/:id', authenticate, requireRole('staff', 'admin'), updatePet);
router.delete('/:id', authenticate, requireRole('staff', 'admin'), deletePet);

export default router;
```

### **Error Handling**

**Backend Error Response:**
```javascript
// Standardized error response
res.status(400).json({
  success: false,
  message: 'Validation error',
  errors: [
    { field: 'email', message: 'Email is required' },
    { field: 'password', message: 'Password must be at least 8 characters' }
  ]
});
```

**Frontend Error Display:**
```javascript
try {
  await petService.createPet(data);
  toast.success('Pet created successfully');
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
}
```

### **Real-Time Features**

**Chat Message Polling:**
```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await chatService.getMessages(roomId);
    setMessages(response.data.data);
  }, 2000); // Poll every 2 seconds
  
  return () => clearInterval(interval);
}, [roomId]);
```

**Notification Polling:**
```javascript
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await notificationService.getUnread();
    setUnreadCount(response.data.count);
  }, 5000); // Poll every 5 seconds
  
  return () => clearInterval(interval);
}, []);
```

### **File Upload Integration**

**Frontend:**
```javascript
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await api.post('/pets/123/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('Image uploaded:', response.data.data.image_url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

**Backend (Multer):**
```javascript
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pets/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

router.post('/pets/:id/images', authenticate, requireRole('staff', 'admin'), upload.single('image'), uploadPetImage);
```

### **State Management**

**Context Providers:**
```javascript
// App.jsx
<AuthProvider>
  <CartProvider>
    <NotificationProvider>
      <AppRoutes />
    </NotificationProvider>
  </CartProvider>
</AuthProvider>
```

**Using Contexts:**
```javascript
// In any component
const { user, isAuthenticated, logout } = useAuth();
const { cartItems, addToCart, removeFromCart } = useCart();
const { unreadCount, notifications } = useNotification();
```

---

## 📊 SYSTEM SUMMARY

### **Statistics**

- **Total Tables:** 30
- **Total API Endpoints:** 120+
- **Total Frontend Pages:** 48+
- **User Roles:** 4 (Customer, Doctor, Staff, Admin)
- **Authentication Methods:** JWT (Access + Refresh Tokens)
- **Payment Methods:** 3 (Card, Bank Transfer, Cash on Delivery)
- **Notification Types:** 7 (Order, Appointment, Pre-Booking, Offer, Loyalty, Reminder, System)
- **Offer Types:** 3 (Percentage, Fixed Amount, Loyalty Points)
- **Order Statuses:** 6 (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled)
- **Appointment Statuses:** 5 (Pending, Accepted, Rejected, Completed, Cancelled)
- **Loyalty Tiers:** 4 (Bronze, Silver, Gold, Platinum)

### **Technology Summary**

**Frontend:**
- React.js 18+ with Vite
- Tailwind CSS for styling
- React Router DOM for routing
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js with Express.js
- MySQL database
- JWT authentication
- bcrypt password hashing
- Nodemailer email service

**Security:**
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing and history
- OTP email verification
- Rate limiting
- CORS protection
- Helmet.js security headers
- Input validation and sanitization

---

## 🎯 CONCLUSION

**My Pet Care+** is a comprehensive, production-ready pet care management system with:

✅ **Complete Authentication System** - Registration, OTP verification, login, password reset
✅ **Role-Based Access Control** - 4 user roles with distinct permissions
✅ **30 Database Tables** - Covering all aspects of the system
✅ **120+ API Endpoints** - RESTful architecture
✅ **48+ Frontend Pages** - Role-specific dashboards and features
✅ **Real-Time Features** - Chat and notifications
✅ **Security Best Practices** - JWT, bcrypt, OTP, rate limiting
✅ **Loyalty Program** - Points and tier system
✅ **Appointment Booking** - Doctor scheduling and management
✅ **E-Commerce Features** - Shopping cart, orders, payments
✅ **Health Records** - Pet medical history tracking
✅ **Admin Management** - Complete system control and analytics

The system is designed for a final year Software Development Project (SDP) with enterprise-level architecture, security, and scalability considerations.

---

**Document Created:** 2026-02-04
**Last Updated:** 2026-02-04
**Version:** 1.0

