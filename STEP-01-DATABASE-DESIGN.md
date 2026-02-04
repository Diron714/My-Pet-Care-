# STEP 01: Database Design (MySQL)

## 📊 Overview

This document provides the complete MySQL database schema for **My Pet Care+**. The database is designed to support all system features including user management, pet/product management, orders, appointments, chat, notifications, loyalty programs, and audit logging.

## 🗄️ Database: `mypetcare_db`

## 📋 Table Structure

### 1. **users** - User Accounts
**Purpose:** Stores all user accounts (Customers, Doctors, Staff/Admin)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `first_name` | VARCHAR(100) | NOT NULL | User's first name |
| `last_name` | VARCHAR(100) | NOT NULL | User's last name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email (login) |
| `phone` | VARCHAR(20) | NOT NULL | Contact number |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `role` | ENUM('customer', 'doctor', 'staff', 'admin') | NOT NULL, DEFAULT 'customer' | User role |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account status |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Email verification status |
| `email_verified_at` | DATETIME | NULL | Email verification timestamp |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `user_id`
- UNIQUE: `email`
- INDEX: `role`, `is_active`, `is_verified`

**Relationships:**
- One-to-Many: `customers` (if role='customer')
- One-to-Many: `doctors` (if role='doctor')
- One-to-Many: `staff` (if role='staff' or 'admin')

---

### 2. **otp_verifications** - OTP Management
**Purpose:** Stores OTP codes for email verification and password reset

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `otp_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique OTP identifier |
| `user_id` | INT | FOREIGN KEY → users.user_id | Associated user |
| `email` | VARCHAR(255) | NOT NULL | Email address for OTP |
| `otp_code` | VARCHAR(6) | NOT NULL | 6-digit OTP code |
| `otp_type` | ENUM('email_verification', 'password_reset') | NOT NULL | OTP purpose |
| `expires_at` | TIMESTAMP | NOT NULL | OTP expiration (5-10 min) |
| `is_used` | BOOLEAN | DEFAULT FALSE | OTP usage status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | OTP creation time |

**Indexes:**
- PRIMARY KEY: `otp_id`
- FOREIGN KEY: `user_id` → `users.user_id` ON DELETE CASCADE
- INDEX: `email`, `otp_code`, `expires_at`, `is_used`

**Business Rules:**
- OTP expires in 5-10 minutes
- OTP can only be used once
- Old unused OTPs are automatically invalidated

---

### 3. **password_history** - Password History
**Purpose:** Prevents reuse of previous passwords

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `history_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique history identifier |
| `user_id` | INT | FOREIGN KEY → users.user_id | Associated user |
| `password_hash` | VARCHAR(255) | NOT NULL | Previous password hash |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When password was set |

**Indexes:**
- PRIMARY KEY: `history_id`
- FOREIGN KEY: `user_id` → `users.user_id` ON DELETE CASCADE
- INDEX: `user_id`, `created_at`

**Business Rules:**
- Store last 5 passwords per user
- Check against history during password reset

---

### 4. **customers** - Customer Profiles
**Purpose:** Extended customer information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `customer_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique customer identifier |
| `user_id` | INT | FOREIGN KEY → users.user_id | Associated user account |
| `loyalty_points` | INT | DEFAULT 0 | Current loyalty points |
| `loyalty_tier` | ENUM('bronze', 'silver', 'gold', 'platinum') | DEFAULT 'bronze' | Loyalty tier level |
| `total_spent` | DECIMAL(10,2) | DEFAULT 0.00 | Lifetime spending |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Profile creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `customer_id`
- FOREIGN KEY: `user_id` → `users.user_id` ON DELETE CASCADE
- UNIQUE: `user_id`
- INDEX: `loyalty_tier`

---

### 5. **doctors** - Doctor Profiles
**Purpose:** Extended doctor information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `doctor_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique doctor identifier |
| `user_id` | INT | FOREIGN KEY → users.user_id | Associated user account |
| `specialization` | VARCHAR(255) | NOT NULL | Medical specialization |
| `qualifications` | TEXT | NULL | Educational qualifications |
| `experience_years` | INT | DEFAULT 0 | Years of experience |
| `consultation_fee` | DECIMAL(10,2) | NOT NULL | Fee per consultation |
| `rating` | DECIMAL(3,2) | DEFAULT 0.00 | Average rating (0-5) |
| `total_reviews` | INT | DEFAULT 0 | Number of reviews |
| `is_available` | BOOLEAN | DEFAULT TRUE | Availability status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Profile creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `doctor_id`
- FOREIGN KEY: `user_id` → `users.user_id` ON DELETE CASCADE
- UNIQUE: `user_id`
- INDEX: `specialization`, `is_available`, `rating`

