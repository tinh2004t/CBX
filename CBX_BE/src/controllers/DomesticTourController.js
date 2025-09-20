const Tour = require("../models/DomesticTour");
const TourDetail = require("../models/TourDetail"); // Thêm model TourDetail
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

// Helper function to create default tour detail
const createDefaultTourDetail = async (tour) => {
  const tourDetail = {
    slug: tour.slug,
    tourData: {
      title: tour.title,
      location: tour.departure, // Sử dụng departure làm location mặc định
      duration: tour.duration,
      price: tour.price,
      originalPrice: "", // Để trống, có thể cập nhật sau
      rating: 0,
      reviews: 0,
      groupSize: "10-15 người", // Mặc định
      highlights: [
        "Khám phá địa điểm du lịch nổi tiếng",
        "Trải nghiệm văn hóa địa phương",
        "Thưởng thức ẩm thực đặc sản",
        "Dịch vụ chuyên nghiệp"
      ]
    },
    scheduleData: [
      {
        day: "Ngày 1",
        title: "Khởi hành",
        activities: [
          "Tập trung và khởi hành",
          "Di chuyển đến điểm đến",
          "Nhận phòng và nghỉ ngơi"
        ]
      }
    ],
    priceIncludes: [
      "Xe ô tô đời mới, máy lạnh",
      "Khách sạn tiêu chuẩn",
      "Các bữa ăn theo chương trình",
      "Vé tham quan theo chương trình",
      "Hướng dẫn viên kinh nghiệm",
      "Bảo hiểm du lịch"
    ],
    priceExcludes: [
      "Chi phí cá nhân",
      "Đồ uống có cồn",
      "Tip cho hướng dẫn viên và tài xế",
      "Chi phí phát sinh ngoài chương trình"
    ],
    landscapeImages: [],
    foodImages: []
  };

  return await TourDetail.create(tourDetail);
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
    
    // Tạo TourDetail tương ứng
    try {
      await createDefaultTourDetail(savedTour);
      console.log("Created corresponding TourDetail for tour:", savedTour.slug);
    } catch (detailError) {
      console.error("Error creating TourDetail:", detailError);
      // Không throw error để không ảnh hưởng đến việc tạo tour chính
    }

    await logAdminAction(req.user._id, req.user.username, "Tạo tour", tourData.title);

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

    const oldSlug = tour.slug;

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

    let newSlug = oldSlug;
    if (title && title !== tour.title) {
      newSlug = generateSlug(title);
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

    // Cập nhật TourDetail tương ứng
    try {
      const existingTourDetail = await TourDetail.findOne({ slug: oldSlug });
      
      if (existingTourDetail) {
        const tourDetailUpdateData = {
          slug: newSlug,
          'tourData.title': updatedTour.title,
          'tourData.location': updatedTour.departure,
          'tourData.duration': updatedTour.duration,
          'tourData.price': updatedTour.price,
        };

        await TourDetail.findByIdAndUpdate(
          existingTourDetail._id,
          tourDetailUpdateData,
          { new: true }
        );

        console.log("Updated corresponding TourDetail for tour:", newSlug);
      } else {
        // Nếu không tìm thấy TourDetail, tạo mới
        await createDefaultTourDetail(updatedTour);
        console.log("Created new TourDetail for updated tour:", newSlug);
      }
    } catch (detailError) {
      console.error("Error updating TourDetail:", detailError);
      // Không throw error để không ảnh hưởng đến việc cập nhật tour chính
    }

    await logAdminAction(req.user._id, "Cập nhật tour", updatedTour.title);

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

    // Soft delete TourDetail tương ứng (nếu có)
    try {
      const tourDetail = await TourDetail.findOne({ slug: tour.slug });
      if (tourDetail) {
        // Nếu TourDetail model có soft delete
        if (typeof tourDetail.softDelete === 'function') {
          await tourDetail.softDelete();
        } else {
          // Nếu không có soft delete, có thể đánh dấu isDeleted hoặc xóa luôn
          await TourDetail.findByIdAndUpdate(tourDetail._id, { 
            isDeleted: true, 
            deletedAt: new Date() 
          });
        }
        console.log("Soft deleted corresponding TourDetail for tour:", tour.slug);
      }
    } catch (detailError) {
      console.error("Error deleting TourDetail:", detailError);
    }

    await logAdminAction(req.user._id, "Xóa tour", tour.title);

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

    // Khôi phục TourDetail tương ứng (nếu có)
    try {
      const tourDetail = await TourDetail.findOne({ slug: tour.slug });
      if (tourDetail) {
        if (typeof tourDetail.restore === 'function') {
          await tourDetail.restore();
        } else {
          // Khôi phục thủ công
          await TourDetail.findByIdAndUpdate(tourDetail._id, { 
            isDeleted: false, 
            deletedAt: null 
          });
        }
        console.log("Restored corresponding TourDetail for tour:", tour.slug);
      } else {
        // Nếu TourDetail bị xóa hoàn toàn, tạo lại
        await createDefaultTourDetail(tour);
        console.log("Recreated TourDetail for restored tour:", tour.slug);
      }
    } catch (detailError) {
      console.error("Error restoring TourDetail:", detailError);
    }

    await logAdminAction(req.user._id, "Khôi phục tour", tour.title);

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
    // Tìm tour với option includeDeleted để có thể tìm cả tour đã soft delete
    const tour = await Tour.findById(req.params.id).setOptions({
      includeDeleted: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    // Xóa TourDetail tương ứng trước (nếu có)
    try {
      const deletedDetail = await TourDetail.findOneAndDelete({ slug: tour.slug });
      if (deletedDetail) {
        console.log("Permanently deleted corresponding TourDetail for tour:", tour.slug);
      } else {
        console.log("No TourDetail found for tour:", tour.slug);
      }
    } catch (detailError) {
      console.error("Error permanently deleting TourDetail:", detailError);
      // Log error nhưng vẫn tiếp tục xóa tour chính
    }

    // Xóa vĩnh viễn tour từ database
    // Sử dụng deleteOne thay vì findByIdAndDelete để đảm bảo xóa được cả soft deleted
    const deleteResult = await Tour.deleteOne({ _id: req.params.id });
    
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Không thể xóa tour, có thể tour không tồn tại",
      });
    }

    // Log admin action
    await logAdminAction(req.user._id, req.user.username, "Xóa vĩnh viễn tour", tour.title);

    res.status(200).json({
      success: true,
      message: "Xóa vĩnh viễn tour thành công",
      data: {
        id: tour._id,
        title: tour.title,
        deletedCount: deleteResult.deletedCount
      }
    });
  } catch (error) {
    console.error("Error in permanentDeleteTour:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa vĩnh viễn tour",
      error: error.message,
    });
  }
};

