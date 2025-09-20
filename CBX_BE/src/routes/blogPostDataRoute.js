// routes/blogPostDataRoutes.js
const express = require('express');
const router = express.Router();
const blogPostDataController = require('../controllers/BlogPostDataController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

// Lấy chi tiết BlogPostData theo id hoặc slug
router.get('/:identifier', blogPostDataController.getBlogPostData);

// Cập nhật BlogPostData theo id
router.put('/:id', authenticateToken, blogPostDataController.updateBlogPostData);

// Lấy danh sách BlogPostData với phân trang, lọc, tìm kiếm
router.get('/', authenticateToken, blogPostDataController.getBlogPostDataList);

// Lấy thống kê views
router.get('/stats/views', authenticateToken, blogPostDataController.getViewsStats);

module.exports = router;
