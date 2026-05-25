const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ===========================================
// ✅ BULLETPROOF CORS — works everywhere
// ===========================================
const allowedOrigins = [
  'https://a1furnished.vercel.app',
  'https://a1suites.ca',
  'https://www.a1suites.ca',
  process.env.CLIENT_URL
].filter(Boolean);

const allowedPatterns = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/.*\.a1suites\.ca$/
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (allowedPatterns.some(p => p.test(origin))) return callback(null, true);
    console.log('❌ CORS blocked origin:', origin);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================================
// MongoDB connection (cached for Vercel)
// ===========================================
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.log('❌ MongoDB Error:', err.message);
    isConnected = false;
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ===========================================
// Routes
// ===========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get("/", (req, res) => {
  res.send("A1 Furnished API Running");
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'API running', 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handler
app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({ error: err.message });
  }
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;