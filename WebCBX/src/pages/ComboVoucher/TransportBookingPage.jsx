import React, { useState, useMemo } from 'react';
import { Search, MapPin, Calendar, Clock, Users, Wifi, Coffee, Car, ChevronDown, ChevronUp, Star, Shield, ArrowRight } from 'lucide-react';

const TransportBooking = () => {
  // States for search form
  const [searchData, setSearchData] = useState({
    fromCity: '',
    toCity: '',
    departDate: '',
    returnDate: '',
    isRoundTrip: false
  });

  // States for filters
  const [filters, setFilters] = useState({
    company: '',
    amenities: [],
    seatType: ''
  });

  // State for expanded cards
  const [expandedCards, setExpandedCards] = useState(new Set());

  // State for search results visibility
  const [showResults, setShowResults] = useState(false);

  // Improved demo data with fromCity and toCity
  const demoRoutes = [
    {
      id: 1,
      company: 'Phương Trang',
      fromCity: 'TP. Hồ Chí Minh',
      toCity: 'Đà Lạt',
      seatType: 'Ghế VIP - 24 chỗ',
      departDate: '2025-09-04',
      returnDate: '2025-09-07',
      departTime: '08:00',
      arrivalTime: '12:30',
      duration: '4h 30m',
      pickupPoint: 'Bến xe Miền Đông',
      dropoffPoint: 'Bến xe Đà Lạt',
      price: 180000,
      totalSeats: 24,
      amenities: ['Wifi', 'Điều hòa', 'Nước uống'],
      features: 'Ghế da cao cấp, có massage, màn hình giải trí',
      rating: 4.5,
      reviews: 234
    },
    {
      id: 2,
      company: 'Thành Bưởi',
      fromCity: 'TP. Hồ Chí Minh',
      toCity: 'Nha Trang',
      seatType: 'Giường nằm VIP - 22 chỗ',
      departDate: '2025-09-03',
      returnDate: '2025-09-07',
      departTime: '21:00',
      arrivalTime: '05:30',
      duration: '8h 30m',
      pickupPoint: 'Bến xe An Sương',
      dropoffPoint: 'Bến xe Nha Trang',
      price: 320000,
      totalSeats: 22,
      amenities: ['Wifi', 'Điều hòa', 'Chăn gối', 'Nước uống'],
      features: 'Giường nằm cao cấp, rèm che riêng tư, ổ cắm điện',
      rating: 4.7,
      reviews: 189
    },
    {
      id: 3,
      company: 'Hoàng Long',
      fromCity: 'Hà Nội',
      toCity: 'Hải Phòng',
      seatType: 'Ghế thường - 45 chỗ',
      departDate: '2024-12-15',
      returnDate: null,
      departTime: '14:00',
      arrivalTime: '17:00',
      duration: '3h 00m',
      pickupPoint: 'Bến xe Mỹ Đình',
      dropoffPoint: 'Bến xe Hải Phòng',
      price: 85000,
      totalSeats: 45,
      amenities: ['Điều hòa', 'Nước uống'],
      features: 'Ghế ngồi thoải mái, hệ thống âm thanh chất lượng cao',
      rating: 4.2,
      reviews: 156
    },
    {
      id: 4,
      company: 'Mai Linh Express',
      fromCity: 'TP. Hồ Chí Minh',
      toCity: 'Vũng Tàu',
      seatType: 'Ghế VIP - 16 chỗ',
      departDate: '2024-12-15',
      returnDate: null,
      departTime: '09:30',
      arrivalTime: '15:00',
      duration: '5h 30m',
      pickupPoint: 'Sân bay Tân Sơn Nhất',
      dropoffPoint: 'Trung tâm Vũng Tàu',
      price: 220000,
      totalSeats: 16,
      amenities: ['Wifi', 'Điều hòa', 'Nước uống', 'Bánh kẹo'],
      features: 'Ghế da thật, khoang hành lý rộng rãi, dịch vụ 5 sao',
      rating: 4.8,
      reviews: 312
    },
    {
      id: 5,
      company: 'Kumho Samco',
      fromCity: 'TP. Hồ Chí Minh',
      toCity: 'Cần Thơ',
      seatType: 'Giường nằm VIP - 20 chỗ',
      departDate: '2024-12-15',
      returnDate: null,
      departTime: '22:30',
      arrivalTime: '06:00',
      duration: '7h 30m',
      pickupPoint: 'Bến xe Miền Tây',
      dropoffPoint: 'Bến xe Cần Thơ',
      price: 180000,
      totalSeats: 20,
      amenities: ['Wifi', 'Điều hòa', 'Chăn gối', 'Nước uống', 'Tivi'],
      features: 'Giường nằm 2 tầng, toilet riêng, hệ thống giải trí hiện đại',
      rating: 4.6,
      reviews: 278
    },
    {
      id: 6,
      company: 'Phương Trang',
      fromCity: 'Hà Nội',
      toCity: 'Đà Nẵng',
      seatType: 'Giường nằm VIP - 24 chỗ',
      departDate: '2024-12-15',
      returnDate: null,
      departTime: '20:00',
      arrivalTime: '08:00',
      duration: '12h 00m',
      pickupPoint: 'Bến xe Giáp Bát',
      dropoffPoint: 'Bến xe Đà Nẵng',
      price: 450000,
      totalSeats: 24,
      amenities: ['Wifi', 'Điều hòa', 'Chăn gối', 'Nước uống', 'Tivi'],
      features: 'Giường nằm premium, wifi tốc độ cao, dịch vụ 24/7',
      rating: 4.9,
      reviews: 421
    }
  ];

  const cities = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Nha Trang', 'Đà Lạt', 'Vũng Tàu', 'Cần Thơ', 'Hải Phòng'];
  const companies = ['Phương Trang', 'Thành Bưởi', 'Hoàng Long', 'Mai Linh Express', 'Kumho Samco'];
  const amenitiesList = ['Wifi', 'Điều hòa', 'Nước uống', 'Chăn gối', 'Bánh kẹo', 'Tivi'];

  // Filter routes based on search and filters
  const filteredRoutes = useMemo(() => {
    return demoRoutes.filter(route => {
      // Apply search filters - required fields
      if (searchData.fromCity && route.fromCity !== searchData.fromCity) return false;
      if (searchData.toCity && route.toCity !== searchData.toCity) return false;
      if (searchData.departDate && new Date(route.departDate).toISOString().split('T')[0] !== searchData.departDate) return false;
      
      // For round trip, check return date if provided
      if (searchData.isRoundTrip && searchData.returnDate && route.returnDate !== searchData.returnDate) return false;

      // Apply other filters
      if (filters.company && route.company !== filters.company) return false;
      if (filters.seatType === '1-20' && route.totalSeats > 20) return false;
      if (filters.seatType === '21-30' && (route.totalSeats < 21 || route.totalSeats > 30)) return false;
      if (filters.seatType === '31-40' && (route.totalSeats < 31 || route.totalSeats > 40)) return false;

      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => route.amenities.includes(amenity));
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [searchData, filters]);

  const handleSearch = () => {
    // Validate required fields
    if (!searchData.fromCity || !searchData.toCity || !searchData.departDate) {
      alert('Vui lòng chọn điểm đi, điểm đến và ngày khởi hành!');
      return;
    }
    
    if (searchData.isRoundTrip && !searchData.returnDate) {
      alert('Vui lòng chọn ngày về cho chuyến khứ hồi!');
      return;
    }
    
    setShowResults(true);
  };

  const toggleCard = (routeId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(routeId)) {
      newExpanded.delete(routeId);
    } else {
      newExpanded.add(routeId);
    }
    setExpandedCards(newExpanded);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const swapCities = () => {
    setSearchData({
      ...searchData,
      fromCity: searchData.toCity,
      toCity: searchData.fromCity
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* From City */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <MapPin className="inline w-3 h-3 mr-1 text-blue-500" />
                  Điểm đi *
                </label>
                <select
                  value={searchData.fromCity}
                  onChange={(e) => setSearchData({ ...searchData, fromCity: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
                  required
                >
                  <option value="">Chọn điểm đi</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="hidden md:flex justify-center items-end pb-2">
                <button
                  onClick={swapCities}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition duration-200 group"
                  title="Đổi điểm đi - đến"
                >
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              </div>

              {/* To City */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <MapPin className="inline w-3 h-3 mr-1 text-purple-500" />
                  Điểm đến *
                </label>
                <select
                  value={searchData.toCity}
                  onChange={(e) => setSearchData({ ...searchData, toCity: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 bg-white"
                  required
                >
                  <option value="">Chọn điểm đến</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Departure Date */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Calendar className="inline w-3 h-3 mr-1 text-green-500" />
                  Ngày khởi hành *
                </label>
                <input
                  type="date"
                  value={searchData.departDate}
                  onChange={(e) => setSearchData({ ...searchData, departDate: e.target.value })}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 bg-white"
                  required
                />
              </div>

              {/* Search Button */}
              <div className="flex flex-col justify-end">
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center space-x-1 text-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Tìm kiếm</span>
                </button>
              </div>
            </div>

            {/* Round Trip and Return Date */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={searchData.isRoundTrip}
                  onChange={(e) => setSearchData({ ...searchData, isRoundTrip: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition duration-200">
                  Khứ hồi
                </span>
              </label>

              {/* Return Date (conditional) */}
              {searchData.isRoundTrip && (
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-medium text-gray-700">
                    <Calendar className="inline w-3 h-3 mr-1 text-orange-500" />
                    Ngày về *:
                  </label>
                  <input
                    type="date"
                    value={searchData.returnDate}
                    onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                    className="p-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-white"
                    required={searchData.isRoundTrip}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded mr-3"></div>
                  Bộ lọc
                </h3>

                {/* Company Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Hãng xe</label>
                  <select
                    value={filters.company}
                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="">Tất cả hãng xe</option>
                    {companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>

                {/* Seat Type Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Loại ghế</label>
                  <div className="space-y-2">
                    {[
                      { value: '', label: 'Tất cả loại ghế' },
                      { value: '1-20', label: '1-20 chỗ (VIP)' },
                      { value: '21-30', label: '21-30 chỗ (Limousine)' },
                      { value: '31-40', label: '31-40 chỗ (Thường)' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="seatType"
                          value={option.value}
                          checked={filters.seatType === option.value}
                          onChange={(e) => setFilters({ ...filters, seatType: e.target.value })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-600 transition duration-200">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Tiện ích</label>
                  <div className="space-y-3">
                    {amenitiesList.map(amenity => (
                      <label key={amenity} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, amenities: [...filters.amenities, amenity] });
                            } else {
                              setFilters({ ...filters, amenities: filters.amenities.filter(a => a !== amenity) });
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-600 transition duration-200">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={() => setFilters({
                    company: '',
                    amenities: [],
                    seatType: ''
                  })}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition duration-200 border-2 border-gray-200 hover:border-gray-300"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>

            {/* Results List */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Kết quả tìm kiếm
                  </h2>
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                    {filteredRoutes.length} chuyến xe
                  </div>
                </div>

                {filteredRoutes.map(route => (
                  <div key={route.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300">
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => toggleCard(route.id)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-bold text-lg lg:text-xl text-gray-900">{route.company}</h3>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm font-medium text-gray-700">{route.rating}</span>
                                  <span className="text-xs text-gray-500">({route.reviews} đánh giá)</span>
                                </div>
                              </div>
                              {/* Trip Type Tag */}
                              <div className="ml-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  route.returnDate ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {route.returnDate ? 'Khứ hồi' : 'Một chiều'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right lg:text-left">
                              <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {formatPrice(route.price)}
                              </p>
                              <p className="text-sm text-gray-500">/ 1 khách</p>
                            </div>
                          </div>

                          {/* Route and Time */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            {/* Route */}
                            <div className="md:col-span-2">
                              <div className="flex items-center space-x-3">
                                <div className="text-center flex-shrink-0">
                                  <p className="font-semibold text-lg text-gray-900">{route.departTime}</p>
                                  <p className="text-xs text-gray-600">{route.fromCity}</p>
                                </div>
                                <div className="flex-1 flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                                  <div className="flex-1 h-px bg-gray-300 relative">
                                    <Car className="w-4 h-4 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
                                  </div>
                                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                                </div>
                                <div className="text-center flex-shrink-0">
                                  <p className="font-semibold text-lg text-gray-900">{route.arrivalTime}</p>
                                  <p className="text-xs text-gray-600">{route.toCity}</p>
                                </div>
                              </div>
                            </div>

                            {/* Duration */}
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Thời gian</p>
                              <p className="font-semibold text-gray-900">{route.duration}</p>
                            </div>

                            {/* Seat Type */}
                            <div className="text-center">
                              <p className="text-sm text-gray-600 flex items-center justify-center">
                                <Users className="w-4 h-4 mr-1" />
                                {route.seatType}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <div className="flex justify-center lg:justify-end mt-4 lg:mt-0 lg:ml-4">
                          {expandedCards.has(route.id) ?
                            <ChevronUp className="w-6 h-6 text-gray-400" /> :
                            <ChevronDown className="w-6 h-6 text-gray-400" />
                          }
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedCards.has(route.id) && (
                      <div className="border-t border-gray-100 p-6 bg-gray-50">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Technical Specifications */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                              <Car className="w-5 h-5 mr-2 text-blue-500" />
                              Thông tin xe
                            </h4>
                            <div className="space-y-4">
                              <div className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Điểm đón</p>
                                  <p className="text-sm text-gray-600">{route.pickupPoint}</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3" style={{ marginTop: '0' }}>
                                <MapPin className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Điểm trả</p>
                                  <p className="text-sm text-gray-600">{route.dropoffPoint}</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3" style={{ marginTop: '0' }}>
                                <Users className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Tổng số ghế</p>
                                  <p className="text-sm text-gray-600">{route.totalSeats} chỗ</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <Calendar className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Ngày khởi hành</p>
                                  <p className="text-sm text-gray-600">{new Date(route.departDate).toLocaleDateString('vi-VN')}</p>
                                </div>
                              </div>

                              {route.returnDate && (
                                <div className="flex items-start space-x-3">
                                  <Calendar className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Ngày về</p>
                                    <p className="text-sm text-gray-600">{new Date(route.returnDate).toLocaleDateString('vi-VN')}</p>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-start space-x-3">
                                <span className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0">✨</span>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Đặc trưng</p>
                                  <p className="text-sm text-gray-600">{route.features}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                              <Coffee className="w-5 h-5 mr-2 text-purple-500" />
                              Tiện ích
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {route.amenities.map(amenity => (
                                <div
                                  key={amenity}
                                  className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 text-sm"
                                >
                                  {amenity === 'Wifi' && <Wifi className="w-4 h-4 text-blue-500" />}
                                  {amenity === 'Nước uống' && <Coffee className="w-4 h-4 text-green-500" />}
                                  {amenity === 'Điều hòa' && <span className="w-4 h-4 text-cyan-500">❄️</span>}
                                  {amenity === 'Chăn gối' && <span className="w-4 h-4">🛏️</span>}
                                  {amenity === 'Bánh kẹo' && <span className="w-4 h-4">🍪</span>}
                                  {amenity === 'Tivi' && <span className="w-4 h-4">📺</span>}
                                  <span className="font-medium text-gray-700">{amenity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Book Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center space-x-1">
                              <Shield className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-600">Hoàn tiền 100%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-600">Đặt nhanh trong 2 phút</span>
                            </div>
                          </div>
                          <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200 whitespace-nowrap">
                            Đặt vé ngay
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {filteredRoutes.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Car className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy chuyến xe</h3>
                    <p className="text-gray-600 mb-6">Vui lòng thử thay đổi điều kiện tìm kiếm hoặc bộ lọc</p>
                    <button
                      onClick={() => {
                        setSearchData({
                          fromCity: '',
                          toCity: '',
                          departDate: '',
                          returnDate: '',
                          isRoundTrip: false
                        });
                        setFilters({
                          company: '',
                          amenities: [],
                          seatType: ''
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition duration-200"
                    >
                      Tìm kiếm lại
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        {!showResults && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tìm kiếm dễ dàng</h3>
              <p className="text-sm text-gray-600">So sánh giá vé từ nhiều nhà xe uy tín trên toàn quốc</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Thanh toán an toàn</h3>
              <p className="text-sm text-gray-600">Bảo mật thông tin 100% với công nghệ mã hóa tiên tiến</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
              <p className="text-sm text-gray-600">Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ bạn</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportBooking;