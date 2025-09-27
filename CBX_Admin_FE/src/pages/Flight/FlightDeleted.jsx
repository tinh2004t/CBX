import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plane,
    Calendar,
    Clock,
    RefreshCw,
    RotateCcw,
    Trash2,
    X,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Loader2
} from 'lucide-react';
import flightAPI from '../../api/flightApi';

const DeletedFlightManagement = () => {
    const navigate = useNavigate();
    // State management
    const [deletedFlights, setDeletedFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFlights, setExpandedFlights] = useState(new Set());
    const [actionLoading, setActionLoading] = useState({});

    // Load deleted flights
    const loadDeletedFlights = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await flightAPI.getDeletedFlights();

            if (response.success) {
                setDeletedFlights(response.data);
            } else {
                throw new Error(response.message || 'Không thể tải dữ liệu chuyến bay đã xóa');
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
            console.error('Error loading deleted flights:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadDeletedFlights();
    }, []);

    // Filter flights based on search term
    useEffect(() => {
        let filtered = deletedFlights;

        if (searchTerm) {
            filtered = filtered.filter(flight =>
                flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
                flight.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                flight.flights.some(f => f.flightCode.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredFlights(filtered);
    }, [searchTerm, deletedFlights]);

    // Toggle flight expansion
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

    // Refresh data
    const refreshData = () => {
        loadDeletedFlights();
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Còn chỗ': return 'bg-green-100 text-green-800';
            case 'Sắp hết': return 'bg-yellow-100 text-yellow-800';
            case 'Hết chỗ': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Restore flight
    const restoreFlight = async (flightId) => {
        if (!window.confirm('Bạn có chắc chắn muốn khôi phục chuyến bay này?')) {
            return;
        }

        try {
            setActionLoading(prev => ({ ...prev, [flightId]: 'restore' }));
            const response = await flightAPI.restoreFlight(flightId);

            if (response.success) {
                await loadDeletedFlights();
                alert('Khôi phục chuyến bay thành công!');
            } else {
                throw new Error(response.message || 'Không thể khôi phục chuyến bay');
            }
        } catch (err) {
            alert('Lỗi khi khôi phục chuyến bay: ' + err.message);
            console.error('Error restoring flight:', err);
        } finally {
            setActionLoading(prev => {
                const newState = { ...prev };
                delete newState[flightId];
                return newState;
            });
        }
    };

    // Delete permanently
    const deletePermanently = async (flightId) => {
        if (!window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn chuyến bay này? Hành động này không thể hoàn tác!')) {
            return;
        }

        // Double confirmation for permanent delete
        if (!window.confirm('Xác nhận lần cuối: Chuyến bay sẽ bị xóa vĩnh viễn khỏi hệ thống!')) {
            return;
        }

        try {
            setActionLoading(prev => ({ ...prev, [flightId]: 'delete' }));
            const response = await flightAPI.deletePermanent(flightId);

            if (response.success) {
                await loadDeletedFlights();
                alert('Xóa vĩnh viễn chuyến bay thành công!');
            } else {
                throw new Error(response.message || 'Không thể xóa vĩnh viễn chuyến bay');
            }
        } catch (err) {
            alert('Lỗi khi xóa vĩnh viễn chuyến bay: ' + err.message);
            console.error('Error permanently deleting flight:', err);
        } finally {
            setActionLoading(prev => {
                const newState = { ...prev };
                delete newState[flightId];
                return newState;
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <button
                                onClick={() => navigate('/ve-may-bay')}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Quay lại
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Trash2 className="text-red-600" />
                                Chuyến bay đã xóa
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Quản lý các chuyến bay đã bị xóa trong hệ thống
                                {deletedFlights.length > 0 && ` (${deletedFlights.length} chuyến bay)`}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={refreshData}
                                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                disabled={loading}
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                                Làm mới
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

                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="relative max-w-md">
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
                </div>

                {/* Warning Banner */}
                {deletedFlights.length > 0 && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <h3 className="font-medium text-amber-800">Lưu ý quan trọng</h3>
                                <p className="text-amber-700 text-sm mt-1">
                                    Các chuyến bay ở đây đã bị xóa mềm. Bạn có thể khôi phục chúng hoặc xóa vĩnh viễn.
                                    Việc xóa vĩnh viễn sẽ không thể hoàn tác.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

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
                            <div key={flight._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow opacity-75">
                                <div className="p-6 border-b bg-gray-50">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={flight.airlineLogo}
                                                alt={flight.airline}
                                                className="w-12 h-12 object-contain grayscale"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iNCIgZmlsbD0iIzMzNzNkYyIvPgo8cGF0aCBkPSJNMTIgMjRMMzYgMTJWMzZMMTIgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
                                                }}
                                            />
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-700 line-through">
                                                    {flight.departure} → {flight.destination}
                                                </h3>
                                                <p className="text-gray-500">{flight.airline}</p>
                                                <p className="text-sm text-red-600 font-medium">
                                                    Đã xóa: {new Date(flight.deletedAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar size={16} />
                                                    <span>{new Date(flight.date).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                <div className="text-lg font-semibold text-gray-600">
                                                    {flight.price} VND
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => restoreFlight(flight._id)}
                                                    disabled={actionLoading[flight._id]}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Khôi phục chuyến bay"
                                                >
                                                    {actionLoading[flight._id] === 'restore' ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <RotateCcw size={18} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => deletePermanently(flight._id)}
                                                    disabled={actionLoading[flight._id]}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Xóa vĩnh viễn"
                                                >
                                                    {actionLoading[flight._id] === 'delete' ? (
                                                        <Loader2 size={18} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Flight summary and expand button */}
                                <div className="px-6 py-4 bg-gray-50 border-b">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Plane size={16} className="text-gray-400" />
                                                <span className="text-gray-600">
                                                    {flight.flights.length} chuyến bay
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                {[...new Set(flight.flights.map(f => f.status))].map(status => (
                                                    <span key={status} className={`px-2 py-1 rounded-full text-xs font-medium opacity-75 ${getStatusColor(status)}`}>
                                                        {status}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleFlightExpansion(flight._id)}
                                            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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

                                {/* Flight details with animation */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedFlights.has(flight._id) ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <div className="p-6 bg-gray-50">
                                        <div className="grid gap-4">
                                            {flight.flights.map((flightDetail) => (
                                                <div key={flightDetail._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg gap-4 border-l-4 border-gray-400 opacity-75">
                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={16} className="text-gray-400" />
                                                            <div>
                                                                <div className="font-semibold text-gray-600">{flightDetail.time}</div>
                                                                <div className="text-sm text-gray-500">{flightDetail.duration}</div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="font-semibold text-gray-600">{flightDetail.flightCode}</div>
                                                            <div className="text-sm text-gray-500">{flightDetail.aircraft}</div>
                                                        </div>

                                                        <div className="col-span-2 sm:col-span-1 flex justify-start sm:justify-center">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium opacity-75 ${getStatusColor(flightDetail.status)}`}>
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
                        <Trash2 size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Không có chuyến bay đã xóa</h3>
                        <p className="text-gray-600">
                            {deletedFlights.length === 0
                                ? 'Chưa có chuyến bay nào bị xóa trong hệ thống.'
                                : 'Không tìm thấy chuyến bay phù hợp với tìm kiếm của bạn.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeletedFlightManagement;