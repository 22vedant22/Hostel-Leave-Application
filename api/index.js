// index.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';

// Routes
import AuthRoute from './routes/Auth.route.js';
import leaveRoutes from './routes/leave.routes.js';
import UserRoute from './routes/User.route.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const MONGO_URI = process.env.MONGODB_CONN;

// Initialize app
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.use('/api/auth', AuthRoute);
app.use('/api/leaves', leaveRoutes);
app.use('/api/user', UserRoute);

// MongoDB connection
mongoose
  .connect(MONGO_URI, { dbName: 'Hostel-Leave-Management' })
  .then(() => console.log('✅ Database connected'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Exit if DB fails
  });

// Health check route (useful for deployment monitoring)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy 🚀' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
