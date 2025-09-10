// controllers/transportController.js
const Transport = require('../models/Transport');
const slugify = require('slugify');
const { validationResult } = require('express-validator');

// Hàm helper để xử lý lỗi
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array()
    });
  }
  return null;
};

// Hàm helper để xây dựng query filter
const buildFilterQuery = (queryParams) => {
  const {
    company,
    fromCity,
    toCity,
    departDate,
    minPrice,
    maxPrice,
    seatType,
    minRating,
    isActive = true
  } = queryParams;

  const filter = { isActive };

  if (company) {
    filter.company = new RegExp(company, 'i');
  }

  if (fromCity) {
    filter['route.fromCity'] = new RegExp(fromCity, 'i');
  }

  if (toCity) {
    filter['route.toCity'] = new RegExp(toCity, 'i');
  }

  if (departDate) {
    const startDate = new Date(departDate);
    const endDate = new Date(departDate);
    endDate.setDate(endDate.getDate() + 1);
    
    filter['schedule.departDate'] = {
      $gte: startDate,
      $lt: endDate
    };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (seatType) {
    filter['bus.seatType'] = new RegExp(seatType, 'i');
  }

  if (minRating) {
    filter.rating = { $gte: Number(minRating) };
  }

  return filter;
};

// @desc    Lấy danh sách tất cả chuyến xe với filter và search
// @route   GET /api/transports
// @access  Public
const getAllTransports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search,
      ...filterParams
    } = req.query;

    // Xây dựng filter query
    let filter = buildFilterQuery(filterParams);

    // Thêm tìm kiếm text nếu có
    if (search) {
      filter.$or = [
        { company: new RegExp(search, 'i') },
        { 'route.fromCity': new RegExp(search, 'i') },
        { 'route.toCity': new RegExp(search, 'i') },
        { 'bus.seatType': new RegExp(search, 'i') },
        { 'schedule.pickupPoint': new RegExp(search, 'i') },
        { 'schedule.dropoffPoint': new RegExp(search, 'i') }
      ];
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort
    };

    const transports = await Transport.find(filter)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await Transport.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: transports.length,
      total,
      pagination: {
        page: options.page,
        pages: Math.ceil(total / options.limit),
        limit: options.limit
      },
      data: transports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách chuyến xe',
      error: error.message
    });
  }
};

// @desc    Lấy một chuyến xe theo ID hoặc slug
// @route   GET /api/transports/:id
// @access  Public
const getTransportById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm theo ObjectId hoặc slug
    const transport = await Transport.findOne({
      $or: [
        { _id: id }
      ],
      isActive: true
    });

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến xe'
      });
    }

    res.status(200).json({
      success: true,
      data: transport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin chuyến xe',
      error: error.message
    });
  }
};

const getTransportBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const transport = await Transport.findOne({
      slug: slug,
      isActive: true
    });

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến xe'
      });
    }

    res.status(200).json({
      success: true,
      data: transport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin chuyến xe',
      error: error.message
    });
  }
};

// @desc    Tạo chuyến xe mới
// @route   POST /api/transports
// @access  Private
const createTransport = async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const transport = await Transport.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tạo chuyến xe thành công',
      data: transport
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Chuyến xe với slug này đã tồn tại'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo chuyến xe',
      error: error.message
    });
  }
};

// @desc    Cập nhật chuyến xe
// @route   PUT /api/transports/:id
// @access  Private
const updateTransport = async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const { id } = req.params;
    
    // Kiểm tra xem có cần tạo slug mới không
    const needNewSlug = req.body.company || req.body['route.fromCity'] || req.body['route.toCity'] || req.body.route;
    
    let updateData = req.body;
    
    if (needNewSlug) {
      // Lấy document hiện tại
      const currentDoc = await Transport.findById(id);
      
      if (!currentDoc) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chuyến xe để cập nhật'
        });
      }
      
      // Xác định giá trị mới cho slug
      const company = req.body.company || currentDoc.company;
      const fromCity = req.body['route.fromCity'] || req.body.route?.fromCity || currentDoc.route.fromCity;
      const toCity = req.body['route.toCity'] || req.body.route?.toCity || currentDoc.route.toCity;
      
      // Tạo slug mới
      updateData.slug = slugify(`${company}-${fromCity}-${toCity}`, {
        lower: true,
        strict: true
      });
    }
    
    const transport = await Transport.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      {
        new: true,
        runValidators: false,
        context: 'query'
      }
    );

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến xe để cập nhật'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật chuyến xe thành công',
      data: transport
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Slug đã tồn tại, vui lòng thử lại'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật chuyến xe',
      error: error.message
    });
  }
};

// @desc    Xóa chuyến xe (soft delete)
// @route   DELETE /api/transports/:id
// @access  Private
const deleteTransport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transport = await Transport.findById(id);

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến xe để xóa'
      });
    }

    await transport.softDelete();

    res.status(200).json({
      success: true,
      message: 'Xóa chuyến xe thành công',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa chuyến xe',
      error: error.message
    });
  }
};

const permanentDeleteTransport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transport = await Transport.findByIdAndDelete(id);

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến xe để xóa'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa vĩnh viễn chuyến xe thành công',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa vĩnh viễn chuyến xe',
      error: error.message
    });
  }
};

