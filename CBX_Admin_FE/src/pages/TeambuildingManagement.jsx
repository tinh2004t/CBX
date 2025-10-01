import React, { useState } from 'react';
import { Edit2, Save, X, Star, MapPin, Phone, Mail, Eye, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import teamBuildingAPI from '../api/teamBuildingApi'; // Điều chỉnh đường dẫn cho phù hợp

const TeambuildingManagement = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceId, setServiceId] = useState(null); // ID của service đang quản lý
  const [editData, setEditData] = useState({
    service: {
      id: 1,
      title: "Tổ chức Team Building & Gala Dinner",
      rating: 4.8,
      reviewCount: 156,
      viewCount: 2341,
      price: "Liên hệ",
      location: "Hà Nội, Hồ Chí Minh",
      description: "Tổ chức g."
    },
    contact: {
      phone: "024 36760 888",
      email: "dulichcanhbuomxanh@gmail.com",
      address: "123 Đường ABC, Quận 1, TP.HCM"
    },
    images: [
      "https://dulichviet.com.vn/images/bandidau/images/Khach-Doan/Slide-400/a10-du-lich-viet.jpg",
      "https://dulichviet.com.vn/images/bandidau/images/Khach-Doan/Slide-400/a10-du-lich-viet.jpg",
      "https://dulichviet.com.vn/images/bandidau/images/Khach-Doan/Slide-400/a10-du-lich-viet.jpg",
      "https://dulichviet.com.vn/images/bandidau/images/Khach-Doan/Slide-400/a10-du-lich-viet.jpg",
      "https://dulichviet.com.vn/images/bandidau/images/Khach-Doan/Slide-400/a10-du-lich-viet.jpg"
    ],
    teamBuilding: {
      definition: "Team building là hoạt động tập thể nhằm tăng cường sự gắn kết, hợp tác và hiểu biết lẫn nhau giữa các thành viên trong tổ chức.",
      roles: [
        "Tăng cường tinh thần đoàn kết",
        "Cải thiện kỹ năng giao tiếp",
        "Phát triển khả năng làm việc nhóm",
        "Giảm stress và tạo động lực làm việc"
      ],
      types: [
        {
          name: "Team Building Ngoài Trời",
          description: "Các hoạt động thể thao, trò chơi ngoài trời"
        },
        {
          name: "Team Building Trong Nhà",
          description: "Các trò chơi trí tuệ, workshop"
        },
        {
          name: "Gala Dinner",
          description: "Tiệc tối trang trọng kết hợp entertainment"
        }
      ]
    },
    updatedAt: new Date()
  });

  useEffect(() => {
    fetchTeamBuildingData();
  }, []); // Chạy 1 lần khi component mount


  // Hàm lấy dữ liệu từ API
  const fetchTeamBuildingData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await teamBuildingAPI.getAllTeamBuildingServices();

      console.log('API Response:', response);

      if (response.success && response.data && response.data.length > 0) {
        // Lấy phần tử đầu tiên trong mảng
        const item = response.data[0];

        setEditData({
          service: {
            id: item._id,
            title: item.service.title,
            rating: item.service.rating,
            reviewCount: item.service.reviewCount,
            viewCount: item.service.viewCount,
            price: item.service.price,
            location: Array.isArray(item.service.location)
              ? item.service.location.join(', ')
              : item.service.location,
            description: item.service.description || ""
          },
          contact: {
            phone: item.contact.phone,
            email: item.contact.email,
            address: item.contact.address
          },
          images: item.images || [],
          teamBuilding: {
            definition: item.teamBuilding.definition,
            roles: item.teamBuilding.roles,
            types: item.teamBuilding.types
          },
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date()
        });

        // Lưu serviceId để dùng cho update
        setServiceId(item._id);
      }
    } catch (err) {
      console.error('Error fetching team building data:', err);
      setError(err.response?.data?.message || 'Không thể tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Chuẩn bị dữ liệu với cấu trúc đúng
      const dataToUpdate = {
        service: {
          title: editData.service.title,
          rating: editData.service.rating,
          location: editData.service.location.split(',').map(loc => loc.trim()), // Convert string về array
          price: editData.service.price,
          description: editData.service.description,
          reviewCount: editData.service.reviewCount,
          viewCount: editData.service.viewCount
        },
        contact: editData.contact,
        images: editData.images,
        teamBuilding: editData.teamBuilding
      };

      console.log('Data to send:', dataToUpdate); // Debug

      const response = await teamBuildingAPI.updateTeamBuildingService(serviceId, dataToUpdate);

      if (response.success) {
        setIsEditing(false);
        setEditData(prev => ({ ...prev, updatedAt: new Date() }));
        alert('Cập nhật thành công!');

        // Tải lại dữ liệu mới từ server
        await fetchTeamBuildingData(serviceId);
      }
    } catch (err) {
      console.error('Error saving data:', err);
      setError(err.response?.data?.message || 'Không thể lưu dữ liệu');
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể lưu dữ liệu'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset data nếu cần
  };

  const updateService = (field, value) => {
    setEditData(prev => ({
      ...prev,
      service: {
        ...prev.service,
        [field]: value
      }
    }));
  };

  const updateContact = (field, value) => {
    setEditData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const updateTeamBuilding = (field, value) => {
    setEditData(prev => ({
      ...prev,
      teamBuilding: {
        ...prev.teamBuilding,
        [field]: value
      }
    }));
  };

  const updateRole = (index, value) => {
    const newRoles = [...editData.teamBuilding.roles];
    newRoles[index] = value;
    updateTeamBuilding('roles', newRoles);
  };

  const addRole = () => {
    const newRoles = [...editData.teamBuilding.roles, ""];
    updateTeamBuilding('roles', newRoles);
  };

  const removeRole = (index) => {
    const newRoles = editData.teamBuilding.roles.filter((_, i) => i !== index);
    updateTeamBuilding('roles', newRoles);
  };

  const updateType = (index, field, value) => {
    const newTypes = [...editData.teamBuilding.types];
    newTypes[index] = {
      ...newTypes[index],
      [field]: value
    };
    updateTeamBuilding('types', newTypes);
  };

  const addType = () => {
    const newTypes = [...editData.teamBuilding.types, { name: "", description: "" }];
    updateTeamBuilding('types', newTypes);
  };

  const removeType = (index) => {
    const newTypes = editData.teamBuilding.types.filter((_, i) => i !== index);
    updateTeamBuilding('types', newTypes);
  };

  const updateImage = (index, value) => {
    const newImages = [...editData.images];
    newImages[index] = value;
    setEditData(prev => ({ ...prev, images: newImages }));
  };
  const addImage = () => {
    const newImages = [...editData.images, ""];
    setEditData(prev => ({ ...prev, images: newImages }));
  };

  const removeImage = (index) => {
    if (editData.images.length > 1) {
      const newImages = editData.images.filter((_, i) => i !== index);
      setEditData(prev => ({ ...prev, images: newImages }));
    } else {
      alert('Phải có ít nhất 1 hình ảnh!');
    }
  };

  return (


    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Loading State */}
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-700 text-center">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-center">{error}</p>
            <button
              onClick={() => fetchTeamBuildingData(serviceId)}
              className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        )}
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản Lý Teambuilding & Gala Dinner</h1>
              <p className="text-sm text-gray-500 mt-1">
                Cập nhật lần cuối: {editData.updatedAt.toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 size={16} />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} />
                    Huỷ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Thông Tin Dịch Vụ</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên dịch vụ</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.service.title}
                        onChange={(e) => updateService('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{editData.service.title}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.service.price}
                        onChange={(e) => updateService('price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-2xl font-bold text-blue-600">{editData.service.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.service.location}
                        onChange={(e) => updateService('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span>{editData.service.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editData.service.rating}
                        onChange={(e) => updateService('rating', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{editData.service.rating}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số review</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.service.reviewCount}
                        onChange={(e) => updateService('reviewCount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                        <span>{editData.service.reviewCount} reviews</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lượt xem</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.service.viewCount}
                        onChange={(e) => updateService('viewCount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-gray-400" />
                        <span>{editData.service.viewCount} views</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  {isEditing ? (
                    <textarea
                      value={editData.service.description}
                      onChange={(e) => updateService('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700">{editData.service.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Team Building Definition */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Định Nghĩa Team Building</h2>
              </div>
              <div className="p-6">
                {isEditing ? (
                  <textarea
                    value={editData.teamBuilding.definition}
                    onChange={(e) => updateTeamBuilding('definition', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{editData.teamBuilding.definition}</p>
                )}
              </div>
            </div>

            {/* Roles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Vai Trò Của Team Building</h2>
                {isEditing && (
                  <button
                    onClick={addRole}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Thêm vai trò
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {editData.teamBuilding.roles.map((role, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      {isEditing ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={role}
                            onChange={(e) => updateRole(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {editData.teamBuilding.roles.length > 1 && (
                            <button
                              onClick={() => removeRole(index)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-700">{role}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Types */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Loại Hình Team Building</h2>
                {isEditing && (
                  <button
                    onClick={addType}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Thêm loại hình
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {editData.teamBuilding.types.map((type, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={type.name}
                              onChange={(e) => updateType(index, 'name', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                              placeholder="Tên loại hình"
                            />
                            {editData.teamBuilding.types.length > 1 && (
                              <button
                                onClick={() => removeType(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                          <textarea
                            value={type.description}
                            onChange={(e) => updateType(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Mô tả"
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
                          <p className="text-gray-600 text-sm">{type.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Thông Tin Liên Hệ</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.contact.phone}
                      onChange={(e) => updateContact('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{editData.contact.phone}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.contact.email}
                      onChange={(e) => updateContact('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 break-all">{editData.contact.email}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  {isEditing ? (
                    <textarea
                      value={editData.contact.address}
                      onChange={(e) => updateContact('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700">{editData.contact.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Hình Ảnh</h2>
                {isEditing && (
                  <button
                    onClick={addImage}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Thêm ảnh
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {editData.images.map((image, index) => (
                    <div key={index} className="space-y-2">
                      {isEditing && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 w-16">Ảnh {index + 1}:</span>
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => updateImage(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="URL hình ảnh"
                          />
                          {editData.images.length > 1 && (
                            <button
                              onClick={() => removeImage(index)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa ảnh"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      )}
                      <div className="relative">
                        <img
                          src={image || 'https://via.placeholder.com/400x200?text=No+Image'}
                          alt={`Team building ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                          }}
                        />
                        {!isEditing && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                              {index + 1}/{editData.images.length}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {editData.images.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có hình ảnh nào. Nhấn "Thêm ảnh" để thêm mới.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeambuildingManagement;