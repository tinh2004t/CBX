// src/api/settingApi.js
import apiClient from './client.js';

const settingAPI = {
  // 📌 Lấy thông tin settings (admin)
  getSettings: async () => {
    const res = await apiClient.get('/settings');
    return res.data; // { success, data: {...settings} }
  },
};

export default settingAPI;
