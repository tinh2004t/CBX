// src/api/blogApi.js
import apiClient from './client.js';

const blogAPI = {
  // 📌 Lấy danh sách bài viết (public)
  getPosts: async (params = {}) => {
    const res = await apiClient.get('/blog', { params });
    return res.data; // { success, data: [...], pagination: {...} }
  },

  // 📌 Lấy chi tiết bài viết theo ID (public)
  getPostById: async (id) => {
    const res = await apiClient.get(`/blog/${id}`);
    return res.data;
  },

  // 📌 Lấy chi tiết bài viết theo slug (public)
  getPostBySlug: async (slug) => {
    const res = await apiClient.get(`/blog/slug/${slug}`);
    return res.data;
  },

  // 📌 Lấy toàn bộ thông tin bài viết theo slug (unified - BlogPost + BlogPostData, public)
  getPostBySlugUnified: async (slug) => {
    const res = await apiClient.get(`/blog/slug/${slug}/unified`);
    return res.data; // { success, data: { ...blogPost, content, views, dataId } }
  },

  // 📌 Lấy chỉ metadata bài viết theo slug (không có content - faster, public)
  getPostMetadataBySlug: async (slug) => {
    const res = await apiClient.get(`/blog/slug/${slug}/metadata`);
    return res.data; // { success, data: { ...blogPost without content } }
  },

  // 📌 Lấy nội dung chi tiết (BlogPostData) - sử dụng slug (public)
  getPostData: async (slug) => {
    const res = await apiClient.get(`/blog/slug/${slug}/content`);
    return res.data;
  },

  // 📌 Thống kê blog (public)
  getStats: async () => {
    const res = await apiClient.get('/blog/stats');
    return res.data;
  },

  // ======== 🎯 HELPER METHODS FOR FRONTEND ========

  // 📌 Lấy bài viết cho việc hiển thị (tự động tăng view)
  getPostForDisplay: async (slug) => {
    try {
      return await blogAPI.getPostBySlugUnified(slug);
    } catch (error) {
      console.error('Error getting post for display:', error);
      throw error;
    }
  },

  // 📌 Lấy nhiều bài viết theo slugs (metadata batch)
  getPostsBySlugsBatch: async (slugs) => {
    try {
      const promises = slugs.map(slug => blogAPI.getPostMetadataBySlug(slug));
      const results = await Promise.allSettled(promises);
      
      return results.map((result, index) => ({
        slug: slugs[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value.data : null,
        error: result.status === 'rejected' ? result.reason : null
      }));
    } catch (error) {
      console.error('Error getting posts by slugs batch:', error);
      throw error;
    }
  }
};

export default blogAPI;
