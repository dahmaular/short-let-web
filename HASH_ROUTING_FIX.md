# Hash-Based Routing Fix

## The Problem
When Paystack redirected back with the URL:
```
http://localhost:5174/?trxref=kxbhr5aauw&reference=kxbhr5aauw#/confirmation
```

The app was still showing the **homepage** instead of the **confirmation page**.

## Root Cause
The application had **NO hash change detection**. The router was purely context-based without listening to URL hash changes. When Paystack redirected with `#/confirmation`, the hash changed but the app didn't respond to it.

## The Solution

### 1. Added Hash Change Listener in App.tsx

Added a `useEffect` hook that:
- ✅ Listens for `hashchange` events
- ✅ Parses the hash path (e.g., `#/confirmation` → `confirmation`)
- ✅ Maps hash paths to page names
- ✅ Updates the app state when hash changes
- ✅ Handles initial page load based on hash

**Code Added:**
```typescript
useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash.slice(1); // Remove the '#'
    const path = hash.split('?')[0]; // Get path before query params
    
    // Map hash paths to pages
    const pageMap: Record<string, Page> = {
      '/': 'home',
      '/home': 'home',
      '/listings': 'listings',
      '/property': 'property',
      '/booking': 'booking',
      '/confirmation': 'confirmation',
      '/dashboard': 'dashboard',
      '/host': 'host',
      '/login': 'login',
      '/signup': 'signup',
    };

    const page = pageMap[path] || 'home';
    
    // Only dispatch if the page is different
    if (page !== state.currentPage) {
      dispatch({ type: 'SET_PAGE', payload: page });
    }
  };

  // Handle initial load
  handleHashChange();

  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);

  return () => {
    window.removeEventListener('hashchange', handleHashChange);
  };
}, [dispatch, state.currentPage]);
```

### 2. Updated navigate() Function in router.ts

Enhanced the `navigate` function to:
- ✅ Update `window.location.hash` when navigating
- ✅ Trigger hash change events
- ✅ Keep URL in sync with app state

