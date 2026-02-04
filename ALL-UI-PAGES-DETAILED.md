# 📋 Complete UI Pages Documentation - My Pet Care+

## Overview
This document provides a comprehensive list of all UI pages in the My Pet Care+ application, organized by user role and access level.

**Total Pages: 50**

---

## 🔓 PUBLIC PAGES (Unauthenticated Access)

### 1. **Login** (`/login`)
- **File:** `frontend/src/pages/public/Login.jsx`
- **Route:** `/login`
- **Access:** Public (redirects to dashboard if authenticated)
- **Features:**
  - Email and password login form
  - Form validation using Zod schema
  - "Remember me" checkbox
  - "Forgot password?" link
  - Link to registration page
  - Role-based redirect after login (customer/doctor/admin)
  - Error handling with toast notifications
  - Network error detection and helpful messages
- **UI:** Centered form, no navbar/footer

### 2. **Register** (`/register`)
- **File:** `frontend/src/pages/public/Register.jsx`
- **Route:** `/register`
- **Access:** Public (redirects to dashboard if authenticated)
- **Features:**
  - User registration form
  - Role selection (customer/doctor)
  - Form validation
  - Email verification requirement
  - Link to login page
- **UI:** Centered form, no navbar/footer

### 3. **OTP Verification** (`/otp-verification`)
- **File:** `frontend/src/pages/public/OTPVerification.jsx`
- **Route:** `/otp-verification`
- **Access:** Public (redirects to dashboard if authenticated)
- **Features:**
  - 6-digit OTP input form
  - Email verification after registration
  - Resend OTP functionality
  - Timer countdown for resend
- **UI:** Centered form, no navbar/footer

### 4. **Forgot Password** (`/forgot-password`)
- **File:** `frontend/src/pages/public/ForgotPassword.jsx`
- **Route:** `/forgot-password`
- **Access:** Public
- **Features:**
  - Email input for password reset
  - OTP sent to email
  - Link to login page
- **UI:** Centered form, no navbar/footer

### 5. **Reset Password** (`/reset-password`)
- **File:** `frontend/src/pages/public/ResetPassword.jsx`
- **Route:** `/reset-password`
- **Access:** Public (requires token)
- **Features:**
  - New password input
  - Confirm password validation
  - Password strength requirements
  - Link to login page
- **UI:** Centered form, no navbar/footer

### 6. **Home** (`/`)
- **File:** `frontend/src/pages/public/Home.jsx`
- **Route:** `/` (redirects to `/login` if not authenticated)
- **Access:** Public (currently redirects to login)
- **Status:** ⚠️ Currently disabled (redirects to login)

### 7. **Pet Listing (Public)** (`/pets`)
- **File:** `frontend/src/pages/public/PetListing.jsx`
- **Route:** `/pets` (currently disabled)
- **Access:** Public
- **Status:** ⚠️ Currently disabled

### 8. **Product Listing (Public)** (`/products`)
- **File:** `frontend/src/pages/public/ProductListing.jsx`
- **Route:** `/products` (currently disabled)
- **Access:** Public
- **Status:** ⚠️ Currently disabled

### 9. **Doctor List (Public)** (`/doctors`)
- **File:** `frontend/src/pages/public/DoctorList.jsx`
- **Route:** `/doctors` (currently disabled)
- **Access:** Public
- **Status:** ⚠️ Currently disabled

---

## 👤 CUSTOMER PAGES (Authenticated - Customer Role)

### 10. **Customer Dashboard** (`/customer/dashboard`)
- **File:** `frontend/src/pages/customer/Dashboard.jsx`
- **Route:** `/customer/dashboard`
- **Access:** Customer only
- **Features:**
  - Summary cards: Active Orders, Upcoming Appointments, Loyalty Points, Notifications
  - Quick action buttons (Browse Pets, Products, Doctors, Orders, Book Appointment, My Pets, Chat, Feedback, Reminders)
  - Recent orders list (last 3)
  - Upcoming appointments list (last 3)
  - Links to detailed views
