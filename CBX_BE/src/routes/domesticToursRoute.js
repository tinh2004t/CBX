    const express = require('express');
    const router = express.Router();
    const tourController = require('../controllers/DomesticTourController');
    const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

    // GET routes
    router.get('/', tourController.getAllTours );
    router.get('/stats/summary', authenticateToken,tourController.getTourStats );
    router.get('/deleted', authenticateToken,tourController.getDeletedTours ); // Admin only
    router.get('/region/:region', authenticateToken,tourController.getToursByRegion );
    router.get('/slug/:slug',authenticateToken, tourController.getTourBySlug );
    router.get('/:id', authenticateToken,tourController.getTourById );

    // POST routes
    router.post('/', authenticateToken,tourController.createTour );
    router.post('/cleanup', authenticateToken,tourController.cleanupOldDeletedTours ); // Admin only
    router.post('/:id/restore', authenticateToken,tourController.restoreTour ); // Admin only

    // PUT routes
    router.put('/:id', authenticateToken,tourController.updateTour );

    // DELETE routes
    router.delete('/:id',authenticateToken, tourController.deleteTour); // Soft delete
    router.delete('/:id/permanent', authenticateToken,tourController.permanentDeleteTour ); // Admin only

    module.exports = router;