---

### 6. **staff** - Staff/Admin Profiles
**Purpose:** Extended staff/admin information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `staff_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique staff identifier |
| `user_id` | INT | FOREIGN KEY → users.user_id | Associated user account |
| `department` | VARCHAR(100) | NULL | Department name |
| `position` | VARCHAR(100) | NULL | Job position |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Profile creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `staff_id`
- FOREIGN KEY: `user_id` → `users.user_id` ON DELETE CASCADE
- UNIQUE: `user_id`

---

### 7. **pets** - Pet Inventory
**Purpose:** Available pets for adoption/sale

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `pet_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique pet identifier |
| `name` | VARCHAR(255) | NOT NULL | Pet name |
| `species` | VARCHAR(100) | NOT NULL | Species (Dog, Cat, etc.) |
| `breed` | VARCHAR(255) | NOT NULL | Breed name |
| `age` | INT | NOT NULL | Age in months |
| `gender` | ENUM('male', 'female', 'other') | NOT NULL | Gender |
| `description` | TEXT | NULL | Pet description |
| `price` | DECIMAL(10,2) | NOT NULL | Selling price |
| `stock_quantity` | INT | DEFAULT 0 | Available quantity |
| `is_available` | BOOLEAN | DEFAULT TRUE | Availability status |
| `image_url` | VARCHAR(500) | NULL | Primary image URL |
| `created_by` | INT | FOREIGN KEY → users.user_id | Staff who added |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `pet_id`
- FOREIGN KEY: `created_by` → `users.user_id`
- INDEX: `species`, `breed`, `is_available`, `price`

---

### 8. **pet_images** - Pet Image Gallery
**Purpose:** Multiple images per pet

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `image_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique image identifier |
| `pet_id` | INT | FOREIGN KEY → pets.pet_id | Associated pet |
| `image_url` | VARCHAR(500) | NOT NULL | Image URL |
| `is_primary` | BOOLEAN | DEFAULT FALSE | Primary image flag |
| `display_order` | INT | DEFAULT 0 | Display order |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Upload time |

**Indexes:**
- PRIMARY KEY: `image_id`
- FOREIGN KEY: `pet_id` → `pets.pet_id` ON DELETE CASCADE
- INDEX: `pet_id`, `is_primary`, `display_order`

---

### 9. **products** - Product Inventory
**Purpose:** Pet-related products for sale

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `product_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique product identifier |
| `name` | VARCHAR(255) | NOT NULL | Product name |
| `category` | VARCHAR(100) | NOT NULL | Product category |
| `description` | TEXT | NULL | Product description |
| `price` | DECIMAL(10,2) | NOT NULL | Selling price |
| `stock_quantity` | INT | DEFAULT 0 | Available stock |
| `is_available` | BOOLEAN | DEFAULT TRUE | Availability status |
| `image_url` | VARCHAR(500) | NULL | Primary image URL |
| `created_by` | INT | FOREIGN KEY → users.user_id | Staff who added |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `product_id`
- FOREIGN KEY: `created_by` → `users.user_id`
- INDEX: `category`, `is_available`, `price`

---

