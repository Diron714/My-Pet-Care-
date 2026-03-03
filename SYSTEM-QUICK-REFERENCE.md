# 🐾 MY PET CARE+ - QUICK REFERENCE GUIDE

## 📊 SYSTEM AT A GLANCE

### **Project Type**
Final Year Software Development Project (SDP-Level System)

### **System Name**
My Pet Care+ - Comprehensive Pet Care Management Platform

### **Architecture**
Full-Stack Web Application (MERN-like Stack with MySQL)

---

## 🔧 TECHNOLOGY STACK

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React.js 18 + Vite | UI Framework |
| **Styling** | Tailwind CSS | Responsive Design |
| **Routing** | React Router DOM v6 | Client-side Navigation |
| **Backend** | Node.js + Express.js | RESTful API Server |
| **Database** | MySQL 8+ | Data Storage |
| **Authentication** | JWT (Access + Refresh) | Security |
| **Password** | bcryptjs | Hashing |
| **Email** | Nodemailer | OTP & Notifications |

---

## 🌐 PORTS & URLS

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| Backend API | http://localhost:5000 | 5000 |
| MySQL Database | localhost | 3306 |

---

## 👥 USER ROLES

| Role | Access Level | Description |
|------|--------------|-------------|
| **Customer** | User | Shop, book appointments, manage pets |
| **Doctor** | Professional | Manage appointments, health records, schedule |
| **Staff** | Admin-Lite | Manage inventory, orders, requests |
| **Admin** | Super Admin | Full system control, user management, reports |

---

## 📂 DATABASE STRUCTURE

### **30 Tables Organized by Category**

**User Management (5 tables)**
- users, customers, doctors, staff, otp_verifications

**Authentication & Security (3 tables)**
- refresh_tokens, password_history, audit_logs

**Inventory (4 tables)**
- pets, pet_images, products, product_images

**Customer Pets & Care (4 tables)**
- customer_pets, pet_vaccinations, pet_feeding_schedules, health_records

**Orders & Transactions (4 tables)**
- carts, orders, order_items, pre_bookings

**Appointments & Schedules (3 tables)**
- doctor_schedules, appointments, health_records

**Communication (2 tables)**
- chat_rooms, chat_messages

**Engagement & Feedback (5 tables)**
- feedback, offers, offer_redemptions, notifications, reminders

**Returns & Exchanges (1 table)**
- exchange_requests

---

## 🎯 KEY FEATURES BY ROLE

### **CUSTOMER (20+ Features)**
✅ Browse & filter pets/products
✅ Shopping cart & checkout
✅ Order tracking & history
✅ Book veterinary appointments
✅ Manage pet profiles
✅ Track vaccinations & feeding schedules
✅ View health records
✅ Chat with support & doctors
✅ Submit feedback & reviews
✅ Loyalty points & rewards
✅ Pre-book unavailable items
✅ Request pet exchanges
✅ Custom reminders
✅ View offers & promotions

### **DOCTOR (7+ Features)**
✅ Manage profile & specialization
✅ Set weekly schedule & availability
✅ View & manage appointments
✅ Accept/reject appointment requests
✅ Create health records & prescriptions
✅ Add consultation notes
✅ Chat with patients

### **ADMIN/STAFF (12+ Features)**
✅ Dashboard with analytics
✅ Manage all users
✅ Inventory management (pets/products)
✅ Process & track orders
✅ Moderate feedback
✅ Create & manage offers
✅ Handle exchange requests
✅ Fulfill pre-bookings
✅ Send broadcast notifications
✅ Generate reports (sales, appointments, customers)
✅ Chat support
✅ View audit logs (admin only)

---

## 🔐 AUTHENTICATION FLOW

### **Registration → OTP → Login → Token Management → Logout**

**1. Register:**
- User fills form (name, email, phone, password, role)
- Backend creates user with `is_verified = false`
- 6-digit OTP sent to email
- OTP expires in 10 minutes

**2. Verify OTP:**
- User enters OTP
- Backend validates and marks user as verified
- Redirect to login

**3. Login:**
- User enters email & password
- Backend validates credentials
- Returns JWT access token (15 min) + refresh token (7 days)
- Redirect based on role

**4. Token Refresh:**
- Access token expires → Auto-refresh using refresh token
- If refresh fails → Logout & redirect to login

