# My Pet Care+ - Setup Commands

## 🚀 Quick Setup Commands

Copy and paste these commands in order:

### 1. Database Setup (MySQL Command Line)

```bash
# Open MySQL
mysql -u root -p

# Then run:
source "C:/Users/Diron/Desktop/My Pet Care+/database/schema.sql"

# Or if using Windows path:
source "C:\\Users\\Diron\\Desktop\\My Pet Care+\\database\\schema.sql"

# Verify:
USE mypetcare_db;
SHOW TABLES;
```

### 2. Backend Installation

```powershell
# Navigate to backend
cd "C:\Users\Diron\Desktop\My Pet Care+\backend"

# Install dependencies
npm install

# Create .env file (if not exists)
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created - Please edit it with your credentials"
}

# Create uploads directory
if (-not (Test-Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads"
}
```

### 3. Configure .env File

**IMPORTANT:** Edit `backend/.env` and update:

1. **Database credentials:**
   ```
   DB_PASSWORD=your_mysql_password
   ```

2. **JWT secrets** (generate random strings):
   ```
   JWT_ACCESS_SECRET=generate_random_string_here
   JWT_REFRESH_SECRET=generate_another_random_string_here
   ```

3. **Email settings** (for Gmail):
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

### 4. Test Database Connection

```powershell
cd "C:\Users\Diron\Desktop\My Pet Care+\backend"
node test-db.js
```

**Expected:** Should see "✅ Database connection successful!" and list of 30 tables

### 5. Start Backend Server

```powershell
cd "C:\Users\Diron\Desktop\My Pet Care+\backend"
npm run dev
```

**Expected:** Server running on http://localhost:5000

### 6. Test Server

Open browser: http://localhost:5000/health

Or use PowerShell:
```powershell
Invoke-WebRequest -Uri http://localhost:5000/health
```

---

## 📋 Checklist

- [ ] MySQL database created (30 tables)
- [ ] Backend dependencies installed
- [ ] .env file configured
- [ ] Database connection test passes
- [ ] Server starts successfully
- [ ] Health endpoint responds

---

## 🔧 Generate JWT Secrets

You can generate random secrets using Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run twice to get two different secrets for ACCESS and REFRESH tokens.

---

## 📧 Gmail App Password Setup

1. Go to https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not enabled)
3. Security → App Passwords
4. Generate new app password for "Mail"
5. Use that 16-character password in EMAIL_PASSWORD

---

## ✅ Next: Continue Implementation

Once setup is complete, continue with:
1. Complete backend services
2. Create database models
3. Implement API routes
4. Set up frontend

See `SETUP-GUIDE.md` for detailed instructions.

