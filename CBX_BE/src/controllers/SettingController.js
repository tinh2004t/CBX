// controllers/settingsController.js
const Settings = require('../models/Settings');
const logAdminAction = require('../utils/logAdminAction');

// Lấy thông tin settings
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSingleSettings();
    
    res.status(200).json({
      success: true,
      data: settings,
      message: 'Lấy thông tin settings thành công'
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin settings',
      error: error.message
    });
  }
};

// Cập nhật thông tin settings
const updateSettings = async (req, res) => {
  try {
    const {
      bannerImage,
      footerImage,
      logoImage,
      hotline,
      email,
      address,
      fbLink
    } = req.body;

    // Validation cơ bản
    if (!email && req.body.email !== undefined) {
      return res.status(400).json({
        success: false,
        message: 'Email không được để trống'
      });
    }

    // Tạo object chứa các field cần update (chỉ update những field được gửi lên)
    const updateData = {};
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage;
    if (footerImage !== undefined) updateData.footerImage = footerImage;
    if (logoImage !== undefined) updateData.logoImage = logoImage;
    if (hotline !== undefined) updateData.hotline = hotline;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (fbLink !== undefined) updateData.fbLink = fbLink;

    const updatedSettings = await Settings.updateSingleSettings(updateData);

    res.status(200).json({
      success: true,
      data: updatedSettings,
      message: 'Cập nhật settings thành công'
    });
    await logAdminAction(req.user._id, 'Cập nhật settings');
  } catch (error) {
    console.error('Error updating settings:', error);
    
    // Xử lý validation error từ mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật settings',
      error: error.message
    });
  }
};

module.exports = {
  getSettings,
  updateSettings
};