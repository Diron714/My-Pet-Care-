# STEP 04: Backend Architecture (Node.js + Express.js)

## 📋 Overview

This document outlines the complete backend architecture for **My Pet Care+**. The backend is built using Node.js and Express.js, following RESTful API principles with proper middleware, authentication, and error handling.

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # MySQL connection configuration
│   ├── jwt.js               # JWT configuration
│   └── nodemailer.js        # Email service configuration
├── controllers/
│   ├── authController.js
│   ├── customerController.js
│   ├── doctorController.js
│   ├── adminController.js
│   ├── petController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── appointmentController.js
│   ├── chatController.js
│   ├── feedbackController.js
│   ├── notificationController.js
│   ├── offerController.js
│   └── reminderController.js
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── rbac.js              # Role-based access control
│   ├── validation.js        # Request validation
│   ├── errorHandler.js      # Global error handler
│   └── logger.js            # Request logging
├── models/
│   ├── User.js
│   ├── Customer.js
│   ├── Doctor.js
│   ├── Staff.js
│   ├── Pet.js
│   ├── Product.js
│   ├── Order.js
│   ├── Appointment.js
│   ├── Chat.js
│   └── ... (all other models)
├── routes/
│   ├── authRoutes.js
│   ├── customerRoutes.js
│   ├── doctorRoutes.js
│   ├── adminRoutes.js
│   ├── petRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── appointmentRoutes.js
│   ├── chatRoutes.js
│   ├── feedbackRoutes.js
│   ├── notificationRoutes.js
│   ├── offerRoutes.js
│   └── reminderRoutes.js
├── services/
│   ├── authService.js       # Authentication logic
│   ├── otpService.js        # OTP generation & verification
│   ├── emailService.js      # Email sending (Nodemailer)
│   ├── jwtService.js        # JWT token management
│   ├── passwordService.js  # Password hashing & validation
│   ├── loyaltyService.js    # Loyalty points calculation
│   ├── paymentService.js    # Payment processing (mock)
│   └── fileUploadService.js # Image upload handling
├── utils/
│   ├── validators.js        # Validation helpers
│   ├── helpers.js           # Utility functions
│   ├── constants.js         # System constants
│   └── errors.js            # Custom error classes
├── database/
│   ├── schema.sql           # Database schema
│   └── seeds.sql            # Initial data (optional)
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── server.js                # Application entry point
```

## 🔧 Configuration Files

### 1. `config/database.js`
**Purpose:** MySQL database connection using connection pooling

```javascript
// MySQL connection with connection pooling
// Handles connection errors and retries
// Exports connection pool for use in models
```

**Key Features:**
- Connection pooling for performance
- Environment-based configuration
- Error handling and reconnection logic

### 2. `config/jwt.js`
**Purpose:** JWT token configuration

```javascript
// Access token secret & expiry (15 minutes)
// Refresh token secret & expiry (7 days)
// Token generation and verification functions
```

**Key Features:**
- Separate access and refresh token secrets
- Configurable expiry times
- Token signing and verification

### 3. `config/nodemailer.js`
**Purpose:** Email service configuration for OTP and notifications

```javascript
// SMTP configuration
// Email templates for OTP, password reset, notifications
// Email sending functions
```

**Key Features:**
- SMTP configuration (Gmail/SendGrid/etc.)
- HTML email templates
- OTP email formatting

## 🛡️ Middleware

### 1. `middleware/auth.js`
**Purpose:** JWT authentication middleware

**Functions:**
- `authenticateToken(req, res, next)` - Verify JWT access token
- `authenticateRefreshToken(req, res, next)` - Verify refresh token
- `optionalAuth(req, res, next)` - Optional authentication for public routes

**Usage:**
- Protects routes requiring authentication
- Attaches user info to `req.user`

### 2. `middleware/rbac.js`
**Purpose:** Role-based access control

**Functions:**
- `requireRole(...roles)` - Middleware factory for role checking
- `requireCustomer()` - Customer-only access
- `requireDoctor()` - Doctor-only access
- `requireStaff()` - Staff/Admin-only access

**Usage:**
- Ensures only authorized roles access specific routes
- Returns 403 Forbidden for unauthorized access

### 3. `middleware/validation.js`
**Purpose:** Request validation using Zod schemas

**Functions:**
- `validate(schema)` - Middleware factory for request validation
- Validates body, query, and params

**Usage:**
- Validates all incoming requests
- Returns 400 Bad Request for invalid data

### 4. `middleware/errorHandler.js`
**Purpose:** Global error handling

**Features:**
- Catches all errors
- Formats error responses
- Logs errors
- Returns appropriate HTTP status codes

### 5. `middleware/logger.js`
**Purpose:** Request logging and audit trails

**Features:**
- Logs all API requests
- Tracks user actions
- Stores in audit_logs table

## 📦 Models

Each model corresponds to a database table and provides:
- Database queries (CRUD operations)
- Data validation
- Relationship handling

### Key Models:

1. **User Model** - User authentication and profile
2. **Customer Model** - Customer-specific data and loyalty
3. **Doctor Model** - Doctor profiles and schedules
4. **Pet Model** - Pet inventory management
5. **Product Model** - Product inventory management
6. **Order Model** - Order processing
7. **Appointment Model** - Appointment management
8. **Chat Model** - Chat room and message handling
9. **Notification Model** - Notification management
10. **Feedback Model** - Feedback and ratings

## 🛣️ API Routes

### Base URL: `http://localhost:5000/api`

