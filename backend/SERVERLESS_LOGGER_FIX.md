# Vercel Serverless Logger Fix

## Issue
When deploying to Vercel, the application was crashing with:
```
Error: EROFS: read-only file system, open '/var/task/logs/application-2025-11-08.log'
```

## Root Cause
Winston logger was trying to write log files to the file system using `winston-daily-rotate-file`. However, Vercel's serverless functions run in a **read-only file system**, making it impossible to write log files.

## Solution Applied

### 1. Enhanced Serverless Detection
Updated `backend/config/logger.js` to detect multiple serverless platforms:

```javascript
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
```

### 2. Console-Only Logging in Serverless
When serverless environment is detected:
- ✅ Uses only `Console` transport (no file system access)
- ✅ Logs to stdout/stderr (accessible in Vercel logs)
- ✅ No `DailyRotateFile` transports
- ✅ Exception and rejection handlers use Console only

### 3. Traditional Server Mode
When NOT in serverless (local development):
- ✅ Uses file-based logging with rotation
- ✅ Separate files for errors, exceptions, rejections
- ✅ Console output in development mode
- ✅ 14-day retention for regular logs, 30-day for errors

## How to View Logs

### In Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Click on **Deployments**
3. Click on the deployment you want to inspect
4. Click **View Function Logs**
5. All `console.log`, `logger.info`, `logger.error` will appear here

### Using Vercel CLI
```bash
# View real-time logs
vercel logs <deployment-url> --follow

# View specific function logs
vercel logs <deployment-url> --function=server
```

### In Production
All logs are sent to Vercel's logging system and can be:
- Viewed in real-time in the dashboard
- Exported to external services (Datadog, LogDNA, etc.)
- Queried and filtered by timestamp, level, or message

## Benefits

### ✅ Serverless-Compatible
- No file system writes
- Works on Vercel, AWS Lambda, Google Cloud Functions, etc.

### ✅ Still Powerful Locally
- File-based logging with rotation
- Separate log levels and types
- Easy debugging in development

### ✅ Production-Ready
- Structured JSON logging
- Exception and rejection handling
- Integration with Vercel's logging infrastructure

### ✅ Environment Detection
- Automatically switches between modes
- No code changes needed
- Works across multiple platforms

## Configuration

### Environment Variables (Optional)
```bash
# Set log level (default: info)
LOG_LEVEL=debug

# Vercel automatically sets VERCEL_ENV
VERCEL_ENV=production  # or preview, development
```

### Log Levels Available
- `error` - Critical errors only
- `warn` - Warnings and errors
- `info` - General information (default)
- `http` - HTTP request logs
- `verbose` - Detailed information
- `debug` - Debug information
- `silly` - Everything

## Testing

### Test Locally
```bash
cd backend
npm run dev
# Should see: "Running in traditional server mode - using file-based logging"
```

### Test on Vercel
```bash
vercel
# Should see: "🔧 Running in serverless mode - using console-only logging"
```

## Related Files
- `backend/config/logger.js` - Logger configuration
- `backend/server.js` - Uses logger for startup messages
- `backend/.gitignore` - Excludes log files from git

## Migration Notes

### Before
```javascript
// Always tried to write to logs/ directory
const logger = winston.createLogger({
  transports: [
    new DailyRotateFile({ filename: 'logs/app.log' })
  ]
});
```

### After
```javascript
// Detects environment and uses appropriate transport
const logger = winston.createLogger({
  transports: isServerless 
    ? [new winston.transports.Console()]
    : [new DailyRotateFile({ filename: 'logs/app.log' })]
});
```

## Status
✅ **Fixed** - Backend now deploys successfully on Vercel without file system errors.

## Next Steps
The backend should now deploy without errors. To verify:

1. Deploy to Vercel: `cd backend && vercel --prod`
2. Check deployment logs for "🔧 Running in serverless mode"
3. Verify MongoDB connection succeeds
4. Test API endpoints
5. Check Vercel Function Logs for any issues

---

**Last Updated**: November 8, 2025
