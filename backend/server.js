require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

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
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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
      '/api/admin'
    ]
  });
});

// Connect to MongoDB & Start Server
const PORT = process.env.PORT || 5000;

// Initialize database connection
const initializeApp = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    // Don't exit process in serverless environment
    // process.exit(1);
  }
};

// For Vercel serverless deployment
if (process.env.VERCEL) {
  // In Vercel, initialize database connection on app startup
  connectDB().catch(console.error);
} else {
  // For local development
  initializeApp().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

// Export for Vercel
module.exports = app;

