// controllers/settingsController.js
const Settings = require("../models/Settings");
const logAdminAction = require("../utils/logAdminAction");

// Lấy thông tin settings
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSingleSettings();

    res.status(200).json({
      success: true,
      data: settings,
      message: "Lấy thông tin settings thành công",
    });
  } catch (error) {
    console.error("Error getting settings:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin settings",
      error: error.message,
    });
  }
};

// Cập nhật thông tin settings
const updateSettings = async (req, res) => {
  try {
    const {
      bannerImages, // Nhận mảng 3 hình từ client
      footerImage,
      logoImage,
      hotline,
      email,
      address,
      fbLink,
    } = req.body;

    // Validation cơ bản
    if (!email && req.body.email !== undefined) {
      return res.status(400).json({
        success: false,
        message: "Email không được để trống",
      });
    }

    // Validation cho bannerImages
    if (bannerImages !== undefined) {
      if (!Array.isArray(bannerImages)) {
        return res.status(400).json({
          success: false,
          message: "bannerImages phải là một mảng",
        });
      }
      if (bannerImages.length !== 3) {
        return res.status(400).json({
          success: false,
          message: "Banner phải có đúng 3 hình ảnh",
        });
      }
    }

    // Tạo object chứa các field cần update
    const updateData = {};
    if (bannerImages !== undefined) updateData.bannerImages = bannerImages;
    if (footerImage !== undefined) updateData.footerImage = footerImage;
    if (logoImage !== undefined) updateData.logoImage = logoImage;
    if (hotline !== undefined) updateData.hotline = hotline;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (fbLink !== undefined) updateData.fbLink = fbLink;

    const updatedSettings = await Settings.updateSingleSettings(updateData);
    await logAdminAction(
      req.user._id,
      req.user.username,
      "Cập nhật settings",
      null,
      { updatedFields: updateData }
    );

    res.status(200).json({
      success: true,
      data: updatedSettings,
      message: "Cập nhật settings thành công",
    });
  } catch (error) {
    console.error("Error updating settings:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật settings",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
