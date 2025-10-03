import React, { useState, useEffect } from 'react';
import TourCard from '../../components/TourSection/TourCard';
import { useLanguage } from '../../hooks/useLanguage';
import tourAPI from '../../api/tourApi';

const SouthernToursPage = () => {
  const { t } = useLanguage();
  const [southernTours, setSorthernTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSouthernTours = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API lấy tour Miền Bắc
        // region có thể là: 'mien_bac', 'north', hoặc tùy theo backend của bạn định nghĩa
        const response = await tourAPI.getToursByRegion('Miền Nam');
        
        setSorthernTours(response.data || response);
      } catch (err) {
        console.error('Error fetching southern tours:', err);
        setError(err.message || 'Không thể tải dữ liệu tour');
      } finally {
        setLoading(false);
      }
    };

    fetchSouthernTours();
  }, []);
  return (
    <section className="ss-about margin-top-50">
      <div className="introduction wow fadeInUp">
        <div className="container">
          {/* MIỀN NAM */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('mien_nam') || 'MIỀN NAM'}
              </h2>
            </div>
            <div className="card-container">
              {southernTours.map(tour => (
                <TourCard 
                  key={tour.id} 
                  tour={tour} 
                  type="bestselling"
                  href={tour.href}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default SouthernToursPage;