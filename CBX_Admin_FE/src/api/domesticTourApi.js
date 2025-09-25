// src/api/domesticTour.js
import apiClient from './client.js';

const domesticTourAPI = {
  // 📌 Tạo tour mới
  createTour: async (data) => {
    const res = await apiClient.post('/tour-noi-dia', data);
    return res.data; // { success, message, tour }
  },

  // 📌 Lấy danh sách tour
  getTours: async (params = {}) => {
    const res = await apiClient.get('/tour-noi-dia', { params });
    return res.data; // { success, data: [...], pagination: {...} }
  },

  // 📌 Lấy chi tiết tour theo ID
  getTourById: async (id) => {
    const res = await apiClient.get(`/tour-noi-dia/${id}`);
    return res.data;
  },

  // 📌 Lấy chi tiết tour theo slug
  getTourBySlug: async (slug) => {
    const res = await apiClient.get(`/tour-noi-dia/slug/${slug}`);
    return res.data;
  },

  // 📌 Lấy tour theo vùng miền
  getToursByRegion: async (region) => {
    const res = await apiClient.get(`/tour-noi-dia/region/${region}`);
    return res.data;
  },

  // 📌 Cập nhật tour theo ID
  updateTour: async (id, data) => {
    const res = await apiClient.put(`/tour-noi-dia/${id}`, data);
    return res.data;
  },

  // 📌 Xoá mềm tour
  softDeleteTour: async (id) => {
    const res = await apiClient.delete(`/tour-noi-dia/${id}`);
    return res.data;
  },

  // 📌 Xoá vĩnh viễn tour
  permanentDeleteTour: async (id) => {
    const res = await apiClient.delete(`/tour-noi-dia/${id}/permanent`);
    return res.data;
  },

  // 📌 Khôi phục tour đã xoá
  restoreTour: async (id) => {
    const res = await apiClient.post(`/tour-noi-dia/${id}/restore`);
    return res.data;
  },

  // 📌 Lấy danh sách tour đã xoá
  getDeletedTours: async (params = {}) => {
    const res = await apiClient.get('/tour-noi-dia/deleted', { params });
    return res.data;
  },

  // 📌 Cleanup các tour đã xoá lâu ngày
  runCleanup: async () => {
    const res = await apiClient.post('/tour-noi-dia/cleanup');
    return res.data;
  },

  // 📌 Lấy thống kê tour
  getStats: async () => {
    const res = await apiClient.get('/tour-noi-dia/stats/summary');
    return res.data;
  },
};

export default domesticTourAPI;
