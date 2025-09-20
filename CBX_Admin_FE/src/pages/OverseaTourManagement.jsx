import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Calendar, Users, Star, Clock, DollarSign, Plane } from 'lucide-react';

const OverseaTourManagement = ({ onEdit, onAdd }) => {
  // Sample data - thay thế bằng API calls thực tế
  const [tours, setTours] = useState([
    {
      "_id": "68bbd49d776872470a508d82",
      "slug": "tour-chau-my",
      "image": "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "title": "Tour Hà Nội - Hạ Long - Sapa",
      "departure": "Khởi hành từ Hà Nội",
      "price": "4.500.000 đ",
      "duration": "Chương trình 4 ngày 3 đêm",
      "airline": "Vietnam Airlines",
      "scheduleInfo": "Khởi hành hàng ngày",
      "continent": "Châu Mỹ",
      "isDeleted": false,
      "createdAt": "2025-09-08T07:14:03.720Z"
    },
    {
      "_id": "68bbd49d776872470a508d83",
      "slug": "tour-chau-au",
      "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "title": "Tour Paris - Rome - Berlin",
      "departure": "Khởi hành từ TP.HCM",
      "price": "45.000.000 đ",
      "duration": "Chương trình 10 ngày 9 đêm",
      "airline": "Lufthansa",
      "scheduleInfo": "Khởi hành thứ 2, 4, 6",
      "continent": "Châu Âu",
      "isDeleted": false,
      "createdAt": "2025-09-08T08:14:03.720Z"
    },
    {
      "_id": "68bbd49d776872470a508d84",
      "slug": "tour-nhat-ban",
      "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "title": "Tour Tokyo - Osaka - Kyoto",
      "departure": "Khởi hành từ Hà Nội",
      "price": "25.000.000 đ",
      "duration": "Chương trình 6 ngày 5 đêm",
      "airline": "Japan Airlines",
      "scheduleInfo": "Khởi hành cuối tuần",
      "continent": "Châu Á",
      "isDeleted": false,
      "createdAt": "2025-09-08T09:14:03.720Z"
    },
    {
      "_id": "68bbd49d776872470a508d85",
      "slug": "tour-uc-new-zealand",
      "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "title": "Tour Sydney - Melbourne - Auckland",
      "departure": "Khởi hành từ TP.HCM",
      "price": "38.000.000 đ",
      "duration": "Chương trình 8 ngày 7 đêm",
      "airline": "Qantas Airways",
      "scheduleInfo": "Khởi hành hàng tuần",
      "continent": "Châu Đại Dương",
      "isDeleted": false,
      "createdAt": "2025-09-08T10:14:03.720Z"
    }
  ]);

  const handleEdit = (tour) => {
    // Callback để chuyển sang EditTour component với dữ liệu tour
    if (onEdit) {
      onEdit(tour);
    }
  };

  const handleDelete = (tourId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      setTours(tours.filter(tour => tour._id !== tourId));
    }
  };

  const handleAdd = () => {
    // Callback để chuyển sang EditTour component với mode thêm mới
    if (onAdd) {
      onAdd();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getContinentColor = (continent) => {
    const colors = {
      'Châu Á': 'bg-green-600',
      'Châu Âu': 'bg-purple-600',
      'Châu Mỹ': 'bg-orange-600',
      'Châu Phi': 'bg-yellow-600',
      'Châu Đại Dương': 'bg-cyan-600'
    };
    return colors[continent] || 'bg-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý Tour Nước ngoài</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Thêm Tour Mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-2 right-2 ${getContinentColor(tour.continent)} text-white px-2 py-1 rounded text-sm`}>
                  {tour.continent}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{tour.title}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{tour.departure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane size={16} />
                    <span>{tour.airline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{tour.scheduleInfo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    <span className="font-semibold text-blue-600">{tour.price}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Tạo ngày: {formatDate(tour.createdAt)}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(tour)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors"
                  >
                    <Edit size={16} />
                    <span className="hidden sm:inline">Sửa</span>
                  </button>
                  <button
                    onClick={() => handleDelete(tour._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverseaTourManagement;