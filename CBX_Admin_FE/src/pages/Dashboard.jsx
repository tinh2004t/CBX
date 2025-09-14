import React, { useState } from 'react';
import { Activity, Users, Eye, Search, Calendar, User, FileText, Clock } from 'lucide-react';

const Dashboard = () => {
  // Sample data for admin logs
  const adminLogs = [
    {
      _id: "68c1393dec80cca0d0fc0ba0",
      adminId: "68bd2854e85e2d0c64204a64",
      adminUsername: "newadmin",
      action: "Tạo MICE tour",
      targetUser: JSON.stringify({
        slug: 'mice-tour-du-lich-ha-noi-nha-tho-da-lat-da-nang',
        name: 'mice tour du lịch hà nội nhà thờ đà lạt đà nẵng',
        image: 'https://iit.com.vn/files/images/Article/5-dieu-can-biet-khi-thiet-ke-website-du-lich.jpg',
        duration: '3 ngày 2 đêm',
        location: 'Đà Lạt, Lâm Đồng',
        rating: 4.8,
        price: '1000000',
        category: 'teambuilding'
      }, null, 2),
      createdAt: "2025-09-10T08:39:25.942Z"
    },
    {
      _id: "68c1393dec80cca0d0fc0ba1",
      adminId: "68bd2854e85e2d0c64204a65",
      adminUsername: "admin_manager",
      action: "Cập nhật tour",
      targetUser: JSON.stringify({
        slug: 'tour-ha-long-bay',
        name: 'Tour Hạ Long Bay 2 ngày 1 đêm',
        duration: '2 ngày 1 đêm',
        location: 'Hạ Long, Quảng Ninh',
        price: '800000'
      }, null, 2),
      createdAt: "2025-09-10T07:25:15.123Z"
    },
    {
      _id: "68c1393dec80cca0d0fc0ba2",
      adminId: "68bd2854e85e2d0c64204a66",
      adminUsername: "content_admin",
      action: "Xóa bài viết",
      targetUser: JSON.stringify({
        title: 'Kinh nghiệm du lịch Đà Nẵng',
        category: 'blog',
        author: 'travel_writer'
      }, null, 2),
      createdAt: "2025-09-10T06:15:30.456Z"
    },
    {
      _id: "68c1393dec80cca0d0fc0ba3",
      adminId: "68bd2854e85e2d0c64204a67",
      adminUsername: "support_admin",
      action: "Phản hồi khách hàng",
      targetUser: JSON.stringify({
        customerId: 'cust_001',
        subject: 'Hủy tour do thời tiết',
        status: 'resolved'
      }, null, 2),
      createdAt: "2025-09-10T05:45:12.789Z"
    }
  ];

  // Sample data for active admins
  const activeAdmins = [
    {
      id: "68bd2854e85e2d0c64204a64",
      username: "newadmin",
      fullName: "Nguyễn Văn An",
      role: "Super Admin",
      lastActivity: "2025-09-10T08:39:25.942Z",
      status: "online",
      avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=3b82f6&color=fff"
    },
    {
      id: "68bd2854e85e2d0c64204a65",
      username: "admin_manager",
      fullName: "Trần Thị Bình",
      role: "Tour Manager",
      lastActivity: "2025-09-10T08:15:10.123Z",
      status: "online",
      avatar: "https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=10b981&color=fff"
    },
    {
      id: "68bd2854e85e2d0c64204a66",
      username: "content_admin",
      fullName: "Lê Văn Cường",
      role: "Content Admin",
      lastActivity: "2025-09-10T07:50:45.456Z",
      status: "idle",
      avatar: "https://ui-avatars.com/api/?name=Le+Van+Cuong&background=f59e0b&color=fff"
    },
    {
      id: "68bd2854e85e2d0c64204a67",
      username: "support_admin",
      fullName: "Phạm Thị Dung",
      role: "Support Admin",
      lastActivity: "2025-09-10T08:30:20.789Z",
      status: "online",
      avatar: "https://ui-avatars.com/api/?name=Pham+Thi+Dung&background=8b5cf6&color=fff"
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');

  // Filter logs based on search and action
  const filteredLogs = adminLogs.filter(log => {
    const matchesSearch = log.adminUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action.includes(selectedAction);
    return matchesSearch && matchesAction;
  });

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

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Truncate long text
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản Trị</h1>
              <p className="text-gray-600 mt-1">Quản lý hoạt động và theo dõi hệ thống</p>
            </div>
            <div className="flex items-center space-x-4">
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
                <p className="text-2xl font-bold text-gray-900">{adminLogs.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {activeAdmins.filter(admin => admin.status === 'online').length}
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
                <p className="text-2xl font-bold text-gray-900">{adminLogs.length}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Admin</p>
                <p className="text-2xl font-bold text-gray-900">{activeAdmins.length}</p>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Nhật Ký Hoạt Động</h2>
                <div className="flex items-center space-x-2">
                  <select 
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="Tạo">Tạo</option>
                    <option value="Cập nhật">Cập nhật</option>
                    <option value="Xóa">Xóa</option>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
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
                  {filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {log.adminUsername.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {log.adminUsername}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
            </div>
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có hoạt động</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Không tìm thấy hoạt động nào phù hợp với bộ lọc.
                </p>
              </div>
            )}
          </div>

          {/* Active Admins */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Admin Đang Hoạt Động</h2>
              <p className="text-sm text-gray-600 mt-1">
                {activeAdmins.filter(admin => admin.status === 'online').length} admin đang online
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              {activeAdmins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={admin.avatar}
                        alt={admin.fullName}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(admin.status)}`}></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {admin.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        @{admin.username}
                      </div>
                      <div className="text-xs text-gray-400">
                        {admin.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      admin.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : admin.status === 'idle'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {admin.status === 'online' ? 'Trực tuyến' : admin.status === 'idle' ? 'Chờ' : 'Ngoại tuyến'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDate(admin.lastActivity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;