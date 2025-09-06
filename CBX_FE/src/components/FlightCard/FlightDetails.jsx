import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';

const FlightDetails = ({ flight, onBack }) => (
  <div className="flight-details">
    {/* Header */}
    <div className="flight-details__header">
      <button 
        onClick={onBack}
        className="back-button"
      >
        <ArrowLeft className="back-icon" />
        Quay lại
      </button>
    </div>

    {/* Thông tin chuyến bay */}
    <div className="flight-info-card">
      <div className="flight-info__header">
        <img 
          src={flight.airlineLogo} 
          alt={flight.airline}
          className="flight-info__logo"
        />
        <div>
          <h2 className="flight-info__title">{flight.airline}</h2>
          <p className="flight-info__route">{flight.departure} → {flight.destination}</p>
        </div>
      </div>
      <div className="flight-info__meta">
        <div className="flight-info__date">
          <Calendar className="date-icon" />
          <span>
            {new Date(flight.date).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className="flight-info__price">Từ {flight.price}₫</div>
      </div>
    </div>

    {/* Danh sách chuyến bay */}
    <div className="flight-list">
      <h3 className="flight-list__title">Chọn giờ bay</h3>
      {flight.flights.map((flightDetail, index) => (
        <div key={index} className="flight-item">
          <div className="flight-item__content">
            <div className="flight-item__details">
              <div className="flight-item__time-info">
                <span className="flight-time">{flightDetail.time}</span>
                <span className="flight-duration">({flightDetail.duration})</span>
              </div>
              <div className="flight-item__meta">
                <span className="flight-code">{flightDetail.flightCode}</span>
                <span className="meta-separator">•</span>
                <span className="aircraft-type">{flightDetail.aircraft}</span>
              </div>
            </div>
            <div className="flight-item__booking">
              <div className="booking-price">{flight.price}₫</div>
              <span className={`status-badge ${
                flightDetail.status === 'Còn chỗ' 
                  ? 'status-badge--available' 
                  : 'status-badge--limited'
              }`}>
                {flightDetail.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FlightDetails;