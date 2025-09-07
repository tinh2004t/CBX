const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const jwt = require('jsonwebtoken');

// Tạo JWT token
const generateToken = (userId, username) => {
  return jwt.sign(
    { 
      userId, 
      username 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
    }
  );
};

// Ghi log hoạt động admin
const logAdminAction = async (adminId, adminUsername, action, targetUser = null, details = {}) => {
  try {
    await AdminLog.create({
      adminId: adminId.toString(),
      adminUsername,
      action,
      targetUser,
      details
    });
  } catch (error) {
    console.error('Lỗi ghi log:', error);
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username và password là bắt buộc'
      });
    }

    // Tìm user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
      });
    }

    // Kiểm tra password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
      });
    }

    // Tạo token
    const token = generateToken(user._id,user.username);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Tạo tài khoản (chỉ SuperAdmin)
const createAccount = async (req, res) => {
  try {
    const { username, password, role = 'Admin' } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username và password là bắt buộc'
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username phải có ít nhất 3 ký tự'
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Password phải có ít nhất 4 ký tự'
      });
    }

    if (!['Admin', 'SuperAdmin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role phải là Admin hoặc SuperAdmin'
      });
    }

    // Kiểm tra username đã tồn tại
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username đã tồn tại'
      });
    }

    // Tạo user mới
    const newUser = new User({
      username,
      passwordHash: password, // Sẽ được hash tự động bởi pre-save middleware
      role
    });

    await newUser.save();

    // Ghi log
    await logAdminAction(
      req.user._id, 
      req.user.username, 
      'Tạo tài khoản mới', 
      username,
      { role }
    );

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công',
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          role: newUser.role
        }
      }
    });

  } catch (error) {
    console.error('Lỗi tạo tài khoản:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy thông tin user hiện tại
const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          role: req.user.role
        }
      }
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Đăng xuất
const logout = async (req, res) => {
  try {
    // Ghi log
    await logAdminAction(req.user._id, req.user.username, 'Đăng xuất khỏi hệ thống');

    res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy danh sách users (chỉ SuperAdmin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách users:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy logs
const getAdminLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const logs = await AdminLog.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AdminLog.countDocuments();

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Lỗi lấy logs:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

module.exports = {
  login,
  createAccount,
  getCurrentUser,
  logout,
  getAllUsers,
  getAdminLogs
};