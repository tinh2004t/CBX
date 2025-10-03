import { useState, useEffect } from 'react';
import { Eye, Calendar, Clock, MapPin, Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tourAPI from '../../api/TourApi';

const MiceToursPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 8;

  const navigate = useNavigate();

  // Fetch MICE tours khi component mount
  useEffect(() => {
    fetchMiceTours();
  }, []);

  const fetchMiceTours = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy tours MICE với phân trang
      const response = await tourAPI.getToursByType('mice');
      
      // Xử lý dữ liệu trả về
      if (response.success) {
        const toursData = response.data || response.tours || [];
        
        if (pageNum === 1) {
          setTours(toursData);
        } else {
          setTours(prev => [...prev, ...toursData]);
        }
        
        // Kiểm tra còn data để load thêm không
        setHasMore(toursData.length === limit);
        setPage(pageNum);
      } else {
        throw new Error(response.message || 'Không thể tải danh sách tour');
      }
    } catch (err) {
      console.error('Error fetching MICE tours:', err);
      setError(err.message || 'Đã có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchMiceTours(page + 1);
    }
  };

const handleViewDetails = (slug) => {
  navigate(`/tours/${slug}`);
};


  const handleBookTour = (tourId) => {
    console.log('Book tour:', tourId);
    // TODO: Implement booking logic
  };

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price || price === 0) return 'Theo yêu cầu';
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  // Format thời gian
  const formatDuration = (tour) => {
    if (tour.duration) return tour.duration;
    if (tour.days && tour.nights) {
      return `${tour.days} ngày ${tour.nights} đêm`;
    }
    return 'Theo yêu cầu';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              MICE Tours
            </h1>
            <p className="text-lg md:text-xl mb-6 text-blue-100">
              Meetings • Incentives • Conferences • Exhibitions
            </p>
            <p className="text-base text-blue-200 max-w-2xl mx-auto">
              Tạo nên những sự kiện doanh nghiệp đáng nhớ với các gói tour MICE được thiết kế riêng cho nhu cầu của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && tours.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Đang tải danh sách tour...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Đã có lỗi xảy ra</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={() => fetchMiceTours()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Tours Grid */}
        {!loading && !error && tours.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Chưa có tour MICE nào</p>
          </div>
        )}

        {tours.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tours.map((tour) => (
                <div
                  key={tour._id || tour.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                >
                  {/* Tour Image */}
                  <div className="relative w-full">
                    <img
                      src={tour.thumbnail || tour.image || 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=300&h=200&fit=crop'}
                      alt={tour.name || tour.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=300&h=200&fit=crop';
                      }}
                    />
                    {tour.rating && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">
                            {typeof tour.rating === 'number' ? tour.rating.toFixed(1) : tour.rating}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tour Content */}
                  <div className="p-4 flex flex-col flex-1 w-full">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight w-full block">
                      {tour.name || tour.title}
                    </h3>

                    {/* Tour Details */}
                    <div className="mb-4 flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-2 w-full">
                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis">
                          {tour.location || tour.destination || 'Đang cập nhật'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {formatDuration(tour)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          Lịch theo yêu cầu
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-gray-100 w-full">
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(tour.price)}
                      </span>
                      {tour.price && tour.price > 0 && (
                        <span className="text-sm text-gray-500 ml-1">/ người</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 mt-auto w-full flex flex-col">
                      <button
                        onClick={() => handleViewDetails(tour.slug)}
                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300"
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleBookTour(tour._id || tour.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Liên hệ đặt tour
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    'Xem thêm tour'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-3">
            Cần tư vấn cho sự kiện của bạn?
          </h2>
          <p className="text-base text-blue-200 mb-6">
            Đội ngũ chuyên gia MICE của chúng tôi sẵn sàng tư vấn và thiết kế gói tour phù hợp nhất cho doanh nghiệp của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Gọi ngay: 1900 xxx xxx
            </button>
            <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors duration-200">
              Nhận tư vấn miễn phí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiceToursPage;