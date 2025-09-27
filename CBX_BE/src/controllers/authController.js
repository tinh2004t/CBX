const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logAdminAction = require('../utils/logAdminAction');

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

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập mật khẩu cũ và mật khẩu mới"
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng"
      });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu cũ không đúng"
      });
    }

    // 🚀 Gán trực tiếp, middleware sẽ hash
    user.passwordHash = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công"
    });

  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi đổi mật khẩu"
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, role, password  } = req.body;

    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Không cho phép user thường sửa SuperAdmin
    if (user.role === 'SuperAdmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền sửa SuperAdmin'
      });
    }

    // Không cho phép user tự hạ cấp quyền của mình
    if (userId === req.user.id && role && role !== user.role) {
      return res.status(403).json({
        success: false,
        message: 'Không thể thay đổi quyền của chính mình'
      });
    }

    // Cập nhật thông tin
    const updateData = {};
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    ).select('-passwordHash');

    res.json({
      success: true,
      message: 'Cập nhật user thành công',
      data: updatedUser
    });

    await logAdminAction(req.user._id, req.user.username, 'Cập nhật user', updatedUser.username);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username đã tồn tại'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật user',
      error: error.message
    });
  }
};

// Xóa user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Không cho phép xóa chính mình
    if (userId === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không thể xóa chính mình'
      });
    }

    // Không cho phép user thường xóa SuperAdmin
    if (user.role === 'SuperAdmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa SuperAdmin'
      });
    }

    // Kiểm tra có phải SuperAdmin cuối cùng không
    if (user.role === 'SuperAdmin') {
      const superAdminCount = await User.countDocuments({ role: 'SuperAdmin' });
      if (superAdminCount <= 1) {
        return res.status(403).json({
          success: false,
          message: 'Không thể xóa SuperAdmin cuối cùng'
        });
      }
    }

    await User.findByIdAndDelete(userId);
    await logAdminAction(req.user._id, req.user.username, 'Xóa user', user.username);

    res.json({
      success: true,
      message: 'Xóa user thành công'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa user',
      error: error.message
    });
  }
};


module.exports = {
  login,
  createAccount,
  getCurrentUser,
  logout,
  getAllUsers,
  getAdminLogs,
  changePassword,
  updateUser,
  deleteUser
};