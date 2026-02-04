# My Pet Care+ - Step-by-Step Setup Guide

## 🎯 Complete Setup Instructions

Follow these steps **in order** to set up your development environment.

---

## STEP 1: Database Setup ⚙️

### Option 1: MySQL Command Line (Recommended)

1. **Open Command Prompt or PowerShell**

2. **Connect to MySQL:**
   ```bash
   mysql -u root -p
   ```
   Enter your MySQL root password.

3. **Import the schema:**
   ```sql
   source "C:/Users/Diron/Desktop/My Pet Care+/database/schema.sql"
   ```
   
   **Note:** Use forward slashes `/` in the path, not backslashes.

4. **Verify the database:**
   ```sql
   USE mypetcare_db;
   SHOW TABLES;
   ```
   
   You should see **30 tables** listed.

5. **Exit MySQL:**
   ```sql
   exit;
   ```

### Option 2: MySQL Workbench

1. Open MySQL Workbench
2. Connect to your server
3. Click **File → Open SQL Script**
4. Navigate to: `C:\Users\Diron\Desktop\My Pet Care+\database\schema.sql`
5. Click **Execute** (⚡ icon) or press `Ctrl+Shift+Enter`
6. Check the left panel - you should see `mypetcare_db` with 30 tables

### Option 3: phpMyAdmin

1. Open phpMyAdmin in browser (usually `http://localhost/phpmyadmin`)
2. Click **Import** tab
3. Click **Choose File**
4. Select: `C:\Users\Diron\Desktop\My Pet Care+\database\schema.sql`
5. Click **Go**
6. Verify database appears in left sidebar

---

## STEP 2: Install Backend Dependencies 📦

1. **Open PowerShell or Command Prompt**

2. **Navigate to backend directory:**
   ```powershell
   cd "C:\Users\Diron\Desktop\My Pet Care+\backend"
   ```

3. **Install all packages:**
   ```powershell
   npm install
   ```
   
   This will take a few minutes. You should see:
   ```
   added 234 packages, and audited 235 packages in 2m
   ```

4. **Verify installation:**
   ```powershell
   npm list --depth=0
   ```
   
   You should see packages like: express, mysql2, bcrypt, etc.

---

## STEP 3: Configure Environment Variables ⚙️

### 3.1 The .env file is already created for you!

The `.env` file has been created from the template. Now you need to **edit it** with your actual values.

### 3.2 Open `.env` file

Open: `C:\Users\Diron\Desktop\My Pet Care+\backend\.env`

### 3.3 Update Required Values

**1. Database Password:**
```env
DB_PASSWORD=your_actual_mysql_password_here
```
Replace `your_password` with your MySQL root password.

**2. JWT Secrets (Generate Random Strings):**

Open PowerShell and run this **twice** to generate two secrets:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the first output to:
```env
JWT_ACCESS_SECRET=first_generated_string_here
```

Copy the second output to:
```env
JWT_REFRESH_SECRET=second_generated_string_here
```

**3. Email Configuration (For Gmail):**

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

**To get Gmail App Password:**
1. Go to https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** (if not enabled)
4. Go back to Security → **App Passwords**
5. Select app: **Mail**, Device: **Other (Custom name)**
6. Enter: "My Pet Care+"
7. Click **Generate**
8. Copy the 16-character password (no spaces)
9. Paste in `EMAIL_PASSWORD`

**4. Keep Defaults (for now):**
- PORT=5000 ✅
- DB_HOST=localhost ✅
- DB_NAME=mypetcare_db ✅
- Other settings can stay as default

### 3.4 Save the .env file

---

## STEP 4: Test Database Connection 🧪

1. **Navigate to backend:**
   ```powershell
   cd "C:\Users\Diron\Desktop\My Pet Care+\backend"
   ```

2. **Run the test script:**
   ```powershell
   node test-db.js
   ```

3. **Expected Output:**
   ```
   ✅ Database connected successfully
   ✅ Database connection successful!
   Test query result: [ { test: 1 } ]
   ✅ Found 30 tables in database
   
   📋 Tables in database:
      1. appointments
      2. audit_logs
      3. carts
      ... (all 30 tables listed)
   ```

4. **If you see errors:**
   - ❌ "Access denied" → Check DB_PASSWORD in .env
   - ❌ "Unknown database" → Run schema.sql again
   - ❌ "Connection refused" → Start MySQL service

---

## STEP 5: Start Backend Server 🚀

1. **Make sure you're in backend directory:**
   ```powershell
   cd "C:\Users\Diron\Desktop\My Pet Care+\backend"
   ```

2. **Start the development server:**
   ```powershell
   npm run dev
   ```

3. **Expected Output:**
   ```
   ✅ Database connected successfully
   ✅ Email service ready
   🚀 Server running on http://localhost:5000
   📊 Environment: development
   ```

4. **Keep this terminal open!** The server is now running.

5. **Test the server:**
   - Open browser: http://localhost:5000/health
   - Or use PowerShell:
     ```powershell
     Invoke-WebRequest -Uri http://localhost:5000/health
     ```
   
   Should return: `{"status":"OK","message":"Server is running"}`

---

## ✅ Setup Complete Checklist

- [ ] MySQL database created with 30 tables
- [ ] Backend dependencies installed (`npm install` completed)
- [ ] `.env` file configured with:
  - [ ] MySQL password
  - [ ] JWT secrets (generated)
  - [ ] Email credentials (Gmail app password)
- [ ] Database connection test passes (`node test-db.js`)
- [ ] Backend server starts successfully (`npm run dev`)
- [ ] Health endpoint works (http://localhost:5000/health)

---

## 🎉 Congratulations!

Your backend foundation is now set up and running! 

### What's Next?

Now you can continue implementing features:

1. **Complete Backend Services** (see next section)
2. **Create Database Models**
3. **Implement API Routes**
4. **Set Up Frontend**

---

## 📚 Next Steps: Continue Implementation

### Phase 1: Complete Backend Services

I'll help you implement the remaining services:
- `services/authService.js` - User registration, login logic
- `services/jwtService.js` - Token management
- `services/loyaltyService.js` - Loyalty points calculation
- `services/paymentService.js` - Payment processing (mock)
- `services/fileUploadService.js` - Image upload handling

### Phase 2: Create Database Models

Create models for database operations:
- `models/User.js`
- `models/Customer.js`
- `models/Pet.js`
- etc.

### Phase 3: Implement Authentication

- Auth controller
- Auth routes
- Connect to server

### Phase 4: Frontend Setup

- Initialize React + Vite
- Set up routing
- Create pages

---

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot find module" errors:**
```powershell
# Solution: Reinstall dependencies
cd backend
rm -r node_modules
npm install
```

**2. Port 5000 already in use:**
```env
# Solution: Change port in .env
PORT=5001
```

**3. Email not sending:**
- Verify Gmail App Password (not regular password)
- Check EMAIL_HOST and EMAIL_PORT
- Ensure 2-Step Verification is enabled

**4. Database connection fails:**
- Verify MySQL is running
- Check credentials in .env
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

---

## 📞 Need Help?

Refer to:
- `SETUP-GUIDE.md` - Detailed setup instructions
- `SETUP-COMMANDS.md` - Quick command reference
- `STEP-04-BACKEND-ARCHITECTURE.md` - Backend architecture details
- `QUICK-START.md` - Quick reference guide

---

**Ready to continue?** Let me know when you've completed the setup steps above, and I'll help you implement the next phase!

