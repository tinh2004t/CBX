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

  // 📌 Cập nhật accommodation detail (admin)
  updateAccommodationDetail: async (id, data) => {
    const res = await apiClient.put(`/accommodation-details/${id}`, data);
    return res.data; // { success, message, data: {...} }
  },

  // 📌 Thêm room type (admin)
  addRoomType: async (id, data) => {
    const res = await apiClient.post(`/accommodation-details/${id}/room-types`, data);
    return res.data; // { success, message, data: {...} }
  },

  // 📌 Cập nhật room type (admin)
  updateRoomType: async (id, roomTypeId, data) => {
    const res = await apiClient.put(`/accommodation-details/${id}/room-types/${roomTypeId}`, data);
    return res.data; // { success, message, data: {...} }
  },

  // 📌 Xóa room type (admin)
  deleteRoomType: async (id, roomTypeId) => {
    const res = await apiClient.delete(`/accommodation-details/${id}/room-types/${roomTypeId}`);
    return res.data; // { success, message }
  },
};

export default accommodationDetailAPI;
