# STEP 02: Frontend Architecture (React.js + Vite)

## 📋 Overview

This document outlines the complete frontend architecture for **My Pet Care+**. The frontend is built using React.js with Vite, Tailwind CSS, React Router DOM, and other modern libraries for a responsive, role-based user interface.

## 📁 Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── images/              # Static images
├── src/
│   ├── assets/
│   │   ├── images/         # Image assets
│   │   ├── icons/           # Icon files
│   │   └── styles/          # Global styles
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── customer/
│   │   │   ├── PetCard.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── OrderCard.jsx
│   │   │   └── AppointmentCard.jsx
│   │   ├── doctor/
│   │   │   ├── ScheduleSlot.jsx
│   │   │   └── AppointmentCard.jsx
│   │   └── admin/
│   │       ├── StatsCard.jsx
│   │       └── DataTable.jsx
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── OTPVerification.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── PetListing.jsx
│   │   │   ├── ProductListing.jsx
│   │   │   └── DoctorList.jsx
│   │   ├── customer/
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
│   │   │   ├── Appointments.jsx
│   │   │   ├── BookAppointment.jsx
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
│   │   ├── doctor/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProfileManagement.jsx
│   │   │   ├── ScheduleManagement.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── AppointmentDetails.jsx
│   │   │   ├── HealthRecords.jsx
│   │   │   └── Chat.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── PetManagement.jsx
│   │       ├── ProductManagement.jsx
│   │       ├── OrderManagement.jsx
│   │       ├── UserManagement.jsx
│   │       ├── ExchangeManagement.jsx
│   │       ├── PreBookingManagement.jsx
│   │       ├── OfferManagement.jsx
│   │       ├── FeedbackModeration.jsx
│   │       ├── NotificationManagement.jsx
│   │       └── Reports.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useLocalStorage.js
│   │   └── useDebounce.js
│   ├── services/
│   │   ├── api.js           # Axios instance & interceptors
│   │   ├── authService.js
│   │   ├── petService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   ├── appointmentService.js
│   │   └── ... (all API services)
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── NotificationContext.jsx
│   ├── utils/
│   │   ├── validators.js    # Zod schemas
│   │   ├── helpers.js       # Utility functions
│   │   ├── constants.js     # Constants
│   │   └── formatters.js    # Date, currency formatters
│   ├── routes/
│   │   ├── PublicRoutes.jsx
│   │   ├── CustomerRoutes.jsx
│   │   ├── DoctorRoutes.jsx
│   │   ├── AdminRoutes.jsx
│   │   └── AppRoutes.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css           # Tailwind imports
├── .env
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 UI Pages - Detailed Specifications

### PUBLIC PAGES

#### 1. **Home Page** (`pages/public/Home.jsx`)
**Purpose:** Landing page for all visitors

**UI Components:**
- Navigation bar (Home, Pets, Products, Doctors, Login, Register)
- Hero banner with pet care highlights
- Featured pets section (6-8 pets)
- Featured products section (6-8 products)
- Available offers preview
- Footer with contact information

**Features:**
- View system overview
- Navigate to login/registration
- Browse pets/products (read-only)
- Responsive design

**Navigation:**
- Click "Pets" → Pet Listing (public view)
- Click "Products" → Product Listing (public view)
- Click "Doctors" → Doctor List (public view)
- Click "Login" → Login Page
- Click "Register" → Register Page

**Note:** Public views allow browsing but require login for booking/purchasing actions.

---

#### 2. **Register Page** (`pages/public/Register.jsx`)
**Purpose:** User registration with role selection

**Form Fields:**
- First Name (required, text)
- Last Name (required, text)
- Email (required, email validation)
- Phone Number (required, format validation)
- Password (required, strength indicator)
- Confirm Password (required, must match)
- Role Selection Dropdown (Customer, Doctor, Staff if allowed)

**UI Components:**
- Registration form with validation
- Password strength indicator (weak/medium/strong)
- Real-time email duplicate check
- Submit button
- Link to Login page

**Validation:**
- Email format validation
- Password strength (min 8 chars, uppercase, lowercase, number, special char)
- Phone number format
- Duplicate email prevention

