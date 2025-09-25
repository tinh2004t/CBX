import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Trash2, RotateCcw, Search, Calendar, MapPin, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tourAPI from '../../api/tourApi.js';
const DomesticTourDeleted = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const regions = [
    { value: '', label: 'Tất cả khu vực' },
    { value: 'Miền Bắc', label: 'Miền Bắc' },
    { value: 'Miền Trung', label: 'Miền Trung' },
    { value: 'Miền Nam', label: 'Miền Nam' }
  ];

  // Load deleted tours
  const loadDeletedTours = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 10,
        search: searchTerm,
        region: selectedRegion,
        type: 'domestic' // Thêm type để lọc tour nội địa
      };

      const response = await tourAPI.getDeletedTours(params);


      if (response.success) {
        setTours(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setError(response.message || 'Không thể tải danh sách tour đã xóa');
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu: ' + err.message);
      console.error('Error loading deleted tours:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadDeletedTours();
  }, []);

  // Handle search and filter
  const handleSearch = () => {
    setCurrentPage(1);
    loadDeletedTours(1);
  };

  // Handle restore tour
  const handleRestore = async (tour) => {
    try {
      setLoading(true);
      const response = await tourAPI.restoreTour(tour.id);
      if (response.success) {
        alert('Khôi phục tour thành công!');
        loadDeletedTours(currentPage);
      } else {
        alert('Lỗi khôi phục tour: ' + response.message);
      }
    } catch (err) {
      alert('Lỗi khôi phục tour: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle permanent delete
  const handlePermanentDelete = async (tour) => {
    try {
      setLoading(true);
      const response = await tourAPI.permanentDeleteTour(tour.id);
      if (response.success) {
        alert('Xóa vĩnh viễn tour thành công!');
        loadDeletedTours(currentPage);
      } else {
        alert('Lỗi xóa vĩnh viễn tour: ' + response.message);
      }
    } catch (err) {
      alert('Lỗi xóa vĩnh viễn tour: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Confirm dialog
  const showConfirm = (action, tour) => {
    setConfirmAction({ action, tour });
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      if (confirmAction.action === 'restore') {
        handleRestore(confirmAction.tour);
      } else if (confirmAction.action === 'delete') {
        handlePermanentDelete(confirmAction.tour);
      }
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/tour-noi-dia')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              Quay lại
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Tour Đã Xóa
            </h1>
          </div>

          <button
            onClick={() => loadDeletedTours(currentPage)}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên tour..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tours List */}
        <div className="bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : tours.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <AlertTriangle size={48} className="mx-auto mb-4 text-gray-400" />
              <p>Không có tour nào đã bị xóa</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian xóa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tours.map((tour) => (
                    <tr key={tour._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {tour.image ? (
                              <img
                                src={tour.image}
                                alt={tour.title}
                                className="w-full h-full aspect-[5/4] object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <MapPin size={20} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {tour.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {tour.departure}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {tour.region}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1 text-green-600">
                            <DollarSign size={14} />
                            <span className="font-medium">{tour.price}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock size={14} />
                            <span>{tour.duration}</span>
                          </div>
                          {tour.airline && (
                            <div className="text-gray-500">
                              PT: {tour.airline}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(tour.deletedAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showConfirm('restore', tour)}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            title="Khôi phục tour"
                          >
                            <RotateCcw size={14} />
                            Khôi phục
                          </button>

                          <button
                            onClick={() => showConfirm('delete', tour)}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            title="Xóa vĩnh viễn"
                          >
                            <Trash2 size={14} />
                            Xóa vĩnh viễn
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Trang {currentPage} / {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadDeletedTours(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => loadDeletedTours(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {confirmAction.action === 'restore' ? 'Xác nhận khôi phục' : 'Xác nhận xóa vĩnh viễn'}
            </h3>

            <p className="text-gray-600 mb-6">
              {confirmAction.action === 'restore'
                ? `Bạn có chắc chắn muốn khôi phục tour "${confirmAction.tour.title}"?`
                : `Bạn có chắc chắn muốn xóa vĩnh viễn tour "${confirmAction.tour.title}"? Hành động này không thể hoàn tác!`
              }
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded text-white transition-colors ${confirmAction.action === 'restore'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {confirmAction.action === 'restore' ? 'Khôi phục' : 'Xóa vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomesticTourDeleted;