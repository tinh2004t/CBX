import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import NewsCard from './NewsCard';
import blogAPI from '../../api/blogApi';

const NewsSection = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getPosts({
          limit: 8,
          sort: '-createdAt'
        });

        console.log('Full API Response:', response);

        if (response.success && response.data) {
          // Data nằm trong response.data.blogPosts
          const posts = Array.isArray(response.data.blogPosts) 
            ? response.data.blogPosts 
            : [];
          
          console.log('Posts to set:', posts);
          console.log('Number of posts:', posts.length);
          
          setNewsItems(posts);
        } else {
          console.warn('No data in response');
          setNewsItems([]);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.message);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const itemsPerSlide = 4;
  const maxSlides = Math.ceil(newsItems.length / itemsPerSlide);

  const nextSlide = () => {
    if (maxSlides > 0) {
      setCurrentSlide((prev) => (prev + 1) % maxSlides);
    }
  };

  const prevSlide = () => {
    if (maxSlides > 0) {
      setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
    }
  };

  const getCurrentItems = () => {
    if (!Array.isArray(newsItems) || newsItems.length === 0) {
      return [];
    }
    const startIndex = currentSlide * itemsPerSlide;
    return newsItems.slice(startIndex, startIndex + itemsPerSlide);
  };

  if (loading) {
    return (
      <section className="news-section">
        <div className="container">
          <h2 className="section-title">
            {t('tin_tuc_du_lich') || 'TIN TỨC DU LỊCH'}
          </h2>
          <div className="news-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="news-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="news-section">
        <div className="container">
          <h2 className="section-title">
            {t('tin_tuc_du_lich') || 'TIN TỨC DU LỊCH'}
          </h2>
          <div className="error-message">
            <p>Không thể tải tin tức. Vui lòng thử lại sau.</p>
            <p style={{ fontSize: '12px', color: '#999' }}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return (
      <section className="news-section">
        <div className="container">
          <h2 className="section-title">
            {t('tin_tuc_du_lich') || 'TIN TỨC DU LỊCH'}
          </h2>
          <div className="empty-message">
            <p>Chưa có tin tức nào.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentItems = getCurrentItems();

  return (
    <section className="news-section">
      <div className="container">
        <h2 className="section-title">
          {t('tin_tuc_du_lich') || 'TIN TỨC DU LỊCH'}
        </h2>
        
        <div className="news-grid">
          {currentItems.map((item, index) => {
            if (!item || !item.slug) {
              console.warn('Invalid item at index', index, item);
              return null;
            }
            return (
              <NewsCard 
                key={item._id?.$oid || item._id || item.slug || index} 
                news={item} 
              />
            );
          })}
        </div>

        {newsItems.length > itemsPerSlide && maxSlides > 1 && (
          <div className="navigation-arrows">
            <button 
              className="nav-arrow prev-arrow" 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              aria-label="Previous slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M15 18L9 12L15 6" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </button>
            <button 
              className="nav-arrow next-arrow" 
              onClick={nextSlide}
              disabled={currentSlide === maxSlides - 1}
              aria-label="Next slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 18L15 12L9 6" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;