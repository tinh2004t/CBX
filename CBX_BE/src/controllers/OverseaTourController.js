const OverseaTour = require("../models/OverseaTour");
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
      groupSize: "15-20 người", // Mặc định cho tour nước ngoài
      highlights: [
        "Khám phá văn hóa quốc tế",
        "Trải nghiệm ẩm thực thế giới",
        "Tham quan các địa danh nổi tiếng",
        "Dịch vụ chuyên nghiệp quốc tế"
      ]
    },
    scheduleData: [
      {
        day: "Ngày 1",
        title: "Khởi hành quốc tế",
        activities: [
          "Tập trung và làm thủ tục xuất cảnh",
          "Bay đến điểm đến",
          "Nhận phòng và nghỉ ngơi"
        ]
      }
    ],
    priceIncludes: [
      "Vé máy bay khứ hồi",
      "Khách sạn tiêu chuẩn quốc tế",
      "Các bữa ăn theo chương trình",
      "Vé tham quan theo chương trình",
      "Hướng dẫn viên địa phương",
      "Visa và bảo hiểm du lịch"
    ],
    priceExcludes: [
      "Chi phí cá nhân",
      "Đồ uống có cồn",
      "Tip cho hướng dẫn viên và tài xế",
      "Chi phí phát sinh ngoài chương trình",
      "Phí visa (nếu có)"
    ],
    landscapeImages: [],
    foodImages: []
  };

  return await TourDetail.create(tourDetail);
};

// GET /api/oversea-tours - Lấy danh sách tất cả tour nước ngoài
exports.getAllOverseaTours = async (req, res) => {
  try {
    const { page = 1, limit = 10, continent, departure, search } = req.query;
    const query = {};

    // Filter by continent
    if (continent) {
      query.continent = { $regex: continent, $options: "i" };
    }

    // Filter by departure
    if (departure) {
      query.departure = { $regex: departure, $options: "i" };
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const tours = await OverseaTour.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await OverseaTour.countDocuments(query);

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
      message: "Lỗi server khi lấy danh sách tour nước ngoài",
      error: error.message,
    });
  }
};

// GET /api/oversea-tours/:id - Lấy thông tin chi tiết tour theo ID
exports.getOverseaTourById = async (req, res) => {
  try {
    const tour = await OverseaTour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour nước ngoài",
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin tour nước ngoài",
      error: error.message,
    });
  }
};

// GET /api/oversea-tours/slug/:slug - Lấy thông tin tour theo slug
exports.getOverseaTourBySlug = async (req, res) => {
  try {
    const tour = await OverseaTour.findOne({ slug: req.params.slug });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour nước ngoài",
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin tour nước ngoài",
      error: error.message,
    });
  }
};

// POST /api/oversea-tours - Tạo tour nước ngoài mới
exports.createOverseaTour = async (req, res) => {
  try {
    const {
      title,
      image,
      departure,
      price,
      duration,
      airline,
      scheduleInfo,
      continent,
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
      !continent
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin tour nước ngoài",
        receivedFields: {
          title: !!title,
          image: !!image,
          departure: !!departure,
          price: !!price,
          duration: !!duration,
          airline: !!airline,
          scheduleInfo: !!scheduleInfo,
          continent: !!continent,
        },
      });
    }

    // Generate slug from title
    const slug = generateSlug(title);
    console.log("Generated slug:", slug);

    // Check if slug already exists - fix the query
    const existingTour = await OverseaTour.findOne({ slug }).setOptions({
      includeDeleted: true,
    });

    if (existingTour && !existingTour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Tour nước ngoài với tiêu đề tương tự đã tồn tại",
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
      continent: continent.trim(),
      isDeleted: false,
      deletedAt: null,
    };

    console.log("OverseaTour data to save:", tourData);

    // Use create method instead of new + save
    const savedTour = await OverseaTour.create(tourData);
    
    // Tạo TourDetail tương ứng
    try {
      await createDefaultTourDetail(savedTour);
      console.log("Created corresponding TourDetail for oversea tour:", savedTour.slug);
    } catch (detailError) {
      console.error("Error creating TourDetail:", detailError);
      // Không throw error để không ảnh hưởng đến việc tạo tour chính
    }

    await logAdminAction(req.user._id, req.user.username, "Tạo tour nước ngoài", savedTour);

    console.log(
      "Saved oversea tour:",
      savedTour.toObject ? savedTour.toObject() : savedTour
    );

    res.status(201).json({
      success: true,
      message: "Tạo tour nước ngoài thành công",
      data: savedTour,
    });
  } catch (error) {
    console.error("Error creating oversea tour:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tour nước ngoài với tiêu đề này đã tồn tại",
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
      message: "Lỗi server khi tạo tour nước ngoài",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// PUT /api/oversea-tours/:id - Cập nhật tour nước ngoài
exports.updateOverseaTour = async (req, res) => {
  try {
    const {
      title,
      image,
      departure,
      price,
      duration,
      airline,
      scheduleInfo,
      continent,
    } = req.body;

    const tour = await OverseaTour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour nước ngoài",
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
      continent,
    };

    let newSlug = oldSlug;
    if (title && title !== tour.title) {
      newSlug = generateSlug(title);
      const existingTour = await OverseaTour.findOne({
        slug: newSlug,
        _id: { $ne: req.params.id },
      });

      if (existingTour) {
        return res.status(400).json({
          success: false,
          message: "Tour nước ngoài với tiêu đề tương tự đã tồn tại",
        });
      }

      updateData.title = title;
      updateData.slug = newSlug;
    }

    const updatedTour = await OverseaTour.findByIdAndUpdate(
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

        console.log("Updated corresponding TourDetail for oversea tour:", newSlug);
      } else {
        // Nếu không tìm thấy TourDetail, tạo mới
        await createDefaultTourDetail(updatedTour);
        console.log("Created new TourDetail for updated oversea tour:", newSlug);
      }
    } catch (detailError) {
      console.error("Error updating TourDetail:", detailError);
      // Không throw error để không ảnh hưởng đến việc cập nhật tour chính
    }

    await logAdminAction(req.user._id, "Cập nhật tour nước ngoài", updatedTour);

    res.status(200).json({
      success: true,
      message: "Cập nhật tour nước ngoài thành công",
      data: updatedTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật tour nước ngoài",
      error: error.message,
    });
  }
};

