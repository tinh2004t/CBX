import { useLanguage } from '../../hooks/useLanguage.jsx';
import MapLocation from './MapLocation';
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import tourAPI from '../../api/TourApi';

const InteractiveMap = () => {
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await tourAPI.advancedSearch({
        keyword: searchQuery,
        limit: 8
      });

      if (res.success) {
        setSearchResults(res.data.tours || res.data || []);
        setShowResults(true);
      }
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSelectTour = (slug) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/tours/${slug}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const locations = [
    {
      id: "1449",
      href: "/TourismPage",
      style: { top: "14.8%", left: "55%", width: "7.3%" },
      image: "/files/images/map/vietnam/hanoi(1).png",
      titleKey: "province_hanoi",
      introKey: "introduce_province_hanoi"
    },
    {
      id: "1452", 
      href: "/laos/vieng-chan",
      style: { top: "27%", left: "24%", width: "11%" },
      image: "/files/images/map/lao-cam/vienchan.png",
      titleKey: "province_vieng_chan",
      introKey: "introduce_province_vieng_chan"
    },
    {
      id: "1453",
      href: "/laos/luangprabang", 
      style: { top: "13%", left: "15%", width: "16%" },
      image: "/files/images/map/lao-cam/luongphabang.png",
      titleKey: "province_luang_prabang",
      introKey: "introduce_province_luang_prabang"
    },
    {
      id: "1456",
      href: "/viet-nam/ho-chi-minh",
      style: { top: "82%", left: "65%", width: "6.4%" },
      image: "/files/images/map/vietnam/HCM(1).png",
      titleKey: "province_ho_chi_minh",
      introKey: "introduce_province_ho_chi_minh"
    },
    {
      id: "1457",
      href: "/viet-nam/chau-doc",
      style: { top: "83.5%", left: "49%", width: "8.3%" },
      image: "/files/images/map/vietnam/angiang(1).png",
      titleKey: "province_chau_doc",
      introKey: "introduce_province_chau_doc"
    },
    {
      id: "1458",
      href: "/viet-nam/can-tho",
      style: { top: "87.7%", left: "53.5%", width: "7%" },
      image: "/files/images/map/vietnam/cantho(1).png",
      titleKey: "province_can_tho",
      introKey: "introduce_province_can_tho"
    },
    // Add more locations as needed...
  ];

  return (
    <section id="maps-detail" className="padding-bottom wow fadeInUp">
      <div id="maps">
        <div className="row justify-content-center margin-0">
          <div className="col">
            <h2 className="text-center">
              {t('kham_pha') || 'Khám phá'}
            </h2>
            <p className="text-center">
              {t('kham_pha1') || 'Khám phá vẻ đẹp của các vùng miền'}
            </p>
          </div>
        </div>
        
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-xs-12">
              <div className="bbb" style={{ position: 'relative' }}>
                <img 
                  className="img-bigmaps" 
                  style={{ width: '100%' }}
                  src="files/images/map/vnlccactinh.png" 
                  alt="Interactive Map" 
                />
                
                {locations.map(location => (
                  <MapLocation 
                    key={location.id}
                    {...location}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
<div className="row justify-content-center margin-0 text-center padding-top">
  <div className="search2-container" ref={searchRef}>
    <form onSubmit={handleSearchSubmit}>
      <input 
        type="text" 
        className="search2-box" 
        placeholder={t('tim_kiem') || 'Tìm kiếm tour, địa điểm...'} 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchResults.length > 0 && setShowResults(true)}
      />
      <button type="submit" className="search2-btn">
        {isSearching ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          <i className="fas fa-search"></i>
        )}
      </button>
    </form>

    {/* Search Results Dropdown */}
    {showResults && searchResults.length > 0 && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl z-[9000] max-h-[500px] overflow-hidden animate-fadeIn">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm text-gray-600 font-semibold">
            Tìm thấy {searchResults.length} kết quả
          </span>
        </div>
        
        <ul className="max-h-[380px] overflow-y-auto">
          {searchResults.map((tour) => (
            <li
              key={tour._id}
              onClick={() => handleSelectTour(tour.slug)}
              className="flex gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 hover:translate-x-1"
            >
              <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/files/images/placeholder.jpg';
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h6 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 leading-5">
                  {tour.title}
                </h6>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 flex items-center gap-1">
                    <i className="far fa-clock text-blue-600"></i>
                    {tour.duration}
                  </span>
                  <span className="font-bold text-orange-600">
                    {formatPrice(tour.price)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => {
              setShowResults(false);
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            }}
            className="w-full py-2 px-4 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            Xem tất cả kết quả
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
    )}

    {/* Không tìm thấy kết quả */}
    {showResults && searchQuery.trim() && searchResults.length === 0 && !isSearching && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl z-[9000] animate-fadeIn">
        <div className="p-10 text-center">
          <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
          <p className="text-gray-600">
            Không tìm thấy kết quả cho "<span className="font-semibold">{searchQuery}</span>"
          </p>
        </div>
      </div>
    )}
  </div>
  <style jsx>{`
          .search2-container {
          position: relative;
        }

        .search2-container form {
          border: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
</div>
    </section>
  );
};

export default InteractiveMap;