# 🐾 ADMIN BACKEND TESTING GUIDE

## ✅ SYSTEM STATUS

| Component | Status |
|-----------|--------|
| Database (30 tables) | ✅ DONE |
| Frontend (51+ pages) | ✅ DONE |
| Authentication | ✅ DONE |
| **Admin Backend** | ✅ JUST COMPLETED |

---

## 📁 FILES CREATED

### Controllers (`backend/controllers/`)
| File | Purpose |
|------|---------|
| `adminController.js` | Dashboard stats, User management, Reports |
| `petController.js` | Pet CRUD operations |
| `productController.js` | Product CRUD operations |
| `orderController.js` | Order management |
| `feedbackController.js` | Feedback moderation |
| `offerController.js` | Offer/promotion management |
| `exchangeController.js` | Exchange request handling |
| `preBookingController.js` | Pre-booking management |
| `chatController.js` | Chat room & messaging |
| `notificationController.js` | Notifications & broadcast |

### Routes (`backend/routes/`)
| File | Base URL | Purpose |
|------|----------|---------|
| `adminRoutes.js` | `/api/admin` | Admin dashboard & users |
| `petRoutes.js` | `/api/pets` | Pet inventory |
| `productRoutes.js` | `/api/products` | Product inventory |
| `orderRoutes.js` | `/api/orders` | Order management |
| `feedbackRoutes.js` | `/api/feedback` | Feedback system |
| `offerRoutes.js` | `/api/offers` | Promotions |
| `exchangeRoutes.js` | `/api/exchanges` | Exchanges |
| `preBookingRoutes.js` | `/api/pre-bookings` | Pre-bookings |
| `chatRoutes.js` | `/api/chat` | Chat system |

---

## 🚀 HOW TO START & TEST

### Step 1: Start Backend Server

```bash
cd backend
npm start
```

Server should show: `🚀 Server running on http://localhost:5000`

### Step 2: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📋 MANUAL TESTING CHECKLIST

### 1️⃣ ADMIN DASHBOARD (`/admin/dashboard`)

**What to Check:**
- [ ] Dashboard loads without errors
- [ ] Shows Total Sales statistics
- [ ] Shows Total Orders count
- [ ] Shows Active Customers count
- [ ] Shows Pending Appointments count
- [ ] Shows Recent Orders list
- [ ] Shows Recent Registrations list

**API Endpoints Called:**
- `GET /api/admin/dashboard`
- `GET /api/orders?limit=5`
- `GET /api/admin/users?limit=5`

---

### 2️⃣ USER MANAGEMENT (`/admin/users`)

**What to Check:**
- [ ] User list loads
- [ ] Filter by Role works (Customer, Doctor, Staff, Admin)
- [ ] Filter by Status works (Active, Inactive)
- [ ] Search by name/email works
- [ ] Can toggle user Active/Inactive status
- [ ] Can change user Role

**API Endpoints Called:**
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/status`
- `PUT /api/admin/users/:id/role`

---

### 3️⃣ PET MANAGEMENT (`/admin/pets`)

**What to Check:**
- [ ] Pet list loads
- [ ] "Add New Pet" button opens form
- [ ] Can create new pet with all fields
- [ ] Can edit existing pet
- [ ] Can delete pet
- [ ] Can toggle availability
- [ ] Filter by species works
- [ ] Search works

**API Endpoints Called:**
- `GET /api/pets`
- `POST /api/pets`
- `PUT /api/pets/:id`
- `DELETE /api/pets/:id`

---

### 4️⃣ PRODUCT MANAGEMENT (`/admin/products`)

**What to Check:**
- [ ] Product list loads
- [ ] "Add New Product" button opens form
- [ ] Can create new product
- [ ] Can edit existing product
- [ ] Can delete product
- [ ] Filter by category works
- [ ] Search works

**API Endpoints Called:**
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

---

### 5️⃣ ORDER MANAGEMENT (`/admin/orders`)

**What to Check:**
- [ ] Order list loads
- [ ] Shows order number, customer, amount, status
- [ ] Filter by order status works
- [ ] Filter by payment status works
- [ ] Date range filter works
- [ ] Can update order status
- [ ] Can update payment status

**API Endpoints Called:**
- `GET /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/status`

---

### 6️⃣ FEEDBACK MODERATION (`/admin/feedback`)

**What to Check:**
- [ ] Feedback list loads
- [ ] Filter by type works (Product, Service, Doctor)
- [ ] Filter by status works (Pending, Approved, Rejected)
- [ ] Filter by rating works
- [ ] Can Approve feedback
- [ ] Can Reject feedback
- [ ] Can add Admin Response

**API Endpoints Called:**
- `GET /api/feedback`
- `PUT /api/feedback/:id/status`
- `POST /api/feedback/:id/response`

---

### 7️⃣ OFFER MANAGEMENT (`/admin/offers`)

**What to Check:**
- [ ] Offers list loads
- [ ] Shows active/expired status
- [ ] "Create Offer" button opens form
- [ ] Can create percentage discount
- [ ] Can create fixed amount discount
- [ ] Can create loyalty points multiplier
- [ ] Can edit offer
- [ ] Can delete offer

**API Endpoints Called:**
- `GET /api/offers`
- `POST /api/offers`
- `PUT /api/offers/:id`
- `DELETE /api/offers/:id`

---

### 8️⃣ EXCHANGE MANAGEMENT (`/admin/exchanges`)

**What to Check:**
- [ ] Exchange requests list loads
- [ ] Filter tabs work (All, Pending, Approved, Rejected, Completed)
- [ ] Shows customer, order, pet, reason
- [ ] Can Approve exchange request
- [ ] Can Reject exchange request

**API Endpoints Called:**
- `GET /api/exchanges`
- `PUT /api/exchanges/:id/approve`
- `PUT /api/exchanges/:id/reject`

---

### 9️⃣ PRE-BOOKING MANAGEMENT (`/admin/pre-bookings`)

**What to Check:**
- [ ] Pre-bookings list loads
- [ ] Filter tabs work (All, Pending, Fulfilled, Cancelled)
- [ ] Shows customer, item type, item name, quantity
- [ ] Can Fulfill pre-booking
- [ ] Can Notify customer

**API Endpoints Called:**
- `GET /api/pre-bookings`
- `PUT /api/pre-bookings/:id/fulfill`
- `POST /api/pre-bookings/:id/notify`

---

### 🔟 REPORTS (`/admin/reports`)

**What to Check:**
- [ ] Date range selector works
- [ ] Sales Report tab loads data
- [ ] Appointments Report tab loads data
- [ ] Customers Report tab loads data
- [ ] Loyalty Report tab loads data
- [ ] Export PDF button works (shows message)
- [ ] Export Excel button works (shows message)

**API Endpoints Called:**
- `GET /api/admin/reports/sales?from=DATE&to=DATE`
- `GET /api/admin/reports/appointments?from=DATE&to=DATE`
- `GET /api/admin/reports/customers?from=DATE&to=DATE`
- `GET /api/admin/reports/loyalty?from=DATE&to=DATE`

---

### 1️⃣1️⃣ NOTIFICATION MANAGEMENT (`/admin/notifications`)

**What to Check:**
- [ ] Sent notifications list loads
- [ ] Statistics cards show counts
- [ ] "Send Notification" button opens form
- [ ] Can select target audience (All, Customers, Doctors)
- [ ] Can select notification type
- [ ] Can enter title and message
- [ ] Notification sends successfully

**API Endpoints Called:**
- `GET /api/notifications?sent=true`
- `POST /api/notifications/broadcast`

---

### 1️⃣2️⃣ CHAT (`/admin/chat`)

**What to Check:**
- [ ] Chat rooms list loads
- [ ] Filter tabs work (All, Doctor Chats, Support Chats)
- [ ] Can select a chat room
- [ ] Messages load for selected room
- [ ] Can send a message
- [ ] Messages appear after sending

**API Endpoints Called:**
- `GET /api/chat/rooms`
- `GET /api/chat/rooms/:id/messages`
- `POST /api/chat/rooms/:id/messages`

---

## 🔧 TESTING WITH POSTMAN/THUNDER CLIENT

### Login as Admin First:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@mypetcare.com",
  "password": "Admin123!"
}
```