const restoreTransport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transport = await Transport.findOne({ _id: id, isDeleted: true });

    if (!transport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến xe đã bị xóa để khôi phục'
      });
    }

    await transport.restore();

    res.status(200).json({
      success: true,
      message: 'Khôi phục chuyến xe thành công',
      data: transport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi khôi phục chuyến xe',
      error: error.message
    });
  }
};

const getDeletedTransports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const transports = await Transport.find({ isDeleted: true })
      .sort('-deletedAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transport.countDocuments({ isDeleted: true });

    res.status(200).json({
      success: true,
      count: transports.length,
      total,
      pagination: {
        page: parseInt(page, 10),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit, 10)
      },
      data: transports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách chuyến xe đã xóa',
      error: error.message
    });
  }
};

const cleanupTransports = async (req, res) => {
  try {
    // Lấy số ngày từ query params, mặc định là 30 ngày
    const { days = 30 } = req.query;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    // Tìm các bản ghi sẽ bị xóa để thống kê
    const recordsToDelete = await Transport.find({
      isDeleted: true,
      deletedAt: { $lt: cutoffDate }
    }).select('company route.fromCity route.toCity deletedAt');

    // Thực hiện xóa vĩnh viễn
    const result = await Transport.deleteMany({
      isDeleted: true,
      deletedAt: { $lt: cutoffDate }
    });

    res.status(200).json({
      success: true,
      message: `Đã cleanup ${result.deletedCount} chuyến xe`,
      data: {
        deletedCount: result.deletedCount,
        cutoffDate,
        daysThreshold: parseInt(days),
        deletedRecords: recordsToDelete.map(record => ({
          company: record.company,
          route: `${record.route.fromCity} - ${record.route.toCity}`,
          deletedAt: record.deletedAt,
          daysDeleted: Math.floor((new Date() - record.deletedAt) / (1000 * 60 * 60 * 24))
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cleanup chuyến xe',
      error: error.message
    });
  }
};

// @desc    Preview cleanup - Xem trước các bản ghi sẽ bị xóa
// @route   GET /api/transports/cleanup/preview
// @access  Private (Admin only)
const previewCleanup = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const recordsToDelete = await Transport.find({
      isDeleted: true,
      deletedAt: { $lt: cutoffDate }
    }).select('company route.fromCity route.toCity deletedAt bus.totalSeats');

    const totalRecords = recordsToDelete.length;
    const totalSeats = recordsToDelete.reduce((sum, record) => sum + record.bus.totalSeats, 0);

    res.status(200).json({
      success: true,
      message: `Preview cleanup với ngưỡng ${days} ngày`,
      data: {
        totalRecords,
        totalSeats,
        cutoffDate,
        daysThreshold: parseInt(days),
        records: recordsToDelete.map(record => ({
          company: record.company,
          route: `${record.route.fromCity} - ${record.route.toCity}`,
          deletedAt: record.deletedAt,
          daysDeleted: Math.floor((new Date() - record.deletedAt) / (1000 * 60 * 60 * 24)),
          totalSeats: record.bus.totalSeats
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi preview cleanup',
      error: error.message
    });
  }
};

// @desc    Tìm kiếm chuyến xe theo tuyến đường
// @route   GET /api/transports/search/route
// @access  Public
const searchByRoute = async (req, res) => {
  try {
    const { fromCity, toCity, departDate, page = 1, limit = 10, sort = 'price' } = req.query;

    if (!fromCity || !toCity) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp điểm đi và điểm đến'
      });
    }

    const transports = await Transport.findByRoute(fromCity, toCity, departDate)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transport.countDocuments({
      'route.fromCity': new RegExp(fromCity, 'i'),
      'route.toCity': new RegExp(toCity, 'i'),
      isActive: true,
      ...(departDate && {
        'schedule.departDate': {
          $gte: new Date(departDate),
          $lt: new Date(new Date(departDate).getTime() + 24 * 60 * 60 * 1000)
        }
      })
    });

    res.status(200).json({
      success: true,
      count: transports.length,
      total,
      pagination: {
        page: parseInt(page, 10),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit, 10)
      },
      data: transports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tìm kiếm chuyến xe',
      error: error.message
    });
  }
};

// @desc    Lấy thống kê chuyến xe
// @route   GET /api/transports/stats
// @access  Private
const getTransportStats = async (req, res) => {
  try {
    const stats = await Transport.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: null,
          totalTransports: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating' },
          totalSeats: { $sum: '$bus.totalSeats' },
          companies: { $addToSet: '$company' }
        }
      },
      {
        $project: {
          _id: 0,
          totalTransports: 1,
          avgPrice: { $round: ['$avgPrice', 0] },
          avgRating: { $round: ['$avgRating', 1] },
          totalSeats: 1,
          totalCompanies: { $size: '$companies' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalTransports: 0,
        avgPrice: 0,
        avgRating: 0,
        totalSeats: 0,
        totalCompanies: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê',
      error: error.message
    });
  }
};

module.exports = {
  getAllTransports,
  getTransportById,
  getTransportBySlug,
  createTransport,
  updateTransport,
  deleteTransport,
  permanentDeleteTransport,
  restoreTransport,
  getDeletedTransports,
  searchByRoute,
  getTransportStats,
  cleanupTransports,
  previewCleanup
};