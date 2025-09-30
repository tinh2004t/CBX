import React, { useState, useEffect } from 'react';
import { RotateCcw, Trash2, ArrowLeft, Star, MapPin, Users, AlertCircle } from 'lucide-react';
import accommodationAPI from '../../api/accommodationApi'; // Điều chỉnh đường dẫn cho phù hợp với cấu trúc project của bạn
import { useNavigate } from 'react-router-dom';


const AccommodationDeleted = () => {
  const [deletedItems, setDeletedItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    fetchDeletedAccommodations();
  }, []);
  // Filter data
  useEffect(() => {
    let filtered = deletedItems;

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
  }, [deletedItems, searchTerm, typeFilter]);

  const handleBackToMain = () => {
    navigate('/hotel-resort');
  };


  // Fetch deleted accommodations from API
  const fetchDeletedAccommodations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await accommodationAPI.getDeletedAccommodations();

      if (response.success) {
        setDeletedItems(response.data);
      } else {
        setError('Không thể tải dữ liệu');
      }
    } catch (err) {
      console.error('Error fetching deleted accommodations:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };
  const handleRestore = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục mục này?')) {
      try {
        const response = await accommodationAPI.restoreAccommodation(id);

        if (response.success) {
          // Remove from deleted list
          setDeletedItems(prev => prev.filter(item => item._id !== id));
          alert('Đã khôi phục thành công!');
        } else {
          alert('Không thể khôi phục: ' + response.message);
        }
      } catch (err) {
        console.error('Error restoring accommodation:', err);
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi khôi phục');
      }
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm('⚠️ CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn dữ liệu và KHÔNG THỂ khôi phục. Bạn có chắc chắn?')) {
      try {
        const response = await accommodationAPI.permanentDeleteAccommodation(id);

        if (response.success) {
          // Remove from list
          setDeletedItems(prev => prev.filter(item => item._id !== id));
          alert('Đã xóa vĩnh viễn!');
        } else {
          alert('Không thể xóa: ' + response.message);
        }
      } catch (err) {
        console.error('Error permanently deleting accommodation:', err);
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa vĩnh viễn');
      }
    }
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
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">
                <strong>Lỗi:</strong> {error}
              </p>
              <button
                onClick={fetchDeletedAccommodations}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}
      {!loading && !error && (
        <>
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToMain}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Quay lại"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thùng Rác</h1>
              </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800">
                    <strong>Lưu ý:</strong> Các mục trong thùng rác có thể được khôi phục hoặc xóa vĩnh viễn.
                    Hành động xóa vĩnh viễn không thể hoàn tác.
                  </p>
                </div>
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
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
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
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Tổng đã xóa</h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{filteredData.length}</p>
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
                      Ngày xóa
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
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
                              className="h-16 w-20 rounded-lg object-cover opacity-75"
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.deletedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRestore(item._id)}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Khôi phục"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(item._id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa vĩnh viễn"
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
                        className="h-20 w-20 sm:h-24 sm:w-28 rounded-lg object-cover opacity-75"
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-2">
                        {item.name}
                      </h3>

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

                        <div className="text-xs text-gray-500 pt-1">
                          Xóa ngày: {formatDate(item.deletedAt)}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleRestore(item._id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Khôi phục
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(item._id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa vĩnh viễn
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <Trash2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-base mb-2">Thùng rác trống</p>
                <p className="text-gray-400 text-sm">Không có mục nào đã bị xóa</p>
              </div>

            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AccommodationDeleted;