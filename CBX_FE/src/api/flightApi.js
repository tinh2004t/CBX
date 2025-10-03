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
  // 📌 ADMIN ROUTES (GET)
  // =========================================================================

  // Lấy chuyến bay đã xóa mềm
  getDeletedFlights: async () => {
    const res = await apiClient.get('/flights/deleted');
    return res.data;
  },
};

export default flightAPI;
