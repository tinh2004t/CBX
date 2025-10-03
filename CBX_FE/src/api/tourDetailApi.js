// src/api/tourDetailApi.js
import apiClient from './client.js';

const tourDetailAPI = {
  // 📌 Lấy TourDetail bằng slug (public, cho frontend user)
  getTourDetailBySlug: async (slug) => {
    const res = await apiClient.get(`/tour/${slug}`);
    return res.data; // { success, data: {...TourDetail} }
  },

  // 📌 Lấy TourDetail trực tiếp bằng ID (admin)
  getTourDetailById: async (id) => {
    const res = await apiClient.get(`/tour/direct/${id}`);
    return res.data; // { success, data: {...TourDetail} }
  },
};

export default tourDetailAPI;
