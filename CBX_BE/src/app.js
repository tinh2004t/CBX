const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoute');
const domesticTourRoutes = require('./routes/domesticToursRoute');
const tourDetailRoute = require('./routes/tourDetailRoute');
const overseaTourRoute = require('./routes/overseaTourRoute');
const flightRoute = require('./routes/flightRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tour-noi-dia', domesticTourRoutes);
app.use('/api/tour-quoc-te', overseaTourRoute);
app.use('/api/tour', tourDetailRoute);
app.use('/api/flight', flightRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi server'
  });
});

// 404 handler



module.exports = app;