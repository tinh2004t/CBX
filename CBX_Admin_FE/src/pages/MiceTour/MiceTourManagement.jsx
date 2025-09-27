import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Calendar, Users, Star, Clock, DollarSign } from 'lucide-react';
import tourApi from '../../api/tourApi';
import { useNavigate } from 'react-router-dom';

const MiceTourManagement = ({ onEdit, onAdd }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tourApi.getToursByType('mice');
      
      // Debug: Log response để kiểm tra cấu trúc dữ liệu
      console.log('API Response:', response);
      
      if (response.success) {
        // Kiểm tra và log dữ liệu tours
        console.log('Tours data:', response.data);
        console.log('First tour structure:', response.data[0]);
        setTours(response.data);
      } else {
        setError('Không thể tải danh sách tour');
      }
    } catch (err) {
      setError('Lỗi kết nối API: ' + err.message);
      console.error('Error loading tours:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tour) => {
    const tourId = tour._id || tour.id || tour.tourId;
    if (!tourId) {
      alert('Lỗi: Không tìm thấy ID của tour');
      return;
    }
    navigate(`/mice/editor/${tour.slug}`);
  };

  const handleDeleted = () => {
    navigate('/mice/deleted');
  };

  const handleDelete = async (tour) => {
    // Lấy ID từ nhiều trường có thể có
    const tourId = tour._id || tour.id || tour.tourId;
    
    console.log('Tour object:', tour);
    console.log('tourId:', tourId);
    
    if (!tourId) {
      alert('Lỗi: Không tìm thấy ID của tour');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      try {
        console.log('Calling softDeleteTour with:', tourId);
        const response = await tourApi.softDeleteTour(tourId);
        
        if (response.success) {
          // Xóa tour khỏi state local - sử dụng cùng logic để tìm ID
          setTours(tours.filter(t => {
            const tId = t._id || t.id || t.tourId;
            return tId !== tourId;
          }));
        } else {
          alert('Không thể xóa tour: ' + response.message);
        }
      } catch (err) {
        alert('Lỗi khi xóa tour: ' + err.message);
        console.error('Error deleting tour:', err);
      }
    }
  };

  const handleAdd = () => {
    navigate('/mice/editor?mode=add');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Helper function để lấy ID an toàn
  const getTourId = (tour) => {
    return tour._id || tour.id || tour.tourId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Quản lý Mice Tour
          </h1>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleDeleted}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <Trash2 size={20} />
              Thùng Rác
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <Plus size={20} />
              Thêm Tour Mới
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={loadTours}
              className="ml-2 text-sm underline hover:no-underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Đang tải danh sách tour...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Chưa có tour nào được tạo
              </div>
            ) : (
              tours.map((tour) => {
                const tourId = getTourId(tour);
                
                return (
                  <div key={tourId || Math.random()} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-48 aspect-[4/3] object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                        {tour.category}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{tour.title}</h3>

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
                          <Users size={16} />
                          <span>{tour.groupSize}</span>
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
                          disabled={!tourId}
                        >
                          <Edit size={16} />
                          <span className="hidden sm:inline">Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDelete(tour)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                          disabled={!tourId}
                        >
                          <Trash2 size={16} />
                          <span className="hidden sm:inline">Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiceTourManagement;