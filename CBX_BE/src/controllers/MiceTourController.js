const MiceTour = require("../models/MiceTour");
const TourDetail = require("../models/TourDetail");
const logAdminAction = require("../utils/logAdminAction");

// Helper function to generate slug
const generateSlug = (name) => {
  return name
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

// Helper function to create default tour detail for MICE tour
const createDefaultTourDetail = async (tour) => {
  const tourDetail = {
    slug: tour.slug,
    tourData: {
      title: tour.name,
      location: tour.location,
      duration: tour.duration,
      price: tour.price,
      originalPrice: tour.originalPrice || "",
      rating: tour.rating || 0,
      reviews: tour.reviews || 0,
      groupSize: tour.groupSize || "20-50 người",
      highlights: tour.highlights && tour.highlights.length > 0 ? tour.highlights : [
        "Hội nghị chuyên nghiệp",
        "Dịch vụ tổ chức sự kiện trọn gói",
        "Không gian sang trọng",
        "Thiết bị hiện đại"
      ]
    },
    scheduleData: [
      {
        day: "Ngày 1",
        title: "Khai mạc sự kiện",
        activities: [
          "Đón tiếp và check-in khách mời",
          "Khai mạc chương trình",
          "Các hoạt động chính theo chương trình",
          "Nghỉ ngơi và networking"
        ]
      }
    ],
    priceIncludes: tour.services && tour.services.length > 0 ? tour.services : [
      "Tổ chức hội nghị/hội thảo",
      "Thiết bị âm thanh ánh sáng",
      "Dịch vụ ăn uống",
      "Trang trí và setup sự kiện",
      "Hỗ trợ kỹ thuật",
      "Nhân viên phục vụ chuyên nghiệp"
    ],
    priceExcludes: [
      "Chi phí di chuyển cá nhân",
      "Đồ uống có cồn (ngoài package)",
      "Quà tặng cá nhân",
      "Chi phí phát sinh ngoài chương trình",
      "Dịch vụ spa và massage",
      "Shopping cá nhân"
    ],
    landscapeImages: [],
    foodImages: []
  };

  return await TourDetail.create(tourDetail);
};

// GET /api/mice-tours - Lấy danh sách tất cả MICE tour
exports.getAllMiceTours = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, location, search, featured, minPrice, maxPrice } = req.query;
    const query = { isDeleted: false };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let tours;

    // Handle price range filtering
    if (minPrice || maxPrice) {
      const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
      const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Number.MAX_VALUE;
      
      tours = await MiceTour.findByPriceRange(minPriceNum, maxPriceNum)
        .find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
    } else {
      tours = await MiceTour.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
    }

    const total = await MiceTour.countDocuments(query);

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
      message: "Lỗi server khi lấy danh sách MICE tour",
      error: error.message,
    });
  }
};

// GET /api/mice-tours/:id - Lấy thông tin chi tiết MICE tour theo ID
exports.getMiceTourById = async (req, res) => {
  try {
    const tour = await MiceTour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy MICE tour",
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin MICE tour",
      error: error.message,
    });
  }
};

// GET /api/mice-tours/slug/:slug - Lấy thông tin MICE tour theo slug
exports.getMiceTourBySlug = async (req, res) => {
  try {
    const tour = await MiceTour.findOne({ slug: req.params.slug, isDeleted: false });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy MICE tour",
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin MICE tour",
      error: error.message,
    });
  }
};

