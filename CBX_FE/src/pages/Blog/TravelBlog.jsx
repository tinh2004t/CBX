import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, Eye, MapPin, User } from "lucide-react";
import blogAPI from "../../api/blogApi"; // chỉnh lại đường dẫn theo project của bạn

const POSTS_PER_PAGE = 6; // số bài mỗi trang (giống backend)

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + "k";
    }
    return views.toString();
  };

  const handleViewDetails = () => {
    window.location.href = `/blog/${post.slug}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full">
      <div className="relative overflow-hidden" onClick={handleViewDetails}>
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

        <div className="text-sm text-gray-500 space-y-2">
          <div className="flex justify-between w-full">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 flex-shrink-0" />
              <span>{post.author?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{post.location?.city}</span>
            </div>
          </div>

          <div className="flex justify-between w-full">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{formatDate(post.publishDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 flex-shrink-0" />
              <span>{formatViews(post.stats?.views)} lượt xem</span>
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Fetch posts từ backend (có phân trang & filter)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const cleanParams = Object.fromEntries(
        Object.entries({
          page: currentPage,
          limit: POSTS_PER_PAGE,
          search: searchTerm,
          category: selectedCategory !== "Tất cả" ? selectedCategory : null,
          city: selectedCity !== "Tất cả" ? selectedCity : null,
          sortBy,
        }).filter(([_, v]) => v != null && v !== "")
      );


      const response = await blogAPI.getPosts(cleanParams);

      if (response.success) {
        setPosts(response.data.blogPosts);      // ✅ mảng bài viết
        setPagination(response.data.pagination); // ✅ object phân trang
      }

    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, selectedCategory, selectedCity, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Tất cả");
    setSelectedCity("Tất cả");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const categories = ["Tất cả", "Thiên nhiên", "Ẩm thực", "Văn hóa", "Phiêu lưu", "Biển đảo"];
  const cities = ["Tất cả", "Hà Nội", "TP.HCM", "Quảng Ninh", "Quảng Nam", "Lào Cai", "Khánh Hòa", "Quảng Bình"];
  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "mostViewed", label: "Xem nhiều nhất" },
    { value: "leastViewed", label: "Xem ít nhất" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Du Lịch Việt Nam</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Khám phá những điểm đến tuyệt vời và trải nghiệm độc đáo trên khắp đất nước hình chữ S
          </p>
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bộ lọc */}
          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thể loại</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Reset */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Posts */}
        {!loading && !error && (
          <>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((p) => (
                  <BlogCard key={p._id || p.id} post={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                Không tìm thấy bài viết nào.
              </div>
            )}

            {/* Pagination */}
            {pagination?.total > 1 && (
              <div className="flex justify-center mt-12 space-x-3">
                {Array.from({ length: pagination.total }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${pageNum === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
};

export default TravelBlogPage;
