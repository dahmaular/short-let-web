# Codakraft Apartment Backend API

Complete Node.js backend service for the Codakraft Apartment rental platform with Express, MongoDB, authentication, booking system, and payment integration.

## Features

✅ **User Authentication & Authorization**
- Register/Login with JWT tokens
- Password hashing with bcrypt
- Email verification
- Password reset functionality
- Role-based access control (User, Host, Admin)

✅ **User Profile Management**
- Update profile information
- Avatar upload
- Favorites management
- Booking history
- Password change

✅ **Property Management**
- CRUD operations for properties
- Advanced search and filtering
- Featured properties
- Property reviews and ratings
- Image gallery

✅ **Booking System**
- Create and manage bookings
- Date availability checking
- Guest management
- Booking confirmation/cancellation
- Special requests

✅ **Payment Integration**
- Stripe payment gateway
- Payment intent creation
- Payment confirmation
- Refund processing
- Webhook handling

✅ **Review System**
- Create reviews for completed bookings
- Category-based ratings
- Host responses
- Review moderation

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Stripe
- **Email:** Nodemailer
- **Security:** Helmet, CORS, Rate Limiting
- **Image Upload:** Cloudinary
- **Logging:** Winston with daily log rotation
- **API Documentation:** Swagger/OpenAPI 3.0

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account
- Cloudinary account (for image uploads)

### Setup Steps

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the backend root directory:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/codakraft-apartment
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@codakraft-apartment.com
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in MONGODB_URI
   ```

5. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be running at `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+2348012345678"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Forgot Password
```http
POST /api/auth/forgotpassword
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
PUT /api/auth/resetpassword/{resetToken}
Content-Type: application/json

{
  "password": "newpassword123"
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+2348012345678",
  "dateOfBirth": "1990-01-01",
  "address": {
    "street": "123 Main St",
    "city": "Lagos",
    "state": "Lagos State",
    "country": "Nigeria"
  }
}
```

#### Toggle Favorite
```http
POST /api/users/favorites/{propertyId}
Authorization: Bearer {token}
```

#### Get Favorites
```http
GET /api/users/favorites
Authorization: Bearer {token}
```

#### Get User Bookings
```http
GET /api/users/bookings
Authorization: Bearer {token}
```

### Property Endpoints

#### Get All Properties
```http
GET /api/properties?search=luxury&city=Lagos&minPrice=100&maxPrice=500&type=entire-place&minRating=4&amenities=WiFi,Pool&category=City&sortBy=-rating&page=1&limit=12
```

#### Get Single Property
```http
GET /api/properties/{id}
```

#### Get Featured Properties
```http
GET /api/properties/featured
```

#### Create Property (Host/Admin only)
```http
POST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Luxury Apartment",
  "description": "Beautiful modern apartment",
  "type": "entire-place",
  "price": 350,
  "location": {
    "address": "123 Main St",
    "city": "Lagos",
    "country": "Nigeria",
    "coordinates": {
      "lat": 6.5244,
      "lng": 3.3792
    }
  },
  "images": ["url1", "url2"],
  "amenities": ["WiFi", "Kitchen", "AC"],
  "maxGuests": 6,
  "bedrooms": 3,
  "beds": 4,
  "bathrooms": 3,
  "category": "City"
}
```

### Booking Endpoints

