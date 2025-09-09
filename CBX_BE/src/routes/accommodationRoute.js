const express = require('express');
const router = express.Router();
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

const {
  createAccommodation,
  getAllAccommodations,
  getAccommodationBySlug,
  updateAccommodation,
  deleteAccommodation,
  permanentDeleteAccommodation,
  restoreAccommodation,
  cleanupOldDeleted
} = require('../controllers/AccommodationController');


// Get all accommodations
router.get('/', getAllAccommodations);

// Get accommodation by slug
router.get('/:slug', getAccommodationBySlug);

// Create accommodation
router.post('/',authenticateToken, createAccommodation);

// Update accommodation
router.put('/:id',authenticateToken, updateAccommodation);

// Soft delete accommodation
router.delete('/:id',authenticateToken, deleteAccommodation);

// Permanent delete accommodation
router.delete('/:id/permanent',authenticateToken, permanentDeleteAccommodation);

// Restore deleted accommodation
router.patch('/:id/restore',authenticateToken, restoreAccommodation);

// Cleanup old deleted records
router.post('/cleanup',authenticateToken, cleanupOldDeleted);

module.exports = router;