**Flow:**
1. User fills form → Submit
2. API call to `/api/auth/register`
3. If success → Redirect to OTP Verification page
4. If error → Show error message

---

#### 3. **OTP Verification Page** (`pages/public/OTPVerification.jsx`)
**Purpose:** Verify email with OTP

**UI Components:**
- OTP input field (6 digits)
- Timer display (countdown from 5-10 minutes)
- Resend OTP button (limited retries)
- Verify button
- Back to Register link

**Features:**
- Auto-focus on OTP input
- Timer countdown display
- Resend OTP functionality (max 3 retries)
- Success/error messages

**Flow:**
1. User enters OTP → Verify
2. API call to `/api/auth/verify-otp`
3. If success → Account activated → Redirect to Login
4. If expired → Show error → Option to resend
5. If invalid → Show error → Retry

---

#### 4. **Login Page** (`pages/public/Login.jsx`)
**Purpose:** User authentication

**Form Fields:**
- Email (required)
- Password (required)
- "Remember Me" checkbox (optional)

**UI Components:**
- Login form
- Forgot password link
- Link to Register page
- Submit button

**Flow:**
1. User enters credentials → Submit
2. API call to `/api/auth/login`
3. If success:
   - Store tokens (access + refresh)
   - Get user role
   - Redirect based on role:
     - Customer → `/customer/dashboard`
     - Doctor → `/doctor/dashboard`
     - Staff/Admin → `/admin/dashboard`
4. If error → Show error message

---

#### 5. **Forgot Password Page** (`pages/public/ForgotPassword.jsx`)
**Purpose:** Request password reset

**Form Fields:**
- Email (required)

**UI Components:**
- Email input field
- "Send OTP" button
- Link to Login page

**Flow:**
1. User enters email → Submit
2. API call to `/api/auth/forgot-password`
3. OTP sent to email
4. Redirect to Reset Password page

---

#### 6. **Reset Password Page** (`pages/public/ResetPassword.jsx`)
**Purpose:** Reset password with OTP

**Form Fields:**
- OTP (6 digits)
- New Password (required, strength indicator)
- Confirm Password (required)

**UI Components:**
- OTP input
- Password fields with strength indicator
- Submit button

**Flow:**
1. User enters OTP + new password → Submit
2. API call to `/api/auth/reset-password`
3. If success → Redirect to Login
4. If error → Show error message

---

### CUSTOMER PAGES

#### 7. **Customer Dashboard** (`pages/customer/Dashboard.jsx`)
**Purpose:** Central hub for customers

**UI Components:**
- Summary Cards:
  - Active Orders (count)
  - Upcoming Appointments (count)
  - Loyalty Points (current points + tier)
  - Unread Notifications (count)
- Quick Navigation Tiles:
  - Browse Pets
  - Browse Products
  - View Doctors
  - My Orders
  - Book Appointment
  - My Pets
  - Chat
  - Feedback
  - Reminders
- Recent Orders (last 3)
- Recent Appointments (next 3)
- Notifications Panel (last 5)

**Features:**
- Real-time data from API
- Click cards to navigate to respective pages
- Responsive grid layout

---

#### 8. **Pet Listing Page** (`pages/customer/PetListing.jsx`)
**Purpose:** Browse and filter pets

**UI Components:**
- Filter Panel (Sidebar):
  - Species dropdown
  - Breed dropdown
  - Price range slider
  - Availability toggle
  - Reset filters button
- Search bar
- Sort dropdown (Price: Low-High, High-Low, Newest)
- Pet Grid:
  - Pet cards (image, name, breed, price, availability)
  - "View Details" button
- Pagination
- Empty state (no pets found)

**Pet Card Components:**
- Pet image
- Pet name
- Breed
- Age
- Price
- Availability badge
- "View Details" button

**Navigation:**
- Click pet card → Pet Details page
- Click "View Details" → Pet Details page

---

#### 9. **Pet Details Page** (`pages/customer/PetDetails.jsx`)
**Purpose:** View detailed pet information

**UI Components:**
- Image Gallery (multiple images)
- Pet Information:
  - Name
  - Species
  - Breed
  - Age
  - Gender
  - Description
  - Price
  - Stock availability
