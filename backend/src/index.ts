import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pool from './config/database';
import statsRoutes from './routes/stats';
import leaderboardRoutes from './routes/leaderboard';
import authRoutes from './routes/auth';
import socialRoutes from './routes/social';
import notificationRoutes from './routes/notifications';
import gameRoutes from './routes/game';
import { startCronJobs } from './services/cronJobs';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }
});

const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Sets various security-related HTTP headers

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour for auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again after an hour' }
});

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/game', gameRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'ok', database: 'connected' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// WebSocket Handlers
io.on('connection', (socket) => {
  console.log('📡 Tactical Uplink Established:', socket.id);

  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} synchronized to secure channel`);
  });

  socket.on('disconnect', () => {
    console.log('📡 Tactical Uplink Terminated:', socket.id);
  });
});

// Export io for use in other routes
export { io };

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Tactical Command Center active on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}`); // Keep API log for clarity

  // Start cron jobs for periodic stat fetching
  startCronJobs();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await pool.end();
  process.exit(0);
});
