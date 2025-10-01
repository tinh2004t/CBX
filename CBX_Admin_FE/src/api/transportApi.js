// src/api/transportApi.js
import apiClient from './client.js';

const transportAPI = {
  // ================= PUBLIC ROUTES =================

  // 📌 Lấy danh sách tất cả chuyến xe với filter & search
  getAllTransports: async (params = {}) => {
  // Lọc bỏ các params undefined/null/empty
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
  
  const res = await apiClient.get('/transports', { params: cleanParams });
  return res.data;
},

  // 📌 Tìm kiếm chuyến xe theo tuyến đường
  searchByRoute: async (params = {}) => {
    const res = await apiClient.get('/transports/search/route', { params });
    return res.data; // { success, data: [...], pagination: {...} }
  },

  // 📌 Lấy thông tin một chuyến xe theo ID (cần token)
  getTransportById: async (id) => {
    const res = await apiClient.get(`/transports/${id}`);
    return res.data; // { success, data: {...} }
  },

  // 📌 Lấy thông tin một chuyến xe theo slug (public)
  getTransportBySlug: async (slug) => {
    const res = await apiClient.get(`/transports/slug/${slug}`);
    return res.data; // { success, data: {...} }
  },

  // 📌 Lấy danh sách chuyến xe đã bị xóa (cần token)
  getDeletedTransports: async () => {
    const res = await apiClient.get('/transports/deleted');
    return res.data; // { success, data: [...] }
  },

  // 📌 Xem trước cleanup (cần token)
  previewCleanup: async () => {
    const res = await apiClient.get('/transports/cleanup/preview');
    return res.data; // { success, data: [...] }
  },

  // ================= PRIVATE ROUTES =================

  // 📌 Lấy thống kê chuyến xe (cần token)
  getTransportStats: async () => {
    const res = await apiClient.get('/transports/admin/stats');
    return res.data; // { success, data: {...} }
  },

  // 📌 Cleanup transports (cần token)
  cleanupTransports: async () => {
    const res = await apiClient.post('/transports/cleanup');
    return res.data; // { success, message, data: [...] }
  },

  // 📌 Tạo chuyến xe mới (cần token)
  createTransport: async (data) => {
    const res = await apiClient.post('/transports', data);
    return res.data; // { success, message, data: {...} }
  },

  // 📌 Cập nhật chuyến xe (cần token)
  updateTransport: async (id, data) => {
    const res = await apiClient.put(`/transports/${id}`, data);
    return res.data; // { success, message, data: {...} }
  },

  // 📌 Cập nhật chuyến xe bằng PATCH (cần token)
  patchTransport: async (id, data) => {
    const res = await apiClient.patch(`/transports/${id}`, data);
    return res.data; // { success, message, data: {...} }
  },

  // 📌 Khôi phục chuyến xe đã xóa (cần token)
  restoreTransport: async (id) => {
    const res = await apiClient.put(`/transports/${id}/restore`);
    return res.data; // { success, message }
  },

  // 📌 Xóa chuyến xe (soft delete, cần token)
  deleteTransport: async (id) => {
    const res = await apiClient.delete(`/transports/${id}`);
    return res.data; // { success, message }
  },

  // 📌 Xóa vĩnh viễn chuyến xe (cần token)
  permanentDeleteTransport: async (id) => {
    const res = await apiClient.delete(`/transports/${id}/permanent`);
    return res.data; // { success, message }
  }
};

export default transportAPI;
