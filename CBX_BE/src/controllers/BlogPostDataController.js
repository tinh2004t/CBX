// controllers/blogPostDataController.js
const BlogPostData = require("../models/BlogPostData");
const mongoose = require("mongoose");

class BlogPostDataController {
  // Lấy chi tiết BlogPostData theo ID hoặc slug

  async getBlogPostData(req, res) {
    try {
      const { identifier } = req.params;
      const { includeDeleted = false } = req.query;

      let filter = {};

      // Nếu identifier là ObjectId hợp lệ
      if (mongoose.Types.ObjectId.isValid(identifier)) {
        filter._id = identifier;
      } else {
        filter.slug = identifier;
      }

      if (!includeDeleted || includeDeleted === "false") {
        filter.isDeleted = { $ne: true };
      }

      const blogPostData = await BlogPostData.findOne(filter).populate(
        "blogPostId",
        "slug title category publishDate"
      );

      if (!blogPostData) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy blog post data",
        });
      }

      // Tăng view count nếu không phải bài đã xóa
      if (!blogPostData.isDeleted) {
        await BlogPostData.findByIdAndUpdate(blogPostData._id, {
          $inc: { views: 1 },
        });
        blogPostData.views += 1;
      }

      res.json({
        success: true,
        data: blogPostData,
      });
    } catch (error) {
      console.error("Error getting blog post data:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy blog post data",
        error: error.message,
      });
    }
  }

  // Cập nhật BlogPostData
  async updateBlogPostData(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const blogPostData = await BlogPostData.findOne({
        _id: parseInt(id),
        isDeleted: { $ne: true },
      });

      if (!blogPostData) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy blog post data",
        });
      }

      // Kiểm tra nếu title thay đổi thì cập nhật slug
      if (updateData.title && updateData.title !== blogPostData.title) {
        updateData.slug = blogPostData.generateSlug(updateData.title);
      }

      // Cập nhật BlogPostData
      Object.assign(blogPostData, updateData);
      await blogPostData.save();

      res.json({
        success: true,
        message: "Blog post data được cập nhật thành công",
        data: blogPostData,
      });
    } catch (error) {
      console.error("Error updating blog post data:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật blog post data",
        error: error.message,
      });
    }
  }

  // Lấy danh sách BlogPostData với phân trang và lọc
  async getBlogPostDataList(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        author,
        sortBy = "publishDate",
        sortOrder = "desc",
        includeDeleted = false,
      } = req.query;

      const skip = (page - 1) * limit;

      // Xây dựng query filter
      let filter = {};

      if (!includeDeleted || includeDeleted === "false") {
        filter.isDeleted = { $ne: true };
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { "author.name": { $regex: search, $options: "i" } },
        ];
      }

      if (category) {
        filter.category = { $regex: category, $options: "i" };
      }

      if (author) {
        filter["author.name"] = { $regex: author, $options: "i" };
      }

      // Xây dựng sort object
      const sort = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      // Thực hiện query
      const [blogPostsData, totalCount] = await Promise.all([
        BlogPostData.find(filter)
          .sort(sort)
          .skip(parseInt(skip))
          .limit(parseInt(limit))
          .populate("blogPostId", "slug title category publishDate")
          .lean(),
        BlogPostData.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        success: true,
        data: {
          blogPostsData,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      console.error("Error getting blog posts data:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách blog posts data",
        error: error.message,
      });
    }
  }

  // Lấy thống kê views
  async getViewsStats(req, res) {
    try {
      const { period = "7d" } = req.query;

      let dateFilter = {};
      const now = new Date();

      switch (period) {
        case "1d":
          dateFilter = { $gte: new Date(now - 24 * 60 * 60 * 1000) };
          break;
        case "7d":
          dateFilter = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
          break;
        case "30d":
          dateFilter = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
          break;
        case "1y":
          dateFilter = { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) };
          break;
        default:
          dateFilter = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
      }

      const stats = await BlogPostData.aggregate([
        {
          $match: {
            isDeleted: { $ne: true },
            publishDate: dateFilter,
          },
        },
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$views" },
            totalPosts: { $sum: 1 },
            avgViews: { $avg: "$views" },
            maxViews: { $max: "$views" },
            minViews: { $min: "$views" },
          },
        },
      ]);

      const topPosts = await BlogPostData.find({
        isDeleted: { $ne: true },
        publishDate: dateFilter,
      })
        .sort({ views: -1 })
        .limit(10)
        .select("title views category author publishDate")
        .lean();

      const categoryStats = await BlogPostData.aggregate([
        {
          $match: {
            isDeleted: { $ne: true },
            publishDate: dateFilter,
          },
        },
        {
          $group: {
            _id: "$category",
            totalViews: { $sum: "$views" },
            postCount: { $sum: 1 },
            avgViews: { $avg: "$views" },
          },
        },
        {
          $sort: { totalViews: -1 },
        },
      ]);

      res.json({
        success: true,
        data: {
          period,
          overview: stats[0] || {
            totalViews: 0,
            totalPosts: 0,
            avgViews: 0,
            maxViews: 0,
            minViews: 0,
          },
          topPosts,
          categoryStats,
        },
      });
    } catch (error) {
      console.error("Error getting views stats:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thống kê views",
        error: error.message,
      });
    }
  }
}

module.exports = new BlogPostDataController();