### 1. Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | User registration | Public |
| POST | `/verify-otp` | Verify OTP for email | Public |
| POST | `/resend-otp` | Resend OTP | Public |
| POST | `/login` | User login | Public |
| POST | `/refresh-token` | Refresh access token | Public |
| POST | `/logout` | User logout | Authenticated |
| POST | `/forgot-password` | Request password reset | Public |
| POST | `/reset-password` | Reset password with OTP | Public |
| GET | `/me` | Get current user | Authenticated |

### 2. Customer Routes (`/api/customers`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard` | Customer dashboard data | Customer |
| GET | `/profile` | Get customer profile | Customer |
| PUT | `/profile` | Update customer profile | Customer |
| GET | `/loyalty` | Get loyalty points & tier | Customer |
| GET | `/stats` | Get customer statistics | Customer |

### 3. Pet Routes (`/api/pets`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all pets (with filters) | Public |
| GET | `/:id` | Get pet details | Public |
| POST | `/` | Add new pet | Staff/Admin |
| PUT | `/:id` | Update pet | Staff/Admin |
| DELETE | `/:id` | Delete pet | Staff/Admin |
| POST | `/:id/images` | Upload pet images | Staff/Admin |
| GET | `/filters` | Get filter options | Public |

**Query Parameters:**
- `species`, `breed`, `minPrice`, `maxPrice`, `available`, `page`, `limit`

### 4. Product Routes (`/api/products`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all products (with filters) | Public |
| GET | `/:id` | Get product details | Public |
| POST | `/` | Add new product | Staff/Admin |
| PUT | `/:id` | Update product | Staff/Admin |
| DELETE | `/:id` | Delete product | Staff/Admin |
| POST | `/:id/images` | Upload product images | Staff/Admin |
| GET | `/categories` | Get product categories | Public |

### 5. Cart Routes (`/api/cart`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get cart items | Customer |
| POST | `/add` | Add item to cart | Customer |
| PUT | `/:cartId` | Update cart item quantity | Customer |
| DELETE | `/:cartId` | Remove item from cart | Customer |
| DELETE | `/clear` | Clear entire cart | Customer |

### 6. Order Routes (`/api/orders`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get orders (customer: own orders, admin: all) | Authenticated |
| GET | `/:id` | Get order details | Authenticated |
| POST | `/create` | Create order from cart | Customer |
| PUT | `/:id/status` | Update order status | Staff/Admin |
| PUT | `/:id/payment` | Update payment status | Staff/Admin |
| POST | `/:id/cancel` | Cancel order | Customer/Staff |
| GET | `/:id/invoice` | Download invoice | Customer/Staff |
| GET | `/stats` | Order statistics | Staff/Admin |

### 7. Pre-Booking Routes (`/api/pre-bookings`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get pre-booking requests | Customer/Staff |
| POST | `/` | Create pre-booking request | Customer |
| PUT | `/:id/fulfill` | Fulfill pre-booking | Staff/Admin |
| DELETE | `/:id` | Cancel pre-booking | Customer |

