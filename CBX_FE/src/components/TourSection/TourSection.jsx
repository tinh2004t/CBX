import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import TourCard from './TourCard';
import tourAPI from '../../api/TourApi.js';

const TourSection = () => {
  const { t } = useLanguage();
  
  // State để lưu trữ dữ liệu tours
  const [popularTours, setPopularTours] = useState([]);
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API để lấy tour phổ biến và tour nổi bật
        const [popularResponse, featuredResponse] = await Promise.all([
          tourAPI.getPopularTours(),
          tourAPI.getFeaturedTours()
        ]);

        setPopularTours(popularResponse.data || popularResponse);
        setFeaturedTours(featuredResponse.data || featuredResponse);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError(err.message || 'Không thể tải dữ liệu tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Hàm chuyển đổi dữ liệu API sang format của TourCard
  const formatTourData = (tour, type) => {
    if (type === 'bestselling') {
      return {
        id: tour._id || tour.id,
        image: tour.images?.[0] || tour.image || "files/images/Tours/1.jpg",
        title: tour.name || tour.title,
        price: tour.price ? `${tour.price.toLocaleString('vi-VN')} đ` : "Liên hệ",
        duration: tour.duration || t('chuong_trinh_7_ngay_6_dem'),
        airline: tour.airline || t('hang_hang_khong_air_china'),
        departure: tour.departure_point ? `${t('khoi_hanh_tu')} ${tour.departure_point} >>` : t('khoi_hanh_tu_viet_tri'),
        scheduleInfo: tour.departure_dates?.[0] ? `${t('khoi_hanh')} ${new Date(tour.departure_dates[0]).toLocaleDateString('vi-VN')}` : t('khoi_hanh_28_12_6_2'),
        slug: tour.slug,
        href: `/tours/${tour.slug || tour._id}`
      };
    } else {
      return {
        id: tour._id || tour.id,
        image: tour.images?.[0] || tour.image || "files/images/Tours/1.jpg",
        title: tour.name || tour.title,
        price: tour.price ? `${tour.price.toLocaleString('vi-VN')} đ` : "Liên hệ",
        duration: tour.duration || t('lo_trinh_4_ngay_3_dem'),
        departure: tour.departure_point ? `${t('khoi_hanh_tu')} ${tour.departure_point}` : t('khoi_hanh_tu_ha_noi'),
        destination: tour.destination ? `${t('diem_den')} ${tour.destination}` : t('diem_den_can_tho'),
        schedule: tour.schedule || t('lich_khoi_hanh_thu_5_hang_tuan'),
        slug: tour.slug
      };
    }
  };

  // Hiển thị loading state
  if (loading) {
    return (
      <section className="ss-about margin-top-50">
        <div className="introduction">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <p>{t('loading') || 'Đang tải...'}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <section className="ss-about margin-top-50">
        <div className="introduction">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
              <p>{t('error') || 'Đã xảy ra lỗi'}: {error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ss-about margin-top-50">
      <div className="introduction wow fadeInUp">
        <div className="container">
          {/* TOUR BÁN CHẠY NHẤT (Tour Phổ Biến) */}
          {popularTours && popularTours.length > 0 && (
            <section className="tour-section">
              <div className="section-header">
                <h2 className="section-title">
                  {t('tour_ban_chay') || 'TOUR BÁN CHẠY NHẤT'}
                </h2>
                <a href="#" className="view-more">
                  {t('more') || 'Xem thêm'} &gt;&gt;
                </a>
              </div>
              <div className="card-container">
                {popularTours.slice(0, 5).map(tour => (
                  <TourCard 
                    key={tour._id || tour.id} 
                    tour={formatTourData(tour, 'bestselling')} 
                    type="bestselling"
                  />
                ))}
              </div>
            </section>
          )}

          
        </div>
      </div>
    </section>
  );
};

export default TourSection;