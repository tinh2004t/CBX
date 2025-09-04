import React from 'react';
import { ChevronRight, Plane, Calendar } from 'lucide-react';

const FlightCard = ({ flight, onClick }) => (
  <div 
    className="flight-card"
    onClick={() => onClick(flight)}
  >
    <div className="flight-card__content">
      {/* Header với hãng bay */}
      <div className="flight-card__header">
        <div className="airline-info">
          <img 
            src={flight.airlineLogo} 
            alt={flight.airline}
            className="airline-logo"
          />
          <span className="airline-name">{flight.airline}</span>
        </div>
        <ChevronRight className="chevron-icon" />
      </div>

      {/* Tuyến bay */}
      <div className="flight-route">
        <span className="route-point">{flight.departure}</span>
        <Plane className="plane-icon" />
        <span className="route-point">{flight.destination}</span>
      </div>

      {/* Ngày bay và giá */}
      <div className="flight-card__footer">
        <div className="date-info">
          <Calendar className="calendar-icon" />
          <span className="date-text">
            {new Date(flight.date).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className="price-container">
          <div className="price-label">Từ</div>
          <div className="price-amount">{flight.price}₫</div>
        </div>
      </div>
    </div>
  </div>
);

export default FlightCard;