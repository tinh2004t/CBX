// src/api/transportApi.js
import apiClient from './client.js';

const transportAPI = {
  // ================= PUBLIC ROUTES =================

  // 📌 Lấy danh sách tất cả chuyến xe với filter & search
  getAllTransports: async (params = {}) => {
    // Lọc bỏ các params undefined/null/empty
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const res = await apiClient.get('/transports', { params: cleanParams });
    return res.data;
  },

  // 📌 Tìm kiếm chuyến xe theo tuyến đường
  searchByRoute: async (params = {}) => {
    const res = await apiClient.get('/transports/search/route', { params });
    return res.data; // { success, data: [...], pagination: {...} }
  },


  // 📌 Lấy thông tin một chuyến xe theo slug (public)
  getTransportBySlug: async (slug) => {
    const res = await apiClient.get(`/transports/slug/${slug}`);
    return res.data; // { success, data: {...} }
  },
};

export default transportAPI;
