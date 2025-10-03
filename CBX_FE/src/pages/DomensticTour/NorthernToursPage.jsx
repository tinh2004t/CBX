import React, { useState, useEffect } from 'react';
import TourCard from '../../components/TourSection/TourCard';
import { useLanguage } from '../../hooks/useLanguage';
import tourAPI from '../../api/tourApi';

const NorthernToursPage = () => {
  const { t } = useLanguage();
  const [northernTours, setNorthernTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNorthernTours = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API lấy tour Miền Bắc
        // region có thể là: 'mien_bac', 'north', hoặc tùy theo backend của bạn định nghĩa
        const response = await tourAPI.getToursByRegion('Miền Bắc');
        
        setNorthernTours(response.data || response);
      } catch (err) {
        console.error('Error fetching northern tours:', err);
        setError(err.message || 'Không thể tải dữ liệu tour');
      } finally {
        setLoading(false);
      }
    };

    fetchNorthernTours();
  }, []);

  return (
    <section className="ss-about margin-top-50">
      <div className="introduction wow fadeInUp">
        <div className="container">
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('mien_bac') || 'MIỀN BẮC'}
              </h2>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Tour list */}
            {!loading && !error && (
              <div className="card-container">
                {northernTours.length > 0 ? (
                  northernTours.map(tour => (
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
                  ))
                ) : (
                  <div className="text-center py-5">
                    <p>Không có tour nào trong khu vực này.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default NorthernToursPage;