### 10. **product_images** - Product Image Gallery
**Purpose:** Multiple images per product

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `image_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique image identifier |
| `product_id` | INT | FOREIGN KEY → products.product_id | Associated product |
| `image_url` | VARCHAR(500) | NOT NULL | Image URL |
| `is_primary` | BOOLEAN | DEFAULT FALSE | Primary image flag |
| `display_order` | INT | DEFAULT 0 | Display order |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Upload time |

**Indexes:**
- PRIMARY KEY: `image_id`
- FOREIGN KEY: `product_id` → `products.product_id` ON DELETE CASCADE
- INDEX: `product_id`, `is_primary`, `display_order`

---

### 11. **customer_pets** - Customer's Owned Pets
**Purpose:** Pets owned by customers (for health records)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `customer_pet_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `customer_id` | INT | FOREIGN KEY → customers.customer_id | Pet owner |
| `name` | VARCHAR(255) | NOT NULL | Pet name |
| `species` | VARCHAR(100) | NOT NULL | Species |
| `breed` | VARCHAR(255) | NULL | Breed |
| `age` | INT | NULL | Age in months |
| `gender` | ENUM('male', 'female', 'other') | NULL | Gender |
| `image_url` | VARCHAR(500) | NULL | Pet image |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `customer_pet_id`
- FOREIGN KEY: `customer_id` → `customers.customer_id` ON DELETE CASCADE
- INDEX: `customer_id`

---

### 12. **pet_vaccinations** - Vaccination Records
**Purpose:** Vaccination history for customer pets

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `vaccination_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `customer_pet_id` | INT | FOREIGN KEY → customer_pets.customer_pet_id | Associated pet |
| `vaccine_name` | VARCHAR(255) | NOT NULL | Vaccine name |
| `vaccination_date` | DATE | NOT NULL | Date administered |
| `next_due_date` | DATE | NULL | Next vaccination due |
| `notes` | TEXT | NULL | Additional notes |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes:**
- PRIMARY KEY: `vaccination_id`
- FOREIGN KEY: `customer_pet_id` → `customer_pets.customer_pet_id` ON DELETE CASCADE
- INDEX: `customer_pet_id`, `vaccination_date`, `next_due_date`

---

### 13. **pet_feeding_schedules** - Feeding Schedules
**Purpose:** Feeding schedule for customer pets

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `schedule_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `customer_pet_id` | INT | FOREIGN KEY → customer_pets.customer_pet_id | Associated pet |
| `food_type` | VARCHAR(255) | NOT NULL | Type of food |
| `feeding_time` | TIME | NOT NULL | Daily feeding time |
| `quantity` | VARCHAR(100) | NULL | Food quantity |
| `notes` | TEXT | NULL | Additional notes |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `schedule_id`
- FOREIGN KEY: `customer_pet_id` → `customer_pets.customer_pet_id` ON DELETE CASCADE
- INDEX: `customer_pet_id`

---

### 14. **carts** - Shopping Cart
**Purpose:** Customer shopping cart items

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `cart_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique cart identifier |
| `customer_id` | INT | FOREIGN KEY → customers.customer_id | Cart owner |
| `item_type` | ENUM('pet', 'product') | NOT NULL | Item type |
| `item_id` | INT | NOT NULL | Pet ID or Product ID |
| `quantity` | INT | DEFAULT 1 | Quantity |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Added time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `cart_id`
- FOREIGN KEY: `customer_id` → `customers.customer_id` ON DELETE CASCADE
- INDEX: `customer_id`, `item_type`, `item_id`

**Business Rules:**
- One cart per customer
- Items removed after checkout

---

### 15. **orders** - Customer Orders
**Purpose:** Order records

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `order_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique order identifier |
| `order_number` | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable order number |
| `customer_id` | INT | FOREIGN KEY → customers.customer_id | Order owner |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Total order amount |
| `discount_amount` | DECIMAL(10,2) | DEFAULT 0.00 | Discount applied |
| `loyalty_points_used` | INT | DEFAULT 0 | Loyalty points redeemed |
| `final_amount` | DECIMAL(10,2) | NOT NULL | Final payable amount |
| `shipping_address` | TEXT | NOT NULL | Delivery address |
| `payment_method` | ENUM('card', 'bank_transfer', 'cash_on_delivery') | NOT NULL | Payment method |
| `payment_status` | ENUM('pending', 'paid', 'failed', 'refunded') | DEFAULT 'pending' | Payment status |
| `order_status` | ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') | DEFAULT 'pending' | Order status |
| `transaction_reference` | VARCHAR(255) | NULL | Payment transaction reference |
| `loyalty_points_earned` | INT | DEFAULT 0 | Points earned from order |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Order creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `order_id`
- UNIQUE: `order_number`
- FOREIGN KEY: `customer_id` → `customers.customer_id`
- INDEX: `customer_id`, `order_status`, `payment_status`, `created_at`

