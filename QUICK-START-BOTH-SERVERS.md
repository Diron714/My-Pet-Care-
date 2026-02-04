# 🚀 Quick Start - Both Servers

## ⚠️ IMPORTANT: Both Servers Must Be Running!

Login will **NOT work** unless **BOTH** backend and frontend servers are running.

---

## 📋 Step-by-Step Startup

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```

**✅ Wait for:**
```
🚀 Server running on http://localhost:5000
📊 Environment: development
✅ Database connected successfully
```

**⚠️ Keep this terminal open!**

---

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

**✅ Wait for:**
```
  VITE v5.0.8  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

**⚠️ Keep this terminal open!**

---

### Browser: Open Application
Navigate to: **http://localhost:5173**

**Should automatically redirect to:** `/login`

---

## 🧪 Test Login

1. **Go to:** `http://localhost:5173/login`
2. **Enter:**
   - Email: `customer@test.com`
   - Password: `TestPass123!`
3. **Click:** "Login"
4. **Should:** Redirect to `/customer/dashboard`

---

## ✅ Verify Both Servers Are Running

### Check Backend:
- Open: `http://localhost:5000/health`
- Should see: `{"status":"OK","message":"Server is running"}`

### Check Frontend:
- Open: `http://localhost:5173`
- Should see: Login page

---

## 🔍 If Login Still Doesn't Work

### Check Browser Console (F12):
1. Press F12
2. Go to "Console" tab
3. Try to login
4. Look for errors

### Check Network Tab (F12):
1. Press F12
2. Go to "Network" tab
3. Try to login
4. Look for `/api/auth/login` request
5. Check status code (should be 200)

### Check Backend Terminal:
- Should see: `POST /api/auth/login HTTP/1.1 200`

---

## 🎯 Troubleshooting

### Backend Not Starting?
```bash
cd backend
npm install
npm run dev
```

### Frontend Not Starting?
```bash
cd frontend
npm install
npm run dev
```

### Port Already in Use?
- Backend (5000): Kill process using port 5000
- Frontend (5173): Kill process using port 5173

---

## ✅ Success Indicators

**Backend Running:**
- ✅ Terminal shows server running message
- ✅ `http://localhost:5000/health` works

**Frontend Running:**
- ✅ Terminal shows Vite ready message
- ✅ `http://localhost:5173` opens

**Login Working:**
- ✅ No errors in browser console
- ✅ Network tab shows 200 status
- ✅ Redirects to dashboard after login

---

**Remember: BOTH servers must be running for login to work!**

