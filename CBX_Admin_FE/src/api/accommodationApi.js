// src/api/accommodation.js
import apiClient from './client.js';

const accommodationAPI = {
  // 📌 Lấy tất cả accommodations (public)
  getAllAccommodations: async (params = {}) => {
    const res = await apiClient.get('/accommodations', { params });
    return res.data; // { success, data: [...], pagination: {...} }
  },

  // 📌 Lấy accommodation theo slug (public)
  getAccommodationBySlug: async (slug) => {
    const res = await apiClient.get(`/accommodations/${slug}`);
    return res.data; // { success, data: {...} }
  },

  // 📌 Tạo accommodation (admin)
  createAccommodation: async (data) => {
    const res = await apiClient.post('/accommodations', data);
    return res.data; // { success, message, data: {...} }
  },

  // 📌 Cập nhật accommodation (admin)
  updateAccommodation: async (id, data) => {
    const res = await apiClient.put(`/accommodations/${id}`, data);
    return res.data; // { success, message, data: {...} }
  },

  // 📌 Xóa mềm accommodation (admin)
  deleteAccommodation: async (id) => {
    const res = await apiClient.delete(`/accommodations/${id}`);
    return res.data; // { success, message }
  },

  // 📌 Xóa vĩnh viễn accommodation (admin)
  permanentDeleteAccommodation: async (id) => {
    const res = await apiClient.delete(`/accommodations/${id}/permanent`);
    return res.data; // { success, message }
  },

  // 📌 Khôi phục accommodation đã xóa (admin)
  restoreAccommodation: async (id) => {
    const res = await apiClient.patch(`/accommodations/${id}/restore`);
    return res.data; // { success, message, data: {...} }
  },

  // 📌 Dọn dẹp dữ liệu đã xóa lâu (admin)
  cleanupOldDeleted: async () => {
    const res = await apiClient.post('/accommodations/cleanup');
    return res.data; // { success, message }
  },

  // 📌 Lấy danh sách accommodation đã xóa (admin)
  getDeletedAccommodations: async (params = {}) => {
    const res = await apiClient.get('/accommodations/deleted', { params });
    return res.data; // { success, data: [...], pagination: {...} }
  },

  // 📌 Lấy accommodation theo loại (public)
  getAccommodationsByType: async (type, params = {}) => {
    const res = await apiClient.get(`/accommodations/type/${type}`, { params });
    return res.data; // { success, data: [...] }
  },
};

export default accommodationAPI;
