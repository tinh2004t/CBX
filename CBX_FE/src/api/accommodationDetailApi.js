// src/api/accommodationDetail.js
import apiClient from './client.js';

const accommodationDetailAPI = {
  // 📌 Lấy tất cả accommodation details
  getAllAccommodationDetails: async (params = {}) => {
    const res = await apiClient.get('/accommodation-details', { params });
    return res.data; // { success, data: [...], pagination: {...} }
  },

  // 📌 Lấy accommodation detail theo slug (public)
  getAccommodationDetailBySlug: async (slug) => {
    const res = await apiClient.get(`/accommodation-details/slug/${slug}`);
    return res.data; // { success, data: {...} }
  },

  // 📌 Lấy accommodation detail theo ID (admin)
  getAccommodationDetailById: async (id) => {
    const res = await apiClient.get(`/accommodation-details/${id}`);
    return res.data; // { success, data: {...} }
  },
};

export default accommodationDetailAPI;
