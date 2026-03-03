# 🐾 MY PET CARE+ - SYSTEM ARCHITECTURE DIAGRAMS

## 📋 TABLE OF CONTENTS
1. [System Overview Diagram](#1-system-overview-diagram)
2. [Database Schema Diagram](#2-database-schema-diagram)
3. [Authentication Flow Diagram](#3-authentication-flow-diagram)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [API Request Flow](#6-api-request-flow)
7. [User Role Hierarchy](#7-user-role-hierarchy)
8. [Feature Flow Diagrams](#8-feature-flow-diagrams)

---

## 1. SYSTEM OVERVIEW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MY PET CARE+ SYSTEM                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐                                        ┌──────────────┐
│   CLIENT     │                                        │   SERVER     │
│  (Browser)   │                                        │  (Backend)   │
├──────────────┤                                        ├──────────────┤
│              │                                        │              │
│  React.js    │◄────────── HTTPS/REST API ──────────►│  Express.js  │
│  Vite        │         (Port 5173 → 5000)           │  Node.js     │
│  Tailwind    │                                        │              │
│              │                                        │      ▼       │
│  Components  │                                        │  ┌────────┐  │
│  ├─ Public   │                                        │  │Middleware│
│  ├─ Customer │                                        │  │  Auth   │  │
│  ├─ Doctor   │                                        │  │  RBAC   │  │
│  └─ Admin    │                                        │  │ Logger  │  │
│              │                                        │  └────────┘  │
│  Context API │                                        │      ▼       │
│  ├─ Auth     │                                        │ Controllers  │
│  ├─ Cart     │                                        │      ▼       │
│  └─ Notify   │                                        │  Services    │
│              │                                        │      ▼       │
└──────────────┘                                        │  ┌────────┐  │
                                                        │  │Database│  │
                                                        │  │ MySQL  │  │
                                                        │  │30 Tables│ │
                                                        │  └────────┘  │
                                                        │      ▲       │
┌──────────────┐                                        │      │       │
│ EMAIL SERVICE│◄───────────────────────────────────────┤  Nodemailer │
│   (SMTP)     │         OTP & Notifications            │              │
└──────────────┘                                        └──────────────┘
```

---

## 2. DATABASE SCHEMA DIAGRAM

### **Entity Relationship Overview**

```
┌──────────────────────────────────────────────────────────────────────┐
│                     DATABASE: mypetcare_db                           │
│                     30 Tables | InnoDB | utf8mb4                     │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│    USERS    │ (Core Authentication)
│─────────────│
│ user_id (PK)│◄──────────┬──────────┬──────────┬─────────────┐
│ email       │           │          │          │             │
│ password    │           │          │          │             │
│ role (ENUM) │           │          │          │             │
│ is_verified │           │          │          │             │
└─────────────┘           │          │          │             │
                          │          │          │             │
        ┌─────────────────┼──────────┼──────────┼─────────────┤
        │                 │          │          │             │
        ▼                 ▼          ▼          ▼             ▼
┌─────────────┐  ┌─────────────┐  ┌────────┐  ┌─────────┐  ┌──────────┐
│  CUSTOMERS  │  │   DOCTORS   │  │ STAFF  │  │REFRESH_ │  │PASSWORD_ │
│─────────────│  │─────────────│  │────────│  │TOKENS   │  │HISTORY   │
│customer_id  │  │ doctor_id   │  │staff_id│  │token_id │  │history_id│
│user_id (FK) │  │ user_id(FK) │  │user_id │  │user_id  │  │user_id   │
│loyalty_pts  │  │specialty    │  │position│  │token    │  │password  │
│loyalty_tier │  │consult_fee  │  └────────┘  │expires  │  └──────────┘
└─────────────┘  │rating       │              └─────────┘
       │         └─────────────┘
       │                │
       │                │
       ├────────────────┼──────────────────────────────────┐
       │                │                                  │
       ▼                ▼                                  ▼
┌─────────────┐  ┌──────────────┐                ┌──────────────┐
│   ORDERS    │  │APPOINTMENTS  │                │CUSTOMER_PETS │
│─────────────│  │──────────────│                │──────────────│
│ order_id    │  │appointment_id│                │cust_pet_id   │
│customer_id  │  │customer_id   │                │customer_id   │
│total_amount │  │doctor_id     │                │name, species │
│status       │  │cust_pet_id   │                │breed, age    │
│payment      │  │app_date/time │                └──────────────┘
└─────────────┘  │status        │                       │
       │         │consult_fee   │                       │
       │         └──────────────┘                       │
       │                │                               │
       ▼                ▼                               ▼
┌─────────────┐  ┌──────────────┐                ┌──────────────┐
│ORDER_ITEMS  │  │HEALTH_RECORDS│                │VACCINATIONS  │
│─────────────│  │──────────────│                │FEEDING_SCHED │
│item_id      │  │record_id     │                └──────────────┘
│order_id(FK) │  │appointment_id│
│item_type    │  │cust_pet_id   │
│item_id      │  │doctor_id     │
│quantity     │  │diagnosis     │
│price        │  │prescription  │
└─────────────┘  └──────────────┘


┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│    PETS     │  │  PRODUCTS   │  │    CARTS    │  │PRE_BOOKINGS │
│─────────────│  │─────────────│  │─────────────│  │─────────────│
│ pet_id (PK) │  │product_id   │  │ cart_id     │  │prebooking_id│
│ name        │  │ name        │  │customer_id  │  │customer_id  │
│ species     │  │ category    │  │item_type    │  │item_type    │
│ breed       │  │ price       │  │item_id      │  │item_id      │
│ age, price  │  │ stock_qty   │  │quantity     │  │quantity     │
│ stock_qty   │  │ is_available│  └─────────────┘  │status       │
│ is_available│  └─────────────┘                   └─────────────┘
└─────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ CHAT_ROOMS   │  │CHAT_MESSAGES │  │ FEEDBACK     │
│──────────────│  │──────────────│  │──────────────│
│ room_id      │◄─┤ message_id   │  │ feedback_id  │
│ room_type    │  │ room_id (FK) │  │ customer_id  │
│ customer_id  │  │ sender_id    │  │ feedback_type│
│ staff/doctor │  │ message_text │  │ rating (1-5) │
│ is_active    │  │ is_read      │  │ comment      │
└──────────────┘  └──────────────┘  │ status       │
                                    │ admin_reply  │
┌──────────────┐  ┌──────────────┐  └──────────────┘
│   OFFERS     │  │NOTIFICATIONS │
│──────────────│  │──────────────│  ┌──────────────┐
│ offer_id     │  │notification  │  │  REMINDERS   │
│ title        │  │ user_id      │  │──────────────│
│ discount_type│  │ type         │  │ reminder_id  │
│ discount_val │  │ title,message│  │ customer_id  │
│ valid_from   │  │ is_read      │  │ type         │
│ valid_until  │  │ created_at   │  │ reminder_date│
│ is_active    │  └──────────────┘  │ is_completed │
└──────────────┘                    └──────────────┘

┌──────────────┐  ┌──────────────┐
│EXCHANGE_REQ  │  │ AUDIT_LOGS   │
│──────────────│  │──────────────│
│ exchange_id  │  │ log_id       │
│ customer_id  │  │ user_id      │
│ order_id     │  │ action_type  │
│ pet_id       │  │ entity_type  │
│ reason       │  │ entity_id    │
│ status       │  │ ip_address   │
│ approved_by  │  │ created_at   │
└──────────────┘  └──────────────┘

LEGEND:
─────  One-to-Many Relationship
◄────  Foreign Key Reference
(PK)   Primary Key
(FK)   Foreign Key
```

---

## 3. AUTHENTICATION FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  1. REGISTER │
└──────────────┘
      │
      ▼
[User submits form]
firstName, lastName, email, phone, password, role
      │
      ▼
[Backend validates & hashes password]
      │
      ▼
[Create user in DB: is_verified = false]
      │
      ▼
[Generate 6-digit OTP]
      │
      ▼
[Store OTP in otp_verifications table]
expires_at = NOW() + 10 minutes
      │
      ▼
[Send OTP via Nodemailer]
      │
      ▼
┌──────────────┐
│ 2. VERIFY OTP│
└──────────────┘
      │
      ▼
[User enters OTP code]
      │
      ▼
[Backend checks OTP]
├─ OTP exists?
├─ Not expired?
└─ Not used?
      │
      ▼ (Valid)
[Mark OTP as used]
[Update user: is_verified = true]
      │
      ▼
┌──────────────┐
│   3. LOGIN   │
└──────────────┘
      │
      ▼
[User enters email & password]
      │
      ▼
[Backend validates]
├─ User exists?
├─ Email verified?
├─ Account active?
└─ Password correct? (bcrypt.compare)
      │
      ▼ (Valid)
[Generate JWT Access Token]
└─ Payload: { userId, email, role }
└─ Expiry: 15 minutes
      │
      ▼
[Generate JWT Refresh Token]
└─ Payload: { userId, tokenId }
└─ Expiry: 7 days
      │
      ▼
[Store refresh token in DB]
      │
      ▼
[Return tokens + user data to frontend]
      │
      ▼
[Frontend stores:]
├─ accessToken → React state (memory)
├─ refreshToken → localStorage
└─ user → localStorage
      │
      ▼
[Redirect based on role]
├─ customer → /customer/dashboard
├─ doctor → /doctor/dashboard
└─ admin/staff → /admin/dashboard


┌──────────────────────┐
│ 4. TOKEN REFRESH     │
└──────────────────────┘
      │
[API request made]
      │
      ▼
[Access token expired? (401)]
      │
      ▼ (Yes)
[Axios interceptor catches 401]
      │
      ▼
[Call /api/auth/refresh-token]
with refreshToken
      │
      ▼
[Backend validates refresh token]
├─ Token exists in DB?
├─ Not revoked?
└─ Not expired?
      │
      ▼ (Valid)
[Generate new access token]
      │
      ▼
[Return new token]
      │
      ▼
[Update token in frontend]
      │
      ▼
[Retry original API request]
      │
      ▼
[Success!]


┌──────────────────────┐
│ 5. PASSWORD RESET    │
└──────────────────────┘
      │
      ▼
[User requests password reset]
      │
      ▼
[Backend generates OTP]
[OTP type: password_reset]
[Send OTP via email]
      │
      ▼
[User enters OTP + new password]
      │
      ▼
[Backend validates]
├─ OTP valid?
├─ Password strong enough?
└─ Not in password history?
      │
      ▼ (Valid)
[Hash new password]
[Update user password]
[Add old password to history]
[Revoke ALL refresh tokens]
      │
      ▼
[User must login again]


┌──────────────────────┐
│ 6. LOGOUT            │
└──────────────────────┘
      │
      ▼
[User clicks logout]
      │
      ▼
[Frontend calls /api/auth/logout]
      │
      ▼
[Backend revokes refresh token]
is_revoked = true
      │
      ▼
[Frontend clears:]
├─ accessToken
├─ refreshToken
└─ user data
      │
      ▼
[Redirect to home/login]
```

---

## 4. FRONTEND ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                   FRONTEND STRUCTURE (React.js)                     │
└─────────────────────────────────────────────────────────────────────┘

frontend/
│
├── src/
│   │
│   ├── assets/                      # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │
│   ├── components/                  # Reusable components
│   │   │
│   │   ├── common/                  # Shared UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── Pagination.jsx
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Navbar.jsx           # Top navigation
│   │   │   ├── Sidebar.jsx          # Side navigation
│   │   │   ├── Footer.jsx           # Page footer
│   │   │   └── Layout.jsx           # Page wrapper
│   │   │
│   │   ├── admin/                   # Admin-specific
│   │   │   ├── StatsCard.jsx
│   │   │   └── DataTable.jsx
│   │   │
│   │   ├── customer/                # Customer-specific
│   │   │   ├── PetCard.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── OrderCard.jsx
│   │   │   └── AppointmentCard.jsx
│   │   │
│   │   └── doctor/                  # Doctor-specific
│   │       ├── ScheduleSlot.jsx
│   │       └── AppointmentCard.jsx
│   │
│   ├── pages/                       # Page components (48+ pages)
│   │   │
│   │   ├── public/ (9 pages)
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── OTPVerification.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── PetListing.jsx
│   │   │   ├── ProductListing.jsx
│   │   │   └── DoctorList.jsx
│   │   │
│   │   ├── customer/ (20+ pages)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PetListing.jsx
│   │   │   ├── PetDetails.jsx
│   │   │   ├── ProductListing.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── DoctorList.jsx
│   │   │   ├── DoctorDetails.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── PetProfiles.jsx
│   │   │   ├── PetProfileForm.jsx
│   │   │   ├── HealthRecords.jsx
│   │   │   ├── ExchangeRequests.jsx
│   │   │   ├── PreBookings.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Offers.jsx
│   │   │   └── Reminders.jsx
│   │   │
│   │   ├── doctor/ (7 pages)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProfileManagement.jsx
│   │   │   ├── ScheduleManagement.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── AppointmentDetails.jsx
│   │   │   ├── HealthRecords.jsx
│   │   │   └── Chat.jsx
│   │   │
│   │   └── admin/ (12 pages)
│   │       ├── Dashboard.jsx
│   │       ├── UserManagement.jsx
│   │       ├── PetManagement.jsx
│   │       ├── ProductManagement.jsx
│   │       ├── OrderManagement.jsx
│   │       ├── FeedbackModeration.jsx
│   │       ├── OfferManagement.jsx
│   │       ├── ExchangeManagement.jsx
│   │       ├── PreBookingManagement.jsx
│   │       ├── NotificationManagement.jsx
│   │       ├── Reports.jsx
│   │       └── Chat.jsx
│   │
│   ├── context/                     # React Context API
│   │   ├── AuthContext.jsx          # Authentication state
│   │   ├── CartContext.jsx          # Shopping cart state
│   │   └── NotificationContext.jsx  # Notification state
│   │
│   ├── hooks/                       # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useLocalStorage.js
│   │   └── useDebounce.js
│   │
│   ├── services/                    # API service layer
│   │   ├── api.js                   # Axios instance & interceptors
│   │   ├── authService.js
│   │   ├── petService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   ├── appointmentService.js
│   │   ├── chatService.js
│   │   ├── notificationService.js
│   │   └── ... (all API services)
│   │
│   ├── routes/                      # Route configuration
│   │   ├── AppRoutes.jsx            # Main route setup
│   │   ├── PublicRoutes.jsx
│   │   ├── CustomerRoutes.jsx
│   │   ├── DoctorRoutes.jsx
│   │   └── AdminRoutes.jsx
│   │
│   ├── utils/                       # Utilities
│   │   ├── validators.js            # Zod schemas
│   │   ├── helpers.js               # Utility functions
│   │   ├── constants.js             # Constants
│   │   └── formatters.js            # Date, currency formatters
│   │
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Tailwind imports
│
├── public/
│   └── images/
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json


┌─────────────────────────────────────────────────────────────────────┐
│                      CONTEXT PROVIDER TREE                          │
└─────────────────────────────────────────────────────────────────────┘

<React.StrictMode>
  <AuthProvider>                     ▲ Provides: user, login, logout
    <CartProvider>                   ▲ Provides: cart items, add/remove
      <NotificationProvider>         ▲ Provides: notifications, unread count
        <BrowserRouter>
          <AppRoutes />              ▲ Route configuration
        </BrowserRouter>
      </NotificationProvider>
    </CartProvider>
  </AuthProvider>
</React.StrictMode>
```

---

## 5. BACKEND ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                  BACKEND STRUCTURE (Node.js/Express)                │
└─────────────────────────────────────────────────────────────────────┘

backend/
│
├── config/                          # Configuration files
│   ├── database.js                  # MySQL connection pool
│   ├── jwt.js                       # JWT token config
│   └── nodemailer.js                # Email service config
│
├── middleware/                      # Express middleware
│   ├── auth.js                      # JWT authentication
│   ├── rbac.js                      # Role-based access control
│   ├── errorHandler.js              # Global error handler
│   └── logger.js                    # Request logging
│
├── controllers/                     # Request handlers (12 files)
│   ├── authController.js            # Auth endpoints
│   ├── adminController.js           # Admin endpoints
│   ├── petController.js             # Pet CRUD
│   ├── productController.js         # Product CRUD
│   ├── orderController.js           # Order management
│   ├── appointmentController.js     # Appointments
│   ├── chatController.js            # Chat system
│   ├── feedbackController.js        # Feedback
│   ├── notificationController.js    # Notifications
│   ├── offerController.js           # Offers
│   ├── exchangeController.js        # Exchanges
│   └── preBookingController.js      # Pre-bookings
│
├── routes/                          # Route definitions (14 files)
│   ├── authRoutes.js                # POST /api/auth/*
│   ├── adminRoutes.js               # GET/PUT /api/admin/*
│   ├── petRoutes.js                 # CRUD /api/pets/*
│   ├── productRoutes.js             # CRUD /api/products/*
│   ├── orderRoutes.js               # /api/orders/*
│   ├── cartRoutes.js                # /api/cart/*
│   ├── appointmentRoutes.js         # /api/appointments/*
│   ├── doctorRoutes.js              # /api/doctors/*
│   ├── chatRoutes.js                # /api/chat/*
│   ├── feedbackRoutes.js            # /api/feedback/*
│   ├── notificationRoutes.js        # /api/notifications/*
│   ├── offerRoutes.js               # /api/offers/*
│   ├── exchangeRoutes.js            # /api/exchanges/*
│   └── preBookingRoutes.js          # /api/pre-bookings/*
│
├── services/                        # Business logic
│   ├── authService.js               # Authentication logic
│   ├── otpService.js                # OTP generation & validation
│   ├── emailService.js              # Email sending (Nodemailer)
│   ├── jwtService.js                # Token generation & verification
│   └── passwordService.js           # Password hashing & validation
│
├── utils/                           # Utilities
│   ├── validators.js                # Validation helpers
│   ├── helpers.js                   # Utility functions
│   └── constants.js                 # System constants
│
├── uploads/                         # File storage
│   ├── pets/
│   ├── products/
│   ├── profiles/
│   └── misc/
│
├── .env                             # Environment variables (not in git)
├── .gitignore
├── package.json
└── server.js                        # Application entry point


┌─────────────────────────────────────────────────────────────────────┐
│                     MIDDLEWARE EXECUTION ORDER                      │
└─────────────────────────────────────────────────────────────────────┘

[Incoming Request]
        │
        ▼
1. helmet()                          # Security headers
        │
        ▼
2. cors()                            # CORS handling
        │
        ▼
3. express.json()                    # Parse JSON body
        │
        ▼
4. express.urlencoded()              # Parse URL-encoded
        │
        ▼
5. compression()                     # Compress responses
        │
        ▼
6. requestLogger                     # Log request
        │
        ▼
7. rateLimit (if production)        # Rate limiting
        │
        ▼
┌──────────────────────────┐
│   ROUTE HANDLER          │
│   /api/[resource]/*      │
└──────────────────────────┘
        │
        ▼
8. authenticate (if protected)       # Verify JWT
        │
        ▼
9. requireRole (if role-specific)    # Check user role
        │
        ▼
10. Controller function              # Business logic
        │
        ▼
11. Response sent OR error thrown
        │
        ▼
12. errorHandler (if error)          # Format error response
        │
        ▼
[Response to Client]
```

---

## 6. API REQUEST FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                     API REQUEST LIFECYCLE                           │
└─────────────────────────────────────────────────────────────────────┘

EXAMPLE: Customer adding item to cart

┌─────────────┐                                         ┌──────────────┐
│  FRONTEND   │                                         │   BACKEND    │
│   (React)   │                                         │  (Express)   │
└─────────────┘                                         └──────────────┘
      │
      │ User clicks "Add to Cart"
      │
      ▼
[cartService.addToCart({ item_type, item_id, quantity })]
      │
      ▼
[Axios request interceptor]
├─ Add Authorization header
│  Authorization: Bearer <access_token>
└─ Set Content-Type: application/json
      │
      ▼
POST /api/cart/add
Body: { item_type: "pet", item_id: 123, quantity: 1 }
      │
      │─────────────────────────────────────────►
      │                                          │
      │                                          ▼
      │                                   [Server receives]
      │                                          │
      │                                          ▼
      │                                   [Middleware chain]
      │                                   ├─ helmet
      │                                   ├─ cors
      │                                   ├─ json parser
      │                                   ├─ logger
      │                                   └─ rate limiter
      │                                          │
      │                                          ▼
      │                                   [Route: POST /cart/add]
      │                                          │
      │                                          ▼
      │                                   [authenticate middleware]
      │                                   ├─ Extract token from header
      │                                   ├─ Verify JWT signature
      │                                   ├─ Check expiration
      │                                   └─ Attach user to req.user
      │                                          │
      │                                          ▼
      │                                   [requireRole('customer')]
      │                                   ├─ Check req.user.role === 'customer'
      │                                   └─ If not, return 403 Forbidden
      │                                          │
      │                                          ▼
      │                                   [cartController.addToCart]
      │                                   ├─ Validate request body
      │                                   ├─ Get customer_id from req.user
      │                                   ├─ Check if item exists
      │                                   ├─ Check stock availability
      │                                   ├─ Insert into carts table
      │                                   └─ Return success response
      │                                          │
      │◄─────────────────────────────────────────┘
      │
      ▼
[Response received]
{
  success: true,
  message: "Item added to cart",
  data: {
    cart_id: 456,
    item_type: "pet",
    item_id: 123,
    quantity: 1
  }
}
      │
      ▼
[Axios response interceptor]
└─ Check status code
      │
      ▼
[Update UI]
├─ Show success toast
├─ Update cart count in navbar
└─ Optionally refetch cart items


┌─────────────────────────────────────────────────────────────────────┐
│                   ERROR HANDLING FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

SCENARIO: Access token expired

[API Request]
      │
      ▼
[Backend returns 401 Unauthorized]
      │
      ▼
[Axios response interceptor catches error]
      │
      ▼
[Check if error.response.status === 401]
      │
      ▼ (Yes)
[originalRequest._retry = true]
      │
      ▼
[Get refreshToken from localStorage]
      │
      ▼
[POST /api/auth/refresh-token { refreshToken }]
      │
      ▼
[Backend validates refresh token]
├─ Token exists in DB?
├─ Not revoked?
└─ Not expired?
      │
      ▼ (Valid)
[Generate new access token]
      │
      ▼
[Return new token]
      │
      ▼
[Update token in localStorage]
      │
      ▼
[Update Authorization header in original request]
      │
      ▼
[Retry original request with new token]
      │
      ▼
[Success!]


If refresh token fails:
      │
      ▼
[Clear all tokens]
      │
      ▼
[Redirect to /login]
```

---

## 7. USER ROLE HIERARCHY

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ROLE HIERARCHY                               │
└─────────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │    ADMIN     │ (Highest Privilege)
                    │──────────────│
                    │ Full Access  │
                    │ User Mgmt    │
                    │ Role Changes │
                    │ Audit Logs   │
                    │ All Features │
                    └──────┬───────┘
                           │
                           │ Inherits all from
                           ▼
                    ┌──────────────┐
                    │    STAFF     │ (Admin-Lite)
                    │──────────────│
                    │ Inventory    │
                    │ Orders       │
                    │ Moderation   │
                    │ Reports      │
                    │ Broadcasts   │
                    └──────┬───────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      ┌──────────────┐           ┌──────────────┐
      │   DOCTOR     │           │   CUSTOMER   │
      │──────────────│           │──────────────│
      │ Appointments │           │ Shopping     │
      │ Health Rec.  │           │ Orders       │
      │ Schedule     │           │ Appointments │
      │ Consultation │           │ Pet Profiles │
      │ Chat         │           │ Chat         │
      └──────────────┘           └──────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                     PERMISSION MATRIX                               │
└─────────────────────────────────────────────────────────────────────┘

Feature                  │ Customer │ Doctor │ Staff │ Admin
─────────────────────────┼──────────┼────────┼───────┼───────
Browse Pets/Products     │    ✅    │   ✅   │  ✅   │  ✅
Add to Cart              │    ✅    │   ❌   │  ❌   │  ❌
Place Orders             │    ✅    │   ❌   │  ❌   │  ❌
Book Appointments        │    ✅    │   ❌   │  ❌   │  ❌
Manage Pet Profiles      │    ✅    │   ❌   │  ❌   │  ❌
View Health Records      │ ✅ (own) │✅ (pts)│  ❌   │  ✅
Create Health Records    │    ❌    │   ✅   │  ❌   │  ❌
Manage Schedule          │    ❌    │   ✅   │  ❌   │  ✅
Accept/Reject Appts      │    ❌    │   ✅   │  ❌   │  ✅
Chat                     │    ✅    │   ✅   │  ✅   │  ✅
Submit Feedback          │    ✅    │   ❌   │  ❌   │  ❌
Moderate Feedback        │    ❌    │   ❌   │  ✅   │  ✅
Create Pets/Products     │    ❌    │   ❌   │  ✅   │  ✅
Manage Inventory         │    ❌    │   ❌   │  ✅   │  ✅
Process Orders           │    ❌    │   ❌   │  ✅   │  ✅
Approve Exchanges        │    ❌    │   ❌   │  ✅   │  ✅
Fulfill Pre-Bookings     │    ❌    │   ❌   │  ✅   │  ✅
Create Offers            │    ❌    │   ❌   │  ✅   │  ✅
View Reports             │    ❌    │   ❌   │  ✅   │  ✅
Manage Users             │    ❌    │   ❌   │  ❌   │  ✅
Change User Roles        │    ❌    │   ❌   │  ❌   │  ✅
View Audit Logs          │    ❌    │   ❌   │  ❌   │  ✅
Broadcast Notifications  │    ❌    │   ❌   │  ✅   │  ✅
```

---

## 8. FEATURE FLOW DIAGRAMS

### **A. Order Placement Flow**

```
┌──────────────────────────────────────────────────────────────────┐
│                    ORDER PLACEMENT FLOW                          │
└──────────────────────────────────────────────────────────────────┘

[Customer browses pets/products]
              │
              ▼
      [Clicks "Add to Cart"]
              │
              ▼
   [Item added to carts table]
   ├─ customer_id
   ├─ item_type (pet/product)
   ├─ item_id
   └─ quantity
              │
              ▼
[Customer views cart]
              │
              ▼
[Adjusts quantities if needed]
              │
              ▼
  [Clicks "Proceed to Checkout"]
              │
              ▼
   [Checkout page displays:]
   ├─ Cart items summary
   ├─ Subtotal
   ├─ Available offers
   └─ Loyalty points option
              │
              ▼
[Customer fills shipping address]
              │
              ▼
[Selects payment method]
├─ Card
├─ Bank Transfer
└─ Cash on Delivery
              │
              ▼
   [Optionally applies offer]
              │
              ▼
[Optionally redeems loyalty points]
              │
              ▼
      [Clicks "Place Order"]
              │
              ▼
   [Backend creates order]
   ├─ Generate order_number
   ├─ Calculate totals
   ├─ Create order record
   ├─ Create order_items records
   ├─ Clear cart
   ├─ Update stock quantities
   ├─ Calculate loyalty points earned
   └─ Send notification
              │
              ▼
[Order Status: Pending]
              │
              ▼
[Staff processes order]
              │
              ▼
[Status: Confirmed → Processing → Shipped → Delivered]
```

### **B. Appointment Booking Flow**

```
┌──────────────────────────────────────────────────────────────────┐
│                  APPOINTMENT BOOKING FLOW                        │
└──────────────────────────────────────────────────────────────────┘

[Customer views doctor list]
              │
              ▼
  [Filters by specialization]
              │
              ▼
    [Selects a doctor]
              │
              ▼
  [Views doctor profile & schedule]
              │
              ▼
[Clicks "Book Appointment"]
              │
              ▼
 [Booking form displays]
 ├─ Doctor (pre-selected)
 ├─ Select pet from profiles
 ├─ Select date
 └─ Select available time slot
              │
              ▼
  [Customer fills form]
              │
              ▼
  [Clicks "Book"]
              │
              ▼
[Backend creates appointment]
├─ Generate appointment_number
├─ Status: Pending
├─ Consultation fee copied from doctor
└─ Send notification to doctor
              │
              ▼
[Doctor views appointment request]
              │
              ├─ Accept ────►[Status: Accepted]
              │                     │
              │                     ▼
              │           [Notification to customer]
              │                     │
              │                     ▼
              │            [Appointment scheduled]
              │                     │
              │                     ▼
              │          [Doctor sees appointment]
              │                     │
              │                     ▼
              │        [Appointment takes place]
              │                     │
              │                     ▼
              │        [Doctor adds consultation notes]
              │                     │
              │                     ▼
              │       [Doctor creates health record]
              │                     │
              │                     ▼
              │         [Status: Completed]
              │
              └─ Reject ────►[Status: Rejected]
                              │
                              ▼
                    [Notification to customer]
```

### **C. Loyalty Points Flow**

```
┌──────────────────────────────────────────────────────────────────┐
│                    LOYALTY POINTS FLOW                           │
└──────────────────────────────────────────────────────────────────┘

[Customer places order]
              │
              ▼
[Order total: Rs. 10,000]
              │
              ▼
  [Backend calculates points]
  └─ 1% of order total = 100 points
              │
              ▼
[Update customers table]
├─ loyalty_points += 100
└─ total_spent += 10,000
              │
              ▼
  [Check tier upgrade]
  ├─ Bronze: Rs. 0 - 9,999
  ├─ Silver: Rs. 10,000 - 49,999
  ├─ Gold: Rs. 50,000 - 99,999
  └─ Platinum: Rs. 100,000+
              │
              ▼
[Update loyalty_tier if needed]
              │
              ▼
[Send tier upgrade notification]
              │
              ▼
[Customer can redeem points]
├─ 100 points = Rs. 100 discount
└─ Applies during checkout
              │
              ▼
[Points deducted on order placement]
```

---

**Document Version:** 1.0
**Last Updated:** 2026-02-04

