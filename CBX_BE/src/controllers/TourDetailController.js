const TourDetail = require("../models/TourDetail");
const DomesticTour = require("../models/DomesticTour");
const logAdminAction = require("../utils/logAdminAction");

// GET /api/tour-details/by-tour/:id - Lấy TourDetail bằng ID của DomesticTour
exports.getTourDetailByTourId = async (req, res) => {
  try {
    const tourId = req.params.id;

    // Tìm DomesticTour trước để lấy slug
    const domesticTour = await DomesticTour.findById(tourId);
    
    if (!domesticTour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    if (domesticTour.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Tour đã bị xóa",
      });
    }

    // Tìm TourDetail bằng slug
    const tourDetail = await TourDetail.findOne({ 
      slug: domesticTour.slug,
      isActive: true 
    });

    if (!tourDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết tour",
      });
    }

    res.status(200).json({
      success: true,
      data: tourDetail,
      domesticTour: {
        id: domesticTour._id,
        title: domesticTour.title,
        slug: domesticTour.slug
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết tour",
      error: error.message,
    });
  }
};

// GET /api/tour-details/by-slug/:slug - Lấy TourDetail bằng slug của DomesticTour
exports.getTourDetailBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    // Tìm DomesticTour trước để verify
    const domesticTour = await DomesticTour.findOne({ slug });
    
    if (!domesticTour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    if (domesticTour.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Tour đã bị xóa",
      });
    }

    // Tìm TourDetail
    const tourDetail = await TourDetail.findOne({ 
      slug: slug,
      isActive: true 
    });

    if (!tourDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết tour",
      });
    }

    res.status(200).json({
      success: true,
      data: tourDetail,
      domesticTour: {
        id: domesticTour._id,
        title: domesticTour.title,
        slug: domesticTour.slug
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết tour",
      error: error.message,
    });
  }
};

// GET /api/tour-details/direct/:id - Lấy TourDetail trực tiếp bằng ID của TourDetail (cho admin)
exports.getTourDetailById = async (req, res) => {
  try {
    const tourDetail = await TourDetail.findById(req.params.id);

    if (!tourDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết tour",
      });
    }

    // Tìm DomesticTour tương ứng để thêm thông tin
    const domesticTour = await DomesticTour.findOne({ slug: tourDetail.slug });

    res.status(200).json({
      success: true,
      data: tourDetail,
      domesticTour: domesticTour ? {
        id: domesticTour._id,
        title: domesticTour.title,
        slug: domesticTour.slug,
        isDeleted: domesticTour.isDeleted
      } : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết tour",
      error: error.message,
    });
  }
};

// PUT /api/tour-details/:id - Cập nhật TourDetail
exports.updateTourDetail = async (req, res) => {
  try {
    const tourDetailId = req.params.id;
    const updateData = req.body;

    // Không cho phép cập nhật slug
    if (updateData.slug) {
      return res.status(400).json({
        success: false,
        message: "Không được phép cập nhật slug",
      });
    }

    // Tìm TourDetail hiện tại
    const existingTourDetail = await TourDetail.findById(tourDetailId);
    
    if (!existingTourDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết tour",
      });
    }

    // Verify DomesticTour còn tồn tại
    const domesticTour = await DomesticTour.findOne({ slug: existingTourDetail.slug });
    
    if (!domesticTour) {
      return res.status(400).json({
        success: false,
        message: "Tour gốc không tồn tại",
      });
    }

    if (domesticTour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Không thể cập nhật chi tiết của tour đã bị xóa",
      });
    }

    // Cập nhật TourDetail
    const updatedTourDetail = await TourDetail.findByIdAndUpdate(
      tourDetailId,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    await logAdminAction(req.user._id, req.user.username, "Cập nhật chi tiết tour", updatedTourDetail);

    res.status(200).json({
      success: true,
      message: "Cập nhật chi tiết tour thành công",
      data: updatedTourDetail,
    });
  } catch (error) {
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
      message: "Lỗi server khi cập nhật chi tiết tour",
      error: error.message,
    });
  }
};

// PUT /api/tour-details/by-tour/:tourId - Cập nhật TourDetail bằng ID của DomesticTour
exports.updateTourDetailByTourId = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const updateData = req.body;

    // Không cho phép cập nhật slug
    if (updateData.slug) {
      return res.status(400).json({
        success: false,
        message: "Không được phép cập nhật slug",
      });
    }

    // Tìm DomesticTour trước
    const domesticTour = await DomesticTour.findById(tourId);
    
    if (!domesticTour) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tour",
      });
    }

    if (domesticTour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Không thể cập nhật chi tiết của tour đã bị xóa",
      });
    }

    // Tìm và cập nhật TourDetail
    const updatedTourDetail = await TourDetail.findOneAndUpdate(
      { slug: domesticTour.slug },
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedTourDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết tour",
      });
    }

    await logAdminAction(req.user._id, req.user.username, "Cập nhật chi tiết tour", updatedTourDetail);

    res.status(200).json({
      success: true,
      message: "Cập nhật chi tiết tour thành công",
      data: updatedTourDetail,
    });
  } catch (error) {
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
      message: "Lỗi server khi cập nhật chi tiết tour",
      error: error.message,
    });
  }
};

// DELETE /api/tour-details/:id - Soft delete TourDetail
exports.deleteTourDetail = async (req, res) => {
  try {
    const tourDetail = await TourDetail.findById(req.params.id);

    if (!tourDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết tour",
      });
    }

    if (!tourDetail.isActive) {
      return res.status(400).json({
        success: false,
        message: "Chi tiết tour đã bị xóa trước đó",
      });
    }

    // Soft delete bằng cách set isActive = false
    await TourDetail.findByIdAndUpdate(req.params.id, { 
      isActive: false,
      updatedAt: new Date()
    });

    await logAdminAction(req.user._id, req.user.username, "Xóa chi tiết tour", tourDetail);

    res.status(200).json({
      success: true,
      message: "Xóa chi tiết tour thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa chi tiết tour",
      error: error.message,
    });
  }
};

// POST /api/tour-details/:id/restore - Khôi phục TourDetail
exports.restoreTourDetail = async (req, res) => {
  try {
    const tourDetail = await TourDetail.findById(req.params.id);

    if (!tourDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết tour",
      });
    }

    if (tourDetail.isActive) {
      return res.status(400).json({
        success: false,
        message: "Chi tiết tour chưa bị xóa",
      });
    }

    // Kiểm tra DomesticTour còn tồn tại
    const domesticTour = await DomesticTour.findOne({ slug: tourDetail.slug });
    
    if (!domesticTour || domesticTour.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Không thể khôi phục chi tiết tour vì tour gốc đã bị xóa",
      });
    }

    // Khôi phục
    await TourDetail.findByIdAndUpdate(req.params.id, { 
      isActive: true,
      updatedAt: new Date()
    });

    const restoredTourDetail = await TourDetail.findById(req.params.id);

    await logAdminAction(req.user._id, req.user.username, "Khôi phục chi tiết tour", restoredTourDetail);

    res.status(200).json({
      success: true,
      message: "Khôi phục chi tiết tour thành công",
      data: restoredTourDetail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi khôi phục chi tiết tour",
      error: error.message,
    });
  }
};

// DELETE /api/tour-details/:id/permanent - Xóa vĩnh viễn TourDetail
exports.permanentDeleteTourDetail = async (req, res) => {
  try {
    const tourDetail = await TourDetail.findById(req.params.id);

    if (!tourDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết tour",
      });
    }

    await TourDetail.findByIdAndDelete(req.params.id);

    await logAdminAction(req.user._id, req.user.username, "Xóa vĩnh viễn chi tiết tour", tourDetail);

    res.status(200).json({
      success: true,
      message: "Xóa vĩnh viễn chi tiết tour thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa vĩnh viễn chi tiết tour",
      error: error.message,
    });
  }
};

// GET /api/tour-details/deleted - Lấy danh sách TourDetail đã xóa (cho admin)
exports.getDeletedTourDetails = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const tourDetails = await TourDetail.find({ isActive: false })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ updatedAt: -1 });

    const total = await TourDetail.countDocuments({ isActive: false });

    // Thêm thông tin DomesticTour tương ứng
    const tourDetailsWithInfo = await Promise.all(
      tourDetails.map(async (detail) => {
        const domesticTour = await DomesticTour.findOne({ slug: detail.slug });
        return {
          ...detail.toObject(),
          domesticTour: domesticTour ? {
            id: domesticTour._id,
            title: domesticTour.title,
            isDeleted: domesticTour.isDeleted
          } : null
        };
      })
    );

    res.status(200).json({
      success: true,
      data: tourDetailsWithInfo,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách chi tiết tour đã xóa",
      error: error.message,
    });
  }
};

// GET /api/tour-details/stats - Thống kê TourDetail
exports.getTourDetailStats = async (req, res) => {
  try {
    const totalTourDetails = await TourDetail.countDocuments();
    const activeTourDetails = await TourDetail.countDocuments({ isActive: true });
    const inactiveTourDetails = await TourDetail.countDocuments({ isActive: false });

    // Thống kê theo rating
    const ratingStats = await TourDetail.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: { $floor: "$tourData.rating" },
          count: { $sum: 1 },
          avgReviews: { $avg: "$tourData.reviews" }
        },
      },
      { $sort: { _id: -1 } }
    ]);

    // Tour có nhiều review nhất
    const topReviewedTours = await TourDetail.find({ isActive: true })
      .sort({ 'tourData.reviews': -1 })
      .limit(5)
      .select('slug tourData.title tourData.reviews tourData.rating');

    res.status(200).json({
      success: true,
      data: {
        totalTourDetails,
        activeTourDetails,
        inactiveTourDetails,
        ratingStats,
        topReviewedTours,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thống kê chi tiết tour",
      error: error.message,
    });
  }
};