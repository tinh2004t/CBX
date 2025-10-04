import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import tourAPI from '../api/TourApi';
import { useLanguage } from '../hooks/useLanguage';
import TourCard from '../components/TourSection/TourCard';
import  '../components/TourSection/TourCard.css';


const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 12
  });

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query = searchQuery, page = 1) => {
    setLoading(true);
    try {
      const params = {
        keyword: query,
        page: page,
        limit: pagination.limit
      };

      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const res = await tourAPI.advancedSearch(params);

      if (res.success) {
        setTours(res.data.tours || res.data || []);
        setPagination({
          currentPage: res.data.currentPage || 1,
          totalPages: res.data.totalPages || 1,
          totalResults: res.data.total || (res.data.tours?.length || 0),
          limit: res.data.limit || pagination.limit
        });
      }
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    handleSearch(searchQuery, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.set('q', searchQuery);
    setSearchParams(newParams);
    handleSearch(searchQuery, 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Transform tour data to match TourCard format
  const transformTourData = (tour) => ({
    image: tour.image,
    title: tour.title,
    duration: tour.duration,
    departure: tour.tourType === 'domestic' ? 'Trong nước' : tour.tourType === 'oversea' ? 'Nước ngoài' : 'MICE',
    destination: tour.destination || '',
    schedule: tour.schedule || '',
    price: formatPrice(tour.price),
    href: `/tours/${tour.slug}`,
    scheduleInfo: tour.scheduleInfo || '',
    airline: tour.airline || ''
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="mb-12">
          
          

          {/* Results Count */}
          {!loading && (
            <div className="text-center mt-6">
              <p className="text-slate-600 text-lg">
                {tours.length > 0 ? (
                  <>
                    Tìm thấy <span className="font-bold text-blue-600">{pagination.totalResults}</span> tour cho "<span className="font-semibold">{searchQuery}</span>"
                  </>
                ) : searchQuery && (
                  <span className="text-slate-500">không tìm thấy "<span className="font-semibold">{searchQuery}</span>"</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 text-lg">{t('dang_tim_kiem') || 'Đang tìm kiếm...'}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && tours.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('khong_tim_thay_ket_qua') || 'Không tìm thấy kết quả'}</h3>
            <p className="text-slate-600">{t('thu_tim_kiem_khac') || 'Thử tìm kiếm với từ khóa khác'}</p>
          </div>
        )}

        {/* Tour Grid using TourCard */}
        {!loading && tours.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {tours.map((tour) => (
                <TourCard 
                  key={tour._id}
                  tour={transformTourData(tour)}
                  type="bestselling"
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-slate-300 transition-all duration-300"
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        className={`min-w-[40px] h-10 px-3 rounded-lg font-semibold transition-all duration-300 ${
                          page === pagination.currentPage
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-110'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.currentPage - 2 ||
                    page === pagination.currentPage + 2
                  ) {
                    return <span key={page} className="px-2 text-slate-400">...</span>;
                  }
                  return null;
                })}

                <button
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-slate-300 transition-all duration-300"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;