// src/routes/TourRoute.js
const express = require('express');
const router = express.Router();
const tourController = require('../controllers/TourController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');
const { validateTourCreation, validateTourUpdate } = require('../middleware/tourValidation');

// ============================================================================
// PUBLIC ROUTES (không cần đăng nhập)
// ============================================================================

// Lấy tất cả tours (có filter)
router.get('/', tourController.getAllTours);

// Lấy tour phổ biến
router.get('/popular', tourController.getPopularTours);

// Lấy tour nổi bật
router.get('/featured', tourController.getFeaturedTours);

// Tìm kiếm nâng cao
router.get('/search/advanced', tourController.advancedSearchTours);

// Thống kê tổng quan
router.get('/stats/summary', tourController.getTourStats);

// Lấy tour theo loại (domestic / oversea / mice)
router.get('/type/:tourType', tourController.getToursByType);

// Lấy tour domestic theo vùng miền
router.get('/region/:region', tourController.getToursByRegion);

// Lấy tour oversea theo châu lục
router.get('/continent/:continent', tourController.getToursByContinent);

// Lấy tour MICE theo category
router.get('/mice/category/:category', tourController.getMiceToursByCategory);

// Lấy tour MICE theo location
router.get('/mice/location/:location', tourController.getMiceToursByLocation);

// Lấy tour domestic theo điểm khởi hành
router.get('/domestic/departure/:departure', tourController.getDomesticToursByDeparture);

// Lấy tour oversea theo hãng hàng không
router.get('/oversea/airline/:airline', tourController.getOverseaToursByAirline);

// Lấy tour theo slug
router.get('/slug/:slug', tourController.getTourBySlug);

// Lấy tour theo ID
router.get('/:id', tourController.getTourById);

// ============================================================================
// PROTECTED ROUTES (cần đăng nhập user thường)
// ============================================================================

// Thêm review cho tour
router.post('/:id/review', authenticateToken, tourController.addTourReview);

// ============================================================================
// ADMIN ONLY ROUTES (chỉ admin/superadmin)
// ============================================================================

// Tạo tour mới
router.post('/', authenticateToken, validateTourCreation, tourController.createTour);

// Cập nhật tour
router.put('/:id', authenticateToken, validateTourUpdate, tourController.updateTour);

// Soft delete tour
router.delete('/:id', authenticateToken, tourController.deleteTour);

// Khôi phục tour đã xóa
router.post('/:id/restore', authenticateToken, tourController.restoreTour);

// Xóa vĩnh viễn tour
router.delete('/:id/permanent', authenticateToken, tourController.permanentDeleteTour);

// Lấy danh sách tour đã xóa
router.get('/admin/deleted', authenticateToken, tourController.getDeletedTours);

// Cleanup tour đã xóa quá 30 ngày
router.post('/admin/cleanup', authenticateToken, tourController.cleanupOldDeletedTours);

// Debug tour status (chỉ khi DEV)
if (process.env.NODE_ENV === 'development') {
  router.get('/debug/:id', tourController.debugTourStatus);
}

module.exports = router;
