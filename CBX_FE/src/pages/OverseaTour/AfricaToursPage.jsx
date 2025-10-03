import React, { useState, useEffect } from 'react';
import TourCard from '../../components/TourSection/TourCard';
import { useLanguage } from '../../hooks/useLanguage';
import tourAPI from '../../api/tourApi';

const AfricaToursPage = () => {
  const { t } = useLanguage();
  const [africaTours, setAfricaTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAfricaTours = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API lấy tour Miền Bắc
        // region có thể là: 'mien_bac', 'north', hoặc tùy theo backend của bạn định nghĩa
        const response = await tourAPI.getToursByContinent('Châu Phi');
        
        setAfricaTours(response.data || response);
      } catch (err) {
        console.error('Error fetching Africa tours:', err);
        setError(err.message || 'Không thể tải dữ liệu tour');
      } finally {
        setLoading(false);
      }
    };

    fetchAfricaTours();
  }, []);

  return (
    <section className="ss-about margin-top-50">
      <div className="introduction wow fadeInUp">
        <div className="container">
          {/* CHÂU PHI */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('chau_phi') || 'CHÂU PHI'}
              </h2>
            </div>
            <div className="card-container">
              {africaTours.map(tour => (
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

export default AfricaToursPage;