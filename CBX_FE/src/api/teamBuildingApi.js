// src/api/teamBuildingApi.js
import apiClient from './client.js';

const teamBuildingAPI = {
  // 📌 Lấy tất cả team building services (public)
  getAllTeamBuildingServices: async (params = {}) => {
    const res = await apiClient.get('/team-building', { params });
    return res.data; // { success, data: [...], pagination?: {...} }
  },


};

export default teamBuildingAPI;