- Action Buttons:
  - "Add to Cart" (if available)
  - "Pre-Book" (if unavailable)
  - "Back to Listing"
- Related Pets section

**Features:**
- Image carousel
- Stock status display
- Add to cart functionality
- Pre-booking option for unavailable pets

---

#### 10. **Product Listing Page** (`pages/customer/ProductListing.jsx`)
**Purpose:** Browse products

**UI Components:**
- Category Filters (Sidebar)
- Search bar
- Sort dropdown
- Product Grid:
  - Product cards (image, name, category, price, stock)
  - "Add to Cart" button
- Pagination

**Product Card Components:**
- Product image
- Product name
- Category
- Price
- Stock status
- "Add to Cart" button

---

#### 11. **Product Details Page** (`pages/customer/ProductDetails.jsx`)
**Purpose:** View product details

**UI Components:**
- Image Gallery
- Product Information:
  - Name
  - Category
  - Description
  - Price
  - Stock quantity
- Quantity selector
- "Add to Cart" button
- Related Products section

---

#### 12. **Cart Page** (`pages/customer/Cart.jsx`)
**Purpose:** Review cart items before checkout

**UI Components:**
- Cart Items List:
  - Item image
  - Item name
  - Quantity selector (+/-)
  - Unit price
  - Subtotal
  - Remove button
- Order Summary:
  - Subtotal
  - Discount (if any)
  - Loyalty points used
  - Total amount
- Action Buttons:
  - "Continue Shopping"
  - "Proceed to Checkout"

**Features:**
- Real-time quantity update
- Real-time total calculation
- Remove item functionality
- Empty cart state

---

#### 13. **Checkout Page** (`pages/customer/Checkout.jsx`)
**Purpose:** Complete order placement

**UI Components:**
- Shipping Address Form:
  - Full address (textarea)
  - City
  - State
  - ZIP code
  - Phone number
- Payment Method Selection:
  - Radio buttons: Card, Bank Transfer, Cash on Delivery
  - Card details form (if card selected)
- Order Summary:
  - Items list
  - Subtotal
  - Discount
  - Loyalty points redemption option
  - Final total
- Available Offers:
  - List of applicable offers
  - Apply offer button
- "Place Order" button

**Features:**
- Address validation
- Payment method selection
- Offer application
- Loyalty points redemption
- Order confirmation

**Flow:**
1. Fill address → Select payment → Apply offers (optional)
2. Click "Place Order"
3. API call to `/api/orders/create`
4. If success → Redirect to Order Confirmation page
5. If error → Show error message

---

#### 14. **Orders Page** (`pages/customer/Orders.jsx`)
**Purpose:** View order history

**UI Components:**
- Filter Tabs:
  - All Orders
  - Pending
  - Confirmed
  - Shipped
  - Delivered
  - Cancelled
- Order Cards:
  - Order number
  - Order date
  - Items count
  - Total amount
  - Order status badge
  - Payment status badge
  - Action buttons: "View Details", "Cancel" (if pending)
- Pagination

**Order Card Actions:**
- View Details → Order Details page
- Cancel Order (if status = pending)

---

#### 15. **Order Details Page** (`pages/customer/OrderDetails.jsx`)
**Purpose:** View detailed order information

**UI Components:**
- Order Header:
  - Order number
  - Order date
  - Order status
  - Payment status
- Shipping Address
- Order Items:
  - Item image
  - Item name
  - Quantity
  - Unit price
  - Subtotal
- Order Summary:
  - Subtotal
  - Discount
  - Final total
  - Transaction reference (if paid)
- Action Buttons:
  - "Download Invoice"
  - "Cancel Order" (if pending)
  - "Track Order" (if shipped)

---

#### 16. **Appointments Page** (`pages/customer/Appointments.jsx`)
**Purpose:** View and manage appointments

**UI Components:**
- Filter Tabs:
  - All
  - Pending
  - Accepted
  - Completed
  - Cancelled
- Appointment Cards:
  - Appointment number
  - Doctor name
  - Pet name
  - Date & time
  - Status badge
  - Action buttons: "View Details", "Cancel" (if pending)
- "Book New Appointment" button

---

#### 17. **Doctor List Page** (`pages/customer/DoctorList.jsx`)
**Purpose:** Browse and view available doctors

