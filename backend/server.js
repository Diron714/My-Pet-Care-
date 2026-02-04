import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import requestLogger from './middleware/logger.js';
import pool from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
// In production, protect all /api routes.
// In development, keep it disabled to avoid blocking testing (e.g. registration/OTP).
const isProduction = (process.env.NODE_ENV || 'development') === 'production';

if (isProduction) {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  });
  app.use('/api/', limiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/notifications', notificationRoutes);
// app.use('/api/customers', customerRoutes);
// ... other routes

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

export default app;

