import React, { useState, useEffect, useRef } from 'react';
import { Activity, Users, Eye, Search, Calendar, User, FileText, Clock, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import adminLogAPI from '../api/adminLog';
import socketAPI from '../api/socket';
import authAPI from '../api/auth';

const Dashboard = ({ user }) => {
  // State cho admin logs
  const [adminLogs, setAdminLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });

  // State cho real-time admin activity
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // State cho filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);



  // Refs
  const socketConnectedRef = useRef(false);

  // Initialize Socket Connection
  // THAY ĐỔI useEffect khởi tạo socket
  // Lắng nghe socket events (socket đã được connect ở App.jsx)
  useEffect(() => {
    // Check socket connection status
    const checkConnection = () => {
      const connected = socketAPI.isConnected();
      setIsSocketConnected(connected);
      socketConnectedRef.current = connected;

      if (connected) {
        fetchOnlineUsers();
      }
    };

    checkConnection();

    // Lắng nghe events
    socketAPI.on('connect', () => {
      console.log('✅ Dashboard: Socket connected');
      setIsSocketConnected(true);
      socketConnectedRef.current = true;
      fetchOnlineUsers();
    });

    socketAPI.on('disconnect', (reason) => {
      console.log('❌ Dashboard: Socket disconnected:', reason);
      setIsSocketConnected(false);
      socketConnectedRef.current = false;
    });

    socketAPI.on('users_online_update', (data) => {
      console.log('📊 Online users updated:', data);
      setOnlineUsers(data.users || []);
      setOnlineCount(data.count || 0);
    });

    // Cleanup: chỉ remove listeners, KHÔNG disconnect
    return () => {
      socketAPI.off('connect');
      socketAPI.off('disconnect');
      socketAPI.off('users_online_update');
    };
  }, []);

  // Fetch online users từ API
  // Fetch online users từ API
  const fetchOnlineUsers = async () => {
    try {
      const res = await socketAPI.getOnlineUsers();
      if (res.success) {
        setOnlineUsers(res.data.users || []);
        setOnlineCount(res.data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching online users:", error);
    }
  };


  // Fetch admin logs từ API
  const fetchAdminLogs = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: currentPage,
        limit: 20,
        ...params
      };

      if (selectedAction !== 'all') {
        queryParams.action = selectedAction;
      }

      const response = await adminLogAPI.getLogs(queryParams);

      if (response.success) {
        setAdminLogs(response.data);
        setPagination(response.pagination);
      } else {
        setError('Không thể tải dữ liệu nhật ký');
      }
    } catch (err) {
      console.error('Error fetching admin logs:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Effect để load dữ liệu ban đầu
  useEffect(() => {
    fetchAdminLogs();
  }, [currentPage, selectedAction]);

  // Effect để tìm kiếm với debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1);
        fetchAdminLogs({ search: searchTerm });
      } else {
        fetchAdminLogs();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Auto refresh online users mỗi 30 giây
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (socketConnectedRef.current) {
  //       fetchOnlineUsers();
  //     }
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, []);

  // Xử lý thay đổi action filter
  const handleActionChange = (action) => {
    setSelectedAction(action);
    setCurrentPage(1);
  };

  // Xử lý refresh dữ liệu
  const handleRefresh = () => {
    setSearchTerm('');
    setSelectedAction('all');
    setCurrentPage(1);
    fetchAdminLogs();
    fetchOnlineUsers();
  };

  // Xử lý phân trang
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Reconnect socket
  const handleReconnectSocket = () => {
    const token = authAPI.getToken();
    if (token) {
      socketAPI.disconnect();
      setTimeout(() => {
        socketAPI.connect(token);
      }, 1000);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  };

  // Get status color
  const getStatusColor = (isOnline) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  // Truncate long text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Get action badge color
  const getActionBadgeColor = (action) => {
    if (action.includes('Tạo')) return 'bg-green-100 text-green-800';
    if (action.includes('Cập nhật')) return 'bg-blue-100 text-blue-800';
    if (action.includes('Xóa')) return 'bg-red-100 text-red-800';
    if (action.includes('Khôi phục')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Filter chỉ admin users
  const adminUsers = onlineUsers.filter(u =>
    ['Admin', 'SuperAdmin'].includes(u.role)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Quản Trị</h1>
              <p className="text-sm lg:text-base text-gray-600 mt-1">Quản lý hoạt động và theo dõi hệ thống real-time</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:gap-4">
              {/* Connection Status */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${isSocketConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {isSocketConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                <span>{isSocketConnected ? 'Kết nối' : 'Mất kết nối'}</span>
                {!isSocketConnected && (
                  <button
                    onClick={handleReconnectSocket}
                    className="ml-2 text-xs underline hover:no-underline"
                  >
                    Kết nối lại
                  </button>
                )}
              </div>



              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Hoạt Động</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {loading ? '...' : pagination.total}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Online</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {adminUsers.length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoạt Động Hôm Nay</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {loading ? '...' : adminLogs.length}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Admin Logs Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Nhật Ký Hoạt Động</h2>
                <div className="flex items-center space-x-2">
                  <select className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                    {/* ... */}
                  </select>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo admin hoặc hoạt động..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            {error && (
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                  <button
                    onClick={handleRefresh}
                    className="ml-auto text-red-600 hover:text-red-700 underline text-sm"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2 text-gray-500">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Đang tải dữ liệu...</span>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <table className="hidden md:table w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hoạt Động
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chi Tiết
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời Gian
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 relative">
                              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {log.adminUsername.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              {/* Online indicator */}
                              {onlineUsers.some(u => u.username === log.adminUsername) && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {log.adminUsername}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {truncateText(log.targetUser)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(log.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Mobile Card List */}
                <div className="md:hidden space-y-3 p-4">
                  {adminLogs.map((log) => (
                    <div key={log._id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                      {/* Admin Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {log.adminUsername.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            {onlineUsers.some(u => u.username === log.adminUsername) && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {log.adminUsername}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{formatDate(log.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Badge */}
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="text-sm text-gray-700 break-words">
                        <span className="font-medium text-gray-500">Chi tiết: </span>
                        {log.targetUser}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {!loading && !error && adminLogs.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có hoạt động</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Không tìm thấy hoạt động nào phù hợp với bộ lọc.
                </p>
              </div>
            )}

            {!loading && !error && pagination.total > pagination.limit && (
              <div className="px-4 lg:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-500">
                  Hiển thị {((currentPage - 1) * pagination.limit) + 1} - {Math.min(currentPage * pagination.limit, pagination.total)}
                  <span className="hidden sm:inline"> trong tổng số {pagination.total} kết quả</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <span className="text-sm text-gray-700">
                    Trang {currentPage} / {Math.ceil(pagination.total / pagination.limit)}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(pagination.total / pagination.limit)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Online Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900"> Đang Online</h2>

                </div>
                <div className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {!isSocketConnected ? (
                <div className="text-center py-8">
                  <WifiOff className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Mất kết nối</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Không thể hiển thị trạng thái online
                  </p>
                  <button
                    onClick={handleReconnectSocket}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
                  >
                    Thử kết nối lại
                  </button>
                </div>
              ) : onlineUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Không có ai online</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Hiện tại không có người dùng nào đang hoạt động.
                  </p>
                </div>
              ) : (
                <>
                  {/* Admin Users First */}
                  {adminUsers.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Quản trị viên ({adminUsers.length})</h3>
                      {adminUsers.map((userItem) => (
                        <div
                          key={userItem.userId}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border border-blue-200 rounded-lg mb-2 bg-blue-50"
                        >
                          {/* Avatar + Username */}
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="relative flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {(userItem.username || '').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                                  true
                                )}`}
                              ></div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {userItem.username}
                              </div>
                              <div className="text-xs text-blue-600 font-medium">
                                {userItem.role || 'Admin'}
                              </div>
                            </div>
                          </div>

                          {/* Status + Time */}
                          <div className="text-right sm:text-right flex-shrink-0">
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Online
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {formatRelativeTime(userItem.connectedAt || new Date())}
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  )}

                  {/* Other Users */}
                  {onlineUsers.filter(u => !['Admin', 'SuperAdmin'].includes(u.role)).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Người dùng khác ({onlineUsers.filter(u => !['Admin', 'SuperAdmin'].includes(u.role)).length})
                      </h3>
                      {onlineUsers
                        .filter(u => !['Admin', 'SuperAdmin'].includes(u.role))
                        .slice(0, 10) // Giới hạn hiển thị 10 user
                        .map((userItem) => (
                          <div key={userItem.userId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
                                  <span className="text-xs font-medium text-white">
                                    {(userItem.username || 'U').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(true)}`}></div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {userItem.username || 'Unknown User'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {userItem.role || 'User'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Online
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatRelativeTime(userItem.connectedAt || new Date())}
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Show more indicator if there are more users */}
                      {onlineUsers.filter(u => !['Admin', 'SuperAdmin'].includes(u.role)).length > 10 && (
                        <div className="text-center py-2 text-sm text-gray-500">
                          và {onlineUsers.filter(u => !['Admin', 'SuperAdmin'].includes(u.role)).length - 10} người dùng khác...
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;