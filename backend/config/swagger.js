import swaggerJsdoc from 'swagger-jsdoc';

// Dynamically generate server URLs based on environment
const getServerUrls = () => {
  const servers = [];
  
  // Always include localhost for development
  servers.push({
    url: 'http://localhost:5001/api',
    description: 'Development server',
  });
  
  // Add production/staging server if API_URL is set
  if (process.env.API_URL) {
    servers.push({
      url: `${process.env.API_URL}/api`,
      description: 'Production server',
    });
  } else if (process.env.VERCEL_URL) {
    // If deployed on Vercel, use the Vercel URL
    servers.push({
      url: `https://${process.env.VERCEL_URL}/api`,
      description: 'Vercel deployment',
    });
  }
  
  return servers;
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Codakraft Apartment API',
      version: '1.0.0',
      description: 'Complete REST API for Codakraft Apartment rental platform with authentication, booking system, and payment integration',
      contact: {
        name: 'Codakraft Support',
        email: 'support@codakraft-apartment.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: getServerUrls(),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phone: { type: 'string', example: '+2348012345678' },
            avatar: { type: 'string', example: 'https://cloudinary.com/avatar.jpg' },
            role: { type: 'string', enum: ['user', 'host', 'admin'], example: 'user' },
            isVerified: { type: 'boolean', example: true },
            dateOfBirth: { type: 'string', format: 'date', example: '1990-01-01' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string', example: '123 Main St' },
                city: { type: 'string', example: 'Lagos' },
                state: { type: 'string', example: 'Lagos State' },
                zipCode: { type: 'string', example: '100001' },
                country: { type: 'string', example: 'Nigeria' },
              },
            },
            favorites: {
              type: 'array',
              items: { type: 'string' },
              example: ['507f1f77bcf86cd799439011'],
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Property: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'Luxury Apartment in Lagos' },
            description: { type: 'string', example: 'Beautiful modern apartment with amazing views' },
            type: { type: 'string', enum: ['entire-place', 'private-room', 'shared-room'], example: 'entire-place' },
            price: { type: 'number', example: 350 },
            location: {
              type: 'object',
              properties: {
                address: { type: 'string', example: '123 Main St' },
                city: { type: 'string', example: 'Lagos' },
                state: { type: 'string', example: 'Lagos State' },
                country: { type: 'string', example: 'Nigeria' },
                zipCode: { type: 'string', example: '100001' },
                coordinates: {
                  type: 'object',
                  properties: {
                    lat: { type: 'number', example: 6.5244 },
                    lng: { type: 'number', example: 3.3792 },
                  },
                },
              },
            },
            images: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://cloudinary.com/image1.jpg', 'https://cloudinary.com/image2.jpg'],
            },
            amenities: {
              type: 'array',
              items: { type: 'string' },
              example: ['WiFi', 'Kitchen', 'Air conditioning', 'Pool'],
            },
            maxGuests: { type: 'number', example: 6 },
            bedrooms: { type: 'number', example: 3 },
            beds: { type: 'number', example: 4 },
            bathrooms: { type: 'number', example: 3 },
            rating: { type: 'number', example: 4.9 },
            reviewCount: { type: 'number', example: 128 },
            category: { type: 'string', example: 'City' },
            featured: { type: 'boolean', example: true },
            instantBook: { type: 'boolean', example: true },
            status: { type: 'string', enum: ['active', 'inactive', 'maintenance'], example: 'active' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            property: { type: 'string', example: '507f1f77bcf86cd799439011' },
            user: { type: 'string', example: '507f1f77bcf86cd799439011' },
            checkIn: { type: 'string', format: 'date', example: '2025-11-10' },
            checkOut: { type: 'string', format: 'date', example: '2025-11-15' },
            guests: {
              type: 'object',
              properties: {
                adults: { type: 'number', example: 2 },
                children: { type: 'number', example: 1 },
                infants: { type: 'number', example: 0 },
              },
            },
            guestDetails: {
              type: 'object',
              properties: {
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                email: { type: 'string', example: 'john@example.com' },
                phone: { type: 'string', example: '+2348012345678' },
              },
            },
            pricing: {
              type: 'object',
              properties: {
                pricePerNight: { type: 'number', example: 350 },
                nights: { type: 'number', example: 5 },
                subtotal: { type: 'number', example: 1750 },
                serviceFee: { type: 'number', example: 245 },
                cleaningFee: { type: 'number', example: 75 },
                total: { type: 'number', example: 2070 },
              },
            },
            payment: {
              type: 'object',
              properties: {
                method: { type: 'string', example: 'card' },
                status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'], example: 'completed' },
                transactionId: { type: 'string', example: 'pi_xxxxxxxxxxxx' },
              },
            },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'], example: 'confirmed' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            property: { type: 'string', example: '507f1f77bcf86cd799439011' },
            user: { type: 'string', example: '507f1f77bcf86cd799439011' },
            booking: { type: 'string', example: '507f1f77bcf86cd799439011' },
            rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string', example: 'Amazing place! Highly recommended.' },
            categories: {
              type: 'object',
              properties: {
                cleanliness: { type: 'number', example: 5 },
                accuracy: { type: 'number', example: 5 },
                communication: { type: 'number', example: 5 },
                location: { type: 'number', example: 5 },
                checkIn: { type: 'number', example: 5 },
                value: { type: 'number', example: 5 },
              },
            },
            hostResponse: {
              type: 'object',
              properties: {
                comment: { type: 'string', example: 'Thank you for your review!' },
                respondedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Not authorized to access this route',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Resource not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Please provide valid data',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Users',
        description: 'User profile and management endpoints',
      },
      {
        name: 'Properties',
        description: 'Property listing and management endpoints',
      },
      {
        name: 'Bookings',
        description: 'Booking management endpoints',
      },
      {
        name: 'Payments',
        description: 'Payment processing endpoints',
      },
      {
        name: 'Reviews',
        description: 'Property review endpoints',
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
