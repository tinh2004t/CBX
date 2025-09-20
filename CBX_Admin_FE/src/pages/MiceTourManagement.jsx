import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Calendar, Clock, DollarSign, Star } from 'lucide-react';

const MiceTourManagement = ({ onEdit, onAdd }) => {
  // Sample data - sau này thay bằng API call thực tế
  const [miceTours, setMiceTours] = useState([
    {
      "_id": "68bbd92b776872470a508d91",
      "slug": "hoi-thao",
      "name": "Hội thảo & Teambuilding Đà Lạt",
      "image": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=300&h=200&fit=crop",
      "duration": "3 ngày 2 đêm",
      "location": "Đà Lạt, Lâm Đồng",
      "rating": 4.8,
      "price": "1000đ",
      "createdAt": "2025-09-15T07:14:03.720Z"
    }
  ]);

  const handleEdit = (tour) => {
    if (onEdit) onEdit(tour);
  };

  const handleDelete = (tourId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa MICE tour này?')) {
      setMiceTours(miceTours.filter(tour => tour._id !== tourId));
    }
  };

  const handleAdd = () => {
    if (onAdd) onAdd();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản lý MICE Tours</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Thêm MICE Tour
          </button>
        </div>

        {/* Card list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {miceTours.map((tour) => (
            <div 
              key={tour._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-yellow-400 px-2 py-1 rounded text-xs">
                  <Star size={14} />
                  <span>{tour.rating}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{tour.name}</h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    <span className="font-semibold text-purple-600">{tour.price}</span>
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

export default MiceTourManagement;