Copy the `accessToken` from response.

### Test Dashboard:
```
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Test Get Users:
```
GET http://localhost:5000/api/admin/users
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Test Get Pets:
```
GET http://localhost:5000/api/pets
```

### Test Create Pet (Admin):
```
POST http://localhost:5000/api/pets
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Test Dog",
  "species": "Dog",
  "breed": "Labrador",
  "age": 12,
  "gender": "male",
  "description": "A friendly test dog",
  "price": 35000,
  "stock_quantity": 2,
  "is_available": true
}
```

---

## ⚠️ COMMON ISSUES & FIXES

### Issue: "Authentication required" error
**Fix:** Make sure you're logged in as admin and sending the Authorization header.

### Issue: "Insufficient permissions" error
**Fix:** Only admin/staff can access admin routes. Check the logged-in user's role.

### Issue: Empty data displays
**Fix:** This is normal if no data exists in database. Add some test data.

### Issue: Frontend shows mock data
**Fix:** The frontend has fallback mock data. If API fails, it shows mock. Check console for API errors.

---

## 📊 API ENDPOINTS SUMMARY

| Admin Page | GET | POST | PUT | DELETE |
|------------|-----|------|-----|--------|
| Dashboard | `/api/admin/dashboard` | - | - | - |
| Users | `/api/admin/users` | - | `/api/admin/users/:id/status`, `/api/admin/users/:id/role` | - |
| Pets | `/api/pets` | `/api/pets` | `/api/pets/:id` | `/api/pets/:id` |
| Products | `/api/products` | `/api/products` | `/api/products/:id` | `/api/products/:id` |
| Orders | `/api/orders` | - | `/api/orders/:id/status` | - |
| Feedback | `/api/feedback` | - | `/api/feedback/:id/status` | - |
| Offers | `/api/offers` | `/api/offers` | `/api/offers/:id` | `/api/offers/:id` |
| Exchanges | `/api/exchanges` | - | `/api/exchanges/:id/approve`, `/api/exchanges/:id/reject` | - |
| Pre-Bookings | `/api/pre-bookings` | - | `/api/pre-bookings/:id/fulfill` | - |
| Reports | `/api/admin/reports/:type` | - | - | - |
| Notifications | `/api/notifications` | `/api/notifications/broadcast` | - | - |
| Chat | `/api/chat/rooms` | `/api/chat/rooms/:id/messages` | - | - |

---

## ✅ SUCCESS CRITERIA

Your admin backend is working correctly if:

1. ✅ All 12 admin pages load without console errors
2. ✅ API calls return data (or empty arrays if no data)
3. ✅ CRUD operations work (Create, Read, Update, Delete)
4. ✅ Status updates work (orders, feedback, exchanges)
5. ✅ Filter and search work on all pages
6. ✅ Role-based access control works (only admin can access)

---

## 🎉 CONGRATULATIONS!

Your Admin Backend is now fully implemented and connected!

**Next Steps:**
1. Test all pages manually using this guide
2. Add test data to the database
3. Verify all CRUD operations
4. Move on to Doctor and Customer backend features