---

### 16. **order_items** - Order Line Items
**Purpose:** Individual items in an order

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `order_item_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `order_id` | INT | FOREIGN KEY → orders.order_id | Associated order |
| `item_type` | ENUM('pet', 'product') | NOT NULL | Item type |
| `item_id` | INT | NOT NULL | Pet ID or Product ID |
| `item_name` | VARCHAR(255) | NOT NULL | Item name (snapshot) |
| `quantity` | INT | NOT NULL | Quantity ordered |
| `unit_price` | DECIMAL(10,2) | NOT NULL | Price per unit (snapshot) |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Line total |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

**Indexes:**
- PRIMARY KEY: `order_item_id`
- FOREIGN KEY: `order_id` → `orders.order_id` ON DELETE CASCADE
- INDEX: `order_id`, `item_type`, `item_id`

---

### 17. **pre_bookings** - Pre-Booking Requests
**Purpose:** Requests for unavailable pets/products

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `pre_booking_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `customer_id` | INT | FOREIGN KEY → customers.customer_id | Requesting customer |
| `item_type` | ENUM('pet', 'product') | NOT NULL | Item type |
| `item_id` | INT | NOT NULL | Pet ID or Product ID |
| `quantity` | INT | DEFAULT 1 | Requested quantity |
| `status` | ENUM('pending', 'fulfilled', 'cancelled') | DEFAULT 'pending' | Request status |
| `fulfilled_at` | DATETIME | NULL | Fulfillment time |
| `notified_at` | DATETIME | NULL | Notification sent time |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Request creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `pre_booking_id`
- FOREIGN KEY: `customer_id` → `customers.customer_id`
- INDEX: `customer_id`, `item_type`, `item_id`, `status`

---

### 18. **doctor_schedules** - Doctor Availability
**Purpose:** Doctor's weekly schedule slots

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `schedule_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `doctor_id` | INT | FOREIGN KEY → doctors.doctor_id | Associated doctor |
| `day_of_week` | ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') | NOT NULL | Day of week |
| `start_time` | TIME | NOT NULL | Slot start time |
| `end_time` | TIME | NOT NULL | Slot end time |
| `slot_duration` | INT | DEFAULT 30 | Duration in minutes |
| `is_active` | BOOLEAN | DEFAULT TRUE | Slot availability |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `schedule_id`
- FOREIGN KEY: `doctor_id` → `doctors.doctor_id` ON DELETE CASCADE
- INDEX: `doctor_id`, `day_of_week`, `is_active`

---

### 19. **appointments** - Doctor Appointments
**Purpose:** Customer appointments with doctors

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `appointment_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `appointment_number` | VARCHAR(50) | UNIQUE, NOT NULL | Appointment reference |
| `customer_id` | INT | FOREIGN KEY → customers.customer_id | Customer |
| `doctor_id` | INT | FOREIGN KEY → doctors.doctor_id | Doctor |
| `customer_pet_id` | INT | FOREIGN KEY → customer_pets.customer_pet_id | Pet for appointment |
| `appointment_date` | DATE | NOT NULL | Appointment date |
| `appointment_time` | TIME | NOT NULL | Appointment time |
| `status` | ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') | DEFAULT 'pending' | Appointment status |
| `consultation_fee` | DECIMAL(10,2) | NOT NULL | Fee (snapshot) |
| `payment_status` | ENUM('pending', 'paid', 'refunded') | DEFAULT 'pending' | Payment status |
| `doctor_notes` | TEXT | NULL | Doctor's consultation notes |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Booking time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `appointment_id`
- UNIQUE: `appointment_number`
- FOREIGN KEY: `customer_id` → `customers.customer_id`
- FOREIGN KEY: `doctor_id` → `doctors.doctor_id`
- FOREIGN KEY: `customer_pet_id` → `customer_pets.customer_pet_id`
- INDEX: `customer_id`, `doctor_id`, `appointment_date`, `status`

