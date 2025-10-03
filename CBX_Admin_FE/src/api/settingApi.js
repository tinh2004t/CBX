// src/api/settingApi.js
import apiClient from './client.js';

const settingAPI = {
  // 📌 Lấy thông tin settings (admin)
  getSettings: async () => {
    const res = await apiClient.get('/settings');
    return res.data; // { success, data: {...settings} }
  },

  // 📌 Cập nhật settings (admin)
  updateSettings: async (data) => {
    const res = await apiClient.put('/settings', data);
    return res.data; // { success, message, data: {...updatedSettings} }
  },
};

export default settingAPI;