**5. Logout:**
- Revoke refresh token in database
- Clear tokens from frontend storage
- Redirect to home/login

**6. Password Reset:**
- Request OTP via email
- Enter OTP + new password
- Password history checked (prevent reuse)
- All refresh tokens revoked

---

## 📡 API ENDPOINTS SUMMARY

### **Total: 120+ Endpoints**

| Category | Count | Base Path | Examples |
|----------|-------|-----------|----------|
| Authentication | 9 | `/api/auth` | register, login, logout, verify-otp |
| Admin | 9 | `/api/admin` | dashboard, users, reports |
| Pets | 7 | `/api/pets` | GET, POST, PUT, DELETE |
| Products | 7 | `/api/products` | GET, POST, PUT, DELETE |
| Cart | 5 | `/api/cart` | add, update, remove, clear |
| Orders | 8 | `/api/orders` | create, list, status, cancel |
| Appointments | 8 | `/api/appointments` | book, accept, reject, complete |
| Doctors | 9 | `/api/doctors` | list, profile, schedule, slots |
| Customer Pets | 10 | `/api/customer-pets` | CRUD, vaccinations, feeding |
| Health Records | 6 | `/api/health-records` | create, list, view, download |
| Exchanges | 5 | `/api/exchanges` | submit, approve, reject |
| Pre-Bookings | 4 | `/api/pre-bookings` | create, fulfill, cancel |
| Chat | 8 | `/api/chat` | rooms, messages, unread |
| Feedback | 7 | `/api/feedback` | submit, moderate, respond |
| Notifications | 7 | `/api/notifications` | list, unread, read, broadcast |
| Offers | 6 | `/api/offers` | create, list, update, delete |
| Reminders | 7 | `/api/reminders` | CRUD, complete, upcoming |

---

## 🎨 FRONTEND PAGES

### **Total: 48+ Pages**

**PUBLIC (9 pages)**
- Home, Register, OTP Verification, Login, Forgot Password, Reset Password
- Pet Listing, Product Listing, Doctor List (read-only)

**CUSTOMER (20+ pages)**
- Dashboard, Pets, Products, Cart, Checkout, Orders
- Appointments, Doctors, Pet Profiles, Health Records
- Exchanges, Pre-Bookings, Chat, Feedback, Notifications
- Offers, Reminders

**DOCTOR (7 pages)**
- Dashboard, Profile, Schedule, Appointments, Health Records, Chat

**ADMIN (12 pages)**
- Dashboard, Users, Pets, Products, Orders, Feedback
- Offers, Exchanges, Pre-Bookings, Notifications, Reports, Chat

---

## 🔒 SECURITY FEATURES

### **Password Security**
- bcrypt hashing (10 salt rounds)
- Strength requirements (8+ chars, uppercase, lowercase, number, special)
- Password history (last 5 passwords)

### **JWT Tokens**
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry
- Token rotation on refresh (optional)
- Revocation on logout & password reset

### **OTP Security**
- 6-digit cryptographically secure random code
- 10-minute expiration
- One-time use enforcement
- Rate limiting (max 3 resends)

### **API Security**
- CORS (restricted origin)
- Rate limiting (100 requests/15 min per IP)
- Helmet.js (security headers)
- Input validation (Zod)
- SQL injection prevention (parameterized queries)
- XSS protection

### **Audit Logging**
- All critical actions logged
- User ID, action, IP, timestamp
- Admin-only access

---

## 📁 PROJECT STRUCTURE

```
My Pet Care+/
├── frontend/
│   ├── src/
│   │   ├── assets/           # Images, icons, styles
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   │   ├── public/       # 9 public pages
│   │   │   ├── customer/     # 20+ customer pages
│   │   │   ├── doctor/       # 7 doctor pages
│   │   │   └── admin/        # 12 admin pages
│   │   ├── context/          # AuthContext, CartContext, NotificationContext
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API service layer
│   │   ├── routes/           # Route configuration
│   │   └── utils/            # Utilities
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── config/               # Database, JWT, Nodemailer
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth, RBAC, Error handling
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic
│   ├── uploads/              # File storage
│   ├── server.js             # Entry point
│   └── package.json
├── database/
│   └── schema.sql            # Database schema (30 tables)
├── README.md
└── .env (NOT in repo)
```

---

## 🚀 QUICK START

### **1. Database Setup**
```bash
mysql -u root -p
CREATE DATABASE mypetcare_db;
USE mypetcare_db;
SOURCE database/schema.sql;
```

