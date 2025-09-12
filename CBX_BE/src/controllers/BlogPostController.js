// controllers/blogPostController.js
const BlogPost = require('../models/BlogPost');
const BlogPostData = require('../models/BlogPostData');
const mongoose = require('mongoose');

// Helper functions bên ngoài class để tránh vấn đề context
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '') // Loại bỏ ký tự đặc biệt
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-') // Loại bỏ dấu gạch ngang trùng lặp
    .replace(/^-+|-+$/g, ''); // Loại bỏ dấu gạch ngang ở đầu và cuối
};

const generateUniqueSlug = async (title, excludeId = null) => {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug: slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingPost = await BlogPost.findOne(query);
    
    if (!existingPost) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

class BlogPostController {
  // Tạo bài viết mới
  async createBlogPost(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        title,
        author,
        category,
        location,
        image,
        excerpt,
        publishDate
      } = req.body;

      // Tự động tạo slug duy nhất từ title
      const slug = await generateUniqueSlug(title);

      // Tạo BlogPost với slug
      const blogPost = new BlogPost({
        title,
        author,
        category,
        location,
        image,
        excerpt,
        publishDate: publishDate || new Date(),
        slug // Gán slug đã tạo
      });

      await blogPost.save({ session });

      // Tạo BlogPostData tương ứng
      const blogPostData = new BlogPostData({
        blogPostId: blogPost._id,
        title: blogPost.title,
        location: blogPost.location.city,
        category: blogPost.category,
        author: blogPost.author,
        publishDate: blogPost.publishDate,
        slug: blogPost.slug
      });

      await blogPostData.save({ session });

      await session.commitTransaction();

      res.status(201).json({
        success: true,
        message: 'Tạo bài viết thành công',
        data: {
          blogPost,
          blogPostData
        }
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Error creating blog post:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi tạo bài viết'
      });
    } finally {
      session.endSession();
    }
  }

  // Lấy danh sách bài viết
  async getBlogPosts(req, res) {
    try {
      const { page = 1, limit = 10, category, author, search } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Tạo query filter
      const filter = { isDeleted: false };
      
      if (category) filter.category = new RegExp(category, 'i');
      if (author) filter['author.name'] = new RegExp(author, 'i');
      if (search) {
        filter.$or = [
          { title: new RegExp(search, 'i') },
          { excerpt: new RegExp(search, 'i') }
        ];
      }

      const blogPosts = await BlogPost.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await BlogPost.countDocuments(filter);

      res.json({
        success: true,
        data: {
          blogPosts,
          pagination: {
            current: parseInt(page),
            total: Math.ceil(total / parseInt(limit)),
            count: blogPosts.length,
            totalRecords: total
          }
        }
      });
    } catch (error) {
      console.error('Error getting blog posts:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách bài viết'
      });
    }
  }

  // Lấy chi tiết bài viết
  async getBlogPost(req, res) {
    try {
      const { id } = req.params;

      const blogPost = await BlogPost.findOne({
        _id: id,
        isDeleted: false
      });

      if (!blogPost) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết'
        });
      }

      // Tăng view count
      await BlogPost.findByIdAndUpdate(id, {
        $inc: { 'stats.views': 1 }
      });

      await BlogPostData.findOneAndUpdate(
        { blogPostId: id },
        { $inc: { views: 1 } }
      );

      res.json({
        success: true,
        data: blogPost
      });
    } catch (error) {
      console.error('Error getting blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy bài viết'
      });
    }
  }

  // Lấy chi tiết bài viết theo slug
  async getBlogPostBySlug(req, res) {
    try {
      const { slug } = req.params;

      const blogPostData = await BlogPostData.findOne({
        slug: slug,
        isDeleted: false
      }).populate('blogPostId');

      if (!blogPostData) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết'
        });
      }

      // Tăng view count
      await BlogPost.findByIdAndUpdate(blogPostData.blogPostId._id, {
        $inc: { 'stats.views': 1 }
      });

      await BlogPostData.findByIdAndUpdate(blogPostData._id, {
        $inc: { views: 1 }
      });

      res.json({
        success: true,
        data: blogPostData
      });
    } catch (error) {
      console.error('Error getting blog post by slug:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy bài viết'
      });
    }
  }

  // Cập nhật bài viết
  async updateBlogPost(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const updateData = req.body;

      const blogPost = await BlogPost.findOne({
        _id: id,
        isDeleted: false
      });

      if (!blogPost) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết'
        });
      }

      // Nếu title được cập nhật, tạo slug mới
      if (updateData.title && updateData.title !== blogPost.title) {
        updateData.slug = await generateUniqueSlug(updateData.title, id);
      }

      // Cập nhật BlogPost
      const updatedBlogPost = await BlogPost.findByIdAndUpdate(
        id,
        updateData,
        { new: true, session }
      );

      // Cập nhật BlogPostData tương ứng
      const blogPostDataUpdate = {
        title: updatedBlogPost.title,
        location: updatedBlogPost.location.city,
        category: updatedBlogPost.category,
        author: updatedBlogPost.author,
        publishDate: updatedBlogPost.publishDate,
        slug: updatedBlogPost.slug
      };

      await BlogPostData.findOneAndUpdate(
        { blogPostId: id },
        blogPostDataUpdate,
        { session }
      );

      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Cập nhật bài viết thành công',
        data: updatedBlogPost
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Error updating blog post:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi cập nhật bài viết'
      });
    } finally {
      session.endSession();
    }
  }

  // Cập nhật nội dung bài viết
  async updateBlogPostContent(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const blogPostData = await BlogPostData.findOneAndUpdate(
        { blogPostId: id, isDeleted: false },
        { content },
        { new: true }
      );

      if (!blogPostData) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật nội dung thành công',
        data: blogPostData
      });
    } catch (error) {
      console.error('Error updating blog post content:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi cập nhật nội dung'
      });
    }
  }

  // API để tạo lại slug cho bài viết cụ thể
  async regenerateSlug(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      const blogPost = await BlogPost.findOne({
        _id: id,
        isDeleted: false
      });

      if (!blogPost) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết'
        });
      }

      // Tạo slug mới từ title hiện tại
      const newSlug = await generateUniqueSlug(blogPost.title, id);

      // Cập nhật BlogPost
      const updatedBlogPost = await BlogPost.findByIdAndUpdate(
        id,
        { slug: newSlug },
        { new: true, session }
      );

      // Cập nhật BlogPostData
      await BlogPostData.findOneAndUpdate(
        { blogPostId: id },
        { slug: newSlug },
        { session }
      );

      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Tạo lại slug thành công',
        data: {
          id: updatedBlogPost._id,
          title: updatedBlogPost.title,
          oldSlug: blogPost.slug,
          newSlug: newSlug
        }
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Error regenerating slug:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi tạo lại slug'
      });
    } finally {
      session.endSession();
    }
  }

  // API để tạo lại slug cho tất cả bài viết
  async regenerateAllSlugs(req, res) {
    try {
      const blogPosts = await BlogPost.find({ isDeleted: false });
      const results = [];

      for (const post of blogPosts) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          const newSlug = await generateUniqueSlug(post.title, post._id);
          
          if (post.slug !== newSlug) {
            // Cập nhật BlogPost
            await BlogPost.findByIdAndUpdate(
              post._id,
              { slug: newSlug },
              { session }
            );

            // Cập nhật BlogPostData
            await BlogPostData.findOneAndUpdate(
              { blogPostId: post._id },
              { slug: newSlug },
              { session }
            );

            results.push({
              id: post._id,
              title: post.title,
              oldSlug: post.slug,
              newSlug: newSlug
            });
          }

          await session.commitTransaction();
        } catch (error) {
          await session.abortTransaction();
          console.error(`Error regenerating slug for post ${post._id}:`, error);
        } finally {
          session.endSession();
        }
      }

      res.json({
        success: true,
        message: `Đã tạo lại ${results.length} slug`,
        data: {
          totalProcessed: blogPosts.length,
          updatedCount: results.length,
          updatedPosts: results
        }
      });
    } catch (error) {
      console.error('Error regenerating all slugs:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi tạo lại tất cả slug'
      });
    }
  }

  // Xóa mềm bài viết
  async softDeleteBlogPost(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      const blogPost = await BlogPost.findOne({
        _id: id,
        isDeleted: false
      });

      if (!blogPost) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết'
        });
      }

      // Soft delete BlogPost
      await BlogPost.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          deletedAt: new Date()
        },
        { session }
      );

      // Soft delete BlogPostData
      await BlogPostData.findOneAndUpdate(
        { blogPostId: id },
        {
          isDeleted: true,
          deletedAt: new Date()
        },
        { session }
      );

      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Xóa bài viết thành công (soft delete)'
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Error soft deleting blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi xóa bài viết'
      });
    } finally {
      session.endSession();
    }
  }

  // Xóa vĩnh viễn bài viết
  async permanentDeleteBlogPost(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      const blogPost = await BlogPost.findById(id);

      if (!blogPost) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết'
        });
      }

      // Xóa vĩnh viễn BlogPostData trước
      await BlogPostData.findOneAndDelete(
        { blogPostId: id },
        { session }
      );

      // Xóa vĩnh viễn BlogPost
      await BlogPost.findByIdAndDelete(id, { session });

      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Xóa vĩnh viễn bài viết thành công'
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Error permanently deleting blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi xóa vĩnh viễn bài viết'
      });
    } finally {
      session.endSession();
    }
  }

  // Tự động xóa vĩnh viễn các bài viết đã soft delete quá 30 ngày
  async cleanupOldDeletedPosts() {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Tìm các bài viết đã bị soft delete quá 30 ngày
      const oldDeletedPosts = await BlogPost.find({
        isDeleted: true,
        deletedAt: { $lte: thirtyDaysAgo }
      });

      if (oldDeletedPosts.length === 0) {
        await session.commitTransaction();
        return {
          success: true,
          message: 'Không có bài viết nào cần cleanup',
          deletedCount: 0
        };
      }

      const postIds = oldDeletedPosts.map(post => post._id);

      // Xóa vĩnh viễn BlogPostData
      await BlogPostData.deleteMany(
        { blogPostId: { $in: postIds } },
        { session }
      );

      // Xóa vĩnh viễn BlogPost
      const deleteResult = await BlogPost.deleteMany(
        { _id: { $in: postIds } },
        { session }
      );

      await session.commitTransaction();

      return {
        success: true,
        message: `Đã cleanup ${deleteResult.deletedCount} bài viết`,
        deletedCount: deleteResult.deletedCount
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('Error cleaning up old deleted posts:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  // API endpoint để chạy cleanup thủ công
  async runCleanup(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Copy code từ cleanupOldDeletedPosts vào đây luôn
    const oldDeletedPosts = await BlogPost.find({
      isDeleted: true,
      deletedAt: { $lte: thirtyDaysAgo }
    });

    if (oldDeletedPosts.length === 0) {
      await session.commitTransaction();
      return res.json({
        success: true,
        message: 'Không có bài viết nào cần cleanup',
        deletedCount: 0
      });
    }

    const postIds = oldDeletedPosts.map(post => post._id);

    await BlogPostData.deleteMany(
      { blogPostId: { $in: postIds } },
      { session }
    );

    const deleteResult = await BlogPost.deleteMany(
      { _id: { $in: postIds } },
      { session }
    );

    await session.commitTransaction();

    res.json({
      success: true,
      message: `Đã cleanup ${deleteResult.deletedCount} bài viết`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error running cleanup:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi chạy cleanup'
    });
  } finally {
    session.endSession();
  }
}

  // Lấy danh sách bài viết đã xóa
  async getDeletedBlogPosts(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const deletedPosts = await BlogPost.find({ isDeleted: true })
        .sort({ deletedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await BlogPost.countDocuments({ isDeleted: true });

      // Tính toán số ngày còn lại trước khi bị xóa vĩnh viễn
      const postsWithTimeLeft = deletedPosts.map(post => {
        const deletedDate = new Date(post.deletedAt);
        const now = new Date();
        const daysSinceDeleted = Math.floor((now - deletedDate) / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, 30 - daysSinceDeleted);
        
        return {
          ...post.toObject(),
          daysSinceDeleted,
          daysLeftBeforePermanentDelete: daysLeft
        };
      });

      res.json({
        success: true,
        data: {
          deletedPosts: postsWithTimeLeft,
          pagination: {
            current: parseInt(page),
            total: Math.ceil(total / parseInt(limit)),
            count: deletedPosts.length,
            totalRecords: total
          }
        }
      });
    } catch (error) {
      console.error('Error getting deleted blog posts:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách bài viết đã xóa'
      });
    }
  }

  // Khôi phục bài viết
  async restoreBlogPost(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      const blogPost = await BlogPost.findOne({
        _id: id,
        isDeleted: true
      });

      if (!blogPost) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết đã xóa'
        });
      }

      // Restore BlogPost
      await BlogPost.findByIdAndUpdate(
        id,
        {
          isDeleted: false,
          deletedAt: null
        },
        { session }
      );

      // Restore BlogPostData
      await BlogPostData.findOneAndUpdate(
        { blogPostId: id },
        {
          isDeleted: false,
          deletedAt: null
        },
        { session }
      );

      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Khôi phục bài viết thành công'
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Error restoring blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khôi phục bài viết'
      });
    } finally {
      session.endSession();
    }
  }
}

module.exports = new BlogPostController();