- **API Endpoints:**
  - `GET /customers/dashboard`
  - `GET /orders?limit=3`
  - `GET /appointments?limit=3`

### 11. **Pet Listing** (`/customer/pets`)
- **File:** `frontend/src/pages/customer/PetListing.jsx`
- **Route:** `/customer/pets`
- **Access:** Customer only
- **Features:**
  - Browse available pets for adoption/purchase
  - Search and filter functionality
  - Pet cards with images
  - View pet details
  - Add to favorites

### 12. **Pet Details** (`/customer/pets/:id`)
- **File:** `frontend/src/pages/customer/PetDetails.jsx`
- **Route:** `/customer/pets/:id`
- **Access:** Customer only
- **Features:**
  - Detailed pet information
  - Image gallery
  - Pet specifications
  - Adoption/purchase options
  - Related pets suggestions

### 13. **Product Listing** (`/customer/products`)
- **File:** `frontend/src/pages/customer/ProductListing.jsx`
- **Route:** `/customer/products`
- **Access:** Customer only
- **Features:**
  - Browse products (food, accessories, etc.)
  - Search and filter
  - Category filtering
  - Price range filtering
  - Sort options
  - Product cards with images

### 14. **Product Details** (`/customer/products/:id`)
- **File:** `frontend/src/pages/customer/ProductDetails.jsx`
- **Route:** `/customer/products/:id`
- **Access:** Customer only
- **Features:**
  - Product details and specifications
  - Image gallery
  - Reviews and ratings
  - Add to cart functionality
  - Quantity selector
  - Related products

### 15. **Shopping Cart** (`/customer/cart`)
- **File:** `frontend/src/pages/customer/Cart.jsx`
- **Route:** `/customer/cart`
- **Access:** Customer only
- **Features:**
  - View cart items
  - Update quantities (+/- buttons)
  - Remove items
  - Order summary (subtotal, discount, total)
  - Continue shopping button
  - Proceed to checkout button
  - Empty cart state
- **API Endpoints:**
  - `GET /cart`
  - `PUT /cart/:cartId`
  - `DELETE /cart/:cartId`

### 16. **Checkout** (`/customer/checkout`)
- **File:** `frontend/src/pages/customer/Checkout.jsx`
- **Route:** `/customer/checkout`
- **Access:** Customer only
- **Features:**
  - Order review
  - Shipping address form
  - Payment method selection
  - Order summary
  - Place order button
  - Apply discount codes

### 17. **Orders** (`/customer/orders`)
- **File:** `frontend/src/pages/customer/Orders.jsx`
- **Route:** `/customer/orders`
- **Access:** Customer only
- **Features:**
  - List of all customer orders
  - Order status tracking
  - Filter by status
  - Order date and amount
  - View order details link
  - Cancel order (if pending)

### 18. **Order Details** (`/customer/orders/:id`)
- **File:** `frontend/src/pages/customer/OrderDetails.jsx`
- **Route:** `/customer/orders/:id`
- **Access:** Customer only
- **Features:**
  - Complete order information
  - Order items list
  - Shipping details
  - Payment information
  - Order status timeline
  - Tracking information (if shipped)
  - Download invoice

### 19. **Doctor List** (`/customer/doctors`)
- **File:** `frontend/src/pages/customer/DoctorList.jsx`
- **Route:** `/customer/doctors`
- **Access:** Customer only
- **Features:**
  - Browse available doctors
  - Search by name/specialization
  - Filter by specialization
  - Doctor cards with ratings
  - View doctor profile
  - Book appointment button

### 20. **Doctor Details** (`/customer/doctors/:id`)
- **File:** `frontend/src/pages/customer/DoctorDetails.jsx`
- **Route:** `/customer/doctors/:id`
- **Access:** Customer only
- **Features:**
  - Doctor profile information
  - Specializations
  - Education and experience
  - Availability schedule
  - Reviews and ratings
  - Book appointment button
  - Consultation fee

