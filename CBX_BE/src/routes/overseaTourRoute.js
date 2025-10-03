const express = require('express');
const router = express.Router();
const overseaTourController = require('../controllers/OverseaTourController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

// GET routes
router.get('/', overseaTourController.getAllOverseaTours);
router.get('/stats/summary', authenticateToken, overseaTourController.getOverseaTourStats);
router.get('/deleted', authenticateToken, overseaTourController.getDeletedOverseaTours); // Admin only
router.get('/continent/:continent', overseaTourController.getOverseaToursByContinent);
router.get('/slug/:slug', overseaTourController.getOverseaTourBySlug);
router.get('/:id', authenticateToken, overseaTourController.getOverseaTourById);
    
// POST routes
router.post('/', authenticateToken, overseaTourController.createOverseaTour);
router.post('/cleanup', authenticateToken, overseaTourController.cleanupOldDeletedOverseaTours); // Admin only
router.post('/:id/restore', authenticateToken, overseaTourController.restoreOverseaTour); // Admin only

// PUT routes
router.put('/:id', authenticateToken, overseaTourController.updateOverseaTour);

// DELETE routes
router.delete('/:id', authenticateToken, overseaTourController.deleteOverseaTour); // Soft delete
router.delete('/:id/permanent', authenticateToken, overseaTourController.permanentDeleteOverseaTour); // Admin only

module.exports = router;