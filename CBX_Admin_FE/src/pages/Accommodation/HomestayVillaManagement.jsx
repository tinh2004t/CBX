import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Star, MapPin, Users, Eye, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import accommodationAPI from '../../api/accommodationApi'; // Điều chỉnh path cho đúng


const HomestayVillaManagement = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);  // Thêm state này
  const [error, setError] = useState(null);      // Thêm state này

  const navigate = useNavigate();

  useEffect(() => {
    fetchAccommodations();
  }, []);

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

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      setError(null);

      const [hotels, resorts] = await Promise.all([
        accommodationAPI.getAccommodationsByType("Homestay", { isDeleted: false }),
        accommodationAPI.getAccommodationsByType("Villa", { isDeleted: false })
      ]);

      const merged = [
        ...(hotels.success ? hotels.data : []),
        ...(resorts.success ? resorts.data : [])
      ];

      setAccommodations(merged);
    } catch (err) {
      console.error("Error fetching accommodations:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };


  const handleSoftDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      try {
        const response = await accommodationAPI.deleteAccommodation(id);

        if (response.success) {
          // Cập nhật UI sau khi xóa thành công
          setAccommodations(prev =>
            prev.map(item =>
              item._id === id ? { ...item, isDeleted: true, deletedAt: new Date().toISOString() } : item
            )
          );

          // Hoặc fetch lại data để đảm bảo đồng bộ
          // fetchAccommodations();
        }
      } catch (err) {
        console.error('Error deleting accommodation:', err);
        alert('Không thể xóa mục này. Vui lòng thử lại sau.');
      }
    }
  };

  const handleDeleted = () => {
    navigate('/homestay-villa/deleted');
  };

  const handleEdit = (item) => {
    navigate(`/homestay-villa/edit/${item.slug}`);
  };

  const handleAdd = () => {
    navigate('/homestay-villa/add');
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchAccommodations}
              className="mt-2 text-red-700 underline hover:text-red-900"
            >
              Thử lại
            </button>
          </div>
        )}

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
              <option value="homestay">Homestay</option>
              <option value="villa">Villa</option>
            </select>
          </div>
        </div>
      </div>

      {!loading && !error && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Tổng số</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{filteredData.length}</p>
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
        </>
      )}
    </div >
  );
};

export default HomestayVillaManagement;