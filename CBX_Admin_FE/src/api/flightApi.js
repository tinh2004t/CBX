// src/api/flightApi.js
import apiClient from './client.js';

const flightAPI = {
  // =========================================================================
  // 📌 PUBLIC ROUTES
  // =========================================================================

  // Lấy tất cả chuyến bay (có filter, phân trang)
  getFlights: async (params = {}) => {
    const res = await apiClient.get('/flights', { params });
    return res.data;
  },

  // Tìm kiếm chuyến bay
  searchFlights: async (params = {}) => {
    const res = await apiClient.get('/flights/search', { params });
    return res.data;
  },

  // Lấy chuyến bay theo ID
  getFlightById: async (id) => {
    const res = await apiClient.get(`/flights/${id}`);
    return res.data;
  },

  // =========================================================================
  // 📌 SUB-FLIGHT ROUTES
  // =========================================================================

  // Lấy tất cả chuyến bay con theo flightId
  getSubFlights: async (flightId) => {
    const res = await apiClient.get(`/flights/${flightId}/subflights`);
    return res.data;
  },

  // Lấy chuyến bay con theo flightCode
  getSubFlightByCode: async (flightId, flightCode) => {
    const res = await apiClient.get(`/flights/${flightId}/subflights/${flightCode}`);
    return res.data;
  },

  // =========================================================================
  // 📌 ADMIN ROUTES (Cần đăng nhập)
  // =========================================================================

  // Lấy chuyến bay đã xóa mềm
  getDeletedFlights: async () => {
    const res = await apiClient.get('/flights/deleted');
    return res.data;
  },

  // Dọn dẹp chuyến bay cũ
  cleanupFlights: async () => {
    const res = await apiClient.post('/flights/cleanup');
    return res.data;
  },

  // Tạo chuyến bay
  createFlight: async (data) => {
    const res = await apiClient.post('/flights', data);
    return res.data;
  },

  // Cập nhật chuyến bay
  updateFlight: async (id, data) => {
    const res = await apiClient.put(`/flights/${id}`, data);
    return res.data;
  },

  // Xoá mềm chuyến bay
  softDeleteFlight: async (id) => {
    const res = await apiClient.delete(`/flights/${id}`);
    return res.data;
  },

  // Xoá vĩnh viễn chuyến bay
  deletePermanent: async (id) => {
    const res = await apiClient.delete(`/flights/${id}/permanent`);
    return res.data;
  },

  // Khôi phục chuyến bay đã xoá mềm
  restoreFlight: async (id) => {
    const res = await apiClient.post(`/flights/${id}/restore`);
    return res.data;
  },

  // =========================================================================
  // 📌 SUB-FLIGHT ADMIN ROUTES
  // =========================================================================

  // Thêm chuyến bay con
  addSubFlight: async (flightId, data) => {
    const res = await apiClient.post(`/flights/${flightId}/subflights`, data);
    return res.data;
  },

  // Cập nhật chuyến bay con
  updateSubFlight: async (flightId, flightCode, data) => {
    const res = await apiClient.put(`/flights/${flightId}/subflights/${flightCode}`, data);
    return res.data;
  },

  // Xoá chuyến bay con
  deleteSubFlight: async (flightId, flightCode) => {
    const res = await apiClient.delete(`/flights/${flightId}/subflights/${flightCode}`);
    return res.data;
  },

  // Cập nhật trạng thái chuyến bay con
  updateFlightStatus: async (flightId, flightCode, data) => {
    const res = await apiClient.patch(`/flights/${flightId}/subflights/${flightCode}/status`, data);
    return res.data;
  },
};

export default flightAPI;
