import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

const NewsCard = ({ news }) => {
  const { t } = useLanguage();

  return (
    <div className="news-item">
      <div className="news-image">
        <img src={news.image} alt={news.title} />
      </div>
      <div className="news-content">
        <h3 className="news-title">{news.title}</h3>
        <p className="news-excerpt">{news.excerpt}</p>
        <button className="btn-read-more">
          {t('more_info') || 'XEM THÊM'}
        </button>
      </div>
    </div>
  );
};

export default NewsCard;