**Code Added:**
```typescript
const navigate = (page: Page, propertyId?: string) => {
  // Update the hash to trigger navigation
  const pageMap: Record<Page, string> = {
    home: '/',
    listings: '/listings',
    property: '/property',
    booking: '/booking',
    confirmation: '/confirmation',
    dashboard: '/dashboard',
    host: '/host',
    login: '/login',
    signup: '/signup',
  };

  window.location.hash = pageMap[page] || '/';
  
  dispatch({ type: 'SET_PAGE', payload: page });
  if (propertyId) {
    dispatch({ type: 'SET_PROPERTY', payload: propertyId });
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

## How It Works Now

### Scenario 1: User Navigates Within App
```typescript
// User clicks "Browse Properties"
navigate('listings');
// Sets: window.location.hash = '#/listings'
// Triggers: hashchange event
// Result: ListingsPage renders
```

### Scenario 2: Paystack Redirect
```
1. User completes payment on Paystack
2. Paystack redirects to: http://localhost:5174/?trxref=xxx&reference=xxx#/confirmation
3. Browser loads page with hash: #/confirmation
4. App's useEffect detects hash on load
5. Extracts path: '/confirmation'
6. Maps to page: 'confirmation'
7. Dispatches: { type: 'SET_PAGE', payload: 'confirmation' }
8. ConfirmationPage renders
9. ConfirmationPage extracts reference from URL
10. Verifies payment and shows booking details
```

### Scenario 3: Browser Back/Forward
```
1. User clicks browser back button
2. Hash changes (e.g., #/confirmation → #/booking)
3. hashchange event fires
4. App updates currentPage state
5. Correct page renders
```

### Scenario 4: Direct URL Access
```
1. User opens: http://localhost:5174/#/dashboard
2. App loads
3. useEffect runs on mount
4. Detects hash: '#/dashboard'
5. Sets page to 'dashboard'
6. DashboardPage renders
```

## URL Formats Handled

| URL Format | Detected Path | Page Rendered |
|------------|---------------|---------------|
| `http://localhost:5174/` | `/` | HomePage |
| `http://localhost:5174/#/listings` | `/listings` | ListingsPage |
| `http://localhost:5174/#/confirmation` | `/confirmation` | ConfirmationPage |
| `http://localhost:5174/#/confirmation?reference=abc` | `/confirmation` | ConfirmationPage |
| `http://localhost:5174/?trxref=abc#/confirmation` | `/confirmation` | ConfirmationPage ✅ |
| `http://localhost:5174/?reference=abc&trxref=abc#/confirmation` | `/confirmation` | ConfirmationPage ✅ |

## Testing Instructions

### 1. Test Direct Navigation
```bash
# In browser, manually navigate to:
http://localhost:5174/#/confirmation
# Should show: ConfirmationPage (with "No payment reference found" error)

http://localhost:5174/#/listings
# Should show: ListingsPage with properties

http://localhost:5174/#/dashboard
# Should show: DashboardPage (or login if not authenticated)
```

### 2. Test In-App Navigation
```javascript
// Click any navigation link in the app
// Check browser URL bar - should update with hash
// Click browser back button - should navigate back
// Click browser forward button - should navigate forward
```

### 3. Test Paystack Flow
```bash
1. Complete booking flow
2. Pay on Paystack (use test card: 4084084084084081)
3. After payment, Paystack redirects with URL like:
   http://localhost:5174/?trxref=xxx&reference=xxx#/confirmation
4. App should:
   ✅ Show ConfirmationPage
   ✅ Show "Verifying payment..." spinner
   ✅ Show booking confirmation after verification
   ❌ NOT show HomePage
```

## Benefits of This Fix

1. **URL Sync** - Browser URL always reflects current page
2. **Deep Linking** - Users can bookmark specific pages
3. **Browser Navigation** - Back/forward buttons work correctly
4. **Share URLs** - Users can share links to specific pages
5. **Paystack Compatible** - Works with Paystack redirects
6. **SEO Friendly** - (When combined with proper meta tags)

## Additional Improvements

### Optional: Persist Property ID in URL
```typescript
// In PropertyDetailPage, you could do:
window.location.hash = `#/property?id=${propertyId}`;

// Then extract it:
const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
const propertyId = urlParams.get('id');
```

### Optional: Add 404 Page
```typescript
const pageMap: Record<string, Page> = {
  // ... existing routes
};

const page = pageMap[path];

if (!page) {
  // Show 404 page
  return <NotFoundPage />;
}
```

### Optional: Add Loading State
```typescript
const [isNavigating, setIsNavigating] = useState(false);

const handleHashChange = () => {
  setIsNavigating(true);
  // ... page change logic
  setIsNavigating(false);
};

// Show loading indicator during navigation
```

## Troubleshooting

### Issue: Page doesn't change when hash changes
**Solution:** Check browser console for errors. Ensure `useEffect` dependency array is correct.

### Issue: Hash changes but shows wrong page
**Solution:** Check `pageMap` in both `App.tsx` and `router.ts` - they must match.

### Issue: Paystack redirect still goes to homepage
**Solution:**
1. Clear browser cache
2. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
3. Check console logs for hash value
4. Verify callback URL doesn't have typos

### Issue: Browser back button doesn't work
**Solution:** Ensure `window.location.hash` is being set in navigate function.

## Files Modified

1. **src/App.tsx**
   - Added `useEffect` for hash change detection
   - Added `handleHashChange` function
   - Added event listener cleanup

2. **src/utils/router.ts**
   - Updated `navigate` function to set hash
   - Added pageMap for hash generation

3. **src/pages/ConfirmationPage.tsx** (previously)
   - Enhanced reference extraction
   - Added multiple URL format support

4. **src/pages/BookingPage.tsx** (previously)
   - Fixed callback URL format

## Migration Notes

If you want to migrate to React Router DOM in the future:
```bash
npm install react-router-dom
```

Then replace hash routing with BrowserRouter:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/listings" element={<ListingsPage />} />
    <Route path="/confirmation" element={<ConfirmationPage />} />
    {/* ... other routes */}
  </Routes>
</BrowserRouter>
```

But for now, hash-based routing works perfectly for your use case! ✅