// DELETE /api/oversea-tours/:id - Soft delete tour nước ngoài
exports.deleteOverseaTour = async (req, res) => {
  try {
    const tour = await OverseaTour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour nước ngoài",
      });
    }

    if (tour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Tour nước ngoài này đã bị xóa trước đó",
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
        console.log("Soft deleted corresponding TourDetail for oversea tour:", tour.slug);
      }
    } catch (detailError) {
      console.error("Error deleting TourDetail:", detailError);
    }

    await logAdminAction(req.user._id, "Xóa tour nước ngoài", tour);

    res.status(200).json({
      success: true,
      message: "Xóa tour nước ngoài thành công (có thể khôi phục trong 30 ngày)",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa tour nước ngoài",
      error: error.message,
    });
  }
};

// POST /api/oversea-tours/:id/restore - Khôi phục tour nước ngoài đã xóa
exports.restoreOverseaTour = async (req, res) => {
  try {
    const tour = await OverseaTour.findById(req.params.id).setOptions({
      includeDeleted: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour nước ngoài",
      });
    }

    if (!tour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Tour nước ngoài này chưa bị xóa",
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
        console.log("Restored corresponding TourDetail for oversea tour:", tour.slug);
      } else {
        // Nếu TourDetail bị xóa hoàn toàn, tạo lại
        await createDefaultTourDetail(tour);
        console.log("Recreated TourDetail for restored oversea tour:", tour.slug);
      }
    } catch (detailError) {
      console.error("Error restoring TourDetail:", detailError);
    }

    await logAdminAction(req.user._id, "Khôi phục tour nước ngoài", tour);

    res.status(200).json({
      success: true,
      message: "Khôi phục tour nước ngoài thành công",
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi khôi phục tour nước ngoài",
      error: error.message,
    });
  }
};

// DELETE /api/oversea-tours/:id/permanent - Xóa vĩnh viễn tour nước ngoài (chỉ admin)
exports.permanentDeleteOverseaTour = async (req, res) => {
  try {
    // Tìm tour với option includeDeleted để có thể tìm cả tour đã soft delete
    const tour = await OverseaTour.findById(req.params.id).setOptions({
      includeDeleted: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour nước ngoài",
      });
    }

    // Xóa TourDetail tương ứng trước (nếu có)
    try {
      const deletedDetail = await TourDetail.findOneAndDelete({ slug: tour.slug });
      if (deletedDetail) {
        console.log("Permanently deleted corresponding TourDetail for oversea tour:", tour.slug);
      } else {
        console.log("No TourDetail found for oversea tour:", tour.slug);
      }
    } catch (detailError) {
      console.error("Error permanently deleting TourDetail:", detailError);
      // Log error nhưng vẫn tiếp tục xóa tour chính
    }

    // Xóa vĩnh viễn tour từ database
    // Sử dụng deleteOne thay vì findByIdAndDelete để đảm bảo xóa được cả soft deleted
    const deleteResult = await OverseaTour.deleteOne({ _id: req.params.id });
    
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Không thể xóa tour nước ngoài, có thể tour không tồn tại",
      });
    }

    // Log admin action
    await logAdminAction(req.user._id, req.user.username, "Xóa vĩnh viễn tour nước ngoài", {
      id: tour._id,
      title: tour.title,
      slug: tour.slug
    });

    res.status(200).json({
      success: true,
      message: "Xóa vĩnh viễn tour nước ngoài thành công",
      data: {
        id: tour._id,
        title: tour.title,
        deletedCount: deleteResult.deletedCount
      }
    });
  } catch (error) {
    console.error("Error in permanentDeleteOverseaTour:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa vĩnh viễn tour nước ngoài",
      error: error.message,
    });
  }
};

