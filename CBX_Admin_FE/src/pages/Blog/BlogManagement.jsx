import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, Filter, Eye, Calendar, User, MapPin, Tag, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import blogAPI from '../../api/blogApi'; // Import the API service

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [categories, setCategories] = useState(['all']); // Dynamic categories
  const navigate = useNavigate();

  // Load blogs from API
  const loadBlogs = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = {
        page: page,
        limit: blogsPerPage,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await blogAPI.getPosts(params);
      
      if (response.success) {
        setBlogs(response.data.blogPosts || []);
        setTotalBlogs(response.data.totalCount || 0);
        
        // Extract unique categories for filter dropdown
        const uniqueCategories = ['all', ...new Set(response.data.blogPosts?.map(blog => blog.category) || [])];
        setCategories(uniqueCategories);
      } else {
        setError(response.message || 'Failed to load blogs');
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      setError('Không thể tải danh sách blog. Vui lòng thử lại.');
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadBlogs(1);
  }, []);

  // Search and filter effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      loadBlogs(1);
    }, 500); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory]);

  // Page change effect
  useEffect(() => {
    if (currentPage > 1) {
      loadBlogs(currentPage);
    }
  }, [currentPage]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = (slug) => {
    navigate(`/blog/editor?slug=${slug}`);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa blog này?')) {
      try {
        setIsLoading(true);
        const response = await blogAPI.deleteBlogPost(blogId);
        
        if (response.success) {
          // Reload current page data
          await loadBlogs(currentPage);
          alert('Blog đã được xóa thành công!');
        } else {
          alert(response.message || 'Có lỗi xảy ra khi xóa blog');
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Không thể xóa blog. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/blog/editor');
  };

  const handleRefresh = () => {
    loadBlogs(currentPage);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  // Loading component
  const LoadingCard = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Blog</h1>
              <p className="text-gray-600">Quản lý các bài viết blog du lịch</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                Làm mới
              </button>
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors w-fit"
              >
                <Plus size={20} />
                Tạo Blog Mới
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Có lỗi xảy ra</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, tác giả, địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tất cả danh mục' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Eye className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tổng lượt xem</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : blogs.reduce((total, blog) => total + (blog.stats?.views || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tổng bài viết</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : totalBlogs.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: blogsPerPage }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={blog.image || 'https://images.unsplash.com/photo-1555264988-df62956fb737?w=400&h=250&fit=crop'}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1555264988-df62956fb737?w=400&h=250&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(blog.slug)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all"
                    >
                      <Edit size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User size={16} className="mr-2" />
                      {blog.author?.name || 'Unknown'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin size={16} className="mr-2" />
                      {blog.location?.city || 'Unknown'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      {formatDate(blog.publishDate || blog.createdAt)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye size={16} className="mr-2" />
                      {(blog.stats?.views || 0).toLocaleString()} lượt xem
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && blogs.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy blog nào</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc' 
                : 'Chưa có blog nào được tạo'
              }
            </p>
            {(!searchTerm && selectedCategory === 'all') && (
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tạo Blog Đầu Tiên
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Hiển thị {((currentPage - 1) * blogsPerPage) + 1} - {Math.min(currentPage * blogsPerPage, totalBlogs)} của {totalBlogs} kết quả
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = index + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 border border-gray-200 rounded-lg ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Tiếp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom CSS for line clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogManagement;