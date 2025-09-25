const { body, validationResult } = require('express-validator');

// Helper function để xử lý validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Validation rules cho các field chung
const commonTourValidation = [
  body('title')
    .notEmpty()
    .withMessage('Tên tour là bắt buộc')
    .isLength({ min: 5, max: 200 })
    .withMessage('Tên tour phải từ 5-200 ký tự')
    .trim(),
  
  body('image')
    .notEmpty()
    .withMessage('Hình ảnh tour là bắt buộc')
    .isURL()
    .withMessage('Hình ảnh phải là URL hợp lệ')
    .matches(/\.(jpg|jpeg|png|webp|gif)$/i)
    .withMessage('Hình ảnh phải có định dạng jpg, jpeg, png, webp hoặc gif')
    .trim(),
  
  body('duration')
    .notEmpty()
    .withMessage('Thời gian tour là bắt buộc')
    .trim(),
  
  body('price')
    .notEmpty()
    .withMessage('Giá tour là bắt buộc')
    .trim(),
  
  body('tourType')
    .notEmpty()
    .withMessage('Loại tour là bắt buộc')
    .isIn(['mice', 'domestic', 'oversea'])
    .withMessage('Loại tour phải là mice, domestic hoặc oversea'),

  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating phải là số từ 0-5'),

  body('reviews')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Số lượng reviews phải là số nguyên không âm')
];

// Validation rules cho MICE tour
const miceValidation = [
  body('location')
    .if(body('tourType').equals('mice'))
    .notEmpty()
    .withMessage('Địa điểm là bắt buộc cho MICE tour')
    .trim(),
  
  body('category')
    .if(body('tourType').equals('mice'))
    .optional()
    .isIn(['meeting', 'incentive', 'conference', 'exhibition', 'teambuilding', 'workshop'])
    .withMessage('Category phải là một trong: meeting, incentive, conference, exhibition, teambuilding, workshop'),
  
  body('groupSize')
    .if(body('tourType').equals('mice'))
    .optional()
    .trim(),
  
  body('services')
    .if(body('tourType').equals('mice'))
    .optional()
    .isArray()
    .withMessage('Services phải là mảng'),
  
  body('services.*')
    .if(body('tourType').equals('mice'))
    .optional()
    .trim(),
  
  body('facilities')
    .if(body('tourType').equals('mice'))
    .optional()
    .isArray()
    .withMessage('Facilities phải là mảng'),
  
  body('facilities.*')
    .if(body('tourType').equals('mice'))
    .optional()
    .trim()
];

// Validation rules cho Domestic tour
const domesticValidation = [
  body('departure')
    .if(body('tourType').equals('domestic'))
    .notEmpty()
    .withMessage('Điểm khởi hành là bắt buộc cho tour trong nước')
    .trim(),
  
  body('region')
    .if(body('tourType').equals('domestic'))
    .notEmpty()
    .withMessage('Vùng miền là bắt buộc cho tour trong nước')
    .isIn(['Miền Bắc', 'Miền Trung', 'Miền Nam'])
    .withMessage('Vùng miền phải là: Miền Bắc, Miền Trung hoặc Miền Nam'),
  
  body('scheduleInfo')
    .if(body('tourType').equals('domestic'))
    .notEmpty()
    .withMessage('Thông tin lịch trình là bắt buộc cho tour trong nước')
    .trim(),
  
  body('transportation')
    .if(body('tourType').equals('domestic'))
    .optional()
    .isIn(['bus', 'train', 'plane', 'car'])
    .withMessage('Phương tiện phải là: bus, train, plane hoặc car')
];

// Validation rules cho Oversea tour
const overseaValidation = [
  body('departure')
    .if(body('tourType').equals('oversea'))
    .notEmpty()
    .withMessage('Điểm khởi hành là bắt buộc cho tour nước ngoài')
    .trim(),
  
  body('airline')
    .if(body('tourType').equals('oversea'))
    .notEmpty()
    .withMessage('Hãng hàng không là bắt buộc cho tour nước ngoài')
    .trim(),
  
  body('continent')
    .if(body('tourType').equals('oversea'))
    .notEmpty()
    .withMessage('Châu lục là bắt buộc cho tour nước ngoài')
    .isIn(['Châu Á', 'Châu Âu', 'Châu Úc', 'Châu Mỹ', 'Châu Phi'])
    .withMessage('Châu lục phải là: Châu Á, Châu Âu, Châu Úc, Châu Mỹ hoặc Châu Phi'),
  
  body('scheduleInfo')
    .if(body('tourType').equals('oversea'))
    .notEmpty()
    .withMessage('Thông tin lịch trình là bắt buộc cho tour nước ngoài')
    .trim(),
  
  body('visa')
    .if(body('tourType').equals('oversea'))
    .optional()
    .isIn(['required', 'not_required', 'visa_on_arrival'])
    .withMessage('Visa phải là: required, not_required hoặc visa_on_arrival'),
  
  body('countries')
    .if(body('tourType').equals('oversea'))
    .optional()
    .isArray()
    .withMessage('Countries phải là mảng'),
  
  body('countries.*')
    .if(body('tourType').equals('oversea'))
    .optional()
    .trim()
];

