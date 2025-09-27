import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Plane, Calendar, Clock, Users, X, Save, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
// Import API (đảm bảo đường dẫn đúng với cấu trúc project của bạn)
import flightAPI from '../../api/flightApi';
import { useNavigate } from 'react-router-dom';

// Form Modal Component
const FormModal = ({
  isEdit,
  formData,
  setFormData,
  flightDetail,
  setFlightDetail,
  isSubmitting,
  onClose,
  onSubmit,
  addFlightDetail,
  removeFlightDetail,
  getStatusColor,
  // Thêm các props mới
  editingSubFlight,
  startEditSubFlight,
  cancelEditSubFlight,
  updateSubFlight
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {isEdit ? 'Chỉnh sửa chuyến bay' : 'Tạo chuyến bay mới'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm khởi hành *
              </label>
              <input
                type="text"
                value={formData.departure}
                onChange={(e) => setFormData(prev => ({ ...prev, departure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: Hà Nội"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm đến *
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: Đà Nẵng"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hãng bay *
              </label>
              <input
                type="text"
                value={formData.airline}
                onChange={(e) => setFormData(prev => ({ ...prev, airline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: Vietnam Airlines"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo hãng bay (URL)
              </label>
              <input
                type="url"
                value={formData.airlineLogo}
                onChange={(e) => setFormData(prev => ({ ...prev, airlineLogo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/logo.png"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bay *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá (VND) *
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: 12,500,000"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Chi tiết chuyến bay</h3>

          {/* Add Flight Detail Form */}
          {/* Add/Edit Flight Detail Form */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-3">
              {editingSubFlight ? 'Sửa chuyến bay chi tiết' : 'Thêm chuyến bay chi tiết'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Các input fields giữ nguyên như cũ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian *
                </label>
                <input
                  type="text"
                  value={flightDetail.time}
                  onChange={(e) => setFlightDetail(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="06:00 - 12:30"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời lượng
                </label>
                <input
                  type="text"
                  value={flightDetail.duration}
                  onChange={(e) => setFlightDetail(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3h 30m"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã chuyến bay *
                </label>
                <input
                  type="text"
                  value={flightDetail.flightCode}
                  onChange={(e) => setFlightDetail(prev => ({ ...prev, flightCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VN3201"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại máy bay
                </label>
                <input
                  type="text"
                  value={flightDetail.aircraft}
                  onChange={(e) => setFlightDetail(prev => ({ ...prev, aircraft: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Boeing 787"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={flightDetail.status}
                  onChange={(e) => setFlightDetail(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="Còn chỗ">Còn chỗ</option>
                  <option value="Sắp hết">Sắp hết</option>
                  <option value="Hết chỗ">Hết chỗ</option>
                </select>
              </div>

              {/* Thay đổi phần button */}
              <div className="flex items-end gap-2">
                {editingSubFlight ? (
                  <>
                    <button
                      type="button"
                      onClick={updateSubFlight}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      <Save size={16} />
                      Cập nhật
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditSubFlight}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      <X size={16} />
                      Hủy
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={addFlightDetail}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    <Plus size={16} />
                    Thêm
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Flight Details List */}
          {formData.flights.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Danh sách chuyến bay ({formData.flights.length})</h4>
              <div className="space-y-2">
                {formData.flights.map((flight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{flight.flightCode}</span>
                      <span className="text-gray-600">{flight.time}</span>
                      <span className="text-gray-600">{flight.duration}</span>
                      <span className="text-gray-600">{flight.aircraft}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(flight.status)}`}>
                        {flight.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditSubFlight(flight, index)}
                        className="text-blue-600 hover:bg-blue-50 p-1 rounded disabled:opacity-50"
                        disabled={isSubmitting}
                        title="Sửa chuyến bay"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => removeFlightDetail(index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded disabled:opacity-50"
                        disabled={isSubmitting}
                        title="Xóa chuyến bay"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isEdit ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              <>
                <Save size={16} />
                {isEdit ? 'Cập nhật' : 'Tạo chuyến bay'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const FlightManagement = () => {
  const navigate = useNavigate();
  // State management
  const [flightsData, setFlightsData] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [airlineFilter, setAirlineFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFlights, setExpandedFlights] = useState(new Set());
  const [editingSubFlight, setEditingSubFlight] = useState(null);
  const [editingSubFlightIndex, setEditingSubFlightIndex] = useState(-1);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form data state
  const [formData, setFormData] = useState({
    departure: '',
    destination: '',
    airline: '',
    airlineLogo: '',
    date: '',
    price: '',
    flights: []
  });

  // Single flight detail state
  const [flightDetail, setFlightDetail] = useState({
    time: '',
    duration: '',
    flightCode: '',
    aircraft: '',
    status: 'Còn chỗ'
  });

  // Load flights from API
  const loadFlights = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 10,
        ...filters
      };

      const response = await flightAPI.getFlights(params);

      if (response.success) {
        setFlightsData(response.data);
        setCurrentPage(response.pagination?.currentPage || 1);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.totalItems || 0);
      } else {
        throw new Error(response.message || 'Không thể tải dữ liệu chuyến bay');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      console.error('Error loading flights:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadFlights();
  }, []);

  // Filter and search logic - now client-side only for loaded data
  useEffect(() => {
    let filtered = flightsData;

    if (searchTerm) {
      filtered = filtered.filter(flight =>
        flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.flights.some(f => f.flightCode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (airlineFilter !== 'all') {
      filtered = filtered.filter(flight => flight.airline === airlineFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(flight =>
        flight.flights.some(f => f.status === statusFilter)
      );
    }

    setFilteredFlights(filtered);
  }, [searchTerm, statusFilter, airlineFilter, flightsData]);

  // Reset form
  const resetForm = () => {
    setFormData({
      departure: '',
      destination: '',
      airline: '',
      airlineLogo: '',
      date: '',
      price: '',
      flights: []
    });
    setFlightDetail({
      time: '',
      duration: '',
      flightCode: '',
      aircraft: '',
      status: 'Còn chỗ'
    });
  };

  const toggleFlightExpansion = (flightId) => {
    setExpandedFlights(prev => {
      const newSet = new Set(prev);
      if (newSet.has(flightId)) {
        newSet.delete(flightId);
      } else {
        newSet.add(flightId);
      }
      return newSet;
    });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingFlight(null);
    resetForm();
  };

  // Get unique airlines for filter
  const uniqueAirlines = [...new Set(flightsData.map(flight => flight.airline))];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Còn chỗ': return 'bg-green-100 text-green-800';
      case 'Sắp hết': return 'bg-yellow-100 text-yellow-800';
      case 'Hết chỗ': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  // Function để bắt đầu sửa sub-flight
  const startEditSubFlight = (subFlight, index) => {
    setEditingSubFlight(subFlight);
    setEditingSubFlightIndex(index);
    setFlightDetail({
      time: subFlight.time,
      duration: subFlight.duration,
      flightCode: subFlight.flightCode,
      aircraft: subFlight.aircraft,
      status: subFlight.status
    });
  };

  // Function để hủy sửa sub-flight
  const cancelEditSubFlight = () => {
    setEditingSubFlight(null);
    setEditingSubFlightIndex(-1);
    setFlightDetail({
      time: '',
      duration: '',
      flightCode: '',
      aircraft: '',
      status: 'Còn chỗ'
    });
  };

  // Function để cập nhật sub-flight
  const updateSubFlight = () => {
    if (!flightDetail.time || !flightDetail.flightCode) {
      alert('Vui lòng nhập đầy đủ thời gian và mã chuyến bay');
      return;
    }

    const updatedFlights = [...formData.flights];
    updatedFlights[editingSubFlightIndex] = {
      ...editingSubFlight,
      ...flightDetail
    };

    setFormData(prev => ({
      ...prev,
      flights: updatedFlights
    }));

    cancelEditSubFlight();
  };

  // Delete flight
  const deleteFlight = async (flightId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chuyến bay này?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await flightAPI.softDeleteFlight(flightId);

      if (response.success) {
        await loadFlights(currentPage);
        alert('Xóa chuyến bay thành công!');
      } else {
        throw new Error(response.message || 'Không thể xóa chuyến bay');
      }
    } catch (err) {
      alert('Lỗi khi xóa chuyến bay: ' + err.message);
      console.error('Error deleting flight:', err);
    } finally {
      setLoading(false);
    }
  };

  // Edit flight
  const editFlight = (flight) => {
    setEditingFlight(flight);
    setFormData({
      departure: flight.departure,
      destination: flight.destination,
      airline: flight.airline,
      airlineLogo: flight.airlineLogo,
      date: flight.date,
      price: flight.price,
      flights: flight.flights
    });
    setShowEditModal(true);
  };

  // Add flight detail to form
  const addFlightDetail = () => {
    if (!flightDetail.time || !flightDetail.flightCode) {
      alert('Vui lòng nhập đầy đủ thời gian và mã chuyến bay');
      return;
    }

    const newDetail = {
      ...flightDetail,
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    setFormData(prev => ({
      ...prev,
      flights: [...prev.flights, newDetail]
    }));

    setFlightDetail({
      time: '',
      duration: '',
      flightCode: '',
      aircraft: '',
      status: 'Còn chỗ'
    });
  };

  // Remove flight detail from form
  const removeFlightDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      flights: prev.flights.filter((_, i) => i !== index)
    }));
  };

  // Handle create flight
  const handleCreateFlight = async () => {
    if (!formData.departure || !formData.destination || !formData.airline || !formData.date || !formData.price) {
      alert('Vui lòng nhập đầy đủ thông tin chuyến bay');
      return;
    }

    if (formData.flights.length === 0) {
      alert('Vui lòng thêm ít nhất một chuyến bay chi tiết');
      return;
    }

    try {
      setIsSubmitting(true);

      // Gửi tất cả dữ liệu cùng lúc, bao gồm cả flights array
      const completeFlightData = {
        departure: formData.departure,
        destination: formData.destination,
        airline: formData.airline,
        airlineLogo: formData.airlineLogo,
        date: formData.date,
        price: formData.price,
        flights: formData.flights // THÊM dòng này
      };

      console.log('Tạo flight với dữ liệu đầy đủ:', completeFlightData);
      const response = await flightAPI.createFlight(completeFlightData);

      if (response.success) {
        await loadFlights(currentPage);
        setShowCreateModal(false);
        resetForm();
        alert('Tạo chuyến bay thành công!');
      } else {
        throw new Error(response.message || 'Không thể tạo chuyến bay');
      }
    } catch (err) {
      console.error('Lỗi chi tiết:', err);
      console.error('Response data:', err.response?.data);

      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        (err.response?.data?.errors ? err.response.data.errors.join(', ') : '') ||
        err.message || 'Lỗi không xác định';

      alert('Lỗi khi tạo chuyến bay: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleted = () => {
    navigate('/ve-may-bay/deleted');
  };

  // Handle update flight
  const handleUpdateFlight = async () => {
    if (!formData.departure || !formData.destination || !formData.airline || !formData.date || !formData.price) {
      alert('Vui lòng nhập đầy đủ thông tin chuyến bay');
      return;
    }

    if (formData.flights.length === 0) {
      alert('Vui lòng thêm ít nhất một chuyến bay chi tiết');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Form:', formData);
      const response = await flightAPI.updateFlight(editingFlight._id, formData);

      if (response.success) {
        await loadFlights(currentPage);
        setShowEditModal(false);
        setEditingFlight(null);
        resetForm();
        alert('Cập nhật chuyến bay thành công!');
      } else {
        throw new Error(response.message || 'Không thể cập nhật chuyến bay');
      }
    } catch (err) {
      alert('Lỗi khi cập nhật chuyến bay: ' + err.message);
      console.error('Error updating flight:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refresh data
  const refreshData = () => {
    loadFlights(currentPage);
  };



  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Plane className="text-blue-600" />
                Quản lý chuyến bay
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý tất cả các chuyến bay trong hệ thống
                {totalItems > 0 && ` (${totalItems} chuyến bay)`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                            onClick={handleDeleted}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
                          >
                            <Trash2 size={20} />
                            Thùng Rác
                          </button>
              <button
                onClick={refreshData}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                disabled={loading}
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Làm mới
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Tạo chuyến bay
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <X size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo địa điểm, hãng bay, mã chuyến..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <select
                value={airlineFilter}
                onChange={(e) => setAirlineFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="all">Tất cả hãng bay</option>
                {uniqueAirlines.map(airline => (
                  <option key={airline} value={airline}>{airline}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Còn chỗ">Còn chỗ</option>
                <option value="Sắp hết">Sắp hết</option>
                <option value="Hết chỗ">Hết chỗ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 size={24} className="animate-spin text-blue-600" />
              <span className="text-gray-600">Đang tải dữ liệu...</span>
            </div>
          </div>
        )}

        {/* Flight Cards */}
        {!loading && (
          <div className="grid gap-6">
            {filteredFlights.map((flight) => (
              <div key={flight._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6 border-b">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={flight.airlineLogo}
                        alt={flight.airline}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iNCIgZmlsbD0iIzMzNzNkYyIvPgo8cGF0aCBkPSJNMTIgMjRMMzYgMTJWMzZMMTIgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
                        }}
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {flight.departure} → {flight.destination}
                        </h3>
                        <p className="text-gray-600">{flight.airline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} />
                          <span>{new Date(flight.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {flight.price} VND
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => editFlight(flight)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteFlight(flight._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phần thông tin tóm tắt và nút mở rộng */}
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Plane size={16} className="text-gray-500" />
                        <span className="text-gray-700">
                          {flight.flights.length} chuyến bay
                        </span>
                      </div>

                      {/* Hiển thị trạng thái tổng quan */}
                      <div className="flex gap-2">
                        {[...new Set(flight.flights.map(f => f.status))].map(status => (
                          <span key={status} className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFlightExpansion(flight._id)}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <span className="text-sm">
                        {expandedFlights.has(flight._id) ? 'Thu gọn' : 'Xem chi tiết'}
                      </span>
                      {expandedFlights.has(flight._id) ?
                        <ChevronUp size={16} /> :
                        <ChevronDown size={16} />
                      }
                    </button>
                  </div>
                </div>

                {/* Phần chi tiết chuyến bay - chỉ hiển thị khi được mở rộng */}
                {/* Phần chi tiết chuyến bay với animation */}
                <div div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedFlights.has(flight._id) ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <div className="p-6">
                    <div className="grid gap-4">
                      {flight.flights.map((flightDetail) => (
                        <div key={flightDetail._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4 border-l-4 border-blue-500">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-500" />
                              <div>
                                <div className="font-semibold">{flightDetail.time}</div>
                                <div className="text-sm text-gray-600">{flightDetail.duration}</div>
                              </div>
                            </div>

                            <div>
                              <div className="font-semibold">{flightDetail.flightCode}</div>
                              <div className="text-sm text-gray-600">{flightDetail.aircraft}</div>
                            </div>

                            <div className="col-span-2 sm:col-span-1 flex justify-start sm:justify-center">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(flightDetail.status)}`}>
                                {flightDetail.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && filteredFlights.length === 0 && (
          <div className="text-center py-12">
            <Plane size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Không tìm thấy chuyến bay</h3>
            <p className="text-gray-600">
              {flightsData.length === 0
                ? 'Chưa có chuyến bay nào trong hệ thống. Hãy tạo chuyến bay đầu tiên!'
                : 'Thử thay đổi bộ lọc hoặc tìm kiếm khác'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => loadFlights(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang trước
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
                return (
                  <button
                    key={pageNumber}
                    onClick={() => loadFlights(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => loadFlights(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang sau
            </button>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <FormModal
            isEdit={false}
            formData={formData}
            setFormData={setFormData}
            flightDetail={flightDetail}
            setFlightDetail={setFlightDetail}
            isSubmitting={isSubmitting}
            onClose={closeCreateModal}
            onSubmit={handleCreateFlight}
            addFlightDetail={addFlightDetail}
            removeFlightDetail={removeFlightDetail}
            getStatusColor={getStatusColor}
            // Thêm các props mới
            editingSubFlight={editingSubFlight}
            startEditSubFlight={startEditSubFlight}
            cancelEditSubFlight={cancelEditSubFlight}
            updateSubFlight={updateSubFlight}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <FormModal
            isEdit={true}
            formData={formData}
            setFormData={setFormData}
            flightDetail={flightDetail}
            setFlightDetail={setFlightDetail}
            isSubmitting={isSubmitting}
            onClose={closeEditModal}
            onSubmit={handleUpdateFlight}
            addFlightDetail={addFlightDetail}
            removeFlightDetail={removeFlightDetail}
            getStatusColor={getStatusColor}
            // Thêm các props mới
            editingSubFlight={editingSubFlight}
            startEditSubFlight={startEditSubFlight}
            cancelEditSubFlight={cancelEditSubFlight}
            updateSubFlight={updateSubFlight}
          />
        )}
      </div>
    </div >
  );
};

export default FlightManagement;