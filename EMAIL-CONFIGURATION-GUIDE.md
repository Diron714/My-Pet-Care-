# Email Configuration Guide - My Pet Care+

This guide will help you configure email service for sending OTP codes and notifications.

---

## 📧 Option 1: Gmail (Recommended for Development)

Gmail is the easiest option for development and testing.

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Sign in with your Gmail account
3. Under "Signing in to Google", find **2-Step Verification**
4. Click on it and follow the prompts to enable it
   - You'll need to verify your phone number
   - This is required to generate App Passwords

### Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to [Security Settings](https://myaccount.google.com/security)
2. Under "Signing in to Google", find **App passwords**
3. Click on **App passwords**
4. You may need to sign in again
5. Select **Mail** as the app
6. Select **Other (Custom name)** as the device
7. Enter a name like "My Pet Care+ App"
8. Click **Generate**
9. **Copy the 16-character password** (you'll see it only once!)
   - It will look like: `abcd efgh ijkl mnop`
   - Remove spaces when using: `abcdefghijklmnop`

### Step 3: Update .env File

Open `backend/.env` and update these lines:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=noreply@mypetcare.com
```

**Replace:**
- `your_email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with the 16-character app password you generated
- `noreply@mypetcare.com` with your preferred sender name (can be your Gmail)

**Example:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd1234efgh5678
EMAIL_FROM=My Pet Care+ <john.doe@gmail.com>
```

---

## 📧 Option 2: Outlook/Hotmail

### Step 1: Enable App Password

1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Sign in with your Outlook/Hotmail account
3. Click **Security** → **Advanced security options**
4. Under "App passwords", click **Create a new app password**
5. Give it a name like "My Pet Care+"
6. Click **Generate**
7. **Copy the password** (you'll see it only once!)

### Step 2: Update .env File

```env
# Email Configuration
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@mypetcare.com
```

---

## 📧 Option 3: Yahoo Mail

### Step 1: Generate App Password

1. Go to [Yahoo Account Security](https://login.yahoo.com/account/security)
2. Sign in with your Yahoo account
3. Click **Generate app password**
4. Select **Mail** and give it a name
5. Click **Generate**
6. **Copy the password**

### Step 2: Update .env File

```env
# Email Configuration
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@yahoo.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@mypetcare.com
```

---

## 📧 Option 4: Custom SMTP Server

If you have your own email server or use a service like SendGrid, Mailgun, etc.:

```env
# Email Configuration
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_username
EMAIL_PASSWORD=your_password
EMAIL_FROM=noreply@yourdomain.com
```

**Common SMTP Settings:**
- **SendGrid:** `smtp.sendgrid.net`, Port: 587
- **Mailgun:** `smtp.mailgun.org`, Port: 587
- **AWS SES:** `email-smtp.region.amazonaws.com`, Port: 587

---

## ✅ Testing Email Configuration

### Method 1: Start the Server

After updating `.env`, restart your backend server:

```bash
cd backend
npm run dev
```

**Look for this message:**
```
✅ Email service ready
```

If you see:
```
❌ Email service error: ...
```
Then check your credentials again.

### Method 2: Run Test Script

I've created a test script for you. Run:

```bash
cd backend
node test-email.js
```

This will attempt to send a test email to verify your configuration.

---

## 🔒 Security Best Practices

1. **Never commit `.env` to Git**
   - The `.env` file is already in `.gitignore`
   - Never share your app password publicly

2. **Use App Passwords, Not Regular Passwords**
   - Regular passwords won't work with Gmail/Outlook
   - App passwords are more secure

3. **Rotate Passwords Regularly**
   - Generate new app passwords periodically
   - Delete old unused app passwords

4. **Use Environment Variables in Production**
   - Don't hardcode credentials
   - Use secure secret management services

---

## 🐛 Troubleshooting

### Error: "Greeting never received"

**Cause:** Connection timeout or wrong SMTP settings

**Solutions:**
1. Check your internet connection
2. Verify `EMAIL_HOST` is correct
3. Try port 465 with `EMAIL_SECURE=true` for Gmail
4. Check if your firewall is blocking the connection

### Error: "Invalid login"

**Cause:** Wrong email or password

**Solutions:**
1. Verify `EMAIL_USER` is your full email address
2. Make sure you're using an **App Password**, not your regular password
3. For Gmail, ensure 2-Step Verification is enabled
4. Check for extra spaces in the password

### Error: "Authentication failed"

**Cause:** App password not generated or expired

**Solutions:**
1. Generate a new app password
2. Make sure you copied the entire password (no spaces)
3. Verify 2-Step Verification is enabled

### Error: "Connection refused"

**Cause:** Wrong port or host

**Solutions:**
1. Try port 587 (TLS) or 465 (SSL)
2. Verify the SMTP host is correct
3. Check if your ISP blocks SMTP ports

---

## 📝 Quick Reference

### Gmail Settings
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password_16_chars
EMAIL_FROM=Your Name <your_email@gmail.com>
```

### Alternative Gmail (SSL)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password_16_chars
EMAIL_FROM=Your Name <your_email@gmail.com>
```

---

## 🎯 Next Steps

After configuring email:

1. **Test the configuration** using the test script
2. **Restart your backend server**
3. **Try registering a new user** - you should receive an OTP email
4. **Check spam folder** if email doesn't arrive

---

## 💡 Tips

- **Development:** Use Gmail for easy setup
- **Production:** Consider using professional email services (SendGrid, Mailgun, AWS SES)
- **Testing:** You can use services like [Mailtrap](https://mailtrap.io/) for testing without sending real emails

---

**Need Help?** Check the error message in your server console for specific details about what went wrong.