#### Check Availability
```http
POST /api/bookings/check-availability
Content-Type: application/json

{
  "propertyId": "{propertyId}",
  "checkIn": "2025-11-10",
  "checkOut": "2025-11-15"
}
```

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "propertyId": "{propertyId}",
  "checkIn": "2025-11-10",
  "checkOut": "2025-11-15",
  "guests": {
    "adults": 2,
    "children": 1,
    "infants": 0
  },
  "guestDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+2348012345678"
  },
  "pricing": {
    "pricePerNight": 350,
    "nights": 5,
    "subtotal": 1750,
    "serviceFee": 245,
    "cleaningFee": 75,
    "total": 2070
  },
  "paymentMethod": "card"
}
```

#### Get User Bookings
```http
GET /api/bookings
Authorization: Bearer {token}
```

#### Get Single Booking
```http
GET /api/bookings/{id}
Authorization: Bearer {token}
```

#### Cancel Booking
```http
PUT /api/bookings/{id}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Change of plans"
}
```

### Payment Endpoints

#### Create Payment Intent
```http
POST /api/payments/create-intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "{bookingId}"
}
```

#### Confirm Payment
```http
POST /api/payments/confirm
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentIntentId": "pi_xxxxx",
  "bookingId": "{bookingId}"
}
```

#### Get Payment Status
```http
GET /api/payments/status/{bookingId}
Authorization: Bearer {token}
```

### Review Endpoints

#### Create Review
```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "propertyId": "{propertyId}",
  "bookingId": "{bookingId}",
  "rating": 5,
  "comment": "Amazing place!",
  "categories": {
    "cleanliness": 5,
    "accuracy": 5,
    "communication": 5,
    "location": 5,
    "checkIn": 5,
    "value": 5
  }
}
```

#### Get Property Reviews
```http
GET /api/reviews/{propertyId}
```

## Database Models

### User
- firstName, lastName, email, password
- phone, avatar, dateOfBirth, address
- role (user/host/admin)
- favorites, totalBookings
- isVerified, verificationToken
- resetPasswordToken, resetPasswordExpire

### Property
- title, description, type, price
- location (address, city, country, coordinates)
- images, host, amenities
- maxGuests, bedrooms, beds, bathrooms
- rating, reviewCount, instantBook
- category, houseRules, unavailableDates
- featured, status, views, totalBookings

### Booking
- property, user
- checkIn, checkOut
- guests (adults, children, infants)
- guestDetails
- pricing (pricePerNight, nights, subtotal, fees, total)
- payment (method, status, transactionId)
- status (pending/confirmed/cancelled/completed)
- specialRequests, cancellationReason

### Review
- property, user, booking
- rating, comment
- categories (cleanliness, accuracy, communication, etc.)
- hostResponse

## Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt (10 rounds)
- Rate limiting to prevent abuse
- Helmet.js for HTTP headers security
- CORS configuration
- Input validation and sanitization
- MongoDB injection protection
- XSS protection

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Success responses:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

## Logging

The application uses **Winston** for comprehensive logging with daily file rotation.

### Log Files Location
All logs are stored in the `logs/` directory:

- `application-YYYY-MM-DD.log` - All application logs
- `error-YYYY-MM-DD.log` - Error logs only
- `combined-YYYY-MM-DD.log` - Combined logs
- `exceptions-YYYY-MM-DD.log` - Uncaught exceptions
- `rejections-YYYY-MM-DD.log` - Unhandled promise rejections

### Log Levels
- `error` - Error messages
- `warn` - Warning messages  
- `info` - Informational messages (default)
- `http` - HTTP request logs
- `debug` - Debug messages

### Configuration
Set the log level in your `.env` file:
```env
LOG_LEVEL=info
```

### Features
- ✅ Daily log rotation
- ✅ Automatic cleanup (14-30 days retention)
- ✅ JSON format for easy parsing
- ✅ Colorized console output in development
- ✅ HTTP request logging with Morgan
- ✅ Error stack traces
- ✅ Separate error log files

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Testing

Test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Swagger UI at `http://localhost:5000/api-docs`

## Deployment

### MongoDB Atlas Setup
1. Create a cluster on MongoDB Atlas
2. Add database user
3. Whitelist IP addresses
4. Get connection string and add to `.env`

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production database URL
- Set up email service
- Configure Stripe production keys

### Recommended Hosting Platforms
- **API:** Render, Railway, Heroku, AWS, DigitalOcean
- **Database:** MongoDB Atlas
- **File Storage:** Cloudinary

## Support

For issues and questions:
- Email: support@codakraft-apartment.com
- GitHub Issues: [repository]/issues

## License

MIT License - feel free to use this project for learning and commercial purposes.

---

**Built with ❤️ by Codakraft**
