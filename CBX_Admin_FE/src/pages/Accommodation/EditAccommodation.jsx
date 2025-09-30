import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import accommodationAPI from '../../api/accommodationApi';
import accommodationDetailAPI from '../../api/accommodationDetailApi';

const EditAccommodation = () => {
  const { slug } = useParams(); // 
  const navigate = useNavigate();
  const isEditMode = !!slug;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Lưu ID thật để dùng cho UPDATE
  const [accommodationId, setAccommodationId] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [showDetailSection, setShowDetailSection] = useState(isEditMode);


  const [basicInfo, setBasicInfo] = useState({
    name: '',
    location: '',
    stars: 3,
    type: 'Hotel',
    image: '',
    rating: 0,
    reviewCount: 0,
    price: ''
  });

  const [detailInfo, setDetailInfo] = useState({
    address: '',
    description: '',
    amenities: [''],
    images: [''],
    roomTypes: [{
      type: '',
      name: '',
      price: '',
      description: ''
    }],
    distances: [{ location: '', distance: '' }]
  });

  useEffect(() => {
    if (isEditMode) {
      setShowDetailSection(true);
      fetchAccommodationData();
    } else {
      setShowDetailSection(false);
    }
  }, [slug, isEditMode]);

  const fetchAccommodationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const basicResponse = await accommodationAPI.getAccommodationBySlug(slug);
      console.log('Fetching accommodation data:', basicResponse);

      if (basicResponse.success) {
        // ✅ FIX: Truy cập đúng vào basicResponse.data.accommodation
        const data = basicResponse.data.accommodation;

        setAccommodationId(data._id);

        setBasicInfo({
          name: data.name || '',
          location: data.location || '',
          stars: data.stars || 3,
          type: data.type || 'Hotel',
          image: data.image || '',
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0,
          price: data.price || ''
        });

        // ✅ FIX: Lấy detail từ basicResponse.data.accommodationDetail
        // Trong hàm fetchAccommodationData, thay thế phần xử lý distances:

        if (basicResponse.data.accommodationDetail) {
          const detail = basicResponse.data.accommodationDetail;

          setDetailId(detail._id);

          // Xử lý distances từ object sang array
          let distancesArray = [];
          if (detail.distances && typeof detail.distances === 'object') {
            distancesArray = Object.entries(detail.distances).map(([key, value]) => ({
              location: key,
              distance: value
            }));
          }

          // Nếu không có distances, tạo 1 item trống
          if (distancesArray.length === 0) {
            distancesArray = [{ location: '', distance: '' }];
          }

          console.log('🔍 Distances processed:', distancesArray);

          setDetailInfo({
            address: detail.address || '',
            description: detail.description || '',
            amenities: detail.amenities?.length > 0 ? detail.amenities : [''],
            images: detail.images?.length > 0 ? detail.images : [''],
            roomTypes: detail.roomTypes?.length > 0 ? detail.roomTypes.map(rt => ({
              type: rt.type || '',
              name: rt.name || '',
              price: rt.price?.toString() || '',
              description: rt.description || ''
            })) : [{
              type: '',
              name: '',
              price: '',
              description: ''
            }],
            distances: distancesArray
          });
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleDetailInfoChange = (field, value) => {
    setDetailInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (arrayName, index, value) => {
    setDetailInfo(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (arrayName, defaultValue) => {
    setDetailInfo(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultValue]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    if (detailInfo[arrayName].length > 1) {
      setDetailInfo(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index)
      }));
    }
  };

  const handleDistanceChange = (index, field, value) => {
    const updatedDistances = [...detailInfo.distances];
    updatedDistances[index] = { ...updatedDistances[index], [field]: value };
    setDetailInfo(prev => ({ ...prev, distances: updatedDistances }));
  };

  const addDistance = () => {
    setDetailInfo(prev => ({
      ...prev,
      distances: [...prev.distances, { location: '', distance: '' }]
    }));
  };

  const removeDistance = (index) => {
    if (detailInfo.distances.length > 1) {
      setDetailInfo(prev => ({
        ...prev,
        distances: prev.distances.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    if (!basicInfo.name.trim()) {
      alert('Vui lòng nhập tên khách sạn/resort');
      return false;
    }
    if (!basicInfo.location.trim()) {
      alert('Vui lòng nhập địa điểm');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const basicData = {
        name: basicInfo.name,
        location: basicInfo.location,
        stars: basicInfo.stars,
        type: basicInfo.type,
        image: basicInfo.image || 'https://via.placeholder.com/400x300',
        rating: parseFloat(basicInfo.rating) || 0,
        reviewCount: parseInt(basicInfo.reviewCount) || 0,
        price: basicInfo.price
      };

      if (isEditMode) {
        console.log('🔄 Updating accommodation ID:', accommodationId);

        const basicResponse = await accommodationAPI.updateAccommodation(accommodationId, basicData);

        if (basicResponse.success && detailId) {
          // Chuẩn bị dữ liệu detail
          const distancesObj = {};
          detailInfo.distances.forEach(item => {
            if (item.location && item.distance) {
              distancesObj[item.location] = item.distance;
            }
          });

          // ✅ THÊM LOG để kiểm tra
          console.log('📦 Distances to save:', distancesObj);

          const detailData = {
            name: basicInfo.name,
            location: basicInfo.location,
            address: detailInfo.address,
            description: detailInfo.description,
            stars: basicInfo.stars,
            rating: parseFloat(basicInfo.rating) || 0,
            reviewCount: parseInt(basicInfo.reviewCount) || 0,
            amenities: detailInfo.amenities.filter(a => a.trim()),
            images: detailInfo.images.filter(i => i.trim()),
            distances: distancesObj,
            roomTypes: detailInfo.roomTypes
              .filter(r => r.name || r.type)
              .map(r => ({
                type: r.type,
                name: r.name,
                price: parseInt(r.price) || 0,
                description: r.description
              }))
          };

          // ✅ THÊM LOG để xem toàn bộ detailData
          console.log('📤 Detail data to send:', detailData);

          await accommodationDetailAPI.updateAccommodationDetail(detailId, detailData);
        }

        alert('Cập nhật thành công!');
        navigate('/hotel-resort');
      }
      else {
        // ✅ TẠO MỚI - chỉ tạo basic info
        const basicResponse = await accommodationAPI.createAccommodation(basicData);

        if (basicResponse.success) {
          alert('Thêm mới thành công!');
          navigate('/hotel-resort');
        }
      }
    } catch (err) {
      console.error('Error saving data:', err);
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/hotel-resort');
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleBasicInfoChange('stars', i + 1)}
            className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating} sao</span>
      </div>
    );
  };

  if (loading && isEditMode) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {isEditMode ? 'Sửa thông tin' : 'Thêm mới'} Khách sạn/Resort
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            disabled={loading}
            className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className={`grid ${showDetailSection ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'} gap-6 lg:gap-8`}>
        {/* Basic Information */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-900">Thông tin cơ bản</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên khách sạn/resort <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={basicInfo.name}
                onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên khách sạn/resort"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={basicInfo.location}
                onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: Hà Nội, Việt Nam"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại hình</label>
              <select
                value={basicInfo.type}
                onChange={(e) => handleBasicInfoChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Hotel">Khách sạn</option>
                <option value="Resort">Resort</option>
                <option value="Motel">Motel</option>
                <option value="Villa">Villa</option>
                <option value="Homestay">Homestay</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số sao</label>
              {renderStars(basicInfo.stars)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh đại diện (URL)</label>
              <input
                type="url"
                value={basicInfo.image}
                onChange={(e) => handleBasicInfoChange('image', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={basicInfo.rating}
                  onChange={(e) => handleBasicInfoChange('rating', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="4.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số đánh giá</label>
                <input
                  type="number"
                  min="0"
                  value={basicInfo.reviewCount}
                  onChange={(e) => handleBasicInfoChange('reviewCount', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="120"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá hiển thị</label>
              <input
                type="text"
                value={basicInfo.price}
                onChange={(e) => handleBasicInfoChange('price', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: 2.500.000 VND/đêm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết</label>
              <input
                type="text"
                value={detailInfo.address}
                onChange={(e) => handleDetailInfoChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập địa chỉ đầy đủ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                value={detailInfo.description}
                onChange={(e) => handleDetailInfoChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mô tả chi tiết về khách sạn/resort..."
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {showDetailSection && (
          <div className="space-y-6">
            {/* Amenities */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Tiện nghi</h2>

              <div className="space-y-3">
                {detailInfo.amenities.map((amenity, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => handleArrayChange('amenities', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: WiFi miễn phí"
                    />
                    {detailInfo.amenities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('amenities', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('amenities', '')}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm tiện nghi
                </button>
              </div>
            </div>

            {/* Distances */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Khoảng cách đến các địa điểm</h2>

              {console.log('🔍 Rendering distances:', detailInfo.distances)}
              <div className="space-y-3">
                {detailInfo.distances.map((distance, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={distance.location}
                      onChange={(e) => handleDistanceChange(index, 'location', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: Sân bay, Trung tâm thành phố"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={distance.distance}
                        onChange={(e) => handleDistanceChange(index, 'distance', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: 5km, 10 phút"
                      />
                      {detailInfo.distances.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDistance(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDistance}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm địa điểm
                </button>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Hình ảnh chi tiết</h2>

              <div className="space-y-3">
                {detailInfo.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleArrayChange('images', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {detailInfo.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('images', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('images', '')}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm hình ảnh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Room Types Section */}
      {showDetailSection && (
        <div className="mt-6 lg:mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-900">Loại phòng</h2>

          <div className="space-y-6">
            {detailInfo.roomTypes.map((room, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Phòng {index + 1}</h3>
                  {detailInfo.roomTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('roomTypes', index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại phòng</label>
                    <input
                      type="text"
                      value={room.type}
                      onChange={(e) => {
                        const updatedRooms = [...detailInfo.roomTypes];
                        updatedRooms[index] = { ...room, type: e.target.value };
                        setDetailInfo(prev => ({ ...prev, roomTypes: updatedRooms }));
                      }}
                      placeholder="VD: standard, deluxe, suite"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên phòng</label>
                    <input
                      type="text"
                      value={room.name}
                      onChange={(e) => {
                        const updatedRooms = [...detailInfo.roomTypes];
                        updatedRooms[index] = { ...room, name: e.target.value };
                        setDetailInfo(prev => ({ ...prev, roomTypes: updatedRooms }));
                      }}
                      placeholder="VD: Phòng Deluxe hướng phố"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VND)</label>
                    <input
                      type="number"
                      value={room.price}
                      onChange={(e) => {
                        const updatedRooms = [...detailInfo.roomTypes];
                        updatedRooms[index] = { ...room, price: e.target.value };
                        setDetailInfo(prev => ({ ...prev, roomTypes: updatedRooms }));
                      }}
                      placeholder="2500000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả phòng</label>
                    <textarea
                      value={room.description}
                      onChange={(e) => {
                        const updatedRooms = [...detailInfo.roomTypes];
                        updatedRooms[index] = { ...room, description: e.target.value };
                        setDetailInfo(prev => ({ ...prev, roomTypes: updatedRooms }));
                      }}
                      placeholder="Mô tả về phòng..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addArrayItem('roomTypes', { type: '', name: '', price: '', description: '' })}
            className="mt-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm loại phòng
          </button>
        </div>
      )}
    </div>
  );
};

export default EditAccommodation;