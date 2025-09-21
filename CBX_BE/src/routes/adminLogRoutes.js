const express = require('express');
const router = express.Router();
const { getAdminLogs, cleanupLogs } = require('../controllers/adminLogController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

// Chỉ SuperAdmin mới được xem log
router.get('/', authenticateToken, getAdminLogs);
router.post('/cleanup', authenticateToken, requireSuperAdmin, cleanupLogs);

module.exports = router;
