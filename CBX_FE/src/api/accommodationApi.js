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
