# Paystack Callback URL Fix

## The Problem
After successful payment on Paystack, the app was redirecting to the homepage instead of the confirmation page.

## Root Cause
The callback URL format wasn't compatible with:
1. Hash-based routing (`#/confirmation`)
2. Paystack's automatic query parameter appending

## The Solution

### 1. Updated Callback URL in BookingPage
**Before:**
```typescript
callbackUrl: `${window.location.origin}/#/confirmation?reference=`
```

**After:**
```typescript
callbackUrl: `${window.location.origin}/#/confirmation`
```

**Why:** Paystack automatically appends query parameters like `?reference=xxx&trxref=xxx`. We don't need to add `?reference=` manually.

### 2. Enhanced Reference Extraction in ConfirmationPage
**Before:**
```typescript
const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
const reference = urlParams.get("reference");
```

**After:**
```typescript
const getReference = () => {
  // Check hash-based query params (e.g., #/confirmation?reference=abc)
  const hashParts = window.location.hash.split("?");
  if (hashParts[1]) {
    const hashParams = new URLSearchParams(hashParts[1]);
    const ref = hashParams.get("reference");
    if (ref) return ref;
  }
  
  // Check regular query params (e.g., ?reference=abc#/confirmation)
  const searchParams = new URLSearchParams(window.location.search);
  const ref = searchParams.get("reference");
  if (ref) return ref;
  
  // Check for 'trxref' which Paystack also uses
  const trxref = searchParams.get("trxref") || 
                 new URLSearchParams(hashParts[1] || "").get("trxref");
  return trxref;
};
```

**Why:** Paystack may redirect with different URL formats:
- `http://localhost:5173/#/confirmation?reference=abc123`
- `http://localhost:5173/?reference=abc123#/confirmation`
- `http://localhost:5173/#/confirmation?trxref=abc123&reference=abc123`

The enhanced extraction handles all these formats.

## How Paystack Callback Works

1. **User completes payment on Paystack**
   - Paystack checkout page
   - User enters card details and pays

2. **Paystack redirects to callback URL**
   - Base URL: `http://localhost:5173/#/confirmation`
   - Paystack appends: `?reference=T123456789&trxref=T123456789`
   - Final URL: `http://localhost:5173/#/confirmation?reference=T123456789&trxref=T123456789`

3. **ConfirmationPage extracts reference**
   - Checks multiple URL formats
   - Extracts either `reference` or `trxref` parameter
   - Calls verify endpoint: `GET /api/payments/verify/:reference`

4. **Backend verifies payment**
   - Calls Paystack API to verify transaction
   - Updates booking status to "confirmed"
   - Returns booking details to frontend

5. **User sees confirmation**
   - Booking details displayed
   - Confirmation number shown
   - Email notification sent

## Testing the Flow

### 1. Start Servers
```bash
# Backend
cd backend && npm run dev

# Frontend
cd .. && npm run dev
```

### 2. Complete a Booking
1. Browse properties
2. Select dates and book
3. Enter guest details
4. Confirm booking

### 3. Test Payment
**Use Paystack Test Card:**
- Card: 4084084084084081
- CVV: 408
- Expiry: Any future date
- PIN: 0000
- OTP: 123456

### 4. Verify Redirect
After successful payment:
- ✅ Should redirect to: `http://localhost:5173/#/confirmation?reference=xxx`
- ✅ Should see: "Verifying payment..." spinner
- ✅ Should see: Booking confirmation with details
- ❌ Should NOT redirect to homepage

## URL Formats Supported

| Format | Example | Supported |
|--------|---------|-----------|
| Hash with query params | `/#/confirmation?reference=abc` | ✅ Yes |
| Query params with hash | `/?reference=abc#/confirmation` | ✅ Yes |
| Trxref parameter | `/#/confirmation?trxref=abc` | ✅ Yes |
| Multiple parameters | `/#/confirmation?reference=abc&trxref=abc` | ✅ Yes |

## Debug Logging
Added console logs in ConfirmationPage to help debug URL issues:
```typescript
if (!reference) {
  console.log("No reference found. Full URL:", window.location.href);
  console.log("Hash:", window.location.hash);
  console.log("Search:", window.location.search);
}
```

## Additional Notes

### Production Considerations
1. **Update callback URL for production:**
   ```typescript
   callbackUrl: `${process.env.REACT_APP_FRONTEND_URL}/#/confirmation`
   ```

2. **Enable HTTPS:**
   - Paystack requires HTTPS for production callbacks
   - Get SSL certificate for your domain

3. **Configure Paystack webhook:**
   - Add webhook URL in Paystack dashboard
   - Endpoint: `https://yourdomain.com/api/payments/webhook`
   - Events: `charge.success`, `charge.failed`, `refund.processed`

4. **Test with live keys:**
   - Replace test keys with live keys in production
   - Test thoroughly before going live

### Troubleshooting
If redirect still goes to homepage:
1. Check browser console for reference extraction logs
2. Verify callback URL in Paystack dashboard
3. Check if router is configured correctly
4. Ensure hash routing is working (`#/` prefix)

### Alternative: Use React Router DOM
For better URL handling, consider migrating from hash routing to:
```bash
npm install react-router-dom
```

This provides better control over routes and query parameters.
