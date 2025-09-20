const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.use(authenticateToken); // Tất cả routes sau này cần authentication

router.post('/logout', authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);
router.get('/logs', authenticateToken, authController.getAdminLogs);

// SuperAdmin only routes
router.post('/create-account', requireSuperAdmin, authController.createAccount);
router.get('/users', requireSuperAdmin, authController.getAllUsers);

router.put('/users/:userId', authenticateToken, requireSuperAdmin, authController.updateUser);
router.delete('/users/:userId', authenticateToken, requireSuperAdmin, authController.deleteUser);

router.post('/change-password', authenticateToken, authController.changePassword);

module.exports = router;