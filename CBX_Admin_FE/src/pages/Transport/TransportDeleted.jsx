import { Search, RefreshCw, Trash2, MapPin, Star, Calendar, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import transportAPI from '../../api/transportApi';
import { useNavigate } from 'react-router-dom';

const TransportDeleted = () => {
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();

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

    // Format datetime
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    useEffect(() => {
        fetchDeletedTransports(currentPage);
    }, [currentPage]);

    // Debounce cho search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1);
            fetchDeletedTransports(1);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const fetchDeletedTransports = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: page,
                limit: itemsPerPage,
                search: searchTerm || undefined,
            };

            // 👉 Gọi API getDeletedTransports thay vì getAllTransports
            const response = await transportAPI.getDeletedTransports(params);

            if (response.success) {
                setTransports(response.data);
                setPagination(response.pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
            console.error('Error fetching deleted transports:', err);
        } finally {
            setLoading(false);
        }
    };


    // Handle restore
    const handleRestore = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn khôi phục chuyến xe này?')) {
            try {
                setLoading(true);
                const response = await transportAPI.restoreTransport(id);

                if (response.success) {
                    await fetchDeletedTransports(currentPage);
                    alert('Khôi phục chuyến xe thành công');
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Có lỗi xảy ra khi khôi phục');
                console.error('Error restoring transport:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle permanent delete
    const handlePermanentDelete = async (id) => {
        if (window.confirm('⚠️ CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn chuyến xe và KHÔNG THỂ KHÔI PHỤC. Bạn có chắc chắn muốn tiếp tục?')) {
            try {
                setLoading(true);
                const response = await transportAPI.permanentDeleteTransport(id);

                if (response.success) {
                    await fetchDeletedTransports(currentPage);
                    alert('Đã xóa vĩnh viễn chuyến xe');
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa vĩnh viễn');
                console.error('Error permanently deleting transport:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Pagination
    const totalPages = pagination.totalPages;

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">

                            <button
                                onClick={() => navigate('/dich-vu-van-tai')}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Quay lại
                            </button>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Chuyến xe đã xóa</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                            <span>Dữ liệu sẽ bị xóa vĩnh viễn sau 30 ngày</span>
                        </div>
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

                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-3 rounded-lg">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Tổng đã xóa</p>
                                <p className="text-2xl font-bold text-gray-900">{pagination.totalItems}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Có vé khứ hồi</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {transports.filter(t => t.schedule?.returnDate).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <RefreshCw className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Có thể khôi phục</p>
                                <p className="text-2xl font-bold text-gray-900">{transports.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transport List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
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
                                        Ngày xóa
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transports.map((transport) => (
                                    <tr key={transport._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{transport.company}</div>
                                                <div className="text-sm text-gray-600 flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {transport.route?.fromCity} → {transport.route?.toCity}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                Đi: {formatDate(transport.schedule?.departDate)}
                                            </div>
                                            {transport.schedule?.returnDate && (
                                                <div className="text-sm text-blue-600">
                                                    Về: {formatDate(transport.schedule.returnDate)}
                                                </div>
                                            )}
                                            <div className="text-sm text-gray-600">
                                                {transport.schedule?.departTime} - {transport.schedule?.arrivalTime}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Thời gian: {transport.schedule?.duration}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{transport.bus?.seatType}</div>
                                            <div className="text-sm text-gray-600">{transport.bus?.totalSeats} ghế</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(transport.price)}
                                            </div>
                                            {transport.schedule?.returnDate && (
                                                <div className="text-xs text-blue-600">Khứ hồi</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm text-gray-900 ml-1">{transport.rating || 0}</span>
                                                <span className="text-sm text-gray-500 ml-1">({transport.reviews || 0})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {transport.deletedAt ? formatDateTime(transport.deletedAt) : 'N/A'}
                                            </div>

                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleRestore(transport._id)}
                                                    className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                                                    title="Khôi phục"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handlePermanentDelete(transport._id)}
                                                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
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

                    {/* Mobile Cards */}
                    <div className="lg:hidden">
                        {transports.map((transport) => (
                            <div key={transport._id} className="p-4 border-b border-gray-200">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{transport.company}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {transport.route?.fromCity} → {transport.route?.toCity}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                    <div>
                                        <span className="text-gray-500">Ngày đi:</span>
                                        <div className="font-medium">{formatDate(transport.schedule?.departDate)}</div>
                                    </div>
                                    {transport.schedule?.returnDate && (
                                        <div>
                                            <span className="text-gray-500">Ngày về:</span>
                                            <div className="font-medium text-blue-600">{formatDate(transport.schedule.returnDate)}</div>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-gray-500">Giờ:</span>
                                        <div className="font-medium">{transport.schedule?.departTime} - {transport.schedule?.arrivalTime}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Loại xe:</span>
                                        <div className="font-medium">{transport.bus?.seatType} ({transport.bus?.totalSeats} ghế)</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Giá:</span>
                                        <div className="font-medium text-blue-600">
                                            {formatCurrency(transport.price)}
                                            {transport.schedule?.returnDate && <span className="text-xs ml-1">(Khứ hồi)</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Ngày xóa:</span>
                                        <div className="font-medium text-red-600 text-xs">
                                            {transport.deletedAt ? formatDateTime(transport.deletedAt) : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-900 ml-1">{transport.rating || 0}</span>
                                        <span className="text-sm text-gray-500 ml-1">({transport.reviews || 0})</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleRestore(transport._id)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Khôi phục
                                        </button>
                                        <button
                                            onClick={() => handlePermanentDelete(transport._id)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="text-sm text-gray-700">
                                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, pagination.totalItems)}
                                {' '}trong tổng số {pagination.totalItems} chuyến xe đã xóa
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
                {transports.length === 0 && !loading && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Trash2 className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không có chuyến xe nào đã bị xóa</h3>
                        <p className="text-gray-600">Các chuyến xe đã xóa sẽ xuất hiện tại đây</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransportDeleted;