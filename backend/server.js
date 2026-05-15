const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get("/", (req, res) => {
  res.send("A1 Furnished API Running");
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'API running', timestamp: new Date() });
});

// Mongo connect ONLY once
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

module.exports = app;