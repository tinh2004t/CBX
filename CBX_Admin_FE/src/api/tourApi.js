// src/api/TourApi.js
import apiClient from './client.js';

const tourAPI = {
  // =========================================================================
  // 📌 PUBLIC ROUTES
  // =========================================================================

  // Lấy tất cả tours (có filter, phân trang)
  getTours: async (params = {}) => {
    const res = await apiClient.get('/tours', { params });
    return res.data;
  },

  // Lấy tour phổ biến
  getPopularTours: async () => {
    const res = await apiClient.get('/tours/popular');
    return res.data;
  },

  // Lấy tour nổi bật
  getFeaturedTours: async () => {
    const res = await apiClient.get('/tours/featured');
    return res.data;
  },

  // Tìm kiếm nâng cao
  advancedSearch: async (params = {}) => {
    const res = await apiClient.get('/tours/search/advanced', { params });
    return res.data;
  },

  // Lấy thống kê tổng quan
  getStats: async () => {
    const res = await apiClient.get('/tours/stats/summary');
    return res.data;
  },

  // Lấy tour theo loại (domestic / oversea / mice)
  getToursByType: async (tourType) => {
    const res = await apiClient.get(`/tours/type/${tourType}`);
    return res.data;
  },

  // Lấy tour domestic theo vùng miền
  getToursByRegion: async (region) => {
    const res = await apiClient.get(`/tours/region/${region}`);
    return res.data;
  },

  // Lấy tour oversea theo châu lục
  getToursByContinent: async (continent) => {
    const res = await apiClient.get(`/tours/continent/${continent}`);
    return res.data;
  },

  // Lấy tour MICE theo category
  getMiceToursByCategory: async (category) => {
    const res = await apiClient.get(`/tours/mice/category/${category}`);
    return res.data;
  },

  // Lấy tour MICE theo location
  getMiceToursByLocation: async (location) => {
    const res = await apiClient.get(`/tours/mice/location/${location}`);
    return res.data;
  },

  // Lấy tour domestic theo điểm khởi hành
  getDomesticToursByDeparture: async (departure) => {
    const res = await apiClient.get(`/tours/domestic/departure/${departure}`);
    return res.data;
  },

  // Lấy tour oversea theo hãng hàng không
  getOverseaToursByAirline: async (airline) => {
    const res = await apiClient.get(`/tours/oversea/airline/${airline}`);
    return res.data;
  },

  // Lấy tour theo slug
  getTourBySlug: async (slug) => {
    const res = await apiClient.get(`/tours/slug/${slug}`);
    return res.data;
  },

  // Lấy tour theo ID
  getTourById: async (id) => {
    const res = await apiClient.get(`/tours/${id}`);
    return res.data;
  },

  // =========================================================================
  // 📌 PROTECTED ROUTES (User đã đăng nhập)
  // =========================================================================

  // Thêm review cho tour
  addReview: async (id, data) => {
    const res = await apiClient.post(`/tours/${id}/review`, data);
    return res.data;
  },

  // =========================================================================
  // 📌 ADMIN ROUTES (SuperAdmin/Admin)
  // =========================================================================

  // Tạo tour mới
  createTour: async (data) => {
    const res = await apiClient.post('/tours', data);
    return res.data;
  },

  // Cập nhật tour
  updateTour: async (id, data) => {
    const res = await apiClient.put(`/tours/${id}`, data);
    return res.data;
  },

  // Soft delete tour
  softDeleteTour: async (id) => {
    const res = await apiClient.delete(`/tours/${id}`);
    return res.data;
  },

  // Khôi phục tour đã xoá
  restoreTour: async (id) => {
    const res = await apiClient.post(`/tours/${id}/restore`);
    return res.data;
  },

  // Xoá vĩnh viễn tour
  permanentDeleteTour: async (id) => {
    const res = await apiClient.delete(`/tours/${id}/permanent`);
    return res.data;
  },

  // Lấy danh sách tour đã xoá
  getDeletedTours: async (params = {}) => {
    const res = await apiClient.get('/tours/admin/deleted', { params });
    return res.data;
  },

  // Cleanup tour đã xoá quá 30 ngày
  runCleanup: async () => {
    const res = await apiClient.post('/tours/admin/cleanup');
    return res.data;
  },

  // Debug tour status (chỉ khi DEV)
  debugTourStatus: async (id) => {
    const res = await apiClient.get(`/tours/debug/${id}`);
    return res.data;
  },
};

export default tourAPI;
