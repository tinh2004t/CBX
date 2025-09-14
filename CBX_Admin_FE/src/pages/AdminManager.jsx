import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';

const AdminManager = () => {
  // Dữ liệu mẫu cho danh sách admin
  const [admins, setAdmins] = useState([
    {
      _id: "68bd27dcb8725ed18c6f60e7",
      username: "tinh2004t",
      role: "SuperAdmin",
      createdAt: "2025-09-07T06:36:12.749Z",
      updatedAt: "2025-09-07T06:36:12.749Z"
    },
    {
      _id: "68bd27dcb8725ed18c6f60e8",
      username: "admin_user1",
      role: "Admin",
      createdAt: "2025-09-06T10:20:30.123Z",
      updatedAt: "2025-09-06T10:20:30.123Z"
    },
    {
      _id: "68bd27dcb8725ed18c6f60e9",
      username: "moderator1",
      role: "Moderator",
      createdAt: "2025-09-05T14:15:22.456Z",
      updatedAt: "2025-09-05T14:15:22.456Z"
    }
  ]);

  // User hiện tại (giả lập đăng nhập)
  const [currentUser] = useState({
    username: "tinh2004t",
    role: "SuperAdmin"
  });

  // States cho form
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Admin'
  });

  // Kiểm tra quyền SuperAdmin
  const isSuperAdmin = currentUser.role === 'SuperAdmin';

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
  const handleSubmit = () => {
    if (!formData.username.trim()) {
      alert('Vui lòng nhập tên đăng nhập');
      return;
    }

    if (!editingAdmin && !formData.password.trim()) {
      alert('Vui lòng nhập mật khẩu');
      return;
    }

    if (editingAdmin) {
      // Cập nhật admin
      setAdmins(prevAdmins => 
        prevAdmins.map(admin => 
          admin._id === editingAdmin._id 
            ? { 
                ...admin, 
                username: formData.username,
                role: formData.role,
                updatedAt: new Date().toISOString()
              }
            : admin
        )
      );
    } else {
      // Thêm admin mới
      const newAdmin = {
        _id: Date.now().toString(),
        username: formData.username,
        role: formData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setAdmins(prevAdmins => [...prevAdmins, newAdmin]);
    }

    resetForm();
  };

  // Xóa admin
  const handleDelete = (adminId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa admin này?')) {
      setAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== adminId));
    }
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Admin</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Đang đăng nhập với tư cách:</span>
            <span className="font-semibold text-gray-900">{currentUser.username}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(currentUser.role)}`}>
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        {isSuperAdmin && (
          <div className="mb-6">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Thêm Admin Mới
            </button>
          </div>
        )}

        {/* Admin List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách Admin ({admins.length})</h2>
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
                  {isSuperAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
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
                    {isSuperAdmin && (
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
                            onClick={() => handleDelete(admin._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingAdmin ? 'Chỉnh sửa Admin' : 'Thêm Admin Mới'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đăng nhập *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={editingAdmin ? "Để trống nếu không đổi mật khẩu" : "Nhập mật khẩu"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Save size={16} />
                    {editingAdmin ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
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

export default AdminManager;