import { useState } from 'react';
import { Eye, Calendar, Clock, MapPin, Star } from 'lucide-react';

const MiceToursPage = () => {
  // Sample data - sẽ được thay thế bằng data từ database
  const sampleTours = [
    {
      id: 1,
      name: 'Hội thảo & Teambuilding Đà Lạt',
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=300&h=200&fit=crop',
      duration: '3 ngày 2 đêm',
      location: 'Đà Lạt, Lâm Đồng',
      rating: 4.8,
      price: '1000đ'
    },
    {
      id: 2,
      name: 'Conference & Gala Dinner Phú Quốc',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop',
      duration: '4 ngày 3 đêm',
      location: 'Phú Quốc, Kiên Giang',
      rating: 4.9,
      price: 'Theo yêu cầu'
    },
    {
      id: 3,
      name: 'Incentive Trip Hạ Long Bay',
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=300&h=200&fit=crop',
      duration: '2 ngày 1 đêm',
      location: 'Hạ Long, Quảng Ninh',
      rating: 4.7,
      price: 'Theo yêu cầu'
    },
    {
      id: 4,
      name: 'Exhibition & Trade Show HCMC',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop',
      duration: '3 ngày 2 đêm',
      location: 'TP.HCM',
      rating: 4.6,
      price: 'Theo yêu cầu'
    },
    {
      id: 5,
      name: 'Corporate Retreat Sapa',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      duration: '3 ngày 2 đêm',
      location: 'Sapa, Lào Cai',
      rating: 4.8,
      price: 'Theo yêu cầu'
    },
    {
      id: 6,
      name: 'Luxury Incentive Nha Trang',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop',
      duration: '4 ngày 3 đêm',
      location: 'Nha Trang, Khánh Hòa',
      rating: 4.9,
      price: 'Theo yêu cầu'
    },
    {
      id: 7,
      name: 'Meeting & Workshop Hội An',
      image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=300&h=200&fit=crop',
      duration: '2 ngày 1 đêm',
      location: 'Hội An, Quảng Nam',
      rating: 4.5,
      price: 'Theo yêu cầu'
    },
    {
      id: 8,
      name: 'Business Event Đà Nẵng',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      duration: '3 ngày 2 đêm',
      location: 'Đà Nẵng',
      rating: 4.7,
      price: 'Theo yêu cầu'
    }
  ];

  // const handleViewDetails = (tourId) => {
  //   console.log('View details for tour:', tourId);
  // };
  const handleViewDetailsTest = () => {
  window.location.href = "/MiceDetail";
};


  const handleBookTour = (tourId) => {
    console.log('Book tour:', tourId);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
            >
              {/* Tour Image */}
              <div className="relative w-full">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{tour.rating}</span>
                  </div>
                </div>
              </div>

              {/* Tour Content */}
              <div className="p-4 flex flex-col flex-1 w-full">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight w-full block">
                  {tour.name}
                </h3>

                {/* Tour Details */}
                <div className="mb-4 flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2 w-full">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis">{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 whitespace-nowrap">{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 whitespace-nowrap">Lịch theo yêu cầu</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 pb-4 border-b border-gray-100 w-full">
                  <span className="text-xl font-bold text-blue-600">{tour.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/ người</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mt-auto w-full flex flex-col">
                  <button
                    // onClick={() => handleViewDetails(tour.id)}
                    onClick={() => handleViewDetailsTest()}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => handleBookTour(tour.id)}
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
        <div className="text-center mt-8">
          <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
            Xem thêm tour
          </button>
        </div>
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