**UI Components:**
- Filter Panel (Sidebar):
  - Specialization dropdown
  - Rating filter (4+, 3+, etc.)
  - Availability toggle
  - Reset filters button
- Search bar
- Sort dropdown (Rating: High-Low, Fee: Low-High, Name: A-Z)
- Doctor Grid:
  - Doctor cards (image, name, specialization, rating, fee, availability)
  - "View Schedule" button
  - "Book Appointment" button
- Pagination
- Empty state (no doctors found)

**Doctor Card Components:**
- Doctor image/avatar
- Doctor name
- Specialization
- Qualifications (abbreviated)
- Rating (stars + number of reviews)
- Consultation fee
- Availability status badge
- "View Schedule" button
- "Book Appointment" button

**Features:**
- View all available doctors
- Filter by specialization
- View doctor ratings
- Check doctor availability
- Quick access to schedule and booking

**Navigation:**
- Click "View Schedule" → Doctor Schedule Modal/Page
- Click "Book Appointment" → Book Appointment Page (with doctor pre-selected)
- Click doctor card → Doctor Details Page

---

#### 18. **Doctor Details Page** (`pages/customer/DoctorDetails.jsx`)
**Purpose:** View detailed doctor information

**UI Components:**
- Doctor Header:
  - Doctor image/avatar
  - Doctor name
  - Specialization
  - Rating (stars + number of reviews)
  - Consultation fee
  - Availability status
- Doctor Information:
  - Full qualifications
  - Experience (years)
  - Specializations list
  - Bio/description
- Reviews Section:
  - Customer reviews with ratings
  - Review comments
  - Review dates
- Schedule Overview:
  - Available days
  - Time slots summary
- Action Buttons:
  - "Book Appointment" button
  - "View Full Schedule" button
  - "Back to Doctor List" button

**Features:**
- Complete doctor profile view
- Customer reviews display
- Schedule preview
- Quick booking access

**Navigation:**
- Click "Book Appointment" → Book Appointment Page (with doctor pre-selected)
- Click "View Full Schedule" → Schedule Modal/Page

---

#### 19. **Book Appointment Page** (`pages/customer/BookAppointment.jsx`)
**Purpose:** Book appointment with doctor

**UI Components:**
- Doctor Selection:
  - Doctor list with specialization
  - Doctor card (name, specialization, rating, fee)
  - "Select Doctor" button
- Selected Doctor Info
- Pet Selection:
  - Dropdown of customer's pets
  - "Add New Pet" link (if no pets)
- Date & Time Selection:
  - Calendar picker
  - Available time slots
  - Selected slot display
- Appointment Summary:
  - Doctor name
  - Pet name
  - Date & time
  - Consultation fee
- "Book Appointment" button

**Flow:**
1. Select doctor → View schedule
2. Select pet → Select date → Select time slot
3. Review summary → Book
4. API call to `/api/appointments`
5. If success → Redirect to Appointments page

---

#### 20. **Pet Profiles Page** (`pages/customer/PetProfiles.jsx`)
**Purpose:** Manage customer's pet profiles

**UI Components:**
- "Add New Pet" button
- Pet Cards:
  - Pet image
  - Pet name
  - Species & breed
  - Age
  - Action buttons: "View Details", "Edit", "Delete"
- Empty state (if no pets)

**Pet Profile Details View:**
- Pet image gallery
- Pet name
- Species & breed
- Age & gender
- Vaccination history (list)
- Feeding schedules (list)
- Medical history summary
- Action buttons: "Edit", "Delete"

**Features:**
- View complete pet profile
- Manage vaccination details
- Manage feeding schedules
- View medical history

**Navigation:**
- Click "Add New Pet" → Pet Profile Form
- Click "Edit" → Pet Profile Form (with data)
- Click "View Details" → Pet Profile Details Modal/Page

---

#### 21. **Pet Profile Form** (`pages/customer/PetProfileForm.jsx`)
**Purpose:** Create/edit pet profile

**Form Fields:**
- Pet Name (required)
- Species (required, dropdown)
- Breed (required)
- Age (required, number in months)
- Gender (required, radio: Male, Female, Other)
- Pet Image (file upload)
- Save button