---

### 20. **health_records** - Medical Records
**Purpose:** Health records for customer pets

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `record_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `appointment_id` | INT | FOREIGN KEY → appointments.appointment_id | Associated appointment |
| `customer_pet_id` | INT | FOREIGN KEY → customer_pets.customer_pet_id | Pet |
| `doctor_id` | INT | FOREIGN KEY → doctors.doctor_id | Treating doctor |
| `diagnosis` | TEXT | NULL | Diagnosis details |
| `prescription` | TEXT | NULL | Prescribed medications |
| `treatment_notes` | TEXT | NULL | Treatment details |
| `record_date` | DATE | NOT NULL | Record date |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `record_id`
- FOREIGN KEY: `appointment_id` → `appointments.appointment_id`
- FOREIGN KEY: `customer_pet_id` → `customer_pets.customer_pet_id` ON DELETE CASCADE
- FOREIGN KEY: `doctor_id` → `doctors.doctor_id`
- INDEX: `customer_pet_id`, `doctor_id`, `record_date`

---

### 21. **exchange_requests** - Pet Exchange Requests
**Purpose:** Customer requests to exchange purchased pets

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `exchange_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `customer_id` | INT | FOREIGN KEY → customers.customer_id | Requesting customer |
| `order_id` | INT | FOREIGN KEY → orders.order_id | Original order |
| `pet_id` | INT | FOREIGN KEY → pets.pet_id | Pet to exchange |
| `reason` | TEXT | NOT NULL | Exchange reason |
| `status` | ENUM('pending', 'approved', 'rejected', 'completed') | DEFAULT 'pending' | Request status |
| `approved_by` | INT | FOREIGN KEY → users.user_id | Staff who approved |
| `approved_at` | DATETIME | NULL | Approval time |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Request creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `exchange_id`
- FOREIGN KEY: `customer_id` → `customers.customer_id`
- FOREIGN KEY: `order_id` → `orders.order_id`
- FOREIGN KEY: `pet_id` → `pets.pet_id`
- FOREIGN KEY: `approved_by` → `users.user_id`
- INDEX: `customer_id`, `status`, `created_at`

---

### 22. **chat_rooms** - Chat Rooms
**Purpose:** Chat room management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `room_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `room_type` | ENUM('customer_staff', 'customer_doctor', 'appointment', 'order') | NOT NULL | Room type |
| `customer_id` | INT | FOREIGN KEY → customers.customer_id | Customer participant |
| `staff_id` | INT | FOREIGN KEY → users.user_id | Staff participant (if applicable) |
| `doctor_id` | INT | FOREIGN KEY → doctors.doctor_id | Doctor participant (if applicable) |
| `appointment_id` | INT | FOREIGN KEY → appointments.appointment_id | Linked appointment (if applicable) |
| `order_id` | INT | FOREIGN KEY → orders.order_id | Linked order (if applicable) |
| `is_active` | BOOLEAN | DEFAULT TRUE | Room status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Room creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `room_id`
- FOREIGN KEY: `customer_id` → `customers.customer_id`
- FOREIGN KEY: `staff_id` → `users.user_id`
- FOREIGN KEY: `doctor_id` → `doctors.doctor_id`
- FOREIGN KEY: `appointment_id` → `appointments.appointment_id`
- FOREIGN KEY: `order_id` → `orders.order_id`
- INDEX: `customer_id`, `room_type`, `is_active`

---

### 23. **chat_messages** - Chat Messages
**Purpose:** Chat message storage

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `message_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `room_id` | INT | FOREIGN KEY → chat_rooms.room_id | Chat room |
| `sender_id` | INT | FOREIGN KEY → users.user_id | Message sender |
| `message_text` | TEXT | NOT NULL | Message content |
| `is_read` | BOOLEAN | DEFAULT FALSE | Read status |
| `read_at` | DATETIME | NULL | Read timestamp |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Message time |