// Nếu bạn muốn thêm một hàm helper để kiểm tra và debug
exports.debugOverseaTourStatus = async (req, res) => {
  try {
    const tourId = req.params.id;
    
    // Kiểm tra tour với includeDeleted
    const tourWithDeleted = await OverseaTour.findById(tourId).setOptions({
      includeDeleted: true,
    });
    
    // Kiểm tra tour không bao gồm deleted
    const tourNormal = await OverseaTour.findById(tourId);
    
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
      message: "Lỗi debug tour nước ngoài",
      error: error.message
    });
  }
};

// GET /api/oversea-tours/deleted - Lấy danh sách tour nước ngoài đã xóa (chỉ admin)
exports.getDeletedOverseaTours = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const tours = await OverseaTour.findDeleted()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ deletedAt: -1 });

    const total = await OverseaTour.countDocuments({ isDeleted: true });

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
      message: "Lỗi server khi lấy danh sách tour nước ngoài đã xóa",
      error: error.message,
    });
  }
};

// POST /api/oversea-tours/cleanup - Cleanup tour nước ngoài đã xóa quá 30 ngày (chỉ admin)
exports.cleanupOldDeletedOverseaTours = async (req, res) => {
  try {
    // Lấy danh sách tour sẽ bị xóa để xóa TourDetail tương ứng
    const toursToDelete = await OverseaTour.find({
      isDeleted: true,
      deletedAt: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).setOptions({ includeDeleted: true });

    console.log(`Found ${toursToDelete.length} oversea tours to cleanup`);

    // Xóa các TourDetail tương ứng
    for (const tour of toursToDelete) {
      try {
        const deletedDetail = await TourDetail.findOneAndDelete({ slug: tour.slug });
        if (deletedDetail) {
          console.log("Cleaned up TourDetail for oversea tour:", tour.slug);
        } else {
          console.log("No TourDetail found for oversea tour:", tour.slug);
        }
      } catch (detailError) {
        console.error("Error cleaning up TourDetail for oversea tour:", tour.slug, detailError);
      }
    }

    const result = await OverseaTour.cleanupOldDeleted();

    await logAdminAction(req.user._id, "Cleanup tour nước ngoài", null);

    res.status(200).json({
      success: true,
      message: `Đã xóa vĩnh viễn ${result.deletedCount} tour nước ngoài quá 30 ngày`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error in cleanupOldDeletedOverseaTours:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cleanup tour nước ngoài",
      error: error.message,
    });
  }
};

// GET /api/oversea-tours/continent/:continent - Lấy tour theo châu lục
exports.getOverseaToursByContinent = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const continent = req.params.continent;

    const tours = await OverseaTour.find({
      continent: { $regex: continent, $options: "i" },
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await OverseaTour.countDocuments({
      continent: { $regex: continent, $options: "i" },
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
      message: "Lỗi server khi lấy tour nước ngoài theo châu lục",
      error: error.message,
    });
  }
};

// GET /api/oversea-tours/stats/summary - Thống kê tổng quan tour nước ngoài
exports.getOverseaTourStats = async (req, res) => {
  try {
    const totalTours = await OverseaTour.countDocuments().setOptions({
      includeDeleted: true,
    });
    const deletedTours = await OverseaTour.countDocuments({ isDeleted: true });
    const activeTours = await OverseaTour.countDocuments({ isDeleted: { $ne: true } });

    const continentStats = await OverseaTour.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$continent",
          count: { $sum: 1 },
        },
      },
    ]);

    const departureStats = await OverseaTour.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$departure",
          count: { $sum: 1 },
        },
      },
    ]);

    const airlineStats = await OverseaTour.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$airline",
          count: { $sum: 1 },
        },
      },
    ]);

    // Tours will be deleted permanently in next 30 days
    const toBeDeletedCount = await OverseaTour.countDocuments({
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
        continentStats,
        departureStats,
        airlineStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thống kê tour nước ngoài",
      error: error.message,
    });
  }
};