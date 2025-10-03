import React, { useState, useEffect } from 'react';
import TourCard from '../../components/TourSection/TourCard';
import { useLanguage } from '../../hooks/useLanguage';
import tourAPI from '../../api/tourApi';

const EuropeToursPage = () => {
  const { t } = useLanguage();
  const [europeTours, setEuropeTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEuropeTours = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API lấy tour Miền Bắc
        // region có thể là: 'mien_bac', 'north', hoặc tùy theo backend của bạn định nghĩa
        const response = await tourAPI.getToursByContinent('Châu Phi');
        
        setEuropeTours(response.data || response);
      } catch (err) {
        console.error('Error fetching Europe tours:', err);
        setError(err.message || 'Không thể tải dữ liệu tour');
      } finally {
        setLoading(false);
      }
    };

    fetchEuropeTours();
  }, []);

  return (
    <section className="ss-about margin-top-50">
      <div className="introduction wow fadeInUp">
        <div className="container">
          {/* Europe Tours */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('chau_au') || 'CHÂU ÂU'}
              </h2>
            </div>
            <div className="card-container">
              {europeTours.map(tour => (
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

export default EuropeToursPage;