**Additional Sections (Tabs or Expandable):**
- Vaccination Details:
  - Vaccine name
  - Vaccination date
  - Next due date
  - Notes
  - Add/Edit/Delete vaccinations
- Feeding Schedules:
  - Food type
  - Feeding time
  - Quantity
  - Notes
  - Add/Edit/Delete schedules

**Features:**
- Image upload preview
- Form validation
- Edit mode (pre-fill data)
- Create new pet profile
- Update existing pet profile
- Manage vaccination details
- Manage feeding schedules

---

#### 22. **Health Records Page** (`pages/customer/HealthRecords.jsx`)
**Purpose:** View pet health records

**UI Components:**
- Pet Selector (dropdown)
- Health Records List:
  - Record date
  - Doctor name
  - Diagnosis summary
  - Prescription summary
  - Action: "View Details", "Download"
- Empty state

**Health Record Details Modal:**
- Full diagnosis
- Complete prescription details
- Treatment notes
- Vaccination updates (if any)
- Record date
- Doctor information
- Download PDF button

**Features:**
- View diagnosis & treatment history
- Track vaccinations
- View doctor notes
- Download medical records as PDF

**Navigation:**
- Click "View Details" → Health Record Details Modal
- Click "Download" → Download PDF file

---

#### 23. **Exchange Requests Page** (`pages/customer/ExchangeRequests.jsx`)
**Purpose:** Submit and track exchange requests

**UI Components:**
- "New Exchange Request" button
- Exchange Requests List:
  - Pet name (from order)
  - Order number
  - Reason
  - Status badge
  - Request date
  - Action: "View Details", "Cancel" (if pending)
- Empty state

**Exchange Request Form (Modal):**
- Order Selection (dropdown of orders with pets)
- Pet Selection (from selected order)
- Reason (textarea, required)
- Submit button

**Features:**
- Submit exchange request
- Track approval status
- View exchange history
- Cancel pending requests
- View request details

**Navigation:**
- Click "New Exchange Request" → Exchange Request Form Modal
- Click "View Details" → Exchange Request Details Modal

---

#### 24. **Pre-Bookings Page** (`pages/customer/PreBookings.jsx`)
**Purpose:** View and manage pre-booking requests

**UI Components:**
- "New Pre-Booking Request" button
- Pre-Booking Requests List:
  - Item name (pet/product)
  - Item type
  - Quantity
  - Status badge
  - Request date
  - Fulfillment date (if fulfilled)
  - Action: "Cancel" (if pending), "View Details"
- Empty state

**Pre-Booking Request Form (Modal):**
- Item Type (radio: Pet, Product)
- Item Selection (dropdown based on type)
- Quantity (number input)
- Notes (textarea, optional)
- Submit button

**Features:**
- Request unavailable pets/products
- Quantity selection
- Request tracking status
- Notifications when available
- Cancel pending requests

**Navigation:**
- Click "New Pre-Booking Request" → Pre-Booking Form Modal
- Click "View Details" → Pre-Booking Details Modal

---

#### 25. **Chat Page** (`pages/customer/Chat.jsx`)
**Purpose:** Chat with staff and doctors

**UI Components:**
- Chat Rooms Sidebar:
  - List of chat rooms
  - Unread message count badges
  - "New Chat" button
- Chat Window:
  - Chat header (recipient name, status)
  - Message list (scrollable)
  - Message input field
  - Send button
- Empty state (no chat selected)

**Features:**
- Real-time message updates (polling or WebSocket)
- Message timestamps
- Read/unread indicators
- File attachment (optional)

---

#### 26. **Feedback Page** (`pages/customer/Feedback.jsx`)
**Purpose:** Submit feedback and ratings

**UI Components:**
- "Submit Feedback" button
- Feedback Form (Modal):
  - Feedback Type (dropdown: Product, Service, Doctor)
  - Item Selection (based on type)
  - Rating (1-5 stars)
  - Comment (textarea)
  - Submit button
- Submitted Feedback List:
  - Feedback type
  - Item name
  - Rating (stars)
  - Comment
  - Status (pending/approved)
  - Admin response (if any)

---

