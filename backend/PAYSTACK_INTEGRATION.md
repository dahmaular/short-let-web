# Paystack Payment Integration

This application uses Paystack as the payment gateway for processing booking payments.

## Setup Instructions

### 1. Get Paystack API Keys

1. Sign up for a Paystack account at [https://paystack.com](https://paystack.com)
2. Navigate to Settings → API Keys & Webhooks
3. Copy your **Secret Key** and **Public Key**
4. Add them to your `.env` file:

```env
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
```

### 2. Configure Webhook

1. In your Paystack Dashboard, go to Settings → Webhooks
2. Add your webhook URL: `https://yourdomain.com/api/payments/webhook`
3. The webhook will automatically handle:
   - `charge.success` - Payment successful
   - `charge.failed` - Payment failed
   - `refund.processed` - Refund completed

## Payment Flow

### Step 1: Initialize Payment

**Endpoint:** `POST /api/payments/initialize`

**Request:**
```json
{
  "bookingId": "507f1f77bcf86cd799439011",
  "callbackUrl": "https://yourapp.com/booking/confirmation"
}
```

**Response:**
```json
{
  "success": true,
  "authorizationUrl": "https://checkout.paystack.com/xxxxxxxxxx",
  "accessCode": "xxxxxxxxxx",
  "reference": "T123456789"
}
```

**Frontend Action:**
- Redirect user to `authorizationUrl` to complete payment
- User enters card details on Paystack's secure checkout page
- After payment, user is redirected back to your `callbackUrl` with `reference` parameter

### Step 2: Verify Payment

**Endpoint:** `GET /api/payments/verify/:reference`

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "booking": { ... },
  "transaction": {
    "reference": "T123456789",
    "amount": 50000,
    "status": "success",
    "paidAt": "2024-01-01T12:00:00Z",
    "channel": "card"
  }
}
```

### Step 3: Process Refund (Optional)

**Endpoint:** `POST /api/payments/refund/:bookingId`

**Response:**
```json
{
  "success": true,
  "message": "Refund processed successfully. Funds will be returned within 5-7 business days.",
  "refund": {
    "id": 123456,
    "status": "pending",
    "amount": 50000
  }
}
```

## Frontend Integration Example

```javascript
// Step 1: Initialize payment
const initializePayment = async (bookingId) => {
  const response = await fetch('/api/payments/initialize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      bookingId,
      callbackUrl: `${window.location.origin}/booking/confirmation`
    })
  });
  
  const data = await response.json();
  
  // Redirect to Paystack checkout
  window.location.href = data.authorizationUrl;
};

// Step 2: Verify payment (on callback page)
const verifyPayment = async (reference) => {
  const response = await fetch(`/api/payments/verify/${reference}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Payment successful - show confirmation
    console.log('Booking confirmed:', data.booking);
  }
};

// Get reference from URL on callback page
const urlParams = new URLSearchParams(window.location.search);
const reference = urlParams.get('reference');

if (reference) {
  verifyPayment(reference);
}
```

## Testing

### Test Cards

Use these test cards in development mode:

**Successful Payment:**
- Card Number: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Failed Payment:**
- Card Number: `5060666666666666666`
- CVV: `123`
- Expiry: Any future date

### Test Flow

1. Create a booking on your frontend
2. Initialize payment with the booking ID
3. You'll be redirected to Paystack's test checkout page
4. Use test card details above
5. Complete payment
6. You'll be redirected back with `reference` parameter
7. Verify the payment to confirm booking

## Currency

All payments are processed in **Nigerian Naira (NGN)**.

Amounts are stored in kobo (100 kobo = 1 naira):
- Frontend: Display as ₦50,000
- Backend: Store as 5000000 (kobo)
- Paystack API: Send as 5000000 (kobo)

## Security

- Never expose your **Secret Key** on the frontend
- Only use the **Public Key** for frontend integrations
- Webhook signature verification ensures requests are from Paystack
- All payment endpoints require user authentication

## Webhook Security

The webhook endpoint verifies that requests are actually from Paystack by:
1. Checking the `x-paystack-signature` header
2. Computing HMAC SHA512 hash of the request body
3. Comparing computed hash with the signature

## Production Checklist

- [ ] Switch from test keys to live keys
- [ ] Update webhook URL to production domain
- [ ] Test with real (small amount) transactions
- [ ] Set up proper error logging
- [ ] Configure email notifications for failed payments
- [ ] Set up monitoring for webhook failures

## Support

For Paystack API documentation: [https://paystack.com/docs/api/](https://paystack.com/docs/api/)

For integration issues: [support@paystack.com](mailto:support@paystack.com)
