# Quick Email Setup Guide

## 🚀 Fast Setup (5 minutes)

### For Gmail Users (Most Common)

#### Step 1: Get Gmail App Password (2 minutes)

1. **Go to:** https://myaccount.google.com/security
2. **Enable 2-Step Verification** (if not already enabled)
   - Click "2-Step Verification"
   - Follow the setup wizard
3. **Generate App Password:**
   - Go back to Security page
   - Click "App passwords" (under 2-Step Verification)
   - Select "Mail" → "Other (Custom name)"
   - Name it: "My Pet Care+"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

#### Step 2: Update .env File (1 minute)

Open `backend/.env` and find or add these lines:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
EMAIL_FROM=My Pet Care+ <your_actual_email@gmail.com>
```

**Replace:**
- `your_actual_email@gmail.com` → Your Gmail address
- `your_16_character_app_password` → The 16-character password (remove spaces)

**Example:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd1234efgh5678
EMAIL_FROM=My Pet Care+ <john.doe@gmail.com>
```

#### Step 3: Test Configuration (1 minute)

Run this command:

```bash
cd backend
node test-email.js
```

**Expected Output:**
```
✅ SMTP connection successful!
✅ Test email sent successfully!
🎉 Email service is fully configured and working!
```

#### Step 4: Restart Server (1 minute)

Restart your backend server:

```bash
cd backend
npm run dev
```

You should now see:
```
✅ Email service ready
```

Instead of:
```
❌ Email service error: ...
```

---

## ✅ Verification Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated
- [ ] `.env` file updated with email settings
- [ ] Test script runs successfully
- [ ] Server shows "✅ Email service ready"
- [ ] Test email received in inbox

---

## 🎯 What Happens Next?

Once configured:
- ✅ OTP emails will be sent during registration
- ✅ Password reset emails will work
- ✅ All email notifications will function

---

## 🆘 Quick Troubleshooting

**"Invalid login" error?**
→ Make sure you're using App Password, not regular password

**"Greeting never received" error?**
→ Check internet connection, try port 465 with `EMAIL_SECURE=true`

**Email not received?**
→ Check spam folder, verify email address is correct

---

**For detailed instructions, see:** `EMAIL-CONFIGURATION-GUIDE.md`

