import { useState } from 'react';
import { Settings, Edit, Save, X, Phone, Mail, MapPin, Facebook, Image, Calendar } from 'lucide-react';

const TravelSettingsPage = () => {
  // Dữ liệu mẫu
  const [settings, setSettings] = useState({
    _id: "68bbd191776872470a508d77",
    bannerImage: "um ba la",
    footerImage: "sdasd",
    logoImage: "sdfdf",
    hotline: "123131",
    email: "jsdisfd",
    address: "ádasd",
    fbLink: "sadad",
    updatedAt: "2025-09-12T08:37:27.798Z"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState({...settings});
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setEditedSettings({...settings});
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSettings({...editedSettings, updatedAt: new Date().toISOString()});
      setIsEditing(false);
      setIsLoading(false);
      // Có thể thêm toast notification ở đây
    }, 1000);
  };

  const handleCancel = () => {
    setEditedSettings({...settings});
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const settingsFields = [
    { key: 'logoImage', label: 'Logo Website', icon: Image, type: 'text' },
    { key: 'bannerImage', label: 'Hình Banner', icon: Image, type: 'text' },
    { key: 'footerImage', label: 'Hình Footer', icon: Image, type: 'text' },
    { key: 'hotline', label: 'Số Hotline', icon: Phone, type: 'tel' },
    { key: 'email', label: 'Email Liên Hệ', icon: Mail, type: 'email' },
    { key: 'address', label: 'Địa Chỉ', icon: MapPin, type: 'text' },
    { key: 'fbLink', label: 'Link Facebook', icon: Facebook, type: 'url' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">Cài Đặt Website</h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Quản lý thông tin cấu hình website du lịch</p>
                <p className="text-xs text-gray-600 sm:hidden">Quản lý cấu hình website</p>
              </div>
            </div>
            <button
              onClick={handleEdit}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
            >
              <Edit className="h-4 w-4" />
              <span className="sm:inline">Chỉnh Sửa</span>
            </button>
          </div>
        </div>

        {/* Settings Display */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {settingsFields.map(({ key, label, icon: Icon }) => (
              <div key={key} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <label className="font-medium sm:font-semibold text-gray-700 text-sm sm:text-base truncate">{label}</label>
                </div>
                <div className="bg-gray-50 rounded-md p-2 sm:p-3">
                  <p className="text-gray-800 break-words text-sm sm:text-base">{settings[key] || 'Chưa có dữ liệu'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Last Updated */}
          <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="font-medium">Cập nhật lần cuối:</span>
              </div>
              <span className="sm:ml-0 ml-5">{formatDate(settings.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-5xl my-4 sm:my-0 max-h-full sm:max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="bg-blue-600 text-white p-4 sm:p-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Chỉnh Sửa Cài Đặt</h2>
                  <button
                    onClick={handleCancel}
                    className="p-1 sm:p-2 hover:bg-blue-700 rounded-lg transition-colors duration-200 flex-shrink-0"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {settingsFields.map(({ key, label, icon: Icon, type }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <label className="font-medium text-gray-700 text-sm sm:text-base">{label}</label>
                      </div>
                      <input
                        type={type}
                        value={editedSettings[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base"
                        placeholder={`Nhập ${label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base order-2 sm:order-1"
                    disabled={isLoading}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl max-w-sm w-full mx-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm sm:text-base">Đang cập nhật cài đặt...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelSettingsPage;