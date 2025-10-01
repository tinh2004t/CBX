// validations/transportValidation.js
const { body } = require("express-validator");

const transportValidation = [
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Tên công ty là bắt buộc")
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên công ty phải từ 2-100 ký tự"),

  body("route.fromCity")
    .trim()
    .notEmpty()
    .withMessage("Thành phố đi là bắt buộc")
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên thành phố đi phải từ 2-50 ký tự"),

  body("route.toCity")
    .trim()
    .notEmpty()
    .withMessage("Thành phố đến là bắt buộc")
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên thành phố đến phải từ 2-50 ký tự"),

  body("bus.seatType").trim().notEmpty().withMessage("Loại ghế là bắt buộc"),

  body("bus.totalSeats")
    .isInt({ min: 1, max: 100 })
    .withMessage("Tổng số ghế phải từ 1-100"),

  body("bus.amenities")
    .optional()
    .isArray()
    .withMessage("Tiện ích phải là mảng"),

  body("schedule.departDate")
    .isISO8601()
    .withMessage("Ngày khởi hành không hợp lệ"),

  body('schedule.returnDate')
  .optional({ nullable: true, checkFalsy: true })  // ← THÊM OPTIONS NÀY
  .isISO8601()
  .withMessage('Ngày về không hợp lệ'),

  body("schedule.departTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Giờ khởi hành không hợp lệ (HH:MM)"),

  body("schedule.arrivalTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Giờ đến không hợp lệ (HH:MM)"),

  body("schedule.duration")
    .trim()
    .notEmpty()
    .withMessage("Thời gian di chuyển là bắt buộc"),

  body("schedule.pickupPoint")
    .trim()
    .notEmpty()
    .withMessage("Điểm đón là bắt buộc"),

  body("schedule.dropoffPoint")
    .trim()
    .notEmpty()
    .withMessage("Điểm trả là bắt buộc"),

  body("price")
    .isNumeric()
    .withMessage("Giá vé phải là số")
    .custom((value) => {
      if (value < 0) {
        throw new Error("Giá vé không được âm");
      }
      return true;
    }),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Đánh giá phải từ 0-5"),

  body("reviews")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Số lượng đánh giá phải là số không âm"),
];

const updateTransportValidation = [
  body("company")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên công ty phải từ 2-100 ký tự"),

  body("route.fromCity")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên thành phố đi phải từ 2-50 ký tự"),

  body("route.toCity")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Tên thành phố đến phải từ 2-50 ký tự"),

  body("bus.seatType").optional().trim(),

  body("bus.totalSeats")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Tổng số ghế phải từ 1-100"),

  body("bus.amenities")
    .optional()
    .isArray()
    .withMessage("Tiện ích phải là mảng"),

  body("schedule.departDate")
    .optional()
    .isISO8601()
    .withMessage("Ngày khởi hành không hợp lệ"),

  body('schedule.returnDate')
  .optional({ nullable: true, checkFalsy: true })  // ← THÊM OPTIONS NÀY
  .isISO8601()
  .withMessage('Ngày về không hợp lệ'),

  body("schedule.departTime")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Giờ khởi hành không hợp lệ (HH:MM)"),

  body("schedule.arrivalTime")
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Giờ đến không hợp lệ (HH:MM)"),

  body("schedule.duration").optional().trim(),

  body("schedule.pickupPoint").optional().trim(),

  body("schedule.dropoffPoint").optional().trim(),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Giá vé phải là số")
    .custom((value) => {
      if (value < 0) {
        throw new Error("Giá vé không được âm");
      }
      return true;
    }),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Đánh giá phải từ 0-5"),

  body("reviews")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Số lượng đánh giá phải là số không âm"),
];

module.exports = {
  transportValidation,
  updateTransportValidation,
};
