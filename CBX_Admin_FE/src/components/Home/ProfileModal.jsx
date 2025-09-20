import React, { useState, useEffect } from "react";
import authAPI from "../../api/auth";

const ProfileModal = ({ isOpen, onClose }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // state cho đổi mật khẩu
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadUserInfo();
    }
  }, [isOpen]);

  const loadUserInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const userData = authAPI.getUserFromStorage();
      setUserInfo(userData);
    } catch (err) {
      console.error("Error loading user info:", err);
      setError("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      SuperAdmin: "Super Admin",
      Admin: "Admin",
      Editor: "Editor",
      Viewer: "Viewer",
    };
    return roleMap[role] || role || "User";
  };

  const handleChangePassword = async () => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    setError("Vui lòng nhập đầy đủ thông tin");
    return;
  }
  if (newPassword !== confirmPassword) {
    setError("Mật khẩu mới không khớp");
    return;
  }

  // 👉 Check token trước khi gọi API
  if (!authAPI.getToken()) {
    setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await authAPI.changePassword(oldPassword, newPassword);
    if (res.success) {
      setSuccess("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Khuyến nghị: logout để đăng nhập lại
      // await authAPI.logout();
      // điều hướng về trang login nếu muốn
    } else {
      setError(res.message || "Đổi mật khẩu thất bại");
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-5 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Thông tin tài khoản
              </h3>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">
                {success}
              </div>
            )}

            {/* User Info */}
            {!loading && userInfo && (
              <div className="space-y-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  alt="Avatar"
                  className="mx-auto w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                />

                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {userInfo.username}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Vai trò</p>
                  <p className="text-base font-semibold text-blue-600">
                    {getRoleDisplayName(userInfo.role)}
                  </p>
                </div>

                {/* Change password form */}
                <div className="space-y-3 text-left">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Đổi mật khẩu
                  </h4>
                  <input
                    type="password"
                    placeholder="Mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:w-auto"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
