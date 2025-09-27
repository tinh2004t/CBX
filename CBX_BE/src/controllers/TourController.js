const { Tour, MiceTour, DomesticTour, OverseaTour } = require("../models/Tour");
const TourDetail = require("../models/TourDetail");
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

// Helper function to get tour model by type
const getTourModel = (tourType) => {
  switch (tourType) {
    case 'mice':
      return MiceTour;
    case 'domestic':
      return DomesticTour;
    case 'oversea':
      return OverseaTour;
    default:
      return Tour;
  }
};

// Helper function to create default tour detail
const createDefaultTourDetail = async (tour) => {
  const tourDetail = {
    slug: tour.slug,
    tourData: {
      title: tour.title,
      location: tour.departure || tour.location || "Chưa xác định",
      duration: tour.duration,
      price: tour.price,
      originalPrice: "",
      rating: tour.rating || 0,
      reviews: tour.reviews || 0,
      groupSize: tour.groupSize || "10-15 người",
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
    const { 
      page = 1, 
      limit = 10, 
      region, 
      departure, 
      search, 
      tourType,
      continent,
      category,
      location,
      airline
    } = req.query;
    
    const query = {};

    // Filter by tour type
    if (tourType) {
      query.tourType = tourType;
    }

    // Filter by region (domestic tours)
    if (region) {
      query.region = { $regex: region, $options: "i" };
    }

    // Filter by departure
    if (departure) {
      query.departure = { $regex: departure, $options: "i" };
    }

    // Filter by continent (oversea tours)
    if (continent) {
      query.continent = { $regex: continent, $options: "i" };
    }

    // Filter by category (mice tours)
    if (category) {
      query.category = category;
    }

    // Filter by location (mice tours)
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter by airline (oversea tours)
    if (airline) {
      query.airline = { $regex: airline, $options: "i" };
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
        current: parseInt(page),
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
    const { tourType, title, image, duration, price, ...otherFields } = req.body;

    console.log("Request body:", req.body);

    // Validate required fields
    if (!tourType || !title || !image || !duration || !price) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin cơ bản (tourType, title, image, duration, price)",
        receivedFields: {
          tourType: !!tourType,
          title: !!title,
          image: !!image,
          duration: !!duration,
          price: !!price,
        },
      });
    }

    // Validate tour type
    if (!['mice', 'domestic', 'oversea'].includes(tourType)) {
      return res.status(400).json({
        success: false,
        message: "Tour type phải là 'mice', 'domestic' hoặc 'oversea'",
      });
    }

    // Validate specific fields based on tour type
    let missingFields = [];
    
    if (tourType === 'mice') {
      if (!otherFields.location) missingFields.push('location');
    } else if (tourType === 'domestic') {
      if (!otherFields.departure) missingFields.push('departure');
      if (!otherFields.region) missingFields.push('region');
      if (!otherFields.scheduleInfo) missingFields.push('scheduleInfo');
    } else if (tourType === 'oversea') {
      if (!otherFields.departure) missingFields.push('departure');
      if (!otherFields.airline) missingFields.push('airline');
      if (!otherFields.continent) missingFields.push('continent');
      if (!otherFields.scheduleInfo) missingFields.push('scheduleInfo');
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Vui lòng cung cấp đầy đủ thông tin cho ${tourType} tour: ${missingFields.join(', ')}`,
        missingFields,
      });
    }

    // Generate slug from title
    const slug = generateSlug(title);
    console.log("Generated slug:", slug);

    // Check if slug already exists
    const existingTour = await Tour.findOne({ slug }).setOptions({
      includeDeleted: true,
    });

    if (existingTour && !existingTour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Tour với tiêu đề tương tự đã tồn tại",
      });
    }

    // Get appropriate model
    const TourModel = getTourModel(tourType);

    // Create tour data object
    const tourData = {
      slug,
      title: title.trim(),
      image: image.trim(),
      duration: duration.trim(),
      price: price.trim(),
      tourType,
      rating: 0,
      reviews: 0,
      isDeleted: false,
      deletedAt: null,
      ...otherFields
    };

    // Trim string fields in otherFields
    Object.keys(tourData).forEach(key => {
      if (typeof tourData[key] === 'string') {
        tourData[key] = tourData[key].trim();
      }
    });

    console.log("Tour data to save:", tourData);

    // Create tour
    const savedTour = await TourModel.create(tourData);
    
    // Tạo TourDetail tương ứng
    try {
      await createDefaultTourDetail(savedTour);
      console.log("Created corresponding TourDetail for tour:", savedTour.slug);
    } catch (detailError) {
      console.error("Error creating TourDetail:", detailError);
      // Không throw error để không ảnh hưởng đến việc tạo tour chính
    }

    await logAdminAction(req.user._id, req.user.username, "Tạo tour", tourData.title);

    console.log("Saved tour:", savedTour.toObject ? savedTour.toObject() : savedTour);

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
        error: error.errors || error.message
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
    const { title, tourType, ...updateFields } = req.body;

    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    // Không cho phép thay đổi tourType
    if (tourType && tourType !== tour.tourType) {
      return res.status(400).json({
        success: false,
        message: "Không thể thay đổi loại tour sau khi tạo",
      });
    }

    const oldSlug = tour.slug;
    let updateData = { ...updateFields };

    // Update slug if title changed
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

    // Trim string fields
    Object.keys(updateData).forEach(key => {
      if (typeof updateData[key] === 'string') {
        updateData[key] = updateData[key].trim();
      }
    });

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
          'tourData.location': updatedTour.departure || updatedTour.location || "Chưa xác định",
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
    }

    await logAdminAction(req.user._id, req.user.username, "Cập nhật tour", updatedTour.title);

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
        if (typeof tourDetail.softDelete === 'function') {
          await tourDetail.softDelete();
        } else {
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

    await logAdminAction(req.user._id, req.user.username, "Xóa tour", tour.title);

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

    await logAdminAction(req.user._id, req.user.username, "Khôi phục tour", tour.title);

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

    // Xóa TourDetail tương ứng trước (nếu có)
    try {
      const deletedDetail = await TourDetail.findOneAndDelete({ slug: tour.slug });
      if (deletedDetail) {
        console.log("Permanently deleted corresponding TourDetail for tour:", tour.slug);
      }
    } catch (detailError) {
      console.error("Error permanently deleting TourDetail:", detailError);
    }

    // Xóa vĩnh viễn tour từ database
    const deleteResult = await Tour.deleteOne({ _id: req.params.id });
    
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Không thể xóa tour, có thể tour không tồn tại",
      });
    }

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

// GET /api/tours/deleted - Lấy danh sách tour đã xóa (chỉ admin)
exports.getDeletedTours = async (req, res) => {
  try {
    const { page = 1, limit = 10, tourType } = req.query;

    // Tạo filter object
    const filter = { isDeleted: true };
    
    // Thêm filter theo tourType nếu có
    if (tourType && ['mice', 'domestic', 'oversea'].includes(tourType)) {
      filter.tourType = tourType;
    }

    const tours = await Tour.find(filter)
      .setOptions({ includeDeleted: true }) // Bắt buộc để lấy tours đã xóa
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ deletedAt: -1 });

    // Đếm total với cùng filter
    const total = await Tour.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
      filter: {
        tourType: tourType || 'all'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách tour đã xóa",
      error: error.message,
    });
  }
};

// Hoặc nếu bạn muốn sử dụng static method findDeleted() từ schema:
exports.getDeletedToursAlternative = async (req, res) => {
  try {
    const { page = 1, limit = 10, tourType } = req.query;

    // Tạo query builder
    let query = Tour.findDeleted();
    
    // Thêm filter theo tourType nếu có
    if (tourType && ['mice', 'domestic', 'oversea'].includes(tourType)) {
      query = query.where({ tourType });
    }

    const tours = await query
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ deletedAt: -1 });

    // Đếm total
    const totalQuery = Tour.find({ isDeleted: true }).setOptions({ includeDeleted: true });
    if (tourType && ['mice', 'domestic', 'oversea'].includes(tourType)) {
      totalQuery.where({ tourType });
    }
    const total = await totalQuery.countDocuments();

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
      filter: {
        tourType: tourType || 'all'
      }
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
        }
      } catch (detailError) {
        console.error("Error cleaning up TourDetail for tour:", tour.slug, detailError);
      }
    }

    const result = await Tour.cleanupOldDeleted();

    await logAdminAction(req.user._id, req.user.username, "Cleanup tour", null);

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

// GET /api/tours/type/:tourType - Lấy tour theo loại
exports.getToursByType = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const tourType = req.params.tourType;

    if (!['mice', 'domestic', 'oversea'].includes(tourType)) {
      return res.status(400).json({
        success: false,
        message: "Tour type không hợp lệ",
      });
    }

    const TourModel = getTourModel(tourType);

    const tours = await TourModel.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await TourModel.countDocuments();

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tour theo loại",
      error: error.message,
    });
  }
};

// GET /api/tours/region/:region - Lấy tour trong nước theo vùng miền
exports.getToursByRegion = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const region = req.params.region;

    const tours = await DomesticTour.find({
      region: { $regex: region, $options: "i" },
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await DomesticTour.countDocuments({
      region: { $regex: region, $options: "i" },
    });

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: parseInt(page),
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

// GET /api/tours/continent/:continent - Lấy tour nước ngoài theo châu lục
exports.getToursByContinent = async (req, res) => {
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
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tour theo châu lục",
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

    // Thống kê theo loại tour
    const typeStats = await Tour.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$tourType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Thống kê theo vùng miền (domestic tours)
    const regionStats = await DomesticTour.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$region",
          count: { $sum: 1 },
        },
      },
    ]);

    // Thống kê theo châu lục (oversea tours)
    const continentStats = await OverseaTour.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$continent",
          count: { $sum: 1 },
        },
      },
    ]);

    // Thống kê theo category (mice tours)
    const categoryStats = await MiceTour.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $group: {
          _id: "$category",
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
        typeStats,
        regionStats,
        continentStats,
        categoryStats,
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

// GET /api/tours/mice/category/:category - Lấy tour MICE theo category
exports.getMiceToursByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const category = req.params.category;

    const tours = await MiceTour.find({ category })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await MiceTour.countDocuments({ category });

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tour MICE theo category",
      error: error.message,
    });
  }
};

// GET /api/tours/mice/location/:location - Lấy tour MICE theo địa điểm
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
    });

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tour MICE theo địa điểm",
      error: error.message,
    });
  }
};

// GET /api/tours/domestic/departure/:departure - Lấy tour domestic theo điểm khởi hành
exports.getDomesticToursByDeparture = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const departure = req.params.departure;

    const tours = await DomesticTour.findByDeparture(departure)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await DomesticTour.countDocuments({
      departure: { $regex: departure, $options: "i" },
    });

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tour domestic theo điểm khởi hành",
      error: error.message,
    });
  }
};

// GET /api/tours/oversea/airline/:airline - Lấy tour oversea theo hãng hàng không
exports.getOverseaToursByAirline = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const airline = req.params.airline;

    const tours = await OverseaTour.findByAirline(airline)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await OverseaTour.countDocuments({
      airline: { $regex: airline, $options: "i" },
    });

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tour oversea theo hãng hàng không",
      error: error.message,
    });
  }
};

// POST /api/tours/:id/review - Thêm đánh giá cho tour
exports.addTourReview = async (req, res) => {
  try {
    const { rating } = req.body;
    const tourId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating phải là số từ 1 đến 5",
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    await tour.addReview(rating);

    // Cập nhật rating trong TourDetail
    try {
      await TourDetail.findOneAndUpdate(
        { slug: tour.slug },
        { 
          'tourData.rating': tour.rating,
          'tourData.reviews': tour.reviews
        }
      );
    } catch (detailError) {
      console.error("Error updating TourDetail rating:", detailError);
    }

    res.status(200).json({
      success: true,
      message: "Thêm đánh giá thành công",
      data: {
        rating: tour.rating,
        reviews: tour.reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm đánh giá",
      error: error.message,
    });
  }
};

// GET /api/tours/search/advanced - Tìm kiếm nâng cao
exports.advancedSearchTours = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      keyword,
      tourType,
      minPrice,
      maxPrice,
      minRating,
      region,
      continent,
      category,
      location,
      departure,
      airline,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    const sort = {};

    // Text search
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { scheduleInfo: { $regex: keyword, $options: "i" } }
      ];
    }

    // Filter by tour type
    if (tourType) {
      query.tourType = tourType;
    }

    // Price range filter (convert string price to number for comparison)
    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) {
        // This is a simplified approach - you might need more sophisticated price parsing
        query.price = { $regex: new RegExp(`[${minPrice.charAt(0)}-9]`), $options: "i" };
      }
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Specific filters based on tour type
    if (region) query.region = { $regex: region, $options: "i" };
    if (continent) query.continent = { $regex: continent, $options: "i" };
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: "i" };
    if (departure) query.departure = { $regex: departure, $options: "i" };
    if (airline) query.airline = { $regex: airline, $options: "i" };

    // Sorting
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tours = await Tour.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const total = await Tour.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
      searchParams: {
        keyword,
        tourType,
        minPrice,
        maxPrice,
        minRating,
        region,
        continent,
        category,
        location,
        departure,
        airline,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm kiếm nâng cao",
      error: error.message,
    });
  }
};

// GET /api/tours/popular - Lấy tour phổ biến (rating cao, nhiều review)
exports.getPopularTours = async (req, res) => {
  try {
    const { page = 1, limit = 10, tourType } = req.query;
    const query = {};

    if (tourType) {
      query.tourType = tourType;
    }

    const tours = await Tour.find(query)
      .sort({ rating: -1, reviews: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tour.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tours,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tour phổ biến",
      error: error.message,
    });
  }
};

// GET /api/tours/featured - Lấy tour nổi bật (có thể thêm field featured sau)
exports.getFeaturedTours = async (req, res) => {
  try {
    const { limit = 6, tourType } = req.query;
    const query = {};

    if (tourType) {
      query.tourType = tourType;
    }

    // Lấy tour có rating cao và được tạo gần đây
    const tours = await Tour.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit * 1);

    res.status(200).json({
      success: true,
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tour nổi bật",
      error: error.message,
    });
  }
};

// GET /api/tours/debug/:id - Debug tour status (helper function)
exports.debugTourStatus = async (req, res) => {
  try {
    const tourId = req.params.id;
    
    const tourWithDeleted = await Tour.findById(tourId).setOptions({
      includeDeleted: true,
    });
    
    const tourNormal = await Tour.findById(tourId);
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
          tourType: tourWithDeleted.tourType,
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