### **2. Backend Setup**
```bash
cd backend
npm install
# Create .env file with credentials
npm run dev  # Runs on port 5000
```

### **3. Frontend Setup**
```bash
cd frontend
npm install
# Create .env file with VITE_API_BASE_URL
npm run dev  # Runs on port 5173
```

### **4. Access System**
- Open browser: http://localhost:5173
- Register new account
- Verify email with OTP
- Login and explore!

---

## 💡 KEY CONCEPTS

### **Loyalty Program**
- **Tiers:** Bronze → Silver → Gold → Platinum
- **Earn Points:** On every purchase
- **Redeem Points:** For discounts on orders
- **Tier Benefits:** Higher discounts, priority support

### **Pre-Booking System**
- Request unavailable pets/products
- Get notified when back in stock
- Staff fulfills requests manually
- Customer receives notification

### **Exchange System**
- Request pet exchange within policy
- Staff reviews and approves/rejects
- Reason required from customer
- Tracked in exchange_requests table

### **Appointment Flow**
1. Customer books appointment with doctor
2. Doctor receives request
3. Doctor accepts/rejects
4. If accepted, appointment scheduled
5. Doctor adds consultation notes
6. Health record created (optional)
7. Appointment marked complete

### **Order Flow**
1. Customer adds items to cart
2. Proceeds to checkout
3. Enters shipping address
4. Selects payment method
5. Applies offers (optional)
6. Redeems loyalty points (optional)
7. Order placed (status: pending)
8. Staff updates status: confirmed → processing → shipped → delivered

---

## 📞 SUPPORT & DOCUMENTATION

### **Full Documentation Files**
- `COMPLETE-SYSTEM-ANALYSIS.md` - Detailed system documentation (69,000+ tokens)
- `STEP-01-DATABASE-DESIGN.md` - Database schema details
- `STEP-02-FRONTEND-ARCHITECTURE.md` - Frontend structure
- `STEP-03-AUTHENTICATION-FLOW.md` - Auth system details
- `STEP-04-BACKEND-ARCHITECTURE.md` - Backend structure
- `STEP-05-SYSTEM-INTEGRATION.md` - Integration guide
- `STEP-06-PACKAGE-INSTALLATION.md` - Dependencies
- `STEP-07-FINAL-VALIDATION.md` - Testing & validation
- `ADMIN-BACKEND-TESTING-GUIDE.md` - Admin testing

### **Testing Guides**
- Manual testing checklists per feature
- Postman/Thunder Client examples
- Authentication flow testing
- Role-based access testing

---

## 🎯 PROJECT STATISTICS

| Metric | Count |
|--------|-------|
| Database Tables | 30 |
| API Endpoints | 120+ |
| Frontend Pages | 48+ |
| User Roles | 4 |
| Authentication Methods | JWT (Access + Refresh) |
| Payment Methods | 3 |
| Order Statuses | 6 |
| Appointment Statuses | 5 |
| Loyalty Tiers | 4 |
| Notification Types | 7 |

---

## ✅ FEATURE COMPLETION CHECKLIST

### **Core Features**
- ✅ User Registration with OTP
- ✅ Login with JWT
- ✅ Role-Based Access Control (RBAC)
- ✅ Password Reset with OTP
- ✅ Token Refresh Mechanism
- ✅ Pet Inventory Management
- ✅ Product Inventory Management
- ✅ Shopping Cart
- ✅ Order Processing
- ✅ Appointment Booking
- ✅ Doctor Schedule Management
- ✅ Health Records
- ✅ Loyalty Program
- ✅ Offers & Promotions
- ✅ Pre-Booking System
- ✅ Exchange Requests
- ✅ Chat System
- ✅ Notifications
- ✅ Feedback & Ratings
- ✅ Custom Reminders
- ✅ Admin Dashboard
- ✅ Reports & Analytics
- ✅ Audit Logging

### **Total: 100% Complete System**

---

## 🔗 QUICK LINKS

### **Access System**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

### **Default Test Users** (If seeded)
- Admin: admin@mypetcare.com / Admin123!
- Doctor: doctor@mypetcare.com / Doctor123!
- Customer: customer@mypetcare.com / Customer123!

---

**Document Version:** 1.0
**Last Updated:** 2026-02-04
**System Status:** ✅ Production Ready