// POST /api/mice-tours - Tạo MICE tour mới
exports.createMiceTour = async (req, res) => {
  try {
    const {
      name,
      image,
      duration,
      location,
      rating,
      price,
      originalPrice,
      reviews,
      groupSize,
      category,
      description,
      highlights,
      services,
      facilities,
      featured
    } = req.body;

    // Debug: Log request body
    console.log("Request body:", req.body);

    // Validate required fields
    if (!name || !image || !duration || !location || !price) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin MICE tour",
        receivedFields: {
          name: !!name,
          image: !!image,
          duration: !!duration,
          location: !!location,
          price: !!price,
        },
      });
    }

    // Generate slug from name
    const slug = generateSlug(name);
    console.log("Generated slug:", slug);

    // Check if slug already exists
    const existingTour = await MiceTour.findOne({ slug });

    if (existingTour && !existingTour.deleted) {
      return res.status(400).json({
        success: false,
        message: "MICE tour với tên tương tự đã tồn tại",
      });
    }

    // Create tour data object
    const tourData = {
      slug,
      name: name.trim(),
      image: image.trim(),
      duration: duration.trim(),
      location: location.trim(),
      rating: rating || 0,
      price: price.trim(),
      originalPrice: originalPrice ? originalPrice.trim() : '',
      reviews: reviews || 0,
      groupSize: groupSize || '20-50 người',
      category: category || 'meeting',
      description: description ? description.trim() : '',
      highlights: highlights || [],
      services: services || [],
      facilities: facilities || [],
      featured: featured || false,
      isActive: true
    };

    console.log("MiceTour data to save:", tourData);

    // Use create method
    const savedTour = await MiceTour.create(tourData);

    
    // Tạo TourDetail tương ứng
    try {
      await createDefaultTourDetail(savedTour);
      console.log("Created corresponding TourDetail for MICE tour:", savedTour.slug);
    } catch (detailError) {
      console.error("Error creating TourDetail:", detailError);
      // Không throw error để không ảnh hưởng đến việc tạo tour chính
    }


    console.log(
      "Saved MICE tour:",
      savedTour.toObject ? savedTour.toObject() : savedTour
    );

    res.status(201).json({
      success: true,
      message: "Tạo MICE tour thành công",
      data: savedTour,
    });
    await logAdminAction(req.user._id, req.user.username, "Tạo MICE tour", savedTour.name);

  } catch (error) {
    console.error("Error creating MICE tour:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "MICE tour với tên này đã tồn tại",
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
      message: "Lỗi server khi tạo MICE tour",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// PUT /api/mice-tours/:id - Cập nhật MICE tour
exports.updateMiceTour = async (req, res) => {
  try {
    const {
      name,
      image,
      duration,
      location,
      rating,
      price,
      originalPrice,
      reviews,
      groupSize,
      category,
      description,
      highlights,
      services,
      facilities,
      featured,
      isActive
    } = req.body;

    const tour = await MiceTour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy MICE tour",
      });
    }

    const oldSlug = tour.slug;

    // Update slug if name changed
    let updateData = {
      image,
      duration,
      location,
      rating,
      price,
      originalPrice,
      reviews,
      groupSize,
      category,
      description,
      highlights,
      services,
      facilities,
      featured,
      isActive
    };

    let newSlug = oldSlug;
    if (name && name !== tour.name) {
      newSlug = generateSlug(name);
      const existingTour = await MiceTour.findOne({
        slug: newSlug,
        _id: { $ne: req.params.id },
      });

      if (existingTour) {
        return res.status(400).json({
          success: false,
          message: "MICE tour với tên tương tự đã tồn tại",
        });
      }

      updateData.name = name;
      updateData.slug = newSlug;
    }

    const updatedTour = await MiceTour.findByIdAndUpdate(
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
          'tourData.title': updatedTour.name,
          'tourData.location': updatedTour.location,
          'tourData.duration': updatedTour.duration,
          'tourData.price': updatedTour.price,
          'tourData.originalPrice': updatedTour.originalPrice,
          'tourData.rating': updatedTour.rating,
          'tourData.reviews': updatedTour.reviews,
          'tourData.groupSize': updatedTour.groupSize,
          'tourData.highlights': updatedTour.highlights,
        };

        // Cập nhật priceIncludes nếu có services
        if (updatedTour.services && updatedTour.services.length > 0) {
          tourDetailUpdateData.priceIncludes = updatedTour.services;
        }

        await TourDetail.findByIdAndUpdate(
          existingTourDetail._id,
          tourDetailUpdateData,
          { new: true }
        );

        console.log("Updated corresponding TourDetail for MICE tour:", newSlug);
      } else {
        // Nếu không tìm thấy TourDetail, tạo mới
        await createDefaultTourDetail(updatedTour);
        console.log("Created new TourDetail for updated MICE tour:", newSlug);
      }
    } catch (detailError) {
      console.error("Error updating TourDetail:", detailError);
      // Không throw error để không ảnh hưởng đến việc cập nhật tour chính
    }


    res.status(200).json({
      success: true,
      message: "Cập nhật MICE tour thành công",
      data: updatedTour,
    });
    await logAdminAction(req.user._id, req.user.username, "Cập nhật MICE tour", updatedTour.name);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật MICE tour",
      error: error.message,
    });
  }
};

// DELETE /api/mice-tours/:id - Soft delete MICE tour
exports.deleteMiceTour = async (req, res) => {
  try {
    const tour = await MiceTour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mice tour",
      });
    }

    if (tour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "MICE tour này đã bị xóa trước đó",
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

    await logAdminAction(req.user._id, "Xóa MICE tour", tour.name);


    res.status(200).json({
      success: true,
      message: "Xóa MICE tour thành công (có thể khôi phục trong 30 ngày)",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa MICE tour",
      error: error.message,
    });
  }
};

// POST /api/mice-tours/:id/restore - Khôi phục MICE tour đã xóa
exports.restoreMiceTour = async (req, res) => {
  try {
    const tour = await MiceTour.findById(req.params.id).setOptions({
      includeDeleted: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy MICE tour",
      });
    }

    if (!tour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "MICE tour này chưa bị xóa",
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


    res.status(200).json({
      success: true,
      message: "Khôi phục MICE tour thành công",
      data: tour,
    });
    await logAdminAction(req.user._id, "Khôi phục MICE tour", tour.name);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi khôi phục MICE tour",
      error: error.message,
    });
  }
};



