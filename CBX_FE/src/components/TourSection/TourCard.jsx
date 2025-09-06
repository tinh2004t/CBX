import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import './TourCard.css';

const TourCard = ({ tour, type }) => {
  const { t } = useLanguage();


  if (type === 'bestselling') {
    return (
      <div className="card">
        <div className="card-image">
          <img src={tour.image} alt={tour.title} />
          <div className="tag">{tour.departure}</div>
        </div>
        <div className="card-content">
          <h3 className="card-title">{tour.title}</h3>
          <div className="card-details">
            <p className="duration">{t('gia_1_khach') || 'Giá 1 khách'}</p>
            <p className="price">{tour.price}</p>
            <div className="program-info">
              <p>{tour.duration}</p>
              <p>{tour.airline}</p>
              <p>
                <span>{tour.scheduleInfo}</span> 
                <span className="note">{t('more_info') || 'Xem thêm'}</span>
              </p>
            </div>
          </div>
          <a href={tour.href} className="btn-view-more">
            {t('more_info') || 'XEM THÊM'}
          </a>
        </div>
      </div>
    );
  }

  if (type === 'combo') {
    return (
      <div className="card">
        <img src={tour.image} alt={tour.title} />
        <div className="card-content">
          <h3>{tour.title}</h3>
          <p>
            <i className="fa-solid fa-clock"></i> <span>{tour.duration}</span><br />
            <i className="fa-solid fa-plane"></i> <span>{tour.departure}</span><br />
            <i className="fa-solid fa-location-dot"></i> <span>{tour.destination}</span><br />
            <i className="fa-solid fa-calendar-days"></i> <span>{tour.schedule}</span><br />
          </p>
          <p className="price">{tour.price}</p>
          <a href="#" className="btn orange">
            {t('chi_tiet') || 'Chi tiết'}
          </a>
        </div>
      </div>
    );
  }

  return null;
};

export default TourCard;