#### 27. **Notifications Page** (`pages/customer/Notifications.jsx`)
**Purpose:** View system notifications

**UI Components:**
- Filter Tabs:
  - All
  - Unread
  - Orders
  - Appointments
  - Offers
- Notification List:
  - Notification icon
  - Title
  - Message
  - Timestamp
  - Read/unread indicator
  - Action button (if applicable)
- "Mark All as Read" button
- Empty state

---

#### 28. **Offers Page** (`pages/customer/Offers.jsx`)
**Purpose:** View available offers and loyalty program

**UI Components:**
- Loyalty Points Card:
  - Current points
  - Current tier (Bronze/Silver/Gold/Platinum)
  - Points to next tier
- Available Offers:
  - Offer cards (title, description, discount, validity)
  - "View Details" button
- Offer Details Modal:
  - Full offer description
  - Terms and conditions
  - Validity period
- Loyalty Tier Benefits:
  - Tier comparison table

---

#### 29. **Reminders Page** (`pages/customer/Reminders.jsx`)
**Purpose:** Manage custom reminders

**UI Components:**
- "Add Reminder" button
- Reminder List:
  - Reminder type icon
  - Title
  - Description
  - Date & time
  - Status (upcoming/completed)
  - Action: "Edit", "Delete", "Mark Complete"
- Filter Tabs:
  - All
  - Upcoming
  - Completed
- Empty state

**Reminder Types:**
- Vaccination
- Medication
- Food
- Appointment

---

### DOCTOR PAGES

#### 30. **Doctor Dashboard** (`pages/doctor/Dashboard.jsx`)
**Purpose:** Doctor's central hub

**UI Components:**
- Summary Cards:
  - Today's Appointments (count)
  - Pending Requests (count)
  - Completed This Week (count)
  - Unread Messages (count)
- Today's Appointments List:
  - Appointment cards (time, customer, pet, status)
- Quick Actions:
  - Manage Profile
  - View Schedule
  - Manage Appointments
  - Health Records
  - Chat

---

#### 31. **Schedule Management Page** (`pages/doctor/ScheduleManagement.jsx`)
**Purpose:** Manage weekly schedule

**UI Components:**
- Weekly Schedule View:
  - Days of week (Monday-Sunday)
  - Time slots per day
  - Add/Edit/Delete slot buttons
- Slot Form (Modal):
  - Day of week (dropdown)
  - Start time (time picker)
  - End time (time picker)
  - Slot duration (minutes)
  - Active toggle
  - Save button
- Existing Slots List:
  - Day
  - Time range
  - Duration
  - Status (active/inactive)
  - Action: "Edit", "Delete"

---

#### 32. **Doctor Appointments Page** (`pages/doctor/Appointments.jsx`)
**Purpose:** View and manage appointments

**UI Components:**
- Filter Tabs:
  - All
  - Pending
  - Accepted
  - Completed
  - Cancelled
- Appointment Cards:
  - Appointment number
  - Customer name
  - Pet name
  - Date & time
  - Status
  - Action buttons: "Accept", "Reject", "View Details", "Complete"
- Calendar View (optional):
  - Monthly calendar
  - Appointments marked on dates

---

#### 33. **Appointment Details Page** (`pages/doctor/AppointmentDetails.jsx`)
**Purpose:** View appointment details and add notes

**UI Components:**
- Appointment Information:
  - Appointment number
  - Customer details
  - Pet details
  - Date & time
  - Status
- Pet Health History (if available)
- Consultation Form:
  - Diagnosis (textarea)
  - Prescription (textarea)
  - Treatment Notes (textarea)
  - Save button
- Action Buttons:
  - Accept Appointment
  - Reject Appointment
  - Mark Completed
  - Add to Health Records

---

#### 34. **Doctor Health Records Page** (`pages/doctor/HealthRecords.jsx`)
**Purpose:** View and manage health records

**UI Components:**
- Health Records List:
  - Pet name
  - Customer name
  - Record date
  - Diagnosis summary
  - Action: "View Details", "Edit"
- "Create New Record" button
- Filters:
  - Date range
  - Pet name
  - Customer name

---

#### 35. **Doctor Profile Management Page** (`pages/doctor/ProfileManagement.jsx`)
**Purpose:** Manage doctor profile information

