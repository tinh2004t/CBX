import { Plus, Search, Edit2, Trash2, Eye, MapPin, Clock, Users, Star, X, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import transportAPI from '../../api/transportApi'; // Đường dẫn tùy thuộc vào cấu trúc project của bạn

// Transport Modal Component
const TransportModal = ({ transport, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    company: transport?.company || '',
    fromCity: transport?.route?.fromCity || '',
    toCity: transport?.route?.toCity || '',
    seatType: transport?.bus?.seatType || 'Ghế ngồi',
    totalSeats: transport?.bus?.totalSeats || 40,
    features: transport?.bus?.features || '',
    amenities: transport?.bus?.amenities?.join(', ') || '',
    departDate: transport?.schedule?.departDate ? transport.schedule.departDate.split('T')[0] : '',
    returnDate: transport?.schedule?.returnDate ? transport.schedule.returnDate.split('T')[0] : '',
    departTime: transport?.schedule?.departTime || '',
    arrivalTime: transport?.schedule?.arrivalTime || '',
    duration: transport?.schedule?.duration || '',
    pickupPoint: transport?.schedule?.pickupPoint || '',
    dropoffPoint: transport?.schedule?.dropoffPoint || '',
    price: transport?.price || '',
    isActive: transport?.isActive !== undefined ? transport.isActive : true
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company.trim()) newErrors.company = 'Vui lòng nhập tên công ty';
    if (!formData.fromCity.trim()) newErrors.fromCity = 'Vui lòng nhập điểm đi';
    if (!formData.toCity.trim()) newErrors.toCity = 'Vui lòng nhập điểm đến';
    if (!formData.totalSeats || formData.totalSeats < 1) newErrors.totalSeats = 'Số ghế phải lớn hơn 0';
    if (!formData.departDate) newErrors.departDate = 'Vui lòng chọn ngày khởi hành';
    if (formData.returnDate && formData.returnDate <= formData.departDate) {
      newErrors.returnDate = 'Ngày về phải sau ngày khởi hành';
    }
    if (!formData.departTime) newErrors.departTime = 'Vui lòng nhập giờ khởi hành';
    if (!formData.arrivalTime) newErrors.arrivalTime = 'Vui lòng nhập giờ đến';
    if (!formData.pickupPoint.trim()) newErrors.pickupPoint = 'Vui lòng nhập điểm đón';
    if (!formData.dropoffPoint.trim()) newErrors.dropoffPoint = 'Vui lòng nhập điểm trả';
    if (!formData.price || formData.price < 0) newErrors.price = 'Vui lòng nhập giá vé hợp lệ';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Transform form data to match the original structure
    const transportData = {
      company: formData.company.trim(),
      route: {
        fromCity: formData.fromCity.trim(),
        toCity: formData.toCity.trim()
      },
      bus: {
        seatType: formData.seatType,
        totalSeats: parseInt(formData.totalSeats),
        features: formData.features.trim(),
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(item => item)
      },
      schedule: {
        departDate: new Date(formData.departDate).toISOString(),
        returnDate: formData.returnDate ? new Date(formData.returnDate).toISOString() : null,
        departTime: formData.departTime,
        arrivalTime: formData.arrivalTime,
        duration: formData.duration,
        pickupPoint: formData.pickupPoint.trim(),
        dropoffPoint: formData.dropoffPoint.trim()
      },
      price: parseInt(formData.price),
      rating: 0,
      reviews: 0,
      isActive: formData.isActive
    };

    console.log('Transport Data:', transportData);
    onSave(transportData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {transport ? 'Sửa thông tin chuyến xe' : 'Thêm chuyến xe mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Company Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin công ty</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên công ty *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.company ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="VD: Hà Nội Travel"
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tuyến đường</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm đi *
                </label>
                <input
                  type="text"
                  value={formData.fromCity}
                  onChange={(e) => handleChange('fromCity', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fromCity ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="VD: Hà Nội"
                />
                {errors.fromCity && <p className="text-red-500 text-sm mt-1">{errors.fromCity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm đến *
                </label>
                <input
                  type="text"
                  value={formData.toCity}
                  onChange={(e) => handleChange('toCity', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.toCity ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="VD: Đà Nẵng"
                />
                {errors.toCity && <p className="text-red-500 text-sm mt-1">{errors.toCity}</p>}
              </div>
            </div>
          </div>

          {/* Bus Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin xe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại ghế
                </label>
                <select
                  value={formData.seatType}
                  onChange={(e) => handleChange('seatType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Ghế ngồi">Ghế ngồi</option>
                  <option value="Giường nằm">Giường nằm</option>
                  <option value="Limousine">Limousine</option>
                  <option value="Ghế VIP - 24 chỗ">Ghế VIP - 24 chỗ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số ghế *
                </label>
                <input
                  type="number"
                  value={formData.totalSeats}
                  onChange={(e) => handleChange('totalSeats', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.totalSeats ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="40"
                  min="1"
                />
                {errors.totalSeats && <p className="text-red-500 text-sm mt-1">{errors.totalSeats}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiện nghi
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => handleChange('features', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Ghế da cao cấp, có massage, màn hình giải trí"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dịch vụ đi kèm
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => handleChange('amenities', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Wifi, Điều hòa, Nước uống (cách nhau bằng dấu phẩy)"
                />
                <p className="text-sm text-gray-500 mt-1">Phân cách các dịch vụ bằng dấu phẩy</p>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch trình</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày khởi hành *
                </label>
                <input
                  type="date"
                  value={formData.departDate}
                  onChange={(e) => handleChange('departDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.departDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.departDate && <p className="text-red-500 text-sm mt-1">{errors.departDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày về
                </label>
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => handleChange('returnDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.returnDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>}
                <p className="text-sm text-gray-500 mt-1">Tùy chọn - dành cho vé khứ hồi</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ khởi hành *
                </label>
                <input
                  type="time"
                  value={formData.departTime}
                  onChange={(e) => handleChange('departTime', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.departTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.departTime && <p className="text-red-500 text-sm mt-1">{errors.departTime}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ đến *
                </label>
                <input
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => handleChange('arrivalTime', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.arrivalTime ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.arrivalTime && <p className="text-red-500 text-sm mt-1">{errors.arrivalTime}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian di chuyển
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: 4h 30m"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm đón *
                </label>
                <input
                  type="text"
                  value={formData.pickupPoint}
                  onChange={(e) => handleChange('pickupPoint', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.pickupPoint ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="VD: Bến xe Miền Đông"
                />
                {errors.pickupPoint && <p className="text-red-500 text-sm mt-1">{errors.pickupPoint}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm trả *
                </label>
                <input
                  type="text"
                  value={formData.dropoffPoint}
                  onChange={(e) => handleChange('dropoffPoint', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dropoffPoint ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="VD: Bến xe Đà Lạt"
                />
                {errors.dropoffPoint && <p className="text-red-500 text-sm mt-1">{errors.dropoffPoint}</p>}
              </div>
            </div>
          </div>

          {/* Price and Status */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Giá và trạng thái</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá vé (VNĐ) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="180000"
                  min="0"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <div className="flex items-center space-x-4 pt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value={true}
                      checked={formData.isActive === true}
                      onChange={() => handleChange('isActive', true)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Hoạt động</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value={false}
                      checked={formData.isActive === false}
                      onChange={() => handleChange('isActive', false)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Tạm dừng</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {transport ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TransportManagement = () => {
  // Dữ liệu mẫu - cập nhật với returnDate
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTransport, setEditingTransport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transports based on search
  const filteredTransports = transports.filter(transport =>
    transport.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.route.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.route.toCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = pagination.totalPages;
  const currentTransports = transports; // API đã trả về đúng số lượng items

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  useEffect(() => {
    fetchTransports(currentPage);
  }, [currentPage]); // Reload khi đổi trang

  // Thêm debounce cho search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset về trang 1 khi search
      fetchTransports(1);
    }, 500); // Đợi 500ms sau khi user ngừng gõ

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchTransports = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        isActive: undefined // hoặc lọc theo trạng thái nếu cần
      };

      const response = await transportAPI.getAllTransports(params);

      if (response.success) {
        setTransports(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
      console.error('Error fetching transports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyến xe này?')) {
      try {
        setLoading(true);
        const response = await transportAPI.deleteTransport(id);

        if (response.success) {
          // Reload lại danh sách sau khi xóa
          await fetchTransports(currentPage);
          alert('Xóa chuyến xe thành công');
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa');
        console.error('Error deleting transport:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit
  const handleEdit = (transport) => {
    setEditingTransport(transport);
    setShowModal(true);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingTransport(null);
    setShowModal(true);
  };

  // Toggle active status
  const toggleActive = async (id) => {
    try {
      setLoading(true);
      const transport = transports.find(t => t._id === id);

      const response = await transportAPI.patchTransport(id, {
        isActive: !transport.isActive
      });

      if (response.success) {
        // Cập nhật state local
        setTransports(transports.map(t =>
          t._id === id ? { ...t, isActive: !t.isActive } : t
        ));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
      console.error('Error toggling active status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Quản lý chuyến xe</h1>
              <p className="text-gray-600 mt-1">Quản lý tất cả chuyến xe trong hệ thống</p>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Thêm chuyến xe
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo công ty, điểm đi, điểm đến..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tổng chuyến xe</p>
                <p className="text-2xl font-bold text-gray-900">{transports.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transports.filter(t => t.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Có vé khứ hồi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transports.filter(t => t.schedule.returnDate).length}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Transport List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Công ty & Tuyến đường
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lịch trình
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xe & Ghế
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentTransports.map((transport) => (
                  <tr key={transport._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transport.company}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {transport.route.fromCity} → {transport.route.toCity}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        Đi: {formatDate(transport.schedule.departDate)}
                      </div>
                      {transport.schedule.returnDate && (
                        <div className="text-sm text-blue-600">
                          Về: {formatDate(transport.schedule.returnDate)}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        {transport.schedule.departTime} - {transport.schedule.arrivalTime}
                      </div>
                      <div className="text-xs text-gray-500">
                        Thời gian: {transport.schedule.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{transport.bus.seatType}</div>
                      <div className="text-sm text-gray-600">{transport.bus.totalSeats} ghế</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(transport.price)}
                      </div>
                      {transport.schedule.returnDate && (
                        <div className="text-xs text-blue-600">Khứ hồi</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-900 ml-1">{transport.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({transport.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(transport._id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${transport.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {transport.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(transport)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transport._id)}
                          className="text-red-600 hover:text-red-900"
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

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {currentTransports.map((transport) => (
              <div key={transport._id} className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{transport.company}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {transport.route.fromCity} → {transport.route.toCity}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(transport)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(transport._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Ngày đi:</span>
                    <div className="font-medium">{formatDate(transport.schedule.departDate)}</div>
                  </div>
                  {transport.schedule.returnDate && (
                    <div>
                      <span className="text-gray-500">Ngày về:</span>
                      <div className="font-medium text-blue-600">{formatDate(transport.schedule.returnDate)}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Giờ:</span>
                    <div className="font-medium">{transport.schedule.departTime} - {transport.schedule.arrivalTime}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Loại xe:</span>
                    <div className="font-medium">{transport.bus.seatType} ({transport.bus.totalSeats} ghế)</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Giá:</span>
                    <div className="font-medium text-blue-600">
                      {formatCurrency(transport.price)}
                      {transport.schedule.returnDate && <span className="text-xs ml-1">(Khứ hồi)</span>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-900 ml-1">{transport.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({transport.reviews} đánh giá)</span>
                  </div>
                  <button
                    onClick={() => toggleActive(transport._id)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${transport.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {transport.isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredTransports.length)}
                {' '}trong tổng số {filteredTransports.length} chuyến xe
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded ${currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredTransports.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy chuyến xe nào</h3>
            <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc thêm chuyến xe mới</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <TransportModal
            transport={editingTransport}
            onClose={() => {
              setShowModal(false);
              setEditingTransport(null);
            }}
            onSave={async (transportData) => {
              try {
                setLoading(true);

                if (editingTransport) {
                  // Update existing
                  const response = await transportAPI.updateTransport(
                    editingTransport._id,
                    transportData
                  );

                  if (response.success) {
                    alert('Cập nhật thành công');
                    await fetchTransports(currentPage);
                  }
                } else {
                  // Create new
                  const response = await transportAPI.createTransport(transportData);

                  if (response.success) {
                    alert('Thêm mới thành công');
                    await fetchTransports(1); // Quay về trang 1
                    setCurrentPage(1);
                  }
                }

                setShowModal(false);
                setEditingTransport(null);
              } catch (err) {
                alert(err.response?.data?.message || 'Có lỗi xảy ra');
                console.error('Error saving transport:', err);
              } finally {
                setLoading(false);
              }
            }}
          />
        )}
      </div>
    </div >
  );
};

export default TransportManagement;