const express = require('express');
const router = express.Router();
const tourDetailController = require('../controllers/TourDetailController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');



// PUBLIC ROUTES (không cần đăng nhập)

// GET /api/tour-details/by-slug/:slug - Lấy TourDetail bằng slug (cho frontend public)
router.get('/:slug', tourDetailController.getTourDetailBySlug);

// GET /api/tour-details/direct/:id - Lấy TourDetail trực tiếp bằng ID (cho admin)
router.get('/direct/:id', authenticateToken, tourDetailController.getTourDetailById);

// PUT /api/tour-details/:id - Cập nhật TourDetail trực tiếp
router.put('/:id', authenticateToken, tourDetailController.updateTourDetail);

// PUT /api/tour-details/by-tour/:tourId - Cập nhật TourDetail bằng ID của DomesticTour
router.put('/by-tour/:tourId', authenticateToken, tourDetailController.updateTourDetailByTourId);


module.exports = router;