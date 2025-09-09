// middleware/validation.js

const mongoose = require("mongoose");

// Middleware để validate ObjectId
const validateObjectId = (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "ID không hợp lệ"
    });
  }

  next();
};

// Middleware để validate slug format
const validateSlug = (req, res, next) => {
  const slug = req.params.slug;

  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Slug không hợp lệ"
    });
  }

  // Kiểm tra format slug (chỉ cho phép chữ thường, số và dấu gạch ngang)
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    return res.status(400).json({
      success: false,
      message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"
    });
  }

  next();
};

// Middleware để validate pagination
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  if (page && (isNaN(page) || page < 1)) {
    return res.status(400).json({
      success: false,
      message: "Trang phải là số nguyên dương"
    });
  }

  if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    return res.status(400).json({
      success: false,
      message: "Limit phải là số nguyên từ 1 đến 100"
    });
  }

  next();
};

// Middleware để validate tour data khi tạo mới
const validateTourData = (req, res, next) => {
  const {
    title,
    image,
    departure,
    price,
    duration,
    airline,
    scheduleInfo
  } = req.body;

  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push("Tiêu đề tour không được để trống");
  }

  if (!image || typeof image !== 'string' || !isValidUrl(image)) {
    errors.push("Hình ảnh phải là URL hợp lệ");
  }

  if (!departure || typeof departure !== 'string' || departure.trim().length === 0) {
    errors.push("Điểm khởi hành không được để trống");
  }

  if (!price || typeof price !== 'string' || price.trim().length === 0) {
    errors.push("Giá tour không được để trống");
  }

  if (!duration || typeof duration !== 'string' || duration.trim().length === 0) {
    errors.push("Thời gian tour không được để trống");
  }

  if (!airline || typeof airline !== 'string' || airline.trim().length === 0) {
    errors.push("Hãng hàng không không được để trống");
  }

  if (!scheduleInfo || typeof scheduleInfo !== 'string' || scheduleInfo.trim().length === 0) {
    errors.push("Thông tin lịch trình không được để trống");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors
    });
  }

  next();
};

// Helper function để validate URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Middleware để validate continent cho oversea tour
const validateContinent = (req, res, next) => {
  const validContinents = [
    "Châu Á",
    "Châu Âu", 
    "Châu Mỹ",
    "Châu Phi"
  ];

  if (req.body.continent && !validContinents.includes(req.body.continent)) {
    return res.status(400).json({
      success: false,
      message: "Châu lục không hợp lệ",
      validContinents: validContinents
    });
  }

  next();
};

// Middleware để validate region cho domestic tour
const validateRegion = (req, res, next) => {
  const validRegions = [
    "Miền Bắc",
    "Miền Trung",
    "Miền Nam"
  ];

  if (req.body.region && !validRegions.includes(req.body.region)) {
    return res.status(400).json({
      success: false,
      message: "Vùng miền không hợp lệ",
      validRegions: validRegions
    });
  }

  next();
};

module.exports = {
  validateObjectId,
  validateSlug,
  validatePagination,
  validateTourData,
  validateContinent,
  validateRegion
};