const express = require('express');
const router = express.Router();
const miceTourRoute = require('../controllers/MiceTourController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

// GET routes
router.get('/', miceTourRoute.getAllMiceTours);
router.get('/stats/summary', authenticateToken, miceTourRoute.getMiceTourStats);
router.get('/deleted', authenticateToken, miceTourRoute.getDeletedMiceTours); // Admin only
router.get('/slug/:slug', miceTourRoute.getMiceTourBySlug);
router.get('/:id', authenticateToken, miceTourRoute.getMiceTourById);

// POST routes
router.post('/', authenticateToken, miceTourRoute.createMiceTour);
router.post('/cleanup', authenticateToken, miceTourRoute.cleanupDeletedMiceTours); // Admin only
router.post('/:id/restore', authenticateToken, miceTourRoute.restoreMiceTour); // Admin only

// PUT routes
router.put('/:id', authenticateToken, miceTourRoute.updateMiceTour);

// DELETE routes
router.delete('/:id', authenticateToken, miceTourRoute.deleteMiceTour); // Soft delete
router.delete('/:id/permanent', authenticateToken, miceTourRoute.permanentDeleteMiceTour); // Admin only

module.exports = router;