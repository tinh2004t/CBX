// src/api/adminLog.js
import apiClient from './client.js';

const adminLogAPI = {
  // 📌 Lấy danh sách log (SuperAdmin only)
  getLogs: async (params = {}) => {
    // params có thể chứa { page, limit, adminId, action }
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/admin-logs?${query}` : '/admin-logs';

    const res = await apiClient.get(endpoint);
    return res.data; 
    /*
      {
        success: true,
        data: [...logs],
        pagination: { total, page, limit }
      }
    */
  },

  // 📌 Lấy chi tiết log theo ID
  getLogById: async (id) => {
    const res = await apiClient.get(`/admin-logs/${id}`);
    return res.data; // {success, data: {...}}
  },


};

export default adminLogAPI;
