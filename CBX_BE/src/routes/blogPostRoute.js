// routes/blogPostRoutes.js
const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

// Validation middleware (tùy chọn)
const validateBlogPost = (req, res, next) => {
  const { title, author, category, location, image, excerpt } = req.body;
  
  if (!title || !author?.name || !category || !location?.city || !image || !excerpt) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin bắt buộc',
      required: ['title', 'author.name', 'category', 'location.city', 'image', 'excerpt']
    });
  }
  
  next();
};

/**
 * BLOG POST ROUTES
 */

// === CREATE & LIST ===
router.post('/', authenticateToken, validateBlogPost, blogPostController.createBlogPost);
router.get('/', blogPostController.getBlogPosts);
router.get('/deleted', authenticateToken, blogPostController.getDeletedBlogPosts);

// === SLUG-BASED ROUTES ===
// Nội dung bài viết
router.get('/slug/:slug/content', authenticateToken, blogPostController.getBlogPostContent);
router.put('/slug/:slug/content', authenticateToken, blogPostController.updateBlogPostContent);

// Unified (lấy/cập nhật tất cả theo slug)
router.get('/slug/:slug/unified', blogPostController.getBlogPostBySlugUnified);
router.put('/slug/:slug/unified', authenticateToken, blogPostController.updateBlogPostBySlugUnified);
router.patch('/slug/:slug/unified', authenticateToken, blogPostController.patchBlogPostBySlugUnified);

// Metadata theo slug
router.get('/slug/:slug/metadata', blogPostController.getBlogPostMetadataBySlug);

// Lấy blog post theo slug cơ bản
router.get('/slug/:slug', blogPostController.getBlogPostBySlug);

// === ID-BASED ROUTES ===
router.get('/:id', authenticateToken, blogPostController.getBlogPost);
router.put('/:id', authenticateToken, blogPostController.updateBlogPost);
router.delete('/:id', authenticateToken, blogPostController.softDeleteBlogPost);
router.delete('/:id/permanent', authenticateToken, blogPostController.permanentDeleteBlogPost);
router.patch('/:id/restore', authenticateToken, blogPostController.restoreBlogPost);

// === MAINTENANCE ===
router.post('/cleanup', authenticateToken, blogPostController.runCleanup);

module.exports = router;
