const express = require('express');
const router = express.Router();
const transportController = require('../controllers/TransportController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');
const { transportValidation, updateTransportValidation } = require('../middleware/transportValidation');

// PUBLIC ROUTES (không cần đăng nhập)

// GET /api/transports - Lấy danh sách tất cả chuyến xe với filter và search
/**
 * Query parameters:
 * - page: số trang (default: 1)
 * - limit: số lượng kết quả mỗi trang (default: 10)
 * - sort: sắp xếp (default: -createdAt)
 * - search: tìm kiếm text
 * - company: lọc theo công ty
 * - fromCity: lọc theo thành phố đi
 * - toCity: lọc theo thành phố đến
 * - departDate: lọc theo ngày khởi hành (YYYY-MM-DD)
 * - minPrice: giá tối thiểu
 * - maxPrice: giá tối đa
 * - seatType: loại ghế
 * - minRating: đánh giá tối thiểu
 */
router.get('/', transportController.getAllTransports);

// GET /api/transports/search/route - Tìm kiếm chuyến xe theo tuyến đường
/**
 * Query parameters:
 * - fromCity: thành phố đi (required)
 * - toCity: thành phố đến (required)
 * - departDate: ngày khởi hành (optional, YYYY-MM-DD)
 * - page: số trang (default: 1)
 * - limit: số lượng kết quả mỗi trang (default: 10)
 * - sort: sắp xếp (default: price)
 */
router.get('/search/route', transportController.searchByRoute);

// GET /api/transports/:id - Lấy thông tin một chuyến xe theo ID hoặc slug
router.get('/:id', transportController.getTransportById);
router.get('/slug/:slug', transportController.getTransportBySlug);
router.get('/deleted', authenticateToken, transportController.getDeletedTransports);
router.get('/cleanup/preview', authenticateToken, transportController.previewCleanup);


// PRIVATE ROUTES (cần đăng nhập)

// GET /api/transports/admin/stats - Lấy thống kê chuyến xe
router.get('/admin/stats', authenticateToken, transportController.getTransportStats);

// POST /api/transports - Tạo chuyến xe mới
router.post('/cleanup', authenticateToken, transportController.cleanupTransports);
router.post('/', authenticateToken, transportValidation, transportController.createTransport);

// PUT /api/transports/:id - Cập nhật thông tin chuyến xe
router.put('/:id', authenticateToken, updateTransportValidation, transportController.updateTransport);
router.patch('/:id', authenticateToken, updateTransportValidation, transportController.updateTransport);


router.put('/:id/restore', authenticateToken, transportController.restoreTransport);

// DELETE /api/transports/:id - Xóa chuyến xe (soft delete)
router.delete('/:id', authenticateToken, transportController.deleteTransport);
router.delete('/:id/permanent', authenticateToken, transportController.permanentDeleteTransport);


module.exports = router;