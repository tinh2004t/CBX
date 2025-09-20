import React, { useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';

const EditAccommodation = ({ item, onBack, onSave }) => {
  const [basicInfo, setBasicInfo] = useState({
    name: item?.name || '',
    location: item?.location || '',
    stars: item?.stars || 1,
    type: item?.type || 'Hotel'
  });

  const [detailInfo, setDetailInfo] = useState({
    address: item?.address || '',
    description: item?.description || '',
    amenities: item?.amenities || [''],
    images: item?.images || [''],
    roomTypes: item?.roomTypes || [{
      type: '',
      name: '',
      price: '',
      description: ''
    }],
    distances: item?.distances ? 
      Object.entries(item.distances).map(([location, distance]) => ({
        location,
        distance
      })) : 
      [{ location: '', distance: '' }]
  });

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

  const handleSave = () => {
    // Convert distances back to object format
    const distancesObj = {};
    detailInfo.distances.forEach(item => {
      if (item.location && item.distance) {
        distancesObj[item.location] = item.distance;
      }
    });

    const saveData = {
      ...basicInfo,
      ...detailInfo,
      distances: distancesObj,
      // Filter out empty values
      amenities: detailInfo.amenities.filter(a => a.trim()),
      images: detailInfo.images.filter(i => i.trim()),
      roomTypes: detailInfo.roomTypes.filter(r => r.name || r.type)
    };

    if (onSave) {
      onSave(saveData);
    } else {
      console.log('Saving data:', saveData);
      alert('Dữ liệu đã được lưu! (Chức năng API sẽ được tích hợp sau)');
    }
    onBack();
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

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {item ? 'Sửa thông tin' : 'Thêm mới'} Khách sạn/Resort
        </h1>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Basic Information */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-900">Thông tin cơ bản</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên khách sạn/resort</label>
              <input
                type="text"
                value={basicInfo.name}
                onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên khách sạn/resort"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
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
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Hình ảnh</h2>
            
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
      </div>

      {/* Room Types Section */}
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
                    placeholder="VD: Standard, Deluxe, Suite"
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
    </div>
  );
};

export default EditAccommodation;