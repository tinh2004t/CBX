import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import NewsCard from './NewsCard';

const NewsSection = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const newsItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
      title: "ẨM THỰC HÀN QUỐC - TỰ LỊCH SỰ TẠO NÊN BẢN SẮC",
      excerpt: "Khám phá văn hóa ẩm thực đặc sắc của Hàn Quốc với những món ăn truyền thống..."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
      title: "HƯỚNG DẪN CHI TIẾT CÁCH XIN VISA DU LỊCH TỰ TÚC HÀN QUỐC",
      excerpt: "Quy trình xin visa du lịch Hàn Quốc từ A-Z, những giấy tờ cần thiết và lưu ý..."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      title: "10 QUY TẮC TRÊN BÀN ĂN CỦA NGƯỜI HÀN",
      excerpt: "Tìm hiểu về những quy tắc ăn uống và văn hóa bàn ăn độc đáo của người Hàn Quốc..."
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
      title: "ẨM THỰC HÀN QUỐC - TỰ LỊCH SỰ TẠO NÊN BẢN SẮC",
      excerpt: "Khám phá những món ăn đặc trưng và văn hóa ẩm thực phong phú của xứ sở kim chi..."
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
      title: "ẨM THỰC HÀN QUỐC SỰ TẠO NÊN BẢN SẮC",
      excerpt: "Khám phá văn hóa ẩm thực đặc sắc của Hàn Quốc với những món ăn truyền thống..."
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
      title: "ẨM TH",
      excerpt: "Khám phá văn hóa ẩm thực đặc sắc của Hàn Quốc với những món ăn truyền thống..."
    },
  ];

  const itemsPerSlide = 4;
  const maxSlides = Math.ceil(newsItems.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  const getCurrentItems = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return newsItems.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <section className="news-section">
      <div className="container">
        <h2 className="section-title">
          {t('tin_tuc_du_lich') || 'TIN TỨC DU LỊCH'}
        </h2>
        
        <div className="news-grid">
          {getCurrentItems().map(item => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="navigation-arrows">
          <button className="nav-arrow prev-arrow" onClick={prevSlide}>
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
          <button className="nav-arrow next-arrow" onClick={nextSlide}>
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
      </div>
    </section>
  );
};

export default NewsSection;