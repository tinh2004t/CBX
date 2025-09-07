const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không được cung cấp' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không hợp lệ' 
      });
    }

    // Gắn thông tin vào request
    req.user = user;
    req.usernameFromToken = decoded.username; // lấy username trực tiếp từ token

    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Token không hợp lệ' 
    });
  }
};

// Middleware kiểm tra quyền SuperAdmin
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Chỉ SuperAdmin mới có quyền thực hiện hành động này' 
    });
  }
  next();
};

module.exports = { authenticateToken, requireSuperAdmin };