**Indexes:**
- PRIMARY KEY: `message_id`
- FOREIGN KEY: `room_id` → `chat_rooms.room_id` ON DELETE CASCADE
- FOREIGN KEY: `sender_id` → `users.user_id`
- INDEX: `room_id`, `sender_id`, `created_at`, `is_read`

---

### 24. **feedback** - Customer Feedback
**Purpose:** Feedback and ratings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `feedback_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `customer_id` | INT | FOREIGN KEY → customers.customer_id | Feedback provider |
| `feedback_type` | ENUM('product', 'service', 'doctor') | NOT NULL | Feedback type |
| `item_id` | INT | NOT NULL | Product ID, Service ID, or Doctor ID |
| `rating` | INT | NOT NULL | Star rating (1-5) |
| `comment` | TEXT | NULL | Feedback comment |
| `status` | ENUM('pending', 'approved', 'rejected') | DEFAULT 'pending' | Moderation status |
| `admin_response` | TEXT | NULL | Admin response |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `feedback_id`
- FOREIGN KEY: `customer_id` → `customers.customer_id`
- INDEX: `customer_id`, `feedback_type`, `item_id`, `status`, `rating`

---

### 25. **offers** - Promotional Offers
**Purpose:** System offers and promotions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `offer_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `title` | VARCHAR(255) | NOT NULL | Offer title |
| `description` | TEXT | NULL | Offer description |
| `discount_type` | ENUM('percentage', 'fixed_amount', 'loyalty_points') | NOT NULL | Discount type |
| `discount_value` | DECIMAL(10,2) | NOT NULL | Discount amount/percentage |
| `min_purchase` | DECIMAL(10,2) | DEFAULT 0.00 | Minimum purchase required |
| `max_discount` | DECIMAL(10,2) | NULL | Maximum discount cap |
| `valid_from` | DATETIME | NOT NULL | Offer start date |
| `valid_until` | DATETIME | NOT NULL | Offer end date |
| `is_active` | BOOLEAN | DEFAULT TRUE | Offer status |
| `created_by` | INT | FOREIGN KEY → users.user_id | Creator (staff/admin) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `offer_id`
- FOREIGN KEY: `created_by` → `users.user_id`
- INDEX: `is_active`, `valid_from`, `valid_until`

---

### 26. **offer_redemptions** - Offer Usage
**Purpose:** Track offer redemptions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `redemption_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `offer_id` | INT | FOREIGN KEY → offers.offer_id | Redeemed offer |
| `customer_id` | INT | FOREIGN KEY → customers.customer_id | Customer |
| `order_id` | INT | FOREIGN KEY → orders.order_id | Order where used |
| `discount_applied` | DECIMAL(10,2) | NOT NULL | Discount amount applied |
| `redeemed_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Redemption time |

**Indexes:**
- PRIMARY KEY: `redemption_id`
- FOREIGN KEY: `offer_id` → `offers.offer_id`
- FOREIGN KEY: `customer_id` → `customers.customer_id`
- FOREIGN KEY: `order_id` → `orders.order_id`
- INDEX: `offer_id`, `customer_id`, `order_id`

---

