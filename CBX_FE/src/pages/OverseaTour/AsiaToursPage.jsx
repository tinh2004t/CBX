import React, { useState, useEffect } from 'react';
import TourCard from '../../components/TourSection/TourCard';
import { useLanguage } from '../../hooks/useLanguage';
import tourAPI from '../../api/tourApi';

const AsiaToursPage = () => {
  const { t } = useLanguage();
  const [asiaTours, setAsiaTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsiaTours = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API lấy tour Miền Bắc
        // region có thể là: 'mien_bac', 'north', hoặc tùy theo backend của bạn định nghĩa
        const response = await tourAPI.getToursByContinent('Châu Á');
        
        setAsiaTours(response.data || response);
      } catch (err) {
        console.error('Error fetching Asia tours:', err);
        setError(err.message || 'Không thể tải dữ liệu tour');
      } finally {
        setLoading(false);
      }
    };

    fetchAsiaTours();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="ss-about margin-top-50">
        <div className="introduction">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {t('chau_a') || 'ASIA TOURS'}
              </h2>
            </div>
            <div className="text-center py-5">
              <p>Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="ss-about margin-top-50">
        <div className="introduction">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {t('chau_a') || 'ASIA TOURS'}
              </h2>
            </div>
            <div className="text-center py-5">
              <p className="text-danger">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (asiaTours.length === 0) {
    return (
      <section className="ss-about margin-top-50">
        <div className="introduction">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {t('chau_a') || 'ASIA TOURS'}
              </h2>
            </div>
            <div className="text-center py-5">
              <p>Hiện tại chưa có tour nào.</p>
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
          {/* ASIA TOURS */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('chau_a') || 'ASIA TOURS'}
              </h2>
            </div>
            <div className="card-container">
              {asiaTours.map(tour => (
                <TourCard 
                      key={tour._id || tour.id} 
                      tour={{
                        id: tour._id || tour.id,
                        image: tour.images?.[0] || tour.image,
                        title: tour.title,
                        departure: tour.departure,
                        price: tour.adultPrice || tour.price,
                        duration: tour.duration,
                        airline: tour.airline,
                        scheduleInfo: tour.schedule || tour.scheduleInfo,
                        href: `/tours/${tour.slug || tour._id}`
                      }} 
                      type="bestselling"
                    />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default AsiaToursPage;