### 21. **Appointments** (`/customer/appointments`)
- **File:** `frontend/src/pages/customer/Appointments.jsx`
- **Route:** `/customer/appointments`
- **Access:** Customer only
- **Features:**
  - List of all appointments
  - Filter by status (All, Pending, Accepted, Completed, Cancelled)
  - Appointment details (doctor, pet, date, time, fee)
  - View details button
  - Cancel appointment (if pending)
  - Book new appointment button
- **API Endpoints:**
  - `GET /appointments?status={filter}`
  - `POST /appointments/:id/cancel`

### 22. **Book Appointment** (`/customer/appointments/book`)
- **File:** `frontend/src/pages/customer/BookAppointment.jsx`
- **Route:** `/customer/appointments/book`
- **Access:** Customer only
- **Features:**
  - Select doctor
  - Select pet
  - Choose date and time
  - Select appointment type
  - Add notes/reason
  - Consultation fee display
  - Submit appointment request

### 23. **Pet Profiles** (`/customer/pet-profiles`)
- **File:** `frontend/src/pages/customer/PetProfiles.jsx`
- **Route:** `/customer/pet-profiles`
- **Access:** Customer only
- **Features:**
  - List of customer's pet profiles
  - Pet cards with images
  - View, Edit, Delete buttons
  - Pet details modal
  - Add new pet button
  - Empty state message
- **API Endpoints:**
  - `GET /customer-pets`
  - `GET /customer-pets/:id`
  - `DELETE /customer-pets/:id`

### 24. **Pet Profile Form** (`/customer/pet-profiles/new`, `/customer/pet-profiles/:id/edit`)
- **File:** `frontend/src/pages/customer/PetProfileForm.jsx`
- **Route:** `/customer/pet-profiles/new` (create) or `/customer/pet-profiles/:id/edit` (edit)
- **Access:** Customer only
- **Features:**
  - Pet name, species, breed
  - Age, gender, weight
  - Photo upload
  - Medical history
  - Vaccination records
  - Feeding schedule
  - Save/Cancel buttons

### 25. **Health Records** (`/customer/health-records`)
- **File:** `frontend/src/pages/customer/HealthRecords.jsx`
- **Route:** `/customer/health-records`
- **Access:** Customer only
- **Features:**
  - View pet health records
  - Filter by pet
  - Appointment history
  - Vaccination records
  - Medical reports
  - Download reports

### 26. **Exchange Requests** (`/customer/exchanges`)
- **File:** `frontend/src/pages/customer/ExchangeRequests.jsx`
- **Route:** `/customer/exchanges`
- **Access:** Customer only
- **Features:**
  - List of exchange requests
  - Create new exchange request
  - Exchange status tracking
  - View exchange details
  - Cancel exchange (if pending)

### 27. **Pre-Bookings** (`/customer/pre-bookings`)
- **File:** `frontend/src/pages/customer/PreBookings.jsx`
- **Route:** `/customer/pre-bookings`
- **Access:** Customer only
- **Features:**
  - List of pre-booked items
  - Pre-booking status
  - Payment information
  - Convert to order option

### 28. **Chat** (`/customer/chat`)
- **File:** `frontend/src/pages/customer/Chat.jsx`
- **Route:** `/customer/chat`
- **Access:** Customer only
- **Features:**
  - Real-time chat with doctors
  - Chat history
  - File attachments
  - Emoji support
  - Unread message indicators

### 29. **Feedback** (`/customer/feedback`)
- **File:** `frontend/src/pages/customer/Feedback.jsx`
- **Route:** `/customer/feedback`
- **Access:** Customer only
- **Features:**
  - Submit feedback form
  - Rate services/products
  - Write reviews
  - View submitted feedback
  - Edit/Delete feedback

