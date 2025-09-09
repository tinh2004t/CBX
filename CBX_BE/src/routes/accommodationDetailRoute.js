const express = require('express');
const router = express.Router();
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

const {
  updateAccommodationDetail,
  getAccommodationDetailById,
  getAccommodationDetailBySlug,
  getAllAccommodationDetails,
  addRoomType,
  updateRoomType,
  deleteRoomType
} = require('../controllers/AccommodationDetailController');

// Get all accommodation details
router.get('/', getAllAccommodationDetails);

// Get accommodation detail by slug
router.get('/slug/:slug', getAccommodationDetailBySlug);

// Get accommodation detail by ID
router.get('/:id',authenticateToken, getAccommodationDetailById);

// Update accommodation detail
router.put('/:id',authenticateToken, updateAccommodationDetail);

// Room type management
router.post('/:id/room-types',authenticateToken, addRoomType);
router.put('/:id/room-types/:roomTypeId',authenticateToken, updateRoomType);
router.delete('/:id/room-types/:roomTypeId',authenticateToken, deleteRoomType);

module.exports = router;