**UI Components:**
- Profile Information Form:
  - Specialization (dropdown/input)
  - Qualifications (textarea)
  - Experience (number input - years)
  - Consultation Fee (number input)
  - Profile Image (file upload)
  - Save button
- Current Profile Display:
  - Specialization
  - Qualifications
  - Experience
  - Consultation fee
  - Rating (read-only)
  - Total reviews (read-only)
- Edit Mode Toggle

**Features:**
- Update specialization
- Update qualifications
- Update experience years
- Update consultation fee
- Upload profile image
- Form validation
- Success/error messages

---

#### 36. **Doctor Chat Page** (`pages/doctor/Chat.jsx`)
**Purpose:** Chat with customers

**UI Components:**
- Chat Rooms Sidebar (customer list)
- Chat Window (same as customer chat)
- Appointment-linked chats highlighted

---

### ADMIN PAGES

#### 37. **Admin Dashboard** (`pages/admin/Dashboard.jsx`)
**Purpose:** Admin overview and analytics

**UI Components:**
- Statistics Cards:
  - Total Sales (today, week, month)
  - Total Orders
  - Active Customers
  - Pending Appointments
  - Pending Exchange Requests
- Charts:
  - Sales Trend (line chart)
  - Popular Pets (bar chart)
  - Popular Products (bar chart)
  - Appointment Trends (line chart)
  - Customer Growth (line chart)
- Recent Activity:
  - Recent orders
  - Recent registrations
  - Recent feedback

---

#### 38. **Pet Management Page** (`pages/admin/PetManagement.jsx`)
**Purpose:** Manage pet inventory

**UI Components:**
- "Add New Pet" button
- Pet Table:
  - Columns: Image, Name, Species, Breed, Age, Price, Stock, Status, Actions
  - Search bar
  - Filters (species, breed, availability)
- Action Buttons (per row):
  - Edit
  - Delete
  - Toggle Availability
- Bulk Actions:
  - Delete selected
  - Update stock

---

#### 39. **Product Management Page** (`pages/admin/ProductManagement.jsx`)
**Purpose:** Manage product inventory

**UI Components:**
- Similar to Pet Management
- Additional: Category filter

---

#### 40. **Order Management Page** (`pages/admin/OrderManagement.jsx`)
**Purpose:** Manage all orders

**UI Components:**
- Order Table:
  - Columns: Order #, Customer, Items, Amount, Status, Payment, Date, Actions
  - Filters (status, payment status, date range)
- Action Buttons (per row):
  - View Details
  - Update Status
  - Process Refund
- Status Update Modal:
  - Status dropdown
  - Notes (optional)
  - Update button

---

#### 41. **User Management Page** (`pages/admin/UserManagement.jsx`)
**Purpose:** Manage users

**UI Components:**
- User Table:
  - Columns: Name, Email, Role, Status, Verified, Created, Actions
  - Filters (role, status, verified)
- Action Buttons (per row):
  - Activate/Deactivate
  - Change Role (admin only)
  - View Details
- Bulk Actions:
  - Activate selected
  - Deactivate selected

---

#### 42. **Exchange Management Page** (`pages/admin/ExchangeManagement.jsx`)
**Purpose:** Review exchange requests

**UI Components:**
- Exchange Requests Table:
  - Columns: Request #, Customer, Pet, Order #, Reason, Status, Date, Actions
  - Filters (status)
- Action Buttons (per row):
  - Approve
  - Reject
  - View Details

---

#### 43. **Pre-Booking Management Page** (`pages/admin/PreBookingManagement.jsx`)
**Purpose:** Manage pre-booking requests

**UI Components:**
- Pre-Booking Table:
  - Columns: Request #, Customer, Item, Type, Quantity, Status, Date, Actions
- Action Buttons (per row):
  - Fulfill Request
  - Notify Customer
  - Cancel

---

#### 44. **Offer Management Page** (`pages/admin/OfferManagement.jsx`)
**Purpose:** Create and manage offers

**UI Components:**
- "Create Offer" button
- Offers Table:
  - Columns: Title, Type, Discount, Validity, Status, Actions