### 30. **Notifications** (`/customer/notifications`)
- **File:** `frontend/src/pages/customer/Notifications.jsx`
- **Route:** `/customer/notifications`
- **Access:** Customer only
- **Features:**
  - List of notifications
  - Mark as read/unread
  - Mark all as read
  - Delete notifications
  - Filter by type
  - Unread count badge

### 31. **Offers** (`/customer/offers`)
- **File:** `frontend/src/pages/customer/Offers.jsx`
- **Route:** `/customer/offers`
- **Access:** Customer only
- **Features:**
  - View available offers/discounts
  - Apply offers to cart
  - Offer expiration dates
  - Terms and conditions

### 32. **Reminders** (`/customer/reminders`)
- **File:** `frontend/src/pages/customer/Reminders.jsx`
- **Route:** `/customer/reminders`
- **Access:** Customer only
- **Features:**
  - Pet care reminders
  - Vaccination reminders
  - Appointment reminders
  - Medication reminders
  - Create/edit/delete reminders
  - Notification settings

---

## 👨‍⚕️ DOCTOR PAGES (Authenticated - Doctor Role)

### 33. **Doctor Dashboard** (`/doctor/dashboard`)
- **File:** `frontend/src/pages/doctor/Dashboard.jsx`
- **Route:** `/doctor/dashboard`
- **Access:** Doctor only
- **Features:**
  - Summary cards: Today's Appointments, Pending Requests, Completed This Week, Unread Messages
  - Quick actions (Manage Profile, View Schedule, Manage Appointments, Health Records, Chat)
  - Today's appointments list
  - Links to detailed views
- **API Endpoints:**
  - `GET /doctors/dashboard`
  - `GET /appointments?date=today`

### 34. **Profile Management** (`/doctor/profile`)
- **File:** `frontend/src/pages/doctor/ProfileManagement.jsx`
- **Route:** `/doctor/profile`
- **Access:** Doctor only
- **Features:**
  - Edit profile information
  - Update specialization
  - Upload profile photo
  - Education and experience
  - Consultation fees
  - Availability settings
  - Save changes

### 35. **Schedule Management** (`/doctor/schedule`)
- **File:** `frontend/src/pages/doctor/ScheduleManagement.jsx`
- **Route:** `/doctor/schedule`
- **Access:** Doctor only
- **Features:**
  - View/edit weekly schedule
  - Set available time slots
  - Block unavailable dates
  - Break time settings
  - Save schedule

### 36. **Appointments** (`/doctor/appointments`)
- **File:** `frontend/src/pages/doctor/Appointments.jsx`
- **Route:** `/doctor/appointments`
- **Access:** Doctor only
- **Features:**
  - List of all appointments
  - Filter by status (All, Pending, Accepted, Completed, Cancelled)
  - Appointment details (customer, pet, date, time, fee)
  - Accept/Reject buttons (for pending)
  - Mark Complete button (for accepted)
  - View details button
- **API Endpoints:**
  - `GET /appointments?status={filter}`
  - `PUT /appointments/:id/accept`
  - `PUT /appointments/:id/reject`
  - `PUT /appointments/:id/complete`

### 37. **Appointment Details** (`/doctor/appointments/:id`)
- **File:** `frontend/src/pages/doctor/AppointmentDetails.jsx`
- **Route:** `/doctor/appointments/:id`
- **Access:** Doctor only
- **Features:**
  - Complete appointment information
  - Customer and pet details
  - Appointment notes
  - Health records access
  - Accept/Reject/Complete actions
  - Add consultation notes

### 38. **Health Records** (`/doctor/health-records`)
- **File:** `frontend/src/pages/doctor/HealthRecords.jsx`
- **Route:** `/doctor/health-records`
- **Access:** Doctor only
- **Features:**
  - View patient health records
  - Filter by customer/pet
  - Add/edit health records
  - Upload medical reports
  - Vaccination history
  - Prescription management

