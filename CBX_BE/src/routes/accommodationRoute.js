const express = require('express');
const router = express.Router();
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

const {
  createAccommodation,
  getAllAccommodations,
  getAccommodationBySlug,
  getDeletedAccommodations,
  getAccommodationsByType,
  updateAccommodation,
  deleteAccommodation,
  permanentDeleteAccommodation,
  restoreAccommodation,
  cleanupOldDeleted
} = require('../controllers/accommodationController');


// Get all accommodations
router.get('/', getAllAccommodations);
router.get('/deleted', authenticateToken, getDeletedAccommodations);

// Get accommodation by slug
router.get('/:slug', getAccommodationBySlug);

// Get deleted accommodations

// Get accommodations by type
router.get('/type/:type', getAccommodationsByType);

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