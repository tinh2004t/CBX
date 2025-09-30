import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Star, MapPin, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Demo data for homestays and villas
const demoData = [
  {
    "_id": "68c02a29e7900465f2499380",
    "slug": "cozy-homestay-hanoi-old-quarter",
    "name": "Cozy Homestay Phố cổ Hà Nội",
    "location": "Quận Hoàn Kiếm, Hà Nội",
    "image": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop",
    "rating": 4.3,
    "reviewCount": 87,
    "stars": 3,
    "price": "800.000 VND/đêm",
    "type": "Homestay",
    "isDeleted": false,
    "createdAt": "2025-09-10T09:15:22.456Z",
    "updatedAt": "2025-09-10T09:15:22.456Z"
  },
  {
    "_id": "68c02a29e7900465f2499381",
    "slug": "luxury-villa-dalat-mountains",
    "name": "Luxury Villa Đà Lạt Mountains",
    "location": "Đà Lạt, Lâm Đồng",
    "image": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&h=200&fit=crop",
    "rating": 4.8,
    "reviewCount": 124,
    "stars": 5,
    "price": "5.500.000 VND/đêm",
    "type": "Villa",
    "isDeleted": false,
    "createdAt": "2025-09-09T16:30:45.789Z",
    "updatedAt": "2025-09-09T16:30:45.789Z"
  },
  {
    "_id": "68c02a29e7900465f2499382",
    "slug": "beachfront-villa-mui-ne",
    "name": "Beachfront Villa Mũi Né",
    "location": "Mũi Né, Phan Thiết",
    "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop",
    "rating": 4.6,
    "reviewCount": 98,
    "stars": 4,
    "price": "3.800.000 VND/đêm",
    "type": "Villa",
    "isDeleted": false,
    "createdAt": "2025-09-08T14:22:18.123Z",
    "updatedAt": "2025-09-08T14:22:18.123Z"
  },
  {
    "_id": "68c02a29e7900465f2499383",
    "slug": "traditional-homestay-hoi-an",
    "name": "Traditional Homestay Hội An",
    "location": "Hội An, Quảng Nam",
    "image": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop",
    "rating": 4.4,
    "reviewCount": 156,
    "stars": 4,
    "price": "1.200.000 VND/đêm",
    "type": "Homestay",
    "isDeleted": false,
    "createdAt": "2025-09-07T11:45:33.678Z",
    "updatedAt": "2025-09-07T11:45:33.678Z"
  },
  {
    "_id": "68c02a29e7900465f2499384",
    "slug": "mountain-homestay-sapa-valley",
    "name": "Mountain Homestay Sapa Valley",
    "location": "Sapa, Lào Cai",
    "image": "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300&h=200&fit=crop",
    "rating": 4.1,
    "reviewCount": 73,
    "stars": 3,
    "price": "650.000 VND/đêm",
    "type": "Homestay",
    "isDeleted": false,
    "createdAt": "2025-09-06T08:20:15.234Z",
    "updatedAt": "2025-09-06T08:20:15.234Z"
  },
  {
    "_id": "68c02a29e7900465f2499385",
    "slug": "ocean-view-villa-nha-trang",
    "name": "Ocean View Villa Nha Trang",
    "location": "Nha Trang, Khánh Hòa",
    "image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop",
    "rating": 4.9,
    "reviewCount": 189,
    "stars": 5,
    "price": "4.200.000 VND/đêm",
    "type": "Villa",
    "isDeleted": false,
    "createdAt": "2025-09-05T13:55:44.567Z",
    "updatedAt": "2025-09-05T13:55:44.567Z"
  }
];

const HomestayVillaManagement = () => {
  const [accommodations, setAccommodations] = useState(demoData);
  const [filteredData, setFilteredData] = useState(demoData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const navigate = useNavigate();

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

  const handleSoftDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      setAccommodations(prev =>
        prev.map(item =>
          item._id === id ? { ...item, isDeleted: true, deletedAt: new Date().toISOString() } : item
        )
      );
    }
  };

  const handleDeleted = () => {
    navigate('/homestay-villa/deleted');
  };

  const handleEdit = (item) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit item:', item);
    alert(`Chỉnh sửa ${item.name} - Tính năng sẽ được tích hợp với routing`);
  };

  const handleAdd = () => {
    // TODO: Navigate to add page or open add modal
    console.log('Add new item');
    alert('Thêm mới homestay/villa - Tính năng sẽ được tích hợp với routing');
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý Homestay & Villa</h1>
          <div className="flex gap-3">
            <button
              onClick={handleDeleted}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <Trash2 size={20} />
              Thùng Rác
            </button>

            <button
              onClick={handleAdd}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Thêm mới</span>
              <span className="sm:hidden">Thêm</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
            >
              <option value="all">Tất cả loại hình</option>
              <option value="homestay">Homestay</option>
              <option value="villa">Villa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Tổng số</h3>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">{filteredData.length}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Homestay</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            {filteredData.filter(item => item.type === 'Homestay').length}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Villa</h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600">
            {filteredData.filter(item => item.type === 'Villa').length}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                  Thông tin cơ bản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-20">
                        <img
                          className="h-16 w-20 rounded-lg object-cover"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center mt-1 flex-wrap gap-1">
                          <div className="flex">{renderStars(item.stars)}</div>
                          <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">
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
                        onClick={() => handleSoftDelete(item._id)}
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
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <img
                    className="h-20 w-20 sm:h-24 sm:w-28 rounded-lg object-cover"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 flex-1">
                      {item.name}
                    </h3>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSoftDelete(item._id)}
                        className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-start text-xs sm:text-sm text-gray-500">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex">{renderStars(item.stars)}</div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
                      <span className="font-medium text-gray-900">⭐ {item.rating}</span>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center text-gray-500">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>{item.reviewCount} đánh giá</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="text-sm sm:text-base font-medium text-gray-900 truncate">
                        {item.price}
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
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

export default HomestayVillaManagement;