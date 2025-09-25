// src/api/tourDetail.js
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

  // 📌 Cập nhật TourDetail trực tiếp bằng ID
  updateTourDetail: async (id, data) => {
    const res = await apiClient.put(`/tour/${id}`, data);
    return res.data; // { success, message, data: {...} }
  },

  // 📌 Cập nhật TourDetail bằng ID của DomesticTour
  updateTourDetailByTourId: async (tourId, data) => {
    const res = await apiClient.put(`/tour/by-tour/${tourId}`, data);
    return res.data; // { success, message, data: {...} }
  },
};

export default tourDetailAPI;
