// src/api/teamBuildingApi.js
import apiClient from './client.js';

const teamBuildingAPI = {
  // 📌 Lấy tất cả team building services (public)
  getAllTeamBuildingServices: async (params = {}) => {
    const res = await apiClient.get('/team-building', { params });
    return res.data; // { success, data: [...], pagination?: {...} }
  },

  // 📌 Lấy team building service theo ID (cần token)
  getTeamBuildingServiceById: async (id) => {
    const res = await apiClient.get(`/team-building/${id}`);
    return res.data; // { success, data: {...} }
  },

  // 📌 Cập nhật team building service (cần token, admin)
  updateTeamBuildingService: async (id, data) => {
    const res = await apiClient.put(`/team-building/${id}`, data);
    return res.data; // { success, message, data: {...} }
  },
};

export default teamBuildingAPI;
