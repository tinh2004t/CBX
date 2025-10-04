import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { useLanguage } from '../../hooks/useLanguage';
import settingAPI from '../../api/settingApi';
import tourAPI from '../../api/TourApi';

const Header = () => {
  const { t } = useLanguage();
  const [contact, setContacts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await settingAPI.getSettings();
        if (res.success) {
          setContacts(res.data);
        }
      } catch (err) {
        console.error("Lỗi lấy settings:", err);
      }
    };
    fetchContacts();
  }, []);

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

  return (
    <header>
      {/* Header Top Section */}
      <div className="header-top">
        <div className="container" style={{ maxWidth: '1180px' }}>
          <div className="row align-items-center">
            {/* Logo */}
            <div className="col-lg-2 col-md-3 col-sm-3 col-4">
              <div className="logo">
                <img src="/files/images/logo/logo.jpg" alt="Logo" />
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-12 contact-wrapper">
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>{contact.hotline}</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>{contact.email}</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{contact.address}</span>
                </div>
              </div>
            </div>

            {/* Search Box */}
            <div className="col-lg-4 col-md-12 col-sm-9 col-8 search-wrapper">
              <div className="search-container" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    className="search-box"
                    placeholder={t('tim_kiem') || 'Tìm kiếm tour, địa điểm...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  />
                  <button type="submit" className="search-btn">
                    {isSearching ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-search"></i>
                    )}
                  </button>
                </form>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="search-results-dropdown">
                    <div className="search-results-header">
                      <span className="text-sm text-gray-600 font-semibold">
                        Tìm thấy {searchResults.length} kết quả
                      </span>
                    </div>

                    <ul className="search-results-list">
                      {searchResults.map((tour) => (
                        <li
                          key={tour._id}
                          onClick={() => handleSelectTour(tour.slug)}
                          className="search-result-item"
                        >
                          <div className="result-image">
                            <img
                              src={tour.image}
                              alt={tour.title}
                              onError={(e) => {
                                e.target.src = '/files/images/placeholder.jpg';
                              }}
                            />
                          </div>

                          <div className="result-content">
                            <h6 className="result-title">
                              {tour.title}
                            </h6>
                            <div className="result-meta">
                              <span className="result-duration">
                                <i className="far fa-clock"></i>
                                {tour.duration}
                              </span>
                              <span className="result-price">
                                {formatPrice(tour.price)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="search-results-footer">
                      <button
                        onClick={() => {
                          setShowResults(false);
                          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                        }}
                        className="view-all-btn"
                      >
                        Xem tất cả kết quả
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Không tìm thấy kết quả */}
                {showResults && searchQuery.trim() && searchResults.length === 0 && !isSearching && (
                  <div className="search-no-results">
                    <div className="no-results-content">
                      <i className="fas fa-search"></i>
                      <p>
                        Không tìm thấy kết quả cho "<span className="font-semibold">{searchQuery}</span>"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Language Switcher */}
            <div className="col-lg-3 col-md-12 language-wrapper">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <Navigation />

      <style jsx>{`
        /* Base Styles */
        .search-container {
          position: relative;
        }

        .search-container form {
          border: none;
        }

        /* Search Results Dropdown */
        .search-results-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 8px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          z-index: 9000;
          max-height: 500px;
          overflow: hidden;
          animation: fadeIn 0.3s ease;
        }

        .search-results-header {
          padding: 12px 20px;
          border-bottom: 1px solid #f0f0f0;
          background: #f9fafb;
        }

        .search-results-list {
          max-height: 380px;
          overflow-y: auto;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .search-result-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          cursor: pointer;
          border-bottom: 1px solid #f9fafb;
          transition: all 0.2s;
        }

        .search-result-item:last-child {
          border-bottom: none;
        }

        .search-result-item:hover {
          background: #f9fafb;
          transform: translateX(4px);
        }

        .result-image {
          flex-shrink: 0;
          width: 80px;
          height: 64px;
          border-radius: 8px;
          overflow: hidden;
        }

        .result-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .result-content {
          flex: 1;
          min-width: 0;
        }

        .result-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }

        .result-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }

        .result-duration {
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .result-duration i {
          color: #3b82f6;
        }

        .result-price {
          font-weight: bold;
          color: #ea580c;
        }

        .search-results-footer {
          padding: 12px 20px;
          border-top: 1px solid #f0f0f0;
          background: #f9fafb;
        }

        .view-all-btn {
          width: 100%;
          padding: 10px 16px;
          background: white;
          border: 2px solid #3b82f6;
          color: #3b82f6;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          background: #3b82f6;
          color: white;
        }

        .view-all-btn i {
          transition: transform 0.2s;
        }

        .view-all-btn:hover i {
          transform: translateX(4px);
        }

        .search-no-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 8px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          z-index: 9000;
          animation: fadeIn 0.3s ease;
        }

        .no-results-content {
          padding: 40px;
          text-align: center;
        }

        .no-results-content i {
          font-size: 48px;
          color: #d1d5db;
          margin-bottom: 16px;
        }

        .no-results-content p {
          color: #6b7280;
          margin: 0;
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

        /* Desktop - Show all elements */
        @media (min-width: 992px) {
          .contact-wrapper,
          .search-wrapper,
          .language-wrapper {
            display: block !important;
          }
        }

        /* Tablet and Mobile - Hide contact and language */
        @media (max-width: 991px) {
          .contact-wrapper,
          .language-wrapper {
            display: none !important;
          }

          .search-wrapper {
            display: block !important;
          }
          .header-top .container {
            padding: 10px 15px;
          }

          .logo img {
            max-height: 50px;
            width: auto;
          }

          .search-container {
            margin: 0;
          }
        }

        /* Mobile Small */
        @media (max-width: 576px) {
          .logo img {
            max-height: 40px;
          }

          .search-box {
            font-size: 13px;
            padding: 8px 12px;
          }

          .search-btn {
            padding: 8px 12px;
          }

          .search-results-dropdown {
            max-height: 400px;
          }

          .result-image {
            width: 60px;
            height: 48px;
          }

          .result-title {
            font-size: 13px;
          }

          .result-meta {
            font-size: 11px;
          }

          .search-results-list {
            max-height: 280px;
          }
        }

        /* Tablet Portrait */
        @media (min-width: 768px) and (max-width: 991px) {
          .logo img {
            max-height: 45px;
          }

          .search-box {
            font-size: 15px;
          }
        }

        /* Large Desktop */
        @media (min-width: 1400px) {
          .header-top .container {
            max-width: 1320px !important;
          }
        }
      `}</style>
    </header>
  );
};

// Language Switcher Component
const LanguageSwitcher = () => {
  const { language, switchLanguage } = useLanguage();

  return (
    <div className="language-switcher justify-content-end">
      <a
        href="#"
        className={`lang-btn ${language === 'vi' ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          switchLanguage('vi');
        }}
      >
        <img src="/files/images/logo/flags/VI.png" alt="" width="30" height="17" />
      </a>
      <a
        href="#"
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          switchLanguage('en');
        }}
      >
        <img src="/files/images/logo/flags/EN.png" alt="" width="30" height="17" />
      </a>
    </div>
  );
};

export default Header;