// Validation cho việc tạo tour mới
exports.validateTourCreation = [
  ...commonTourValidation,
  ...miceValidation,
  ...domesticValidation,
  ...overseaValidation,
  handleValidationErrors
];

// Validation cho việc cập nhật tour (một số field có thể optional)
exports.validateTourUpdate = [
  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Tên tour phải từ 5-200 ký tự')
    .trim(),
  
  body('image')
    .optional()
    .isURL()
    .withMessage('Hình ảnh phải là URL hợp lệ')
    .matches(/\.(jpg|jpeg|png|webp|gif)$/i)
    .withMessage('Hình ảnh phải có định dạng jpg, jpeg, png, webp hoặc gif')
    .trim(),
  
  body('duration')
    .optional()
    .notEmpty()
    .withMessage('Thời gian tour không được để trống')
    .trim(),
  
  body('price')
    .optional()
    .notEmpty()
    .withMessage('Giá tour không được để trống')
    .trim(),
  
  body('tourType')
    .optional()
    .isIn(['mice', 'domestic', 'oversea'])
    .withMessage('Loại tour phải là mice, domestic hoặc oversea'),

  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating phải là số từ 0-5'),

  body('reviews')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Số lượng reviews phải là số nguyên không âm'),

  // MICE tour fields
  body('location')
    .optional()
    .trim(),
  
  body('category')
    .optional()
    .isIn(['meeting', 'incentive', 'conference', 'exhibition', 'teambuilding', 'workshop'])
    .withMessage('Category phải là một trong: meeting, incentive, conference, exhibition, teambuilding, workshop'),
  
  body('groupSize')
    .optional()
    .trim(),
  
  body('services')
    .optional()
    .isArray()
    .withMessage('Services phải là mảng'),
  
  body('facilities')
    .optional()
    .isArray()
    .withMessage('Facilities phải là mảng'),

  // Domestic tour fields
  body('departure')
    .optional()
    .trim(),
  
  body('region')
    .optional()
    .isIn(['Miền Bắc', 'Miền Trung', 'Miền Nam'])
    .withMessage('Vùng miền phải là: Miền Bắc, Miền Trung hoặc Miền Nam'),
  
  body('scheduleInfo')
    .optional()
    .trim(),
  
  body('transportation')
    .optional()
    .isIn(['bus', 'train', 'plane', 'car'])
    .withMessage('Phương tiện phải là: bus, train, plane hoặc car'),

  // Oversea tour fields
  body('airline')
    .optional()
    .trim(),
  
  body('continent')
    .optional()
    .isIn(['Châu Á', 'Châu Âu', 'Châu Úc', 'Châu Mỹ', 'Châu Phi'])
    .withMessage('Châu lục phải là: Châu Á, Châu Âu, Châu Úc, Châu Mỹ hoặc Châu Phi'),
  
  body('visa')
    .optional()
    .isIn(['required', 'not_required', 'visa_on_arrival'])
    .withMessage('Visa phải là: required, not_required hoặc visa_on_arrival'),
  
  body('countries')
    .optional()
    .isArray()
    .withMessage('Countries phải là mảng'),

  handleValidationErrors
];

// Validation cho review
exports.validateReview = [
  body('rating')
    .notEmpty()
    .withMessage('Rating là bắt buộc')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating phải là số từ 1-5'),
  
  handleValidationErrors
];

// Validation cho query parameters
exports.validateQueryParams = [
  // Page và limit
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page phải là số nguyên dương'),
  
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit phải là số nguyên từ 1-100'),
  
  // Tour type
  body('tourType')
    .optional()
    .isIn(['mice', 'domestic', 'oversea'])
    .withMessage('Tour type phải là mice, domestic hoặc oversea'),
  
  // Rating
  body('minRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('MinRating phải là số từ 0-5'),
  
  // Sort
  body('sortBy')
    .optional()
    .isIn(['createdAt', 'title', 'price', 'rating', 'reviews'])
    .withMessage('SortBy phải là: createdAt, title, price, rating hoặc reviews'),
  
  body('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('SortOrder phải là asc hoặc desc'),
  
  handleValidationErrors
];