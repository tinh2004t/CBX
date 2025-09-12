// routes/settings.js
const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/SettingController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

// Middleware validation (optional - bạn có thể thêm authentication middleware ở đây)
const validateUpdateSettings = (req, res, next) => {
  const {
    bannerImage,
    footerImage,
    logoImage,
    hotline,
    email,
    address,
    fbLink
  } = req.body;

  // Kiểm tra email format nếu có
  if (email && email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email không hợp lệ'
      });
    }
  }

  // Kiểm tra URL Facebook nếu có
  if (fbLink && fbLink.trim() !== '') {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(fbLink)) {
      return res.status(400).json({
        success: false,
        message: 'Format Facebook link không hợp lệ'
      });
    }
  }

  next();
};

// Routes
// GET /api/settings - Lấy thông tin settings
router.get('/', authenticateToken, getSettings);

// PUT /api/settings - Cập nhật settings
router.put('/', authenticateToken, validateUpdateSettings, updateSettings);

module.exports = router;