### 39. **Chat** (`/doctor/chat`)
- **File:** `frontend/src/pages/doctor/Chat.jsx`
- **Route:** `/doctor/chat`
- **Access:** Doctor only
- **Features:**
  - Real-time chat with customers
  - Chat history
  - File attachments
  - Emoji support
  - Unread message indicators
  - Multiple conversation management

---

## 👨‍💼 ADMIN PAGES (Authenticated - Admin/Staff Role)

### 40. **Admin Dashboard** (`/admin/dashboard`)
- **File:** `frontend/src/pages/admin/Dashboard.jsx`
- **Route:** `/admin/dashboard`
- **Access:** Admin/Staff only
- **Features:**
  - Statistics cards: Total Sales (Today/Week/Month), Total Orders, Active Customers, Pending Appointments
  - Recent orders list (last 5)
  - Recent registrations list (last 5)
  - Analytics charts placeholders (Sales Trend, Popular Pets, Appointment Trends, Customer Growth)
- **API Endpoints:**
  - `GET /admin/dashboard`
  - `GET /orders?limit=5`
  - `GET /admin/users?limit=5`

### 41. **Pet Management** (`/admin/pets`)
- **File:** `frontend/src/pages/admin/PetManagement.jsx`
- **Route:** `/admin/pets`
- **Access:** Admin/Staff only
- **Features:**
  - List of all pets
  - Add/Edit/Delete pets
  - Search and filter
  - Pet status management
  - Image upload
  - Bulk operations

### 42. **Product Management** (`/admin/products`)
- **File:** `frontend/src/pages/admin/ProductManagement.jsx`
- **Route:** `/admin/products`
- **Access:** Admin/Staff only
- **Features:**
  - List of all products
  - Add/Edit/Delete products
  - Product categories
  - Inventory management
  - Price management
  - Image upload
  - Stock tracking

### 43. **Order Management** (`/admin/orders`)
- **File:** `frontend/src/pages/admin/OrderManagement.jsx`
- **Route:** `/admin/orders`
- **Access:** Admin/Staff only
- **Features:**
  - List of all orders
  - Search orders
  - Filter by status, payment status, date range
  - Update order status
  - Update payment status
  - View order details modal
  - Order status management
- **API Endpoints:**
  - `GET /orders?{filters}`
  - `PUT /orders/:id/status`

### 44. **User Management** (`/admin/users`)
- **File:** `frontend/src/pages/admin/UserManagement.jsx`
- **Route:** `/admin/users`
- **Access:** Admin/Staff only
- **Features:**
  - List of all users
  - Search users
  - Filter by role, status, verification
  - Toggle user active/inactive status
  - Change user role
  - View user details
  - User verification status
- **API Endpoints:**
  - `GET /admin/users?{filters}`
  - `PUT /admin/users/:id/status`
  - `PUT /admin/users/:id/role`

### 45. **Exchange Management** (`/admin/exchanges`)
- **File:** `frontend/src/pages/admin/ExchangeManagement.jsx`
- **Route:** `/admin/exchanges`
- **Access:** Admin/Staff only
- **Features:**
  - List of all exchange requests
  - Approve/Reject exchanges
  - Exchange status tracking
  - View exchange details
  - Process exchanges

### 46. **Pre-Booking Management** (`/admin/pre-bookings`)
- **File:** `frontend/src/pages/admin/PreBookingManagement.jsx`
- **Route:** `/admin/pre-bookings`
- **Access:** Admin/Staff only
- **Features:**
  - List of all pre-bookings
  - Approve/Reject pre-bookings
  - Pre-booking status management
  - Convert to orders
  - View pre-booking details

