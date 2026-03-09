# Fix PayHere "Unauthorized payment request" Error

## Problem
PayHere cannot reach `localhost` URLs for the notify webhook, causing "Unauthorized payment request" errors.

## Solution: Use ngrok for Local Testing

### Step 1: Install ngrok
Download from: https://ngrok.com/download

Or use npm:
```bash
npm install -g ngrok
```

### Step 2: Start ngrok
```bash
ngrok http 5000
```

This will give you a public URL like: `https://abc123.ngrok.io`

### Step 3: Update .env file
Add to `backend/.env`:
```env
BACKEND_URL=https://abc123.ngrok.io
PAYHERE_NOTIFY_URL=https://abc123.ngrok.io/api/payments/payhere/notify
```

### Step 4: Restart your server
The notify URL will now be publicly accessible to PayHere.

## Alternative: Use PayHere Test Mode
If you're just testing, PayHere sandbox might allow you to skip notify URL validation in some cases, but this is not recommended for production testing.

## Production
For production, use your actual domain:
```env
BACKEND_URL=https://yourdomain.com
PAYHERE_NOTIFY_URL=https://yourdomain.com/api/payments/payhere/notify
```

## Verify
After updating, check the logs - you should see:
```
notify_url: 'https://abc123.ngrok.io/api/payments/payhere/notify'
```

Instead of:
```
notify_url: 'http://localhost:5000/api/payments/payhere/notify'
```

