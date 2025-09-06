import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Eye, MapPin, User, Clock } from 'lucide-react';

// ... giữ nguyên mockBlogPosts, categories, cities, sortOptions

const POSTS_PER_PAGE = 3; // số bài mỗi trang

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'k';
    }
    return views.toString();
  };

  const handleViewDetailsTest = () => {
  window.location.href = "/TravelBlogData";
};

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full" >
      <div className="relative overflow-hidden" onClick={handleViewDetailsTest}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium select-none">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
          {post.excerpt}
        </p>

        {/* Thông tin mỗi cái 1 dòng */}
        <div className="text-sm text-gray-500 space-y-2">
          {/* Dòng 1: Tác giả và Địa điểm */}
          <div className="flex justify-between w-full">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 flex-shrink-0" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{post.city}</span>
            </div>
          </div>

          {/* Dòng 2: Ngày đăng và Số lượt xem */}
          <div className="flex justify-between w-full">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{formatDate(post.publishDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 flex-shrink-0" />
              <span>{formatViews(post.views)} lượt xem</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TravelBlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedCity, setSelectedCity] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort logic
  const filteredAndSortedPosts = useMemo(() => {
    const mockBlogPosts = [
      {
        id: 1,
        title: "Khám phá vẻ đẹp Hạ Long Bay",
        author: "Nguyễn Văn A",
        views: 1250,
        publishDate: "2024-08-15",
        category: "Thiên nhiên",
        city: "Quảng Ninh",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop",
        excerpt: "Khám phá vẻ đẹp huyền bí của Vịnh Hạ Long với những hang động tuyệt đẹp..."
      },
      {
        id: 2,
        title: "Ẩm thực đường phố Sài Gòn",
        author: "Trần Thị B",
        views: 890,
        publishDate: "2024-08-20",
        category: "Ẩm thực",
        city: "TP.HCM",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop",
        excerpt: "Hành trình khám phá những món ăn đường phố đặc sắc nhất Sài Gòn..."
      },
      {
        id: 3,
        title: "Phố cổ Hội An về đêm",
        author: "Lê Văn C",
        views: 2100,
        publishDate: "2024-08-10",
        category: "Văn hóa",
        city: "Quảng Nam",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=250&fit=crop",
        excerpt: "Đắm chìm trong không gian cổ kính của phố cổ Hội An lúc đêm về..."
      },
      {
        id: 4,
        title: "Trekking Sapa - Chinh phục đỉnh Fansipan",
        author: "Phạm Thị D",
        views: 1680,
        publishDate: "2024-08-05",
        category: "Phiêu lưu",
        city: "Lào Cai",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
        excerpt: "Hành trình chinh phục nóc nhà Đông Dương và khám phá văn hóa H'Mông..."
      },
      {
        id: 5,
        title: "Bãi biển Nha Trang xanh ngắt",
        author: "Hoàng Văn E",
        views: 950,
        publishDate: "2024-08-25",
        category: "Biển đảo",
        city: "Khánh Hòa",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop",
        excerpt: "Tận hưởng những bãi biển tuyệt đẹp và hoạt động thể thao dưới nước..."
      },
      {
        id: 6,
        title: "Khám phá động Phong Nha",
        author: "Vũ Thị F",
        views: 1420,
        publishDate: "2024-08-12",
        category: "Thiên nhiên",
        city: "Quảng Bình",
        image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=250&fit=crop",
        excerpt: "Hành trình khám phá hệ thống hang động kỳ vĩ tại Quảng Bình..."
      }
    ];


    let filtered = mockBlogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory;
      const matchesCity = selectedCity === "Tất cả" || post.city === selectedCity;

      return matchesSearch && matchesCategory && matchesCity;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.publishDate) - new Date(a.publishDate);
        case "oldest":
          return new Date(a.publishDate) - new Date(b.publishDate);
        case "mostViewed":
          return b.views - a.views;
        case "leastViewed":
          return a.views - b.views;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedCity, sortBy]);

  const categories = ["Tất cả", "Thiên nhiên", "Ẩm thực", "Văn hóa", "Phiêu lưu", "Biển đảo"];
  const cities = ["Tất cả", "Hà Nội", "TP.HCM", "Quảng Ninh", "Quảng Nam", "Lào Cai", "Khánh Hòa", "Quảng Bình"];
  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "mostViewed", label: "Xem nhiều nhất" },
    { value: "leastViewed", label: "Xem ít nhất" }
  ];

  // Tính tổng trang
  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);

  // Lấy bài viết cho trang hiện tại
  const currentPosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Tất cả");
    setSelectedCity("Tất cả");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Khi filter thay đổi, reset trang về 1
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedCity, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog Du Lịch Việt Nam
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Khám phá những điểm đến tuyệt vời và trải nghiệm độc đáo trên khắp đất nước hình chữ S
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
            </button>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thể loại
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thành phố
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
          <div className="text-gray-600">
            Tìm thấy <span className="font-semibold">{filteredAndSortedPosts.length}</span> bài viết
          </div>

          {(searchTerm || selectedCategory !== "Tất cả" || selectedCity !== "Tất cả") && (
            <div className="flex flex-wrap items-center space-x-2 gap-2">
              <span className="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs select-none">
                  "{searchTerm}"
                </span>
              )}
              {selectedCategory !== "Tất cả" && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs select-none">
                  {selectedCategory}
                </span>
              )}
              {selectedCity !== "Tất cả" && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs select-none">
                  {selectedCity}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Blog Posts Grid */}
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy bài viết nào
            </h3>
            <p className="text-gray-500 mb-4">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
            <button
              onClick={resetFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded-lg border transition-colors ${pageNum === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
                  }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelBlogPage;
