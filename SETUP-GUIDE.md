# My Pet Care+ - Complete Setup & Implementation Guide

## 🎯 Step-by-Step Implementation Guide

Follow these steps in order to set up and implement the complete system.

---

## 📊 STEP 1: Database Setup

### Option A: Using MySQL Command Line

1. **Open MySQL Command Line:**
   ```bash
   mysql -u root -p
   ```
   Enter your MySQL root password when prompted.

2. **Import the schema:**
   ```bash
   source C:/Users/Diron/Desktop/My Pet Care+/database/schema.sql
   ```
   
   Or use the full path:
   ```bash
   source "C:\Users\Diron\Desktop\My Pet Care+\database\schema.sql"
   ```

3. **Verify database creation:**
   ```sql
   USE mypetcare_db;
   SHOW TABLES;
   ```
   You should see 30 tables listed.

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to **File → Open SQL Script**
4. Select `database/schema.sql`
5. Click the **Execute** button (⚡ icon)
6. Verify tables are created in the left panel

### Option C: Using phpMyAdmin

1. Open phpMyAdmin in your browser
2. Click on **Import** tab
3. Choose file: `database/schema.sql`
4. Click **Go**
5. Verify database `mypetcare_db` is created with 30 tables

### Verification Query

Run this to verify all tables exist:
```sql
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'mypetcare_db';
```
Should return: **30**

---

## 📦 STEP 2: Backend Installation

### 2.1 Navigate to Backend Directory

```bash
cd "C:\Users\Diron\Desktop\My Pet Care+\backend"
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install all packages listed in `package.json`:
- express, mysql2, dotenv, bcrypt, jsonwebtoken
- nodemailer, cors, helmet, express-rate-limit
- And all other dependencies

**Expected output:** Should see "added X packages" message

### 2.3 Verify Installation

```bash
npm list --depth=0
```

You should see all packages listed.

---

## ⚙️ STEP 3: Backend Configuration

### 3.1 Create .env File

```bash
copy .env.example .env
```

Or manually:
1. Copy `backend/.env.example`
2. Rename to `backend/.env`

### 3.2 Configure .env File

Open `backend/.env` and update these values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration - UPDATE THESE!
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=mypetcare_db

# JWT Configuration - CHANGE THESE IN PRODUCTION!
JWT_ACCESS_SECRET=your_super_secret_access_token_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_change_in_production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email Configuration - UPDATE FOR YOUR EMAIL!
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@mypetcare.com

# OTP Configuration
OTP_EXPIRY_MINUTES=10

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:**
- Replace `your_mysql_password_here` with your actual MySQL password
- For Gmail: Use App Password (not regular password)
  - Go to Google Account → Security → 2-Step Verification → App Passwords
- Generate strong random strings for JWT secrets

### 3.3 Create Uploads Directory

```bash
mkdir uploads
```

---

## 🧪 STEP 4: Test Database Connection

### 4.1 Create Test Script

Create `backend/test-db.js`:

```javascript
import pool from './config/database.js';

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    console.log('Test query result:', rows);
    
    // Test table count
    const [tables] = await pool.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'mypetcare_db'"
    );
    console.log(`✅ Found ${tables[0].count} tables in database`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

### 4.2 Run Test

```bash
node test-db.js
```

**Expected output:**
```
✅ Database connected successfully
✅ Database connection successful!
Test query result: [ { test: 1 } ]
✅ Found 30 tables in database
```

If you see errors, check:
- MySQL is running
- Database credentials in `.env` are correct
- Database `mypetcare_db` exists

---

## 🚀 STEP 5: Start Backend Server

### 5.1 Start Development Server

```bash
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
✅ Email service ready
🚀 Server running on http://localhost:5000
📊 Environment: development
```

### 5.2 Test Server

Open browser or use curl:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status":"OK","message":"Server is running"}
```

---

## 🔨 STEP 6: Continue Implementation

Now that the foundation is set up, continue implementing features:

### Phase 1: Complete Backend Services

1. **Auth Service** (`services/authService.js`)
2. **JWT Service** (`services/jwtService.js`)
3. **Loyalty Service** (`services/loyaltyService.js`)
4. **Payment Service** (`services/paymentService.js`)
5. **File Upload Service** (`services/fileUploadService.js`)

### Phase 2: Create Database Models

Create models in `backend/models/`:
- User.js
- Customer.js
- Doctor.js
- Pet.js
- Product.js
- Order.js
- etc.

### Phase 3: Implement Authentication

1. **Auth Controller** (`controllers/authController.js`)
2. **Auth Routes** (`routes/authRoutes.js`)
3. **Connect to server.js**

### Phase 4: Implement Other Routes

Follow the pattern for:
- Customer routes
- Pet routes
- Product routes
- Order routes
- etc.

### Phase 5: Frontend Setup

1. Initialize React + Vite project
2. Install dependencies
3. Set up routing
4. Create pages
5. Connect to backend

---

## 📝 Implementation Order

Follow this order for best results:

1. ✅ Database setup (DONE)
2. ✅ Backend installation (DONE)
3. ✅ Configuration (DONE)
4. ⏳ Complete services
5. ⏳ Create models
6. ⏳ Implement auth routes
7. ⏳ Implement other routes
8. ⏳ Frontend setup
9. ⏳ Frontend pages
10. ⏳ Integration & testing

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** `ER_ACCESS_DENIED_ERROR`
- **Solution:** Check MySQL username and password in `.env`

**Error:** `ER_BAD_DB_ERROR`
- **Solution:** Database doesn't exist. Run schema.sql again

**Error:** `ECONNREFUSED`
- **Solution:** MySQL server is not running. Start MySQL service

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`
- **Solution:** Change PORT in `.env` or kill process using port 5000

### Module Not Found

**Error:** `Cannot find module 'xxx'`
- **Solution:** Run `npm install` again

### Email Not Working

**Error:** Email sending fails
- **Solution:** 
  - For Gmail: Use App Password (not regular password)
  - Check EMAIL_HOST, EMAIL_PORT in `.env`
  - Verify SMTP settings

---

## ✅ Next Steps

Once setup is complete:

1. **Test the foundation:**
   - Database connection ✅
   - Server starts ✅
   - Health endpoint works ✅

2. **Continue with implementation:**
   - See `STEP-04-BACKEND-ARCHITECTURE.md` for backend details
   - See `STEP-02-FRONTEND-ARCHITECTURE.md` for frontend details

3. **Follow the step files:**
   - Each STEP file has detailed implementation instructions
   - Follow them sequentially

---

**Ready to continue?** Let me know which phase you want to implement next!

