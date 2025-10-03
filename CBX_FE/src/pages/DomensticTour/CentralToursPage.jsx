import React, { useState, useEffect } from 'react';
import TourCard from '../../components/TourSection/TourCard';
import { useLanguage } from '../../hooks/useLanguage';
import tourAPI from '../../api/tourApi';

const CentralToursPage = () => {
  const { t } = useLanguage();
  const [centralTours, setCentralTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNorthernTours = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API lấy tour Miền Bắc
        // region có thể là: 'mien_bac', 'north', hoặc tùy theo backend của bạn định nghĩa
        const response = await tourAPI.getToursByRegion('Miền Trung');
        
        setCentralTours(response.data || response);
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
          {/* MIỀN TRUNG */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('mien_trung') || 'MIỀN TRUNG'}
              </h2>
            </div>
            <div className="card-container">
              {centralTours.map(tour => (
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

export default CentralToursPage;