### 8. Appointment Routes (`/api/appointments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get appointments | Customer/Doctor/Staff |
| GET | `/:id` | Get appointment details | Authenticated |
| POST | `/` | Book appointment | Customer |
| PUT | `/:id/accept` | Accept appointment | Doctor |
| PUT | `/:id/reject` | Reject appointment | Doctor |
| PUT | `/:id/complete` | Mark completed | Doctor |
| POST | `/:id/notes` | Add doctor notes | Doctor |
| POST | `/:id/cancel` | Cancel appointment | Customer/Doctor |

### 9. Doctor Routes (`/api/doctors`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all doctors | Public |
| GET | `/:id` | Get doctor details | Public |
| GET | `/:id/schedule` | Get doctor schedule | Public |
| GET | `/:id/available-slots` | Get available slots | Public |
| PUT | `/profile` | Update doctor profile | Doctor |
| POST | `/schedule` | Add schedule slot | Doctor |
| PUT | `/schedule/:id` | Update schedule slot | Doctor |
| DELETE | `/schedule/:id` | Delete schedule slot | Doctor |
| GET | `/dashboard` | Doctor dashboard | Doctor |

### 10. Pet Profile Routes (`/api/customer-pets`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get customer's pets | Customer |
| GET | `/:id` | Get pet details | Customer |
| POST | `/` | Create pet profile | Customer |
| PUT | `/:id` | Update pet profile | Customer |
| DELETE | `/:id` | Delete pet profile | Customer |
| GET | `/:id/vaccinations` | Get vaccination records | Customer |
| POST | `/:id/vaccinations` | Add vaccination record | Customer |
| GET | `/:id/feeding-schedules` | Get feeding schedules | Customer |
| POST | `/:id/feeding-schedules` | Add feeding schedule | Customer |

### 11. Health Record Routes (`/api/health-records`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get health records | Customer/Doctor |
| GET | `/:id` | Get record details | Customer/Doctor |
| POST | `/` | Create health record | Doctor |
| PUT | `/:id` | Update health record | Doctor |
| GET | `/pet/:petId` | Get records for pet | Customer/Doctor |
| GET | `/:id/download` | Download record PDF | Customer/Doctor |

### 12. Exchange Request Routes (`/api/exchanges`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get exchange requests | Customer/Staff |
| POST | `/` | Submit exchange request | Customer |
| PUT | `/:id/approve` | Approve exchange | Staff/Admin |
| PUT | `/:id/reject` | Reject exchange | Staff/Admin |
| DELETE | `/:id` | Cancel exchange request | Customer |

### 13. Chat Routes (`/api/chat`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/rooms` | Get chat rooms | Authenticated |
| GET | `/rooms/:id` | Get room details | Authenticated |
| POST | `/rooms` | Create chat room | Authenticated |
| GET | `/rooms/:id/messages` | Get messages | Authenticated |
| POST | `/rooms/:id/messages` | Send message | Authenticated |
| PUT | `/messages/:id/read` | Mark message as read | Authenticated |
| GET | `/unread-count` | Get unread message count | Authenticated |

### 14. Feedback Routes (`/api/feedback`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get feedback (with filters) | Authenticated |
| POST | `/` | Submit feedback | Customer |
| GET | `/:id` | Get feedback details | Authenticated |
| PUT | `/:id/status` | Update feedback status | Staff/Admin |
| POST | `/:id/response` | Add admin response | Staff/Admin |
| GET | `/stats` | Feedback statistics | Staff/Admin |

### 15. Notification Routes (`/api/notifications`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get notifications | Authenticated |
| GET | `/unread` | Get unread notifications | Authenticated |
| PUT | `/:id/read` | Mark as read | Authenticated |
| PUT | `/read-all` | Mark all as read | Authenticated |
| DELETE | `/:id` | Delete notification | Authenticated |
| POST | `/broadcast` | Send broadcast notification | Staff/Admin |

