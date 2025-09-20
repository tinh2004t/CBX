// src/api/auth.js
import apiClient from './client.js';

const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, user } = response.data.data || {};

    if (!token || !user) throw new Error('Phản hồi đăng nhập không hợp lệ');

    // 👉 Lưu token vào localStorage
    localStorage.setItem('authToken', token);

    // 👉 user chỉ lưu username & role
    const minimalUser = { username: user.username, role: user.role };
    localStorage.setItem('user', JSON.stringify(minimalUser));

    return { success: true, user: minimalUser };
  },

  logout: async () => {
    try { await apiClient.post('/auth/logout'); } catch (_) {}
    finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    return { success: true };
  },

  changePassword: async (oldPassword, newPassword) => {
    const res = await apiClient.post('/auth/change-password', { oldPassword, newPassword });
    return res.data;
  },

  getUserFromStorage: () => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },

  getToken: () => localStorage.getItem('authToken'),
   // 📌 Lấy danh sách tất cả users (SuperAdmin only)
  getAllUsers: async () => {
    const res = await apiClient.get('/auth/users');
    return res.data; // [{id, username, role, createdAt, ...}]
  },

  // 📌 Tạo tài khoản mới (SuperAdmin only)
  createAccount: async (accountData) => {
    const res = await apiClient.post('/auth/create-account', accountData);
    return res.data; // {success, message, user}
  },

  // 📌 Cập nhật user (bạn cần thêm route ở backend, ví dụ PUT /auth/users/:id)
  updateAccount: async (id, accountData) => {
    const res = await apiClient.put(`/auth/users/${id}`, accountData);
    return res.data;
  },

  // 📌 Xoá user (bạn cần thêm route ở backend, ví dụ DELETE /auth/users/:id)
  deleteAccount: async (id) => {
    const res = await apiClient.delete(`/auth/users/${id}`);
    return res.data;
  }
};

export default authAPI;
