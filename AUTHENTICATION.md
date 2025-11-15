# Authentication System

Complete authentication system for Codakraft-apartment with login, signup, and user management.

## Features

### ✅ User Registration
- First name and last name fields
- Email validation
- Phone number field
- Password with visibility toggle
- Confirm password validation
- Terms & conditions checkbox
- Social login buttons (Google, Facebook)
- Automatic redirect to dashboard after registration

### ✅ User Login
- Email and password authentication
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Social login options
- Error handling with user-friendly messages
- JWT token storage

### ✅ Conditional Navigation
- **Not Authenticated:**
  - "Log in" button
  - "Sign up" button with gradient styling
  
- **Authenticated:**
  - Favorites link with counter
  - Trips link
  - User menu dropdown
  - Profile access

### ✅ Mobile Responsive
- Mobile-friendly login/signup forms
- Touch-optimized navigation
- Responsive button layout

## Pages

### Login Page (`/login`)
**Route:** `#/login`

**Features:**
- Email and password fields with icons
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Social login (Google, Facebook)
- Link to signup page
- Error messages
- Loading states

### Signup Page (`/signup`)
**Route:** `#/signup`

**Features:**
- First name and last name fields
- Email validation
- Phone number field
- Password with strength requirements (min 6 chars)
- Confirm password with matching validation
- Terms & conditions checkbox
- Success message with auto-redirect
- Link to login page
- Error handling

## API Integration

### Register Endpoint
```typescript
POST http://localhost:5002/api/auth/register

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+234 801 234 5678",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    ...
  }
}
```

### Login Endpoint
```typescript
POST http://localhost:5002/api/auth/login

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "...",
    "firstName": "John",
    ...
  }
}
```

## State Management

### AppContext Updates
The AppContext now includes:
- `login(user, token)` - Stores user and token
- `logout()` - Clears user and token
- Automatic localStorage persistence
- User state restoration on page reload

### Storage
- JWT token stored in `localStorage` as `token`
- User data stored in `localStorage` as `user`
- Automatic cleanup on logout

## Usage

### Accessing Current User
```typescript
import { useApp } from './context/AppContext';

function MyComponent() {
  const { state } = useApp();
  
  if (state.currentUser) {
    // User is logged in
    console.log(state.currentUser.firstName);
  } else {
    // User is not logged in
  }
}
```

### Login Programmatically
```typescript
import { useApp } from './context/AppContext';

function MyComponent() {
  const { login } = useApp();
  
  const handleLogin = async () => {
    const response = await fetch('/api/auth/login', {...});
    const data = await response.json();
    login(data.user, data.token);
  };
}
```

### Logout
```typescript
import { useApp } from './context/AppContext';
import { useRouter } from './utils/router';

function MyComponent() {
  const { logout } = useApp();
  const { navigate } = useRouter();
  
  const handleLogout = () => {
    logout();
    navigate('home');
  };
}
```

## Protected Routes

To protect routes that require authentication:

```typescript
function ProtectedPage() {
  const { state } = useApp();
  const { navigate } = useRouter();
  
  useEffect(() => {
    if (!state.currentUser) {
      navigate('login');
    }
  }, [state.currentUser]);
  
  if (!state.currentUser) {
    return <div>Loading...</div>;
  }
  
  return <div>Protected Content</div>;
}
```

## Styling

### Design System
- **Primary Colors:** Gradient from primary-600 to secondary-600
- **Forms:** Rounded corners, shadow effects, icon inputs
- **Buttons:** Gradient backgrounds, hover effects, loading states
- **Errors:** Red alert boxes with icons
- **Success:** Green confirmation with animations

### Components
- Gradient logo with colorful design
- Glass-effect navbar
- Smooth transitions and animations
- Responsive breakpoints
- Touch-friendly mobile interface

## Security Features

- Password visibility toggle
- Password strength requirements (min 6 characters)
- Password confirmation matching
- JWT token authentication
- Secure token storage
- Input validation
- Error handling
- HTTPS recommended for production

## Future Enhancements

- [ ] Email verification
- [ ] Forgot password flow
- [ ] Social login integration
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Remember me functionality
- [ ] Password strength meter
- [ ] Account settings page
- [ ] Profile picture upload

## Testing

### Test Credentials
You can create a test account or use the API to seed test users.

### Test Flow
1. Visit `http://localhost:5174/#/signup`
2. Fill in the form with test data
3. Submit to create account
4. Automatic redirect to dashboard
5. Click logout (when implemented)
6. Visit `http://localhost:5174/#/login`
7. Login with credentials
8. Access protected features

## Troubleshooting

### Port Issues
If frontend port 5173 is in use, Vite automatically uses port 5174.

### API Connection
Make sure the backend is running on port 5002:
```bash
cd backend
npm run dev
```

### Token Issues
If you experience authentication issues:
1. Clear localStorage: `localStorage.clear()`
2. Refresh the page
3. Try logging in again

### CORS Errors
Ensure backend CORS is configured for frontend URL:
```javascript
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
```

---

**Built with ❤️ by Codakraft**
