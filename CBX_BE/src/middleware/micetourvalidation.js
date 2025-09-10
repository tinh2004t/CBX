const { body, validationResult } = require("express-validator");

// Validation rules cho MICE Tour
exports.validateMiceTour = [
  // Validate name
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên MICE tour không được để trống")
    .isLength({ min: 3, max: 200 })
    .withMessage("Tên MICE tour phải từ 3 đến 200 ký tự"),

  // Validate image
  body("image")
    .trim()
    .notEmpty()
    .withMessage("Hình ảnh không được để trống")
    .isURL()
    .withMessage("Hình ảnh phải là URL hợp lệ"),

  // Validate duration
  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Thời gian không được để trống")
    .isLength({ min: 1, max: 50 })
    .withMessage("Thời gian phải từ 1 đến 50 ký tự"),

  // Validate location
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Địa điểm không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Địa điểm phải từ 2 đến 100 ký tự"),

  // Validate price
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Giá không được để trống")
    .isLength({ min: 1, max: 50 })
    .withMessage("Giá phải từ 1 đến 50 ký tự"),

  // Validate rating (optional)
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Đánh giá phải từ 0 đến 5"),

  // Validate reviews (optional)
  body("reviews")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Số lượng đánh giá phải là số nguyên không âm"),

  // Validate groupSize (optional)
  body("groupSize")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Kích thước nhóm không được quá 50 ký tự"),

  // Validate category (optional)
  body("category")
    .optional()
    .isIn(["meeting", "incentive", "conference", "exhibition", "event"])
    .withMessage("Danh mục phải là: meeting, incentive, conference, exhibition, hoặc event"),

  // Validate description (optional)
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Mô tả không được quá 2000 ký tự"),

  // Validate highlights array (optional)
  body("highlights")
    .optional()
    .isArray()
    .withMessage("Điểm nổi bật phải là mảng"),
  body("highlights.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Mỗi điểm nổi bật phải từ 1 đến 200 ký tự"),

  // Validate services array (optional)
  body("services")
    .optional()
    .isArray()
    .withMessage("Dịch vụ phải là mảng"),
  body("services.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Mỗi dịch vụ phải từ 1 đến 100 ký tự"),

  // Validate facilities array (optional)
  body("facilities")
    .optional()
    .isArray()
    .withMessage("Tiện ích phải là mảng"),
  body("facilities.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Mỗi tiện ích phải từ 1 đến 100 ký tự"),

  // Validate featured (optional)
  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured phải là true hoặc false"),

  // Validate isActive (optional)
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("Trạng thái hoạt động phải là true hoặc false"),

  // Custom validation middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      });
    }
    next();
  }
];

// Validation cho review
exports.validateReview = [
  body("rating")
    .notEmpty()
    .withMessage("Đánh giá không được để trống")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Đánh giá phải từ 1 đến 5"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu đánh giá không hợp lệ",
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      });
    }
    next();
  }
];