### 27. **notifications** - System Notifications
**Purpose:** User notifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `notification_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `user_id` | INT | FOREIGN KEY → users.user_id | Recipient |
| `notification_type` | ENUM('order', 'appointment', 'pre_booking', 'offer', 'loyalty', 'reminder', 'system') | NOT NULL | Notification type |
| `title` | VARCHAR(255) | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification message |
| `related_id` | INT | NULL | Related entity ID (order_id, appointment_id, etc.) |
| `is_read` | BOOLEAN | DEFAULT FALSE | Read status |
| `read_at` | DATETIME | NULL | Read timestamp |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

**Indexes:**
- PRIMARY KEY: `notification_id`
- FOREIGN KEY: `user_id` → `users.user_id` ON DELETE CASCADE
- INDEX: `user_id`, `notification_type`, `is_read`, `created_at`

---

### 28. **reminders** - Custom Reminders
**Purpose:** User-created reminders

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `reminder_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `customer_id` | INT | FOREIGN KEY → customers.customer_id | Reminder owner |
| `reminder_type` | ENUM('vaccination', 'medication', 'food', 'appointment') | NOT NULL | Reminder type |
| `title` | VARCHAR(255) | NOT NULL | Reminder title |
| `description` | TEXT | NULL | Reminder description |
| `reminder_date` | DATE | NOT NULL | Reminder date |
| `reminder_time` | TIME | NULL | Reminder time |
| `is_completed` | BOOLEAN | DEFAULT FALSE | Completion status |
| `completed_at` | DATETIME | NULL | Completion time |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- PRIMARY KEY: `reminder_id`
- FOREIGN KEY: `customer_id` → `customers.customer_id` ON DELETE CASCADE
- INDEX: `customer_id`, `reminder_type`, `reminder_date`, `is_completed`

---

### 29. **refresh_tokens** - JWT Refresh Tokens
**Purpose:** Refresh token storage for JWT authentication

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `token_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `user_id` | INT | FOREIGN KEY → users.user_id | Token owner |
| `refresh_token` | VARCHAR(500) | NOT NULL | Refresh token string |
| `expires_at` | TIMESTAMP | NOT NULL | Token expiration |
| `is_revoked` | BOOLEAN | DEFAULT FALSE | Revocation status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

**Indexes:**
- PRIMARY KEY: `token_id`
- FOREIGN KEY: `user_id` → `users.user_id` ON DELETE CASCADE
- INDEX: `user_id`, `refresh_token`, `expires_at`, `is_revoked`

---

### 30. **audit_logs** - System Audit Logs
**Purpose:** Track system actions for security and debugging

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `log_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `user_id` | INT | FOREIGN KEY → users.user_id | User who performed action |
| `action_type` | VARCHAR(100) | NOT NULL | Action type (login, create, update, delete, etc.) |
| `entity_type` | VARCHAR(100) | NULL | Entity affected (order, pet, user, etc.) |
| `entity_id` | INT | NULL | Entity ID |
| `description` | TEXT | NULL | Action description |
| `ip_address` | VARCHAR(45) | NULL | User IP address |
| `user_agent` | VARCHAR(500) | NULL | Browser/client info |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Log time |

**Indexes:**
- PRIMARY KEY: `log_id`
- FOREIGN KEY: `user_id` → `users.user_id`
- INDEX: `user_id`, `action_type`, `entity_type`, `created_at`

---

## 🔗 Entity Relationship Summary

### Core Relationships:
1. **users** → **customers**, **doctors**, **staff** (1:1)
2. **customers** → **orders**, **appointments**, **customer_pets** (1:Many)
3. **doctors** → **appointments**, **health_records**, **doctor_schedules** (1:Many)
4. **pets** → **pet_images**, **order_items**, **pre_bookings** (1:Many)
5. **products** → **product_images**, **order_items**, **pre_bookings** (1:Many)
6. **orders** → **order_items**, **exchange_requests** (1:Many)
7. **appointments** → **health_records**, **chat_rooms** (1:Many)
8. **chat_rooms** → **chat_messages** (1:Many)
9. **customer_pets** → **pet_vaccinations**, **pet_feeding_schedules**, **appointments**, **health_records** (1:Many)

## 📝 Database Initialization Script

Create a SQL file: `database/schema.sql` with:
- Database creation
- All table creation statements
- All foreign key constraints
- All indexes
- Initial admin user (optional)

## ✅ Validation Checklist

- [ ] All 30 tables created
- [ ] All foreign keys defined
- [ ] All indexes created
- [ ] Constraints enforced (NOT NULL, UNIQUE, ENUM)
- [ ] Cascade rules set appropriately
- [ ] Default values defined
- [ ] Timestamps configured correctly

---

**Next Step:** [STEP 02: Frontend Architecture](./STEP-02-FRONTEND-ARCHITECTURE.md)

