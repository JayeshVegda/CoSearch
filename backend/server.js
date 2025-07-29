// Load environment variables - only load .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');

const activityTracker = require('./middleware/activityTracker');
const { requestLogger, _errorLogger, performanceLogger, securityLogger, logger } = require('./middleware/logging');
const adminRoute = require('./router/adminRoute');
const cleanupRoute = require('./router/cleanupRoute');
const settingRoute = require('./router/settingRoute');
const userRouter = require('./router/userRoute');
const monitoringRoute = require('./router/monitoringRoute');
const cleanupService = require('./services/cleanupService');

const app = express();
const port = process.env.PORT || 8484;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      styleSrc: ['\'self\'', '\'unsafe-inline\''],
      scriptSrc: ['\'self\''],
      imgSrc: ['\'self\'', 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Compression middleware
app.use(compression({
  level: parseInt(process.env.COMPRESSION_LEVEL) || 6,
  threshold: 1024,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Additional rate limiting for file uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    error: 'Too many file uploads from this IP, please try again later.',
  },
});
app.use('/api/setting/icons/upload', uploadLimiter);

// CORS configuration
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) { return callback(null, true); }

    // Check if origin is in our allowed list
    if (corsOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For development, allow all localhost origins
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
};
app.use(cors(corsOptions));

// Body parsing middleware with limits
app.use(express.json({
  limit: process.env.MAX_FILE_SIZE || '10mb',
}));

// Serve static files from temp directory
app.use('/temp', express.static('temp'));

// Handle body-parser errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'The request body contains invalid JSON format',
    });
  }
  next();
});

// Custom JSON validation middleware
app.use((req, res, next) => {
  // Only validate JSON requests
  if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
    // If body-parser successfully parsed the JSON, req.body will be an object
    // If parsing failed, body-parser would have already handled it
    if (req.body && typeof req.body === 'object') {
      return next();
    }
  }
  next();
});
app.use(express.urlencoded({
  extended: true,
  limit: process.env.MAX_FILE_SIZE || '10mb',
}));

// Activity tracking middleware (track user activity for cleanup)
app.use(activityTracker);

// Logging middleware (only in production or when explicitly enabled)
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_LOGGING === 'true') {
  app.use(requestLogger);
  app.use(performanceLogger);
  app.use(securityLogger);
}

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  };

  res.status(200).json(health);
});

// API routes
app.use('/api/user', userRouter);
app.use('/api/setting', settingRoute);
app.use('/api/cleanup', cleanupRoute);
app.use('/api/admin', adminRoute);
app.use('/api/monitoring', monitoringRoute);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CoSearch API is running!',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api/docs',
    health: '/health',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled server error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Check if headers have already been sent
  if (res.headersSent) {
    return next(error);
  }

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? error.message : 'Something went wrong',
    ...(isDevelopment && { stack: error.stack }),
  });
});

// Database connection and server startup
async function main() {
  try {
    console.log('🚀 Starting CoSearch backend...');
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔧 Port: ${port}`);
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cosearch';
    console.log(`📊 MongoDB URI: ${mongoUri ? 'Set' : 'Not set'}`);

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB connected successfully!');
    logger.info('✅ MongoDB connected successfully!');

    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      logger.info(`🚀 Server running on port ${port}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📊 Health check: http://localhost:${port}/health`);

      // Start the cleanup service
      cleanupService.start();
      console.log('🧹 Cleanup service started');
      logger.info('🧹 Cleanup service started');

      if (process.env.NODE_ENV === 'production') {
        console.log('🔒 Production mode enabled with enhanced security');
        logger.info('🔒 Production mode enabled with enhanced security');
      }
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    logger.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);

  // Stop the cleanup service
  cleanupService.stop();
  logger.info('Cleanup service stopped');

  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit immediately in development, just log the error
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

main();