- Offer Form (Modal):
  - Title
  - Description
  - Discount Type (percentage/fixed/loyalty)
  - Discount Value
  - Min Purchase
  - Max Discount
  - Valid From/Until (date pickers)
  - Active toggle
  - Save button

---

#### 45. **Feedback Moderation Page** (`pages/admin/FeedbackModeration.jsx`)
**Purpose:** Moderate customer feedback

**UI Components:**
- Feedback Table:
  - Columns: Customer, Type, Item, Rating, Comment, Status, Date, Actions
  - Filters (type, status, rating)
- Action Buttons (per row):
  - Approve
  - Reject
  - Add Response
- Response Modal:
  - Admin response textarea
  - Submit button

---

#### 46. **Notification Management Page** (`pages/admin/NotificationManagement.jsx`)
**Purpose:** Send broadcast notifications

**UI Components:**
- "Send Notification" button
- Notification Form:
  - Target (All Users, Customers, Doctors, Specific User)
  - Notification Type
  - Title
  - Message
  - Related ID (optional)
  - Send button
- Sent Notifications List:
  - Target
  - Title
  - Sent date
  - Recipients count

---

#### 47. **Reports Page** (`pages/admin/Reports.jsx`)
**Purpose:** View system reports

**UI Components:**
- Report Tabs:
  - Sales Report
  - Appointment Report
  - Customer Report
  - Loyalty Report
- Date Range Selector
- Report Charts and Tables
- Export buttons (PDF, Excel)

---

## 🎯 Routing Structure

### Route Configuration

```javascript
// Public Routes
/ → Home
/register → Register
/otp-verification → OTP Verification
/login → Login
/forgot-password → Forgot Password
/reset-password → Reset Password
/doctors → Doctor List (Public)
/pets → Pet Listing (Public)
/products → Product Listing (Public)

// Customer Routes (Protected)
/customer/dashboard → Customer Dashboard
/customer/pets → Pet Listing
/customer/pets/:id → Pet Details
/customer/products → Product Listing
/customer/products/:id → Product Details
/customer/cart → Cart
/customer/checkout → Checkout
/customer/orders → Orders
/customer/orders/:id → Order Details
/customer/doctors → Doctor List
/customer/doctors/:id → Doctor Details
/customer/appointments → Appointments
/customer/appointments/book → Book Appointment
/customer/pet-profiles → Pet Profiles
/customer/pet-profiles/new → New Pet Profile
/customer/pet-profiles/:id/edit → Edit Pet Profile
/customer/health-records → Health Records
/customer/exchanges → Exchange Requests
/customer/pre-bookings → Pre-Bookings
/customer/chat → Chat
/customer/feedback → Feedback
/customer/notifications → Notifications
/customer/offers → Offers
/customer/reminders → Reminders

// Doctor Routes (Protected)
/doctor/dashboard → Doctor Dashboard
/doctor/profile → Profile Management
/doctor/schedule → Schedule Management
/doctor/appointments → Appointments
/doctor/appointments/:id → Appointment Details
/doctor/health-records → Health Records
/doctor/chat → Chat

// Admin Routes (Protected)
/admin/dashboard → Admin Dashboard
/admin/pets → Pet Management
/admin/products → Product Management
/admin/orders → Order Management
/admin/users → User Management
/admin/exchanges → Exchange Management
/admin/pre-bookings → Pre-Booking Management
/admin/offers → Offer Management
/admin/feedback → Feedback Moderation
/admin/notifications → Notification Management
/admin/reports → Reports
```

## 🔐 Route Protection

- **Public Routes:** Accessible to all
- **Customer Routes:** Require `customer` role
- **Doctor Routes:** Require `doctor` role
- **Admin Routes:** Require `staff` or `admin` role

## 🎨 Styling (Tailwind CSS)

- Consistent color theme
- Responsive design (mobile, tablet, desktop)
- Dark mode support (optional)
- Component-based styling
- Utility-first approach

## 📱 Responsive Design

- **Mobile:** Single column, collapsible sidebar
- **Tablet:** Two columns, sidebar toggle
- **Desktop:** Full layout with persistent sidebar

---

**Next Step:** [STEP 03: Authentication Flow](./STEP-03-AUTHENTICATION-FLOW.md)

