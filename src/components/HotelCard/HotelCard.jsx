import React from 'react';
import './HotelCard.css';

const HotelCard = ({ location, image, name, rating, reviewCount, stars, price, href }) => {
  return (
    <a className="hotel-card" href={href}>
      <img src={image} alt={name} className="hotel-card__image" />
      <div className="hotel-card__info">
        <h3 className="hotel-card__name">{name}</h3>
        <p className="hotel-card__location">{location}</p>
        <div className="hotel-card__rating">
          <span className="hotel-card__stars">{'⭐'.repeat(stars)}</span>
          <span className="hotel-card__rating-score">{rating} ({reviewCount} đánh giá)</span>
        </div>
        <p className="hotel-card__price">{price} / đêm</p>
      </div>
    </a>
  );
};

export default HotelCard;
