import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running in serverless environment (Vercel, AWS Lambda, etc.)
// Also check for read-only file system (common in serverless)
const isServerless = !!(
  process.env.VERCEL || 
  process.env.VERCEL_ENV || 
  process.env.AWS_LAMBDA_FUNCTION_NAME || 
  process.env.LAMBDA_TASK_ROOT ||
  process.env.FUNCTION_TARGET || // Google Cloud Functions
  process.env.RAILWAY_ENVIRONMENT || // Railway
  process.env.RENDER || // Render
  process.env.FLY_APP_NAME // Fly.io
);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console log format (colorized and simplified)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create the logger with appropriate transports
let transports = [];
let exceptionHandlers = [];
let rejectionHandlers = [];

// In serverless environments, only use console logging (no file system access)
if (isServerless) {
  console.log('🔧 Running in serverless mode - using console-only logging');
  
  transports = [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    })
  ];
  
  exceptionHandlers = [
    new winston.transports.Console({
      format: logFormat,
    })
  ];
  
  rejectionHandlers = [
    new winston.transports.Console({
      format: logFormat,
    })
  ];
} else {
  // In traditional server environments, use file logging
  const logsDir = path.join(__dirname, '..', 'logs');

  // Configure daily rotate file transport for all logs
  const allLogsRotateTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat,
  });

  // Configure daily rotate file transport for error logs
  const errorLogsRotateTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '30d',
    format: logFormat,
  });

  // Configure daily rotate file transport for combined logs
  const combinedLogsRotateTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat,
  });

  transports = [
    allLogsRotateTransport,
    errorLogsRotateTransport,
    combinedLogsRotateTransport,
  ];

  exceptionHandlers = [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ];

  rejectionHandlers = [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ];

  // Also add console logging for non-production traditional servers
  if (process.env.NODE_ENV !== 'production') {
    transports.push(
      new winston.transports.Console({
        format: consoleFormat,
      })
    );
  }
}

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exceptionHandlers,
  rejectionHandlers,
});

// Create a stream object for Morgan HTTP logger
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;
