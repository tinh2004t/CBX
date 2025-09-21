// src/api/blog.js
import apiClient from './client.js';

const blogAPI = {
  // 📌 Tạo bài viết mới
  createPost: async (data) => {
    const res = await apiClient.post('/blog', data);
    return res.data; // { success, message, post }
  },

  // 📌 Lấy danh sách bài viết
  getPosts: async (params = {}) => {
    const res = await apiClient.get('/blog', { params });
    return res.data; // { success, data: [...], pagination: {...} }
  },

  // 📌 Lấy chi tiết bài viết theo ID
  getPostById: async (id) => {
    const res = await apiClient.get(`/blog/${id}`);
    return res.data;
  },

  // 📌 Lấy chi tiết bài viết theo slug
  getPostBySlug: async (slug) => {
    const res = await apiClient.get(`/blog/slug/${slug}`);
    return res.data;
  },

  // ======== 🚀 UNIFIED SLUG METHODS (NEW) ========

  // 📌 Lấy toàn bộ thông tin bài viết theo slug (unified - BlogPost + BlogPostData)
  getPostBySlugUnified: async (slug) => {
    const res = await apiClient.get(`/blog/slug/${slug}/unified`);
    return res.data; // { success, data: { ...blogPost, content, views, dataId } }
  },

  // 📌 Lấy chỉ metadata bài viết theo slug (không có content - faster)
  getPostMetadataBySlug: async (slug) => {
    const res = await apiClient.get(`/blog/slug/${slug}/metadata`);
    return res.data; // { success, data: { ...blogPost without content } }
  },

  // 📌 Cập nhật toàn bộ thông tin bài viết theo slug (unified - PUT)
  updatePostBySlugUnified: async (slug, data) => {
    const res = await apiClient.put(`/blog/slug/${slug}/unified`, data);
    return res.data; // { success, message, data: {...}, slugChanged: null | {oldSlug, newSlug} }
  },

  // 📌 Cập nhật từng phần thông tin bài viết theo slug (unified - PATCH)
  patchPostBySlugUnified: async (slug, data) => {
    const res = await apiClient.patch(`/blog/slug/${slug}/unified`, data);
    return res.data; // { success, message, data: {...} }
  },

  // ======== EXISTING METHODS ========

  // 📌 Cập nhật bài viết
  updatePost: async (id, data) => {
    const res = await apiClient.put(`/blog/${id}`, data);
    return res.data;
  },

  // 📌 Lấy nội dung chi tiết (BlogPostData) - sử dụng slug
  getPostData: async (slug) => {
    const res = await apiClient.get(`/blog/slug/${slug}/content`);
    return res.data;
  },

  // 📌 Cập nhật nội dung chi tiết - sử dụng slug thay vì id
  updatePostData: async (slug, content) => {
    const res = await apiClient.put(`/blog/${slug}/content`, content);
    return res.data;
  },

  // 📌 Xoá mềm bài viết
  softDeletePost: async (id) => {
    const res = await apiClient.delete(`/blog/${id}`);
    return res.data;
  },

  // 📌 Xoá vĩnh viễn
  permanentDeletePost: async (id) => {
    const res = await apiClient.delete(`/blog/${id}/permanent`);
    return res.data;
  },

  // 📌 Khôi phục bài viết
  restorePost: async (id) => {
    const res = await apiClient.patch(`/blog/${id}/restore`);
    return res.data;
  },

  // 📌 Lấy danh sách đã xoá
  getDeletedPosts: async (params = {}) => {
    const res = await apiClient.get('/blog/deleted', { params });
    return res.data;
  },

  // 📌 Tạo lại slug
  regenerateSlug: async (id) => {
    const res = await apiClient.post(`/blog/${id}/regenerate-slug`);
    return res.data;
  },

  // 📌 Tạo lại toàn bộ slug
  regenerateAllSlugs: async () => {
    const res = await apiClient.post('/blog/regenerate-all-slugs');
    return res.data;
  },

  // 📌 Cleanup bài viết cũ
  runCleanup: async () => {
    const res = await apiClient.post('/blog/cleanup');
    return res.data;
  },

  // 📌 Upload ảnh
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await apiClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // 📌 Thống kê blog
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

  // 📌 Lấy bài viết cho việc edit (không tăng view, có thể dùng metadata trước)
  getPostForEdit: async (slug) => {
    try {
      // Có thể dùng metadata trước để load nhanh, sau đó load content
      return await blogAPI.getPostBySlugUnified(slug);
    } catch (error) {
      console.error('Error getting post for edit:', error);
      throw error;
    }
  },

  // 📌 Cập nhật chỉ nội dung (quick content update)
  updatePostContent: async (slug, content) => {
    try {
      return await blogAPI.patchPostBySlugUnified(slug, { content });
    } catch (error) {
      console.error('Error updating post content:', error);
      throw error;
    }
  },

  // 📌 Cập nhật chỉ metadata (không đụng content)
  updatePostMetadata: async (slug, metadata) => {
    try {
      // Loại bỏ content khỏi metadata để tránh ghi đè
      const { content, ...metadataOnly } = metadata;
      return await blogAPI.patchPostBySlugUnified(slug, metadataOnly);
    } catch (error) {
      console.error('Error updating post metadata:', error);
      throw error;
    }
  },

  // 📌 Cập nhật toàn bộ (metadata + content)
  updatePostComplete: async (slug, data) => {
    try {
      return await blogAPI.updatePostBySlugUnified(slug, data);
    } catch (error) {
      console.error('Error updating complete post:', error);
      throw error;
    }
  },

  // 📌 Kiểm tra slug có tồn tại không (cho validation)
  checkSlugExists: async (slug) => {
    try {
      await blogAPI.getPostMetadataBySlug(slug);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  },

  // 📌 Lấy nhiều bài viết theo slugs
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