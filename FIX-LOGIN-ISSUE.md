# 🔧 Fix Login Issue - Step by Step Guide

## ❌ Issue Found: Backend Server Not Running

The login is not working because the **backend server is not running**.

---

## ✅ Solution: Start Backend Server

### Step 1: Open Terminal/Command Prompt
Open a new terminal window.

### Step 2: Navigate to Backend Directory
```bash
cd backend
```

### Step 3: Start Backend Server
```bash
npm run dev
```

**Wait for this message:**
```
🚀 Server running on http://localhost:5000
📊 Environment: development
✅ Database connected successfully
```

### Step 4: Keep Terminal Open
**IMPORTANT:** Keep this terminal window open! The server must keep running.

---

## ✅ Verify Backend is Running

### Check 1: Look for Server Message
You should see:
```
🚀 Server running on http://localhost:5000
```

### Check 2: Test in Browser
Open: `http://localhost:5000/health`

You should see:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Check 3: Check Terminal Logs
When you try to login, you should see requests in the terminal like:
```
::1 - - [27/Jan/2026:...] "POST /api/auth/login HTTP/1.1" 200 ...
```

---

## 🔍 If Backend Won't Start

### Issue 1: Port 5000 Already in Use
**Error:** `EADDRINUSE` or "Port 5000 is already in use"

**Solution:**
1. Find what's using port 5000:
   ```bash
   netstat -ano | findstr :5000
   ```
2. Kill the process or use a different port

### Issue 2: Database Connection Error
**Error:** `Database connection error`

**Solution:**
1. Make sure MySQL is running
2. Check `.env` file has correct database credentials
3. Verify database `mypetcare_db` exists

### Issue 3: Missing Dependencies
**Error:** `Cannot find module`

**Solution:**
```bash
cd backend
npm install
```

---

## 🧪 Test Login After Starting Server

### 1. Backend Running?
- ✅ Terminal shows: `🚀 Server running on http://localhost:5000`
- ✅ `http://localhost:5000/health` returns OK

### 2. Frontend Running?
- ✅ Terminal shows: `➜  Local:   http://localhost:5173/`
- ✅ Browser opens to `http://localhost:5173`

### 3. Try Login:
1. Go to: `http://localhost:5173/login`
2. Enter: `customer@test.com` / `TestPass123!`
3. Click "Login"
4. Should redirect to `/customer/dashboard`

---

## 🔍 Debug Steps

### Check Browser Console (F12)
Look for errors like:
- `Network Error` → Backend not running
- `CORS Error` → CORS not configured
- `401 Unauthorized` → Wrong credentials
- `404 Not Found` → Wrong API URL

### Check Network Tab (F12 → Network)
1. Try to login
2. Look for `/api/auth/login` request
3. Check:
   - **Status:** Should be 200 (not 404 or 500)
   - **Request URL:** Should be `http://localhost:5000/api/auth/login`
   - **Response:** Should have `success: true`

### Check Backend Terminal
When you click login, you should see:
```
POST /api/auth/login HTTP/1.1 200
```

---

## ✅ Quick Fix Checklist

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Frontend server is running (`npm run dev` in frontend folder)
- [ ] Database is connected (check backend terminal)
- [ ] Port 5000 is available
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls

---

## 🚀 Complete Startup Guide

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
**Wait for:** `🚀 Server running on http://localhost:5000`

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
**Wait for:** `➜  Local:   http://localhost:5173/`

### Browser
Open: `http://localhost:5173`

---

## 🎯 Expected Behavior

### When Login Works:
1. Enter email and password
2. Click "Login"
3. See success toast: "Login successful!"
4. Automatically redirects to dashboard
5. Backend terminal shows: `POST /api/auth/login 200`

### When Login Fails:
1. See error toast with message
2. Stay on login page
3. Check browser console for details
4. Check backend terminal for errors

---

## 💡 Common Issues & Fixes

### Issue: "Network Error"
**Fix:** Backend server not running → Start backend

### Issue: "CORS Error"
**Fix:** Check backend CORS settings in `server.js`

### Issue: "404 Not Found"
**Fix:** Check API URL in `frontend/src/services/api.js`

### Issue: "401 Unauthorized"
**Fix:** Wrong email/password → Use test users

### Issue: "500 Internal Server Error"
**Fix:** Check backend terminal for error details

---

## ✅ After Starting Backend

Once backend is running, try login again:
1. Go to `http://localhost:5173/login`
2. Use: `customer@test.com` / `TestPass123!`
3. Should work now!

---

**The main issue is: Backend server must be running for login to work!**

