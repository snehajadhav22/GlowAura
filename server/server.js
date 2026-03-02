const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const arRoutes = require('./routes/ar');

const app = express();

// ─────────────────────────────────────────────────────────
// 🔍 MongoDB Debug Logging
// ─────────────────────────────────────────────────────────
mongoose.set('debug', false); // set to true for query-level debugging

mongoose.connection.on('connecting', () => {
  console.log('⏳ [MongoDB] Attempting to connect...');
});

mongoose.connection.on('connected', () => {
  console.log('✅ [MongoDB] Successfully connected to database!');
  console.log(`   📦 Database: ${mongoose.connection.db?.databaseName || 'N/A'}`);
  console.log(`   🌐 Host:     ${mongoose.connection.host}`);
  console.log(`   🔌 Port:     ${mongoose.connection.port}`);
  console.log(`   📊 Ready State: ${mongoose.connection.readyState} (1 = connected)`);
});

mongoose.connection.on('disconnected', () => {
  console.log('❌ [MongoDB] Disconnected from database');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 [MongoDB] Reconnected to database');
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 [MongoDB] Connection Error:', err.message);
  console.error('   Full Error:', err);
});

mongoose.connection.on('close', () => {
  console.log('🔒 [MongoDB] Connection closed');
});

// ─────────────────────────────────────────────────────────
// 🔐 Security & Middleware
// ─────────────────────────────────────────────────────────
app.use(helmet());
const allowedOrigins = [
  'http://localhost:3000',
  'https://glowauraa.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 5000 }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// ─────────────────────────────────────────────────────────
// 🛤️ Routes
// ─────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ar', arRoutes);

// Health check with DB status
app.get('/health', (_, res) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'OK',
    database: stateMap[dbState] || 'unknown',
    ts: new Date(),
  });
});

// Debug route - check DB status
app.get('/api/debug/db-status', (_, res) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: stateMap[dbState] || 'unknown',
    readyState: dbState,
    host: mongoose.connection.host || 'N/A',
    port: mongoose.connection.port || 'N/A',
    database: mongoose.connection.db?.databaseName || 'N/A',
    models: Object.keys(mongoose.models),
    ts: new Date(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ─────────────────────────────────────────────────────────
// 🚀 Start Server & Connect to MongoDB
// ─────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('🚨 [MongoDB] MONGODB_URI is not defined in .env file!');
  console.error('   Please add MONGODB_URI to your .env file');
  process.exit(1);
}

// Mask the password in URI for safe logging
const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
console.log('\n══════════════════════════════════════════════════');
console.log('  🌟 GlowAura Backend Server Starting...');
console.log('══════════════════════════════════════════════════');
console.log(`  📡 MongoDB URI: ${maskedUri}`);
console.log(`  🔑 Razorpay Key: ${process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`  🔐 JWT Secret:   ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log('══════════════════════════════════════════════════\n');

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,  // 10s timeout for initial connection
    socketTimeoutMS: 45000,           // 45s socket timeout
    heartbeatFrequencyMS: 10000,      // check connection every 10s
  })
  .then(() => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  ✅ MongoDB Connected Successfully!          ║');
    console.log(`║  📦 Database: ${(mongoose.connection.db?.databaseName || 'glowaura').padEnd(31)}║`);
    console.log(`║  🌐 Host: ${(mongoose.connection.host || 'N/A').padEnd(35)}║`);
    console.log('╚══════════════════════════════════════════════╝\n');

    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
      console.log(`🏥 Health check: http://localhost:${process.env.PORT || 5000}/health`);
      console.log(`🔍 DB Debug:     http://localhost:${process.env.PORT || 5000}/api/debug/db-status\n`);
    });
  })
  .catch(err => {
    console.error('\n╔══════════════════════════════════════════════╗');
    console.error('║  ❌ MongoDB Connection FAILED!                ║');
    console.error('╚══════════════════════════════════════════════╝');
    console.error('\n🚨 Error Details:');
    console.error(`   Name:    ${err.name}`);
    console.error(`   Message: ${err.message}`);
    console.error(`   Code:    ${err.code || 'N/A'}`);
    console.error('\n🔧 Troubleshooting Steps:');
    console.error('   1. Check if your MongoDB URI is correct in .env');
    console.error('   2. Ensure your IP is whitelisted in MongoDB Atlas');
    console.error('      (Network Access → Add IP → "Allow Access from Anywhere" or add your IP)');
    console.error('   3. Verify username/password are correct');
    console.error('   4. Check your internet connection');
    console.error('   5. Try accessing MongoDB Atlas dashboard at https://cloud.mongodb.com');
    console.error('   6. If using VPN, try disconnecting it');
    console.error('\n');
    process.exit(1);
  });