// DELETE /api/mice-tours/:id/permanent - Xóa vĩnh viễn MICE tour (chỉ admin)
exports.permanentDeleteMiceTour = async (req, res) => {
  try {
    // Tìm tour với option includeDeleted để có thể tìm cả tour đã soft delete
    const tour = await MiceTour.findById(req.params.id).setOptions({
      includeDeleted: true,
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy MICE tour",
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
    const deleteResult = await MiceTour.deleteOne({ _id: req.params.id });
    
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Không thể xóa MICE tour, có thể tour không tồn tại",
      });
    }

    // Log admin action
    await logAdminAction(req.user._id, req.user.username, "Xóa vĩnh viễn MICE tour", tour.name);

    res.status(200).json({
      success: true,
      message: "Xóa vĩnh viễn MICE tour thành công",
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
      message: "Lỗi server khi xóa vĩnh viễn MICE tour",
      error: error.message,
    });
  }
};

// GET /api/mice-tours/deleted - Lấy danh sách MICE tour đã xóa (chỉ admin)
exports.getDeletedMiceTours = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const tours = await MiceTour.findDeleted()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ deletedAt: -1 });

    const total = await MiceTour.countDocuments({ isDeleted: true });

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
      message: "Lỗi server khi lấy danh sách MICE tour đã xóa",
      error: error.message,
    });
  }
};

// POST /api/mice-tours/cleanup - Cleanup MICE tour đã xóa quá 30 ngày (chỉ admin)
exports.cleanupDeletedMiceTours = async (req, res) => {
  try {
    // Lấy danh sách tour sẽ bị xóa để xóa TourDetail tương ứng
    const toursToDelete = await MiceTour.find({
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

    const result = await MiceTour.cleanupOldDeleted();

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

// GET /api/mice-tours/category/:category - Lấy MICE tour theo category
exports.getMiceToursByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const category = req.params.category;

    const tours = await MiceTour.findByCategory(category)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await MiceTour.countDocuments({
      category: category,
      isActive: true,
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
      message: "Lỗi server khi lấy MICE tour theo category",
      error: error.message,
    });
  }
};

// GET /api/mice-tours/location/:location - Lấy MICE tour theo location
exports.getMiceToursByLocation = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const location = req.params.location;

    const tours = await MiceTour.findByLocation(location)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await MiceTour.countDocuments({
      location: { $regex: location, $options: "i" },
      isActive: true,
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
      message: "Lỗi server khi lấy MICE tour theo location",
      error: error.message,
    });
  }
};

// GET /api/mice-tours/featured - Lấy MICE tour nổi bật
exports.getFeaturedMiceTours = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const tours = await MiceTour.findFeatured()
      .limit(limit * 1);

    res.status(200).json({
      success: true,
      data: tours,
      total: tours.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy MICE tour nổi bật",
      error: error.message,
    });
  }
};

// POST /api/mice-tours/:id/review - Thêm review cho MICE tour
exports.addMiceTourReview = async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating phải từ 1 đến 5",
      });
    }

    const tour = await MiceTour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy MICE tour",
      });
    }

    await tour.addReview(rating);

    res.status(200).json({
      success: true,
      message: "Thêm review thành công",
      data: {
        rating: tour.rating,
        reviews: tour.reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm review",
      error: error.message,
    });
  }
};

// GET /api/mice-tours/stats/summary - Thống kê tổng quan MICE tour
exports.getMiceTourStats = async (req, res) => {
  try {
    const totalTours = await MiceTour.countDocuments();
    const deletedTours = await MiceTour.countDocuments({ deleted: true });
    const activeTours = await MiceTour.countDocuments({ isActive: true, deleted: { $ne: true } });
    const featuredTours = await MiceTour.countDocuments({ featured: true, isActive: true, deleted: { $ne: true } });

    const categoryStats = await MiceTour.aggregate([
      { $match: { isActive: true, deleted: { $ne: true } } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const locationStats = await MiceTour.aggregate([
      { $match: { isActive: true, deleted: { $ne: true } } },
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingStats = await MiceTour.aggregate([
      { $match: { isActive: true, deleted: { $ne: true } } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: "$reviews" },
          highRatingCount: {
            $sum: { $cond: [{ $gte: ["$rating", 4] }, 1, 0] }
          }
        },
      },
    ]);

    // Tours will be deleted permanently in next 30 days
     const toBeDeletedCount = await MiceTour.countDocuments({
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
      message: "Lỗi server khi lấy thống kê MICE tour",
      error: error.message,
    });
  }
};