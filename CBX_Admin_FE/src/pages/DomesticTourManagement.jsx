import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Calendar, Users, Star, Clock, DollarSign } from 'lucide-react';

const DomesticTourManagement = ({ onEdit, onAdd }) => {
  // Sample data - thay thế bằng API calls thực tế
  const [tours, setTours] = useState([
    {
      "_id": "68be823b58807f7a9ac1c4c8",
      "slug": "tour-ha-noi-nha-tho-lon",
      "image": "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      "title": "Tour Hà Nội - Nhà thờ lớn",
      "departure": "Hà Nội",
      "price": "3.200.000 đ",
      "duration": "Chương trình 3 ngày 2 đêm",
      "airline": "Xe du lịch",
      "scheduleInfo": "Cuối tuần",
      "region": "Miền Bắc",
      "isDeleted": false,
      "createdAt": "2025-09-08T07:14:03.720Z"
    },
    {
      "_id": "68be823b58807f7a9ac1c4c9",
      "slug": "tour-sapa-fansipan",
      "image": "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "title": "Tour Sapa - Fansipan",
      "departure": "Hà Nội",
      "price": "4.500.000 đ",
      "duration": "Chương trình 4 ngày 3 đêm",
      "airline": "Xe du lịch",
      "scheduleInfo": "Hàng ngày",
      "region": "Miền Bắc",
      "isDeleted": false,
      "createdAt": "2025-09-08T08:14:03.720Z"
    },
    {
      "_id": "68be823b58807f7a9ac1c4d0",
      "slug": "tour-ha-long-bay",
      "image": "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "title": "Tour Vịnh Hạ Long - Cát Bà",
      "departure": "Hà Nội",
      "price": "2.800.000 đ",
      "duration": "Chương trình 2 ngày 1 đêm",
      "airline": "Xe du lịch + Tàu",
      "scheduleInfo": "Thứ 7 - Chủ nhật",
      "region": "Miền Bắc",
      "isDeleted": false,
      "createdAt": "2025-09-08T09:14:03.720Z"
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý Tour Nội địa</h1>
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
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                  {tour.region}
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

export default DomesticTourManagement;