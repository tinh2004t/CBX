// src/app.js - Cập nhật với Socket.IO routes
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoute');
const domesticTourRoutes = require('./routes/domesticToursRoute');
const tourDetailRoute = require('./routes/tourDetailRoute');
const overseaTourRoute = require('./routes/overseaTourRoute');
const flightRoute = require('./routes/flightRoute');
const accommodationRoute = require('./routes/accommodationRoute');
const accommodationDetailRoute = require('./routes/accommodationDetailRoute');
const micetourRoute = require('./routes/micetourRoute');
const teamBuildingRoute = require('./routes/teamBuildingRoute');
const transportRoute = require('./routes/transportRoute');
const blog = require('./routes/blogPostRoute');
const blogPostData = require('./routes/blogPostDataRoute');
const settingsRoute = require('./routes/settingRoute');
const adminLogRoutes = require('./routes/adminLogRoutes');

const TourRoute = require('./routes/TourRoute');

// Thêm socket routes
const socketRoutes = require('./routes/socketRoute');

const autoCleanupLogs = require('./cronJobs/cleanupLogs');

const app = express();

autoCleanupLogs();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware để inject socketManager vào req (phải đặt trước routes)
app.use((req, res, next) => {
  req.socketManager = app.get('socketManager');
  next();
});

// Routes hiện tại
app.use('/api/auth', authRoutes);
app.use('/api/tour-noi-dia', domesticTourRoutes);
app.use('/api/tour-quoc-te', overseaTourRoute);
app.use('/api/tour', tourDetailRoute);
app.use('/api/flights', flightRoute);
app.use('/api/accommodation', accommodationRoute);
app.use('/api/accommodationDetail', accommodationDetailRoute);
app.use('/api/TeamBuilding', teamBuildingRoute);
app.use('/api/mice', micetourRoute);
app.use('/api/transport', transportRoute);
app.use('/api/blog', blog);
app.use('/api/blog-post-data', blogPostData);
app.use('/api/settings', settingsRoute);
app.use('/api/admin-logs', adminLogRoutes);
app.use('/api/tours',TourRoute)


// Thêm socket routes
app.use('/api/socket', socketRoutes);

// Route để check server status với online users
app.get('/', (req, res) => {
  const socketManager = req.socketManager;
  res.json({ 
    message: 'CBX Backend API với WebSocket',
    onlineUsers: socketManager ? socketManager.getOnlineCount() : 0,
    timestamp: new Date()
  });
});

// API endpoint để lấy thông tin users online
app.get('/api/online-users', (req, res) => {
  try {
    if (!req.socketManager) {
      return res.status(503).json({
        success: false,
        message: 'Socket.IO chưa được khởi tạo'
      });
    }

    const onlineUsers = req.socketManager.getOnlineUsers();
    const onlineCount = req.socketManager.getOnlineCount();
    
    res.json({
      success: true,
      data: {
        users: onlineUsers,
        count: onlineCount,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin users online',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi server'
  });
});

// 404 handler - để ở cuối
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint không tồn tại'
  });
});

module.exports = app;