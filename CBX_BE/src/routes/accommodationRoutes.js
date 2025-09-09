const express = require('express');
const router = express.Router();
const {
  createAccommodation,
  getAllAccommodations,
  getAccommodationBySlug,
  updateAccommodation,
  deleteAccommodation,
  permanentDeleteAccommodation,
  restoreAccommodation,
  cleanupOldDeleted
} = require('../controllers/accommodationController');

// Create accommodation
router.post('/', createAccommodation);

// Get all accommodations
router.get('/', getAllAccommodations);

// Get accommodation by slug
router.get('/:slug', getAccommodationBySlug);

// Update accommodation
router.put('/:id', updateAccommodation);

// Soft delete accommodation
router.delete('/:id', deleteAccommodation);

// Permanent delete accommodation
router.delete('/:id/permanent', permanentDeleteAccommodation);

// Restore deleted accommodation
router.patch('/:id/restore', restoreAccommodation);

// Cleanup old deleted records
router.post('/cleanup', cleanupOldDeleted);

module.exports = router;