### 16. Offer Routes (`/api/offers`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get available offers | Public/Customer |
| GET | `/:id` | Get offer details | Public |
| POST | `/` | Create offer | Staff/Admin |
| PUT | `/:id` | Update offer | Staff/Admin |
| DELETE | `/:id` | Delete offer | Staff/Admin |
| GET | `/redemptions` | Get offer redemptions | Staff/Admin |

### 17. Reminder Routes (`/api/reminders`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get reminders | Customer |
| GET | `/:id` | Get reminder details | Customer |
| POST | `/` | Create reminder | Customer |
| PUT | `/:id` | Update reminder | Customer |
| DELETE | `/:id` | Delete reminder | Customer |
| PUT | `/:id/complete` | Mark as completed | Customer |
| GET | `/upcoming` | Get upcoming reminders | Customer |

### 18. Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard` | Admin dashboard stats | Staff/Admin |
| GET | `/users` | List all users | Staff/Admin |
| PUT | `/users/:id/status` | Activate/deactivate user | Staff/Admin |
| PUT | `/users/:id/role` | Change user role | Admin |
| GET | `/reports/sales` | Sales reports | Staff/Admin |
| GET | `/reports/appointments` | Appointment reports | Staff/Admin |
| GET | `/reports/customers` | Customer growth reports | Staff/Admin |
| GET | `/reports/loyalty` | Loyalty program reports | Staff/Admin |
| GET | `/audit-logs` | View audit logs | Admin |

## 🔐 Services

### 1. `services/authService.js`
- User registration logic
- Login validation
- Token generation
- Password reset flow

### 2. `services/otpService.js`
- Generate 6-digit OTP
- Store OTP with expiry (5-10 minutes)
- Verify OTP
- Cleanup expired OTPs

### 3. `services/emailService.js`
- Send OTP emails
- Send password reset emails
- Send notification emails
- HTML email templates

### 4. `services/jwtService.js`
- Generate access tokens
- Generate refresh tokens
- Verify tokens
- Token refresh logic

### 5. `services/passwordService.js`
- Hash passwords (bcrypt)
- Verify passwords
- Check password strength
- Validate password history

### 6. `services/loyaltyService.js`
- Calculate loyalty points
- Update loyalty tier
- Apply loyalty discounts
- Track point redemptions

### 7. `services/paymentService.js`
- Process payments (mock implementation)
- Generate transaction references
- Update payment status
- Handle refunds

### 8. `services/fileUploadService.js`
- Handle image uploads
- Validate file types
- Resize images
- Store in file system or cloud

## 🚀 Server Entry Point

### `server.js`

**Key Features:**
- Express app initialization
- Middleware setup (CORS, body-parser, etc.)
- Route registration
- Error handling
- Server startup on port 5000

**Structure:**
```javascript
// Import dependencies
// Initialize Express app
// Configure middleware
// Register routes
// Error handling middleware
// Start server
```

## 📝 Environment Variables (`.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mypetcare_db

# JWT
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@mypetcare.com

# OTP
OTP_EXPIRY_MINUTES=10

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## ✅ Implementation Checklist

### Phase 1: Setup
- [ ] Initialize Node.js project
- [ ] Install dependencies
- [ ] Setup database connection
- [ ] Configure environment variables
- [ ] Setup folder structure

### Phase 2: Authentication
- [ ] User registration with OTP
- [ ] OTP verification service
- [ ] Login with JWT
- [ ] Refresh token mechanism
- [ ] Password reset flow
- [ ] RBAC middleware

### Phase 3: Core Features
- [ ] Pet management APIs
- [ ] Product management APIs
- [ ] Cart functionality
- [ ] Order processing
- [ ] Payment handling

### Phase 4: Advanced Features
- [ ] Appointment system
- [ ] Chat system
- [ ] Notification system
- [ ] Feedback system
- [ ] Loyalty program
- [ ] Reminder system

### Phase 5: Admin Features
- [ ] Admin dashboard APIs
- [ ] User management
- [ ] Reports and analytics
- [ ] Offer management

### Phase 6: Testing & Validation
- [ ] API endpoint testing
- [ ] Error handling validation
- [ ] Security validation
- [ ] Performance testing

---

**Next Step:** [STEP 05: System Integration](./STEP-05-SYSTEM-INTEGRATION.md)

