import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database.js';
import swaggerSpec from './config/swagger.js';
import logger from './config/logger.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Load environment variables
dotenv.config();

logger.info('Starting Codakraft Apartment API...');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
// Allow requests from frontend URLs (production and development)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  // Add Vercel preview deployments
  /^https:\/\/.*\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware - Morgan HTTP logger
app.use(morgan('combined', { stream: logger.stream }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Codakraft Apartment API Docs',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check route
app.get('/api/health', (req, res) => {
  logger.info('Health check requested');
  res.status(200).json({
    success: true,
    message: 'Codakraft Apartment API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
logger.info('Mounting API routes...');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
logger.info('API routes mounted successfully');

// 404 handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const message = `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`;
  console.log(message);
  logger.info(message);
  logger.info(`Swagger documentation available at: http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});