### 47. **Offer Management** (`/admin/offers`)
- **File:** `frontend/src/pages/admin/OfferManagement.jsx`
- **Route:** `/admin/offers`
- **Access:** Admin/Staff only
- **Features:**
  - Create/Edit/Delete offers
  - Set discount percentages
  - Set expiration dates
  - Apply to products/categories
  - Offer status management

### 48. **Feedback Moderation** (`/admin/feedback`)
- **File:** `frontend/src/pages/admin/FeedbackModeration.jsx`
- **Route:** `/admin/feedback`
- **Access:** Admin/Staff only
- **Features:**
  - List of all feedback/reviews
  - Approve/Reject feedback
  - Edit feedback
  - Delete inappropriate feedback
  - Filter by status/rating

### 49. **Notification Management** (`/admin/notifications`)
- **File:** `frontend/src/pages/admin/NotificationManagement.jsx`
- **Route:** `/admin/notifications`
- **Access:** Admin/Staff only
- **Features:**
  - Create system notifications
  - Send notifications to users
  - View notification history
  - Notification templates
  - Bulk notifications

### 50. **Reports** (`/admin/reports`)
- **File:** `frontend/src/pages/admin/Reports.jsx`
- **Route:** `/admin/reports`
- **Access:** Admin/Staff only
- **Features:**
  - Sales reports
  - User activity reports
  - Appointment reports
  - Product performance reports
  - Export reports (PDF/Excel)
  - Date range filtering
  - Charts and graphs

---

## 📊 Page Statistics

### By Access Level:
- **Public Pages:** 9 (5 active, 4 disabled)
- **Customer Pages:** 23
- **Doctor Pages:** 7
- **Admin Pages:** 11
- **Total:** 50 pages

### By Category:
- **Authentication:** 5 pages
- **Dashboard:** 3 pages (one per role)
- **E-commerce:** 8 pages (products, cart, checkout, orders)
- **Appointments:** 5 pages
- **Pet Management:** 6 pages
- **Health Records:** 2 pages
- **Chat:** 2 pages
- **Admin Management:** 11 pages
- **Other:** 8 pages (notifications, feedback, offers, etc.)

---

## 🔐 Route Protection

All customer, doctor, and admin routes are protected by:
- **`RequireAuth`** component
- Role-based access control (RBAC)
- JWT token validation
- Automatic redirect to login if not authenticated
- Role-based redirect to appropriate dashboard

---

## 🎨 Common UI Components Used

- **Layout:** Navbar, Footer, Sidebar (role-based)
- **Loading:** Spinner component
- **EmptyState:** Empty state messages
- **Button:** Reusable button component
- **Input:** Form input fields
- **Modal:** Popup modals for details/actions
- **Toast:** Success/error notifications (react-hot-toast)

---

## 📝 Notes

1. **Public browsing pages** (Home, PetListing, ProductListing, DoctorList) are currently disabled and redirect to login
2. **Authentication pages** (Login, Register, OTP, Forgot/Reset Password) have no navbar/footer for cleaner UX
3. All pages use **Tailwind CSS** for styling
4. **API calls** use the centralized `api.js` service with interceptors
5. **Form validation** uses Zod schemas with react-hook-form
6. **State management** uses React Context (AuthContext, CartContext, NotificationContext)

---

## 🚀 Quick Navigation

### Customer Flow:
1. Login → Dashboard → Browse Products/Pets → Add to Cart → Checkout → Orders
2. Dashboard → Book Appointment → Appointments → Health Records
3. Dashboard → Pet Profiles → Add Pet → Health Records

### Doctor Flow:
1. Login → Dashboard → Appointments → Accept/Reject → Complete
2. Dashboard → Schedule Management → Set Availability
3. Dashboard → Health Records → View/Add Records

### Admin Flow:
1. Login → Dashboard → View Statistics
2. Dashboard → User Management → Manage Users
3. Dashboard → Order Management → Update Order Status
4. Dashboard → Reports → Generate Reports

---

**Last Updated:** January 2026
**Version:** 1.0.0

