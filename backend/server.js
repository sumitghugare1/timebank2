
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Validate critical environment variables
if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI environment variable is required");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET environment variable is required");
  process.exit(1);
}

console.log("Environment variables loaded successfully");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI defined:", !!process.env.MONGO_URI);
console.log("JWT_SECRET defined:", !!process.env.JWT_SECRET);

const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(express.json());

// CORS configuration to allow frontend domain
const corsOptions = {
  origin: [
    'http://localhost:3000', // For local development
    'https://timebankfrontend.vercel.app', // Your frontend domain
    'https://timebankfrontend.vercel.app/', // With trailing slash
    'https://timebankfrontend.vercel.app' // Without trailing slash (duplicate for safety)
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Database connection middleware for Vercel serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ 
      message: "Database connection failed", 
      error: error.message 
    });
  }
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// URL normalization middleware to handle encoded spaces in API paths
app.use((req, res, next) => {
  if (req.url.includes('%20api/')) {
    req.url = req.url.replace('%20api/', 'api/');
    console.log(`Normalized URL to: ${req.url}`);
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);

// Test route without database dependency
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString() 
  });
});

// Database connection test route
app.get('/api/db-test', async (req, res) => {
  try {
    await connectDB();
    const User = require('./models/user');
    const userCount = await User.countDocuments();
    res.json({ 
      message: 'Database connected!', 
      userCount,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message,
      timestamp: new Date().toISOString() 
    });
  }
});

// Root route for health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'TimeBank Backend API is running!', 
    timestamp: new Date().toISOString(),
    routes: [
      '/api/auth',
      '/api/skills', 
      '/api/transactions',
      '/api/courses',
      '/api/admin',
      '/api/test'
    ]
  });
});

// Error handling for 404s
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

// Connect to MongoDB & Start Server
const PORT = process.env.PORT || 5000;

// For Vercel serverless deployment
if (process.env.VERCEL) {
  // Export for Vercel
  module.exports = app;
} else {
  // For local development
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

