const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.use(authenticateToken); // Tất cả routes sau này cần authentication

router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);
router.get('/logs', authController.getAdminLogs);

// SuperAdmin only routes
router.post('/create-account', requireSuperAdmin, authController.createAccount);
router.get('/users', requireSuperAdmin, authController.getAllUsers);

module.exports = router;