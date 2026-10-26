const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { initSocket } = require('./socket/socketHandler');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const alertRoutes = require('./routes/alertRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const safeZoneRoutes = require('./routes/safeZoneRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const safeHavenRoutes = require('./routes/safeHavenRoutes');
const safeJourneyRoutes = require('./routes/safeJourneyRoutes');

const app = express();
const server = http.createServer(app);

// Connect Database
connectDB().then(async () => {
  try {
    const User = require('./models/User');
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('🌱 [SafeWo Server] Empty database detected. Auto-seeding initial demo data...');
      const seedData = require('./seed');
      await seedData();
    }
  } catch (seedErr) {
    console.warn('⚠️ Auto-seed check notice:', seedErr.message);
  }
});

// Initialize Socket.io
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const io = socketio(server, {
  cors: {
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});
initSocket(io);

// Security and Logging Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching client
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Mount API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'SafeWo Women Safety Platform',
    tagline: 'Your Safety. One Click Away.',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/safe-zones', safeZoneRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/safe-havens', safeHavenRoutes);
app.use('/api/journeys', safeJourneyRoutes);

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 [SafeWo Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🌐 [SafeWo Server] Health check available at: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
});
