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
app.use(cors());

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

// Error handling for 404s
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

// Connect to MongoDB & Start Server
connectDB();
const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;

