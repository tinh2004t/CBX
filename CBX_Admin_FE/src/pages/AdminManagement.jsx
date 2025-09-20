import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Eye, EyeOff, RefreshCw } from 'lucide-react';
import authAPI from '../api/auth';

const AdminManagement = () => {
  // States
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser] = useState(authAPI.getUserFromStorage());

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Admin'
  });

  // Error và success states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Kiểm tra quyền SuperAdmin
  const isSuperAdmin = currentUser?.role === 'SuperAdmin';

  // Load danh sách admins khi component mount
  useEffect(() => {
    if (isSuperAdmin) {
      loadAdmins();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  // Tự động ẩn thông báo sau 5 giây
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Load danh sách admins từ API
  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.getAllUsers();
      
      console.log('API Response:', response); // Debug log
      
      if (response.success) {
        // Backend trả về { success: true, data: { users: [...] } }
        const adminsList = response.data?.users || response.users || response.data || [];
        
        // Đảm bảo adminsList là một array
        if (Array.isArray(adminsList)) {
          setAdmins(adminsList);
        } else {
          console.error('Admins data is not an array:', adminsList);
          setAdmins([]);
          setError('Dữ liệu không hợp lệ từ server');
        }
      } else {
        setError(response.message || 'Không thể tải danh sách admin');
        setAdmins([]); // Reset về array rỗng
      }
    } catch (err) {
      console.error('Load admins error:', err);
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách admin');
      setAdmins([]); // Reset về array rỗng khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'Admin'
    });
    setEditingAdmin(null);
    setShowForm(false);
    setShowPassword(false);
    setError('');
    setSuccess('');
  };

  // Mở form thêm mới
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Mở form chỉnh sửa
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      password: '',
      role: admin.role
    });
    setShowForm(true);
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    // Validation
    if (!formData.username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }

    if (!editingAdmin && !formData.password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    if (formData.username.length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      if (editingAdmin) {
        // Cập nhật admin
        const updateData = {
          username: formData.username.trim(),
          role: formData.role
        };

        // Chỉ gửi password nếu có nhập
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }

        const response = await authAPI.updateAccount(editingAdmin._id, updateData);
        
        if (response.success) {
          // Cập nhật trong danh sách local hoặc refresh từ API
          if (response.user) {
            setAdmins(prevAdmins => {
              const currentAdmins = Array.isArray(prevAdmins) ? prevAdmins : [];
              return currentAdmins.map(admin => 
                admin._id === editingAdmin._id 
                  ? { 
                      ...admin, 
                      username: response.user.username || formData.username.trim(),
                      role: response.user.role || formData.role,
                      updatedAt: response.user.updatedAt || new Date().toISOString()
                    }
                  : admin
              );
            });
          } else {
            // Nếu API không trả về user data, refresh lại danh sách
            await loadAdmins();
          }
          setSuccess(response.message || 'Cập nhật admin thành công!');
        } else {
          setError(response.message || 'Có lỗi xảy ra khi cập nhật');
        }
      } else {
        // Thêm admin mới
        const createData = {
          username: formData.username.trim(),
          password: formData.password,
          role: formData.role
        };

        const response = await authAPI.createAccount(createData);
        
        if (response.success) {
          // Thêm vào danh sách local hoặc refresh từ API
          if (response.user) {
            setAdmins(prevAdmins => {
              const currentAdmins = Array.isArray(prevAdmins) ? prevAdmins : [];
              return [...currentAdmins, response.user];
            });
          } else {
            // Nếu API không trả về user data, refresh lại danh sách
            await loadAdmins();
          }
          setSuccess(response.message || 'Thêm admin mới thành công!');
        } else {
          setError(response.message || 'Có lỗi xảy ra khi tạo tài khoản');
        }
      }

      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa admin
  const handleDelete = async (adminId, adminUsername) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa admin "${adminUsername}"?`)) {
      return;
    }

    try {
      setError('');
      const response = await authAPI.deleteAccount(adminId);
      
      if (response.success) {
        setAdmins(prevAdmins => {
          const currentAdmins = Array.isArray(prevAdmins) ? prevAdmins : [];
          return currentAdmins.filter(admin => admin._id !== adminId);
        });
        setSuccess(response.message || 'Xóa admin thành công!');
      } else {
        setError(response.message || 'Có lỗi xảy ra khi xóa');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa admin');
    }
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
  };

  // Format ngày tháng cho mobile (ngắn gọn hơn)
  const formatDateMobile = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Lấy màu cho role
  const getRoleColor = (role) => {
    switch (role) {
      case 'SuperAdmin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Moderator':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Nếu không phải SuperAdmin
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quản lý Admin</h1>
            <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        

        {/* Error và Success Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Action buttons */}
        <div className="mb-4 sm:mb-6 flex gap-3">
          <button
            onClick={handleAddNew}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span>Thêm Admin Mới</span>
          </button>
          
          <button
            onClick={loadAdmins}
            disabled={loading}
            className="border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 px-4 py-3 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách admin...</p>
          </div>
        ) : (
          <>
            {/* Admin List - Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Danh sách Admin ({Array.isArray(admins) ? admins.length : 0})</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên đăng nhập
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vai trò
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cập nhật lần cuối
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(admins) && admins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{admin.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(admin.role)}`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(admin.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(admin.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(admin)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(admin._id, admin.username)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!Array.isArray(admins) || admins.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  {!Array.isArray(admins) ? 'Lỗi tải dữ liệu' : 'Chưa có admin nào trong hệ thống.'}
                </div>
              )}
            </div>

            {/* Admin List - Mobile Cards */}
            <div className="lg:hidden space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Danh sách Admin ({Array.isArray(admins) ? admins.length : 0})</h2>
              </div>
              
              {!Array.isArray(admins) || admins.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                  {!Array.isArray(admins) ? 'Lỗi tải dữ liệu' : 'Chưa có admin nào trong hệ thống.'}
                </div>
              ) : (
                admins.map((admin) => (
                  <div key={admin._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{admin.username}</h3>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(admin.role)}`}>
                          {admin.role}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(admin._id, admin.username)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Ngày tạo:</span>
                        <span>{formatDateMobile(admin.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cập nhật:</span>
                        <span>{formatDateMobile(admin.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingAdmin ? 'Chỉnh sửa Admin' : 'Thêm Admin Mới'}
                </h3>
                <button
                  onClick={resetForm}
                  disabled={submitting}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-4 sm:px-6 py-4 space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đăng nhập *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    disabled={submitting}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm disabled:bg-gray-100"
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu {!editingAdmin && '*'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      disabled={submitting}
                      className="w-full px-3 py-3 sm:py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm disabled:bg-gray-100"
                      placeholder={editingAdmin ? "Để trống nếu không đổi mật khẩu" : "Nhập mật khẩu"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={submitting}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    disabled={submitting}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-sm disabled:bg-gray-100"
                  >
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {editingAdmin ? 'Đang cập nhật...' : 'Đang tạo...'}
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {editingAdmin ? 'Cập nhật' : 'Thêm mới'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetForm}
                    disabled={submitting}
                    className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;