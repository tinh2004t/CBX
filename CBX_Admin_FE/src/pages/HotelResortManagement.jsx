import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Star, MapPin, Users, Eye } from 'lucide-react';

// Demo data
const demoData = [
  {
    "_id": "68c02a29e7900465f2499375",
    "slug": "grand-luxury-hotel-hanoi",
    "name": "Grand Luxury Hotel Hanoi",
    "location": "Hà Nội, Việt Nam",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop",
    "rating": 4.5,
    "reviewCount": 120,
    "stars": 5,
    "price": "2.500.000 VND/đêm",
    "type": "Hotel",
    "isDeleted": false,
    "createdAt": "2025-09-09T13:22:49.658Z",
    "updatedAt": "2025-09-09T13:23:55.192Z"
  },
  {
    "_id": "68c02a29e7900465f2499376",
    "slug": "seaside-resort-danang",
    "name": "Seaside Resort Đà Nẵng",
    "location": "Đà Nẵng, Việt Nam",
    "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop",
    "rating": 4.8,
    "reviewCount": 89,
    "stars": 4,
    "price": "3.200.000 VND/đêm",
    "type": "Resort",
    "isDeleted": false,
    "createdAt": "2025-09-08T10:15:30.123Z",
    "updatedAt": "2025-09-08T10:15:30.123Z"
  },
  {
    "_id": "68c02a29e7900465f2499377",
    "slug": "mountain-view-hotel-sapa",
    "name": "Mountain View Hotel Sapa",
    "location": "Sapa, Lào Cai",
    "image": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop",
    "rating": 4.2,
    "reviewCount": 67,
    "stars": 3,
    "price": "1.800.000 VND/đêm",
    "type": "Hotel",
    "isDeleted": false,
    "createdAt": "2025-09-07T08:45:12.456Z",
    "updatedAt": "2025-09-07T08:45:12.456Z"
  },
  {
    "_id": "68c02a29e7900465f2499378",
    "slug": "tropical-paradise-resort-phu-quoc",
    "name": "Tropical Paradise Resort Phú Quốc",
    "location": "Phú Quốc, Kiên Giang",
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop",
    "rating": 4.9,
    "reviewCount": 203,
    "stars": 5,
    "price": "4.500.000 VND/đêm",
    "type": "Resort",
    "isDeleted": false,
    "createdAt": "2025-09-06T14:20:18.789Z",
    "updatedAt": "2025-09-06T14:20:18.789Z"
  }
];

const HotelManagement = () => {
  const [accommodations, setAccommodations] = useState(demoData);
  const [filteredData, setFilteredData] = useState(demoData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter data based on search term and type
  useEffect(() => {
    let filtered = accommodations.filter(item => !item.isDeleted);
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    setFilteredData(filtered);
  }, [accommodations, searchTerm, typeFilter]);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      setAccommodations(prev => 
        prev.map(item => 
          item._id === id ? { ...item, isDeleted: true, deletedAt: new Date().toISOString() } : item
        )
      );
    }
  };

  const handleEdit = (item) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit item:', item);
    alert(`Chỉnh sửa ${item.name} - Tính năng sẽ được tích hợp với routing`);
  };

  const handleAdd = () => {
    // TODO: Navigate to add page or open add modal
    console.log('Add new item');
    alert('Thêm mới khách sạn/resort - Tính năng sẽ được tích hợp với routing');
  };

  const renderStars = (stars) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý Khách sạn & Resort</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Thêm mới</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">Tất cả loại hình</option>
              <option value="hotel">Khách sạn</option>
              <option value="resort">Resort</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Tổng số</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{filteredData.length}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Khách sạn</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            {filteredData.filter(item => item.type === 'Hotel').length}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Resort</h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600">
            {filteredData.filter(item => item.type === 'Resort').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin cơ bản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-20">
                        <img
                          className="h-16 w-20 rounded-lg object-cover"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.location}
                        </div>
                        <div className="flex items-center mt-1">
                          {renderStars(item.stars)}
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      ⭐ {item.rating}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {item.reviewCount} đánh giá
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden">
          {filteredData.map((item) => (
            <div key={item._id} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-20 w-24 sm:h-24 sm:w-32 rounded-lg object-cover"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate pr-2">
                      {item.name}
                    </h3>
                    <div className="flex space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex">
                          {renderStars(item.stars)}
                        </div>
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center text-gray-500">
                        <span className="font-medium text-gray-900">⭐ {item.rating}</span>
                        <span className="mx-2">•</span>
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {item.reviewCount} đánh giá
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm sm:text-base font-medium text-gray-900">
                        {item.price}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredData.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-500 mb-4">
              <Eye className="w-8 h-8 sm:w-12 sm:h-12 mx-auto opacity-40" />
            </div>
            <p className="text-gray-500 text-sm sm:text-base">Không tìm thấy dữ liệu phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelManagement;