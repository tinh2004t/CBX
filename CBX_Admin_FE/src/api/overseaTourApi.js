// src/api/overseaTour.js
import apiClient from './client.js';

const overseaTourAPI = {
  // 📌 Tạo tour mới
  createTour: async (data) => {
    const res = await apiClient.post('/tour-quoc-te', data);
    return res.data; // { success, message, tour }
  },

  // 📌 Lấy danh sách tour
  getTours: async (params = {}) => {
    const res = await apiClient.get('/tour-quoc-te', { params });
    return res.data; // { success, data: [...], pagination: {...} }
  },

  // 📌 Lấy chi tiết tour theo ID
  getTourById: async (id) => {
    const res = await apiClient.get(`/tour-quoc-te/${id}`);
    return res.data;
  },

  // 📌 Lấy chi tiết tour theo slug
  getTourBySlug: async (slug) => {
    const res = await apiClient.get(`/tour-quoc-te/slug/${slug}`);
    return res.data;
  },

  // 📌 Lấy tour theo châu lục
  getToursByContinent: async (continent) => {
    const res = await apiClient.get(`/tour-quoc-te/continent/${continent}`);
    return res.data;
  },

  // 📌 Cập nhật tour theo ID
  updateTour: async (id, data) => {
    const res = await apiClient.put(`/tour-quoc-te/${id}`, data);
    return res.data;
  },

  // 📌 Xoá mềm tour
  softDeleteTour: async (id) => {
    const res = await apiClient.delete(`/tour-quoc-te/${id}`);
    return res.data;
  },

  // 📌 Xoá vĩnh viễn tour
  permanentDeleteTour: async (id) => {
    const res = await apiClient.delete(`/tour-quoc-te/${id}/permanent`);
    return res.data;
  },

  // 📌 Khôi phục tour đã xoá
  restoreTour: async (id) => {
    const res = await apiClient.post(`/tour-quoc-te/${id}/restore`);
    return res.data;
  },

  // 📌 Lấy danh sách tour đã xoá
  getDeletedTours: async (params = {}) => {
    const res = await apiClient.get('/tour-quoc-te/deleted', { params });
    return res.data;
  },

  // 📌 Cleanup các tour đã xoá lâu ngày
  runCleanup: async () => {
    const res = await apiClient.post('/tour-quoc-te/cleanup');
    return res.data;
  },

  // 📌 Lấy thống kê tour
  getStats: async () => {
    const res = await apiClient.get('/tour-quoc-te/stats/summary');
    return res.data;
  },
};

export default overseaTourAPI;
