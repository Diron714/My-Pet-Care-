# Fix Port 5000 Error

## ✅ Issue Fixed!

The process using port 5000 has been **terminated**. You can now start your server.

---

## 🚀 Start Server Now

```bash
cd backend
npm run dev
```

The server should start successfully now!

---

## 🔧 If It Happens Again

### Quick Fix (Windows Batch)
Double-click: `backend/fix-port-5000.bat`

### Quick Fix (PowerShell)
```powershell
cd backend
.\fix-port-5000.ps1
```

### Manual Fix

**Option 1: Kill Process**
```bash
# Find process
netstat -ano | findstr :5000

# Kill it (replace PID with actual process ID)
taskkill /F /PID <PID>
```

**Option 2: Change Port**
Edit `backend/.env`:
```env
PORT=5001
```
Then update `frontend/vite.config.js` proxy to port 5001.

---

## ✅ Port Status

Port 5000 is now **FREE** and ready to use!

---

**Try starting the server again: `npm run dev`**

