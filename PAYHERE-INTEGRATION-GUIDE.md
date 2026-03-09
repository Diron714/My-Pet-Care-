# PayHere.lk Payment Gateway Integration Guide

## 📋 Overview

This guide explains the PayHere.lk sandbox payment gateway integration in the My Pet Care+ system. The integration allows customers to pay for orders using credit/debit cards through PayHere's secure payment gateway.

## 🔑 Configuration

### Environment Variables

Add the following PayHere credentials to your `backend/.env` file:

```env
# PayHere Configuration
PAYHERE_MERCHANT_ID=1234392
PAYHERE_SECRET=MzQ5MDY2NjEzMjI4MTc4NzU5OTkxNTcyNjUxMjA3NzA1NzQxMDAw
PAYHERE_APP_ID=4OVybqJH3Ng4JH5Ex4ziQy3TZ
PAYHERE_APP_SECRET=4jo3SGrx50g8RiILaA0ofX4jo3RtWJ75U8LKY0df6Hh7
PAYHERE_SANDBOX=true

# PayHere URLs (Optional - defaults provided)
PAYHERE_NOTIFY_URL=http://localhost:5000/api/payments/payhere/notify
PAYHERE_RETURN_URL=http://localhost:5173/customer/orders
PAYHERE_CANCEL_URL=http://localhost:5173/customer/checkout

# Backend URL (for notify URL construction)
BACKEND_URL=http://localhost:5000
```

### Production Configuration

For production, update these values:

```env
PAYHERE_SANDBOX=false
PAYHERE_MERCHANT_ID=your_production_merchant_id
PAYHERE_SECRET=your_production_secret
PAYHERE_APP_ID=your_production_app_id
PAYHERE_APP_SECRET=your_production_app_secret
BACKEND_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

**⚠️ IMPORTANT:** 
- The notify URL must be publicly accessible (not localhost)
- Use HTTPS in production
- Update PayHere dashboard with your production notify URL

## 🔄 Payment Flow

### 1. Order Creation
- Customer selects "Credit/Debit Card" as payment method
- Order is created with `payment_status: 'pending'`
- Cart is NOT cleared yet (will be cleared after payment confirmation)

### 2. Payment Initiation
- Frontend calls `/api/payments/payhere/initiate` with order_id
- Backend generates PayHere payment data with hash
- Frontend creates and submits form to PayHere checkout

### 3. Payment Processing
- Customer completes payment on PayHere
- PayHere redirects to return URL
- PayHere sends notification to notify URL (webhook)

### 4. Payment Confirmation
- Backend receives notification at `/api/payments/payhere/notify`
- Payment hash is verified
- Order status updated to `paid` and `confirmed`
- Cart is cleared
- Loyalty points updated
- Customer receives notification

## 📁 File Structure

### Backend Files

```
backend/
├── services/
│   └── payhereService.js          # PayHere service with payment logic
├── controllers/
│   └── paymentController.js       # Payment endpoints
├── routes/
│   └── paymentRoutes.js           # Payment routes
└── server.js                       # Updated to include payment routes
```

### Frontend Files

```
frontend/src/
└── pages/customer/
    └── Checkout.jsx                # Updated to handle PayHere payment
```

## 🔌 API Endpoints

### 1. Initiate Payment
**POST** `/api/payments/payhere/initiate`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "order_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payment_data": {
      "merchant_id": "1234392",
      "order_id": "ORD-2024-1234",
      "amount": "1500.00",
      "currency": "LKR",
      "hash": "ABC123...",
      ...
    },
    "checkout_url": "https://sandbox.payhere.lk/pay/checkout",
    "order_id": 123,
    "order_number": "ORD-2024-1234"
  }
}
```

### 2. Payment Notification (Webhook)
**POST** `/api/payments/payhere/notify`

**Note:** This is called by PayHere, not your frontend.

**Request:** Form data from PayHere

**Response:** 
- `200 OK` - Payment processed successfully
- `400 ERROR` - Payment verification failed

### 3. Payment Return Handler
**GET** `/api/payments/payhere/return`

**Query Parameters:**
- `order_id` - Order number
- `payment_id` - PayHere payment ID
- `status_code` - Payment status (2 = success)
- `status_message` - Status message

**Response:** Redirects to frontend order page

### 4. Verify Payment
**POST** `/api/payments/payhere/verify`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "order_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": 123,
    "payment_status": "paid",
    "payhere_status": {...}
  }
}
```

## 🔒 Security Features

### 1. Payment Hash Verification
- MD5 hash generated using merchant secret
- Hash verified on both payment initiation and notification
- Prevents payment tampering

### 2. Amount Verification
- Order amount verified against PayHere amount
- Prevents amount manipulation

### 3. Order Verification
- Order must exist and belong to customer
- Prevents unauthorized payments

## 🧪 Testing

### Sandbox Test Cards

PayHere sandbox provides test cards for testing:

1. **Successful Payment:**
   - Card: 5123 4567 8901 2346
   - CVV: Any 3 digits
   - Expiry: Any future date

2. **Failed Payment:**
   - Card: 5123 4567 8901 2347
   - CVV: Any 3 digits
   - Expiry: Any future date

### Testing Steps

1. **Create Order:**
   - Add items to cart
   - Go to checkout
   - Select "Credit/Debit Card" payment
   - Fill shipping address
   - Click "Place Order"

2. **Payment Flow:**
   - Order created
   - Redirected to PayHere checkout
   - Enter test card details
   - Complete payment

3. **Verify:**
   - Check order status (should be "paid" and "confirmed")
   - Check cart (should be empty)
   - Check loyalty points (should be updated)
   - Check notifications (should have payment confirmation)

## 🐛 Troubleshooting

### Payment Not Processing

1. **Check Notify URL:**
   - Must be publicly accessible
   - Must accept POST requests
   - Check PayHere dashboard for URL configuration

2. **Check Hash:**
   - Verify merchant secret is correct
   - Check hash generation logic
   - Ensure hash is uppercase

3. **Check Order Status:**
   - Verify order exists
   - Check payment_status is 'pending'
   - Verify order belongs to customer

### Notification Not Received

1. **Check Server Logs:**
   - Look for "PayHere notification received" log
   - Check for errors in notification handler

2. **Check PayHere Dashboard:**
   - View payment logs
   - Check notification delivery status

3. **Test Notify URL:**
   - Use curl or Postman to test endpoint
   - Verify it returns 200 OK

### Amount Mismatch

1. **Check Order Amount:**
   - Verify final_amount calculation
   - Check for discount/loyalty point deductions

2. **Check PayHere Amount:**
   - Verify amount sent to PayHere
   - Check for currency conversion issues

## 📝 Notes

- PayHere sandbox is for testing only
- Switch to production credentials before going live
- Notify URL must be HTTPS in production
- Keep merchant secret secure (never commit to git)
- Monitor payment logs regularly
- Test all payment scenarios before production

## 🔗 Resources

- [PayHere Documentation](https://support.payhere.lk/)
- [PayHere Sandbox](https://sandbox.payhere.lk/)
- [PayHere API Reference](https://support.payhere.lk/api-reference-and-technical-documentation)

---

**Status:** ✅ PayHere Integration Complete
**Last Updated:** Integration Implementation