// Nếu bạn muốn thêm một hàm helper để kiểm tra và debug
exports.debugTourStatus = async (req, res) => {
  try {
    const tourId = req.params.id;
    
    // Kiểm tra tour với includeDeleted
    const tourWithDeleted = await Tour.findById(tourId).setOptions({
      includeDeleted: true,
    });
    
    // Kiểm tra tour không bao gồm deleted
    const tourNormal = await Tour.findById(tourId);
    
    // Kiểm tra TourDetail
    const tourDetail = tourWithDeleted ? await TourDetail.findOne({ slug: tourWithDeleted.slug }) : null;

    res.status(200).json({
      success: true,
      debug: {
        tourWithDeleted: !!tourWithDeleted,
        tourNormal: !!tourNormal,
        tourDetail: !!tourDetail,
        tourData: tourWithDeleted ? {
          id: tourWithDeleted._id,
          title: tourWithDeleted.title,
          isDeleted: tourWithDeleted.isDeleted,
          deletedAt: tourWithDeleted.deletedAt
        } : null,
        tourDetailData: tourDetail ? {
          id: tourDetail._id,
          slug: tourDetail.slug,
          isDeleted: tourDetail.isDeleted || false
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi debug tour",
      error: error.message
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
    // Lấy danh sách tour sẽ bị xóa để xóa TourDetail tương ứng
    const toursToDelete = await Tour.find({
      isDeleted: true,
      deletedAt: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).setOptions({ includeDeleted: true });

    console.log(`Found ${toursToDelete.length} tours to cleanup`);

    // Xóa các TourDetail tương ứng
    for (const tour of toursToDelete) {
      try {
        const deletedDetail = await TourDetail.findOneAndDelete({ slug: tour.slug });
        if (deletedDetail) {
          console.log("Cleaned up TourDetail for tour:", tour.slug);
        } else {
          console.log("No TourDetail found for tour:", tour.slug);
        }
      } catch (detailError) {
        console.error("Error cleaning up TourDetail for tour:", tour.slug, detailError);
      }
    }

    const result = await Tour.cleanupOldDeleted();

    await logAdminAction(req.user._id, "Cleanup tour", null);

    res.status(200).json({
      success: true,
      message: `Đã xóa vĩnh viễn ${result.deletedCount} tour quá 30 ngày`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error in cleanupOldDeletedTours:", error);
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