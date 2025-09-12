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

// Routes
router.post('/', authenticateToken, validateBlogPost, blogPostController.createBlogPost);
router.get('/', blogPostController.getBlogPosts);
router.get('/deleted', authenticateToken, blogPostController.getDeletedBlogPosts);
router.get('/:id', authenticateToken, blogPostController.getBlogPost);
router.get('/slug/:slug', blogPostController.getBlogPostBySlug);
router.put('/:id', authenticateToken, blogPostController.updateBlogPost);
router.put('/:id/content', authenticateToken, blogPostController.updateBlogPostContent);
router.delete('/:id', authenticateToken, blogPostController.softDeleteBlogPost);
router.delete('/:id/permanent', authenticateToken, blogPostController.permanentDeleteBlogPost);
router.patch('/:id/restore', authenticateToken, blogPostController.restoreBlogPost);
router.post('/cleanup', authenticateToken, blogPostController.runCleanup);

module.exports = router;