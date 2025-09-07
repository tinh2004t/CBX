const Tour = require("../models/DomesticTour");
const logAdminAction = require("../utils/logAdminAction");

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove multiple consecutive hyphens
};

// GET /api/tours - Lấy danh sách tất cả tour
exports.getAllTours = async (req, res) => {
  try {
    const { page = 1, limit = 10, region, departure, search } = req.query;
    const query = {};

    // Filter by region
    if (region) {
      query.region = { $regex: region, $options: "i" };
    }

    // Filter by departure
    if (departure) {
      query.departure = { $regex: departure, $options: "i" };
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const tours = await Tour.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Tour.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách tour",
      error: error.message,
    });
  }
};

// GET /api/tours/:id - Lấy thông tin chi tiết tour theo ID
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin tour",
      error: error.message,
    });
  }
};

// GET /api/tours/slug/:slug - Lấy thông tin tour theo slug
exports.getTourBySlug = async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin tour",
      error: error.message,
    });
  }
};

// POST /api/tours - Tạo tour mới
exports.createTour = async (req, res) => {
  try {
    const {
      title,
      image,
      departure,
      price,
      duration,
      airline,
      scheduleInfo,
      region,
    } = req.body;

    // Debug: Log request body
    console.log("Request body:", req.body);

    // Validate required fields
    if (
      !title ||
      !image ||
      !departure ||
      !price ||
      !duration ||
      !airline ||
      !scheduleInfo ||
      !region
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin tour",
        receivedFields: {
          title: !!title,
          image: !!image,
          departure: !!departure,
          price: !!price,
          duration: !!duration,
          airline: !!airline,
          scheduleInfo: !!scheduleInfo,
          region: !!region,
        },
      });
    }

    // Generate slug from title
    const slug = generateSlug(title);
    console.log("Generated slug:", slug);

    // Check if slug already exists - fix the query
    const existingTour = await Tour.findOne({ slug }).setOptions({
      includeDeleted: true,
    });

    if (existingTour && !existingTour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Tour với tiêu đề tương tự đã tồn tại",
      });
    }

    // Create tour data object
    const tourData = {
      slug,
      title: title.trim(),
      image: image.trim(),
      departure: departure.trim(),
      price: price.trim(),
      duration: duration.trim(),
      airline: airline.trim(),
      scheduleInfo: scheduleInfo.trim(),
      region: region.trim(),
      isDeleted: false,
      deletedAt: null,
    };

    console.log("Tour data to save:", tourData);

    // Use create method instead of new + save
    const savedTour = await Tour.create(tourData);
    await logAdminAction(req.user._id, req.user.username, "Tạo tour", savedTour);

    console.log(
      "Saved tour:",
      savedTour.toObject ? savedTour.toObject() : savedTour
    );

    res.status(201).json({
      success: true,
      message: "Tạo tour thành công",
      data: savedTour,
    });
  } catch (error) {
    console.error("Error creating tour:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tour với tiêu đề này đã tồn tại",
        error: "Duplicate key error",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo tour",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// PUT /api/tours/:id - Cập nhật tour
exports.updateTour = async (req, res) => {
  try {
    const {
      title,
      image,
      departure,
      price,
      duration,
      airline,
      scheduleInfo,
      region,
    } = req.body;

    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    // Update slug if title changed
    let updateData = {
      image,
      departure,
      price,
      duration,
      airline,
      scheduleInfo,
      region,
    };

    if (title && title !== tour.title) {
      const newSlug = generateSlug(title);
      const existingTour = await Tour.findOne({
        slug: newSlug,
        _id: { $ne: req.params.id },
      });

      if (existingTour) {
        return res.status(400).json({
          success: false,
          message: "Tour với tiêu đề tương tự đã tồn tại",
        });
      }

      updateData.title = title;
      updateData.slug = newSlug;
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    await logAdminAction(req.user._id, "Cập nhật tour", updatedTour);

    res.status(200).json({
      success: true,
      message: "Cập nhật tour thành công",
      data: updatedTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật tour",
      error: error.message,
    });
  }
};

// DELETE /api/tours/:id - Soft delete tour
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    if (tour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Tour này đã bị xóa trước đó",
      });
    }

    await tour.softDelete();

    await logAdminAction(req.user._id, "Xóa tour", tour);

    res.status(200).json({
      success: true,
      message: "Xóa tour thành công (có thể khôi phục trong 30 ngày)",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa tour",
      error: error.message,
    });
  }
};

// POST /api/tours/:id/restore - Khôi phục tour đã xóa
exports.restoreTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).setOptions({
      includeDeleted: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    if (!tour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Tour này chưa bị xóa",
      });
    }

    await tour.restore();

    await logAdminAction(req.user._id, "Khôi phục tour", tour);

    res.status(200).json({
      success: true,
      message: "Khôi phục tour thành công",
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi khôi phục tour",
      error: error.message,
    });
  }
};

// DELETE /api/tours/:id/permanent - Xóa vĩnh viễn tour (chỉ admin)
exports.permanentDeleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).setOptions({
      includeDeleted: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    await Tour.findByIdAndDelete(req.params.id);

    await logAdminAction(req.user._id, "Xóa vĩnh viễn tour", tour);

    res.status(200).json({
      success: true,
      message: "Xóa vĩnh viễn tour thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa vĩnh viễn tour",
      error: error.message,
    });
  }
};

// GET /api/tours/deleted - Lấy danh sách tour đã xóa (chỉ admin)
exports.getDeletedTours = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const tours = await Tour.findDeleted()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ deletedAt: -1 });

    const total = await Tour.countDocuments({ isDeleted: true });

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách tour đã xóa",
      error: error.message,
    });
  }
};

// POST /api/tours/cleanup - Cleanup tour đã xóa quá 30 ngày (chỉ admin)
exports.cleanupOldDeletedTours = async (req, res) => {
  try {
    const result = await Tour.cleanupOldDeleted();

    await logAdminAction(req.user._id, "Cleanup tour", null);

    res.status(200).json({
      success: true,
      message: `Đã xóa vĩnh viễn ${result.deletedCount} tour quá 30 ngày`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cleanup tour",
      error: error.message,
    });
  }
};

// GET /api/tours/region/:region - Lấy tour theo vùng miền
exports.getToursByRegion = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const region = req.params.region;

    const tours = await Tour.find({
      region: { $regex: region, $options: "i" },
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Tour.countDocuments({
      region: { $regex: region, $options: "i" },
    });

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tour theo vùng miền",
      error: error.message,
    });
  }
};

// GET /api/tours/stats/summary - Thống kê tổng quan
exports.getTourStats = async (req, res) => {
  try {
    const totalTours = await Tour.countDocuments().setOptions({
      includeDeleted: true,
    });
    const deletedTours = await Tour.countDocuments({ isDeleted: true });
    const activeTours = await Tour.countDocuments({ isDeleted: { $ne: true } });

    const regionStats = await Tour.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$region",
          count: { $sum: 1 },
        },
      },
    ]);

    const departureStats = await Tour.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$departure",
          count: { $sum: 1 },
        },
      },
    ]);

    // Tours will be deleted permanently in next 30 days
    const toBeDeletedCount = await Tour.countDocuments({
      isDeleted: true,
      deletedAt: { $exists: true },
    });

    res.status(200).json({
      success: true,
      data: {
        totalTours,
        activeTours,
        deletedTours,
        toBeDeletedCount,
        regionStats,
        departureStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thống kê",
      error: error.message,
    });
  }
};
