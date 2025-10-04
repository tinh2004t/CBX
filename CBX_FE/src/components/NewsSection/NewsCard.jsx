import React from 'react';
import { Link } from 'react-router-dom';
import './NewsCard.css';

const NewsCard = ({ news }) => {
  // Kiểm tra news có tồn tại không
  if (!news) {
    console.warn('NewsCard received undefined news');
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString.$date || dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      console.error('Date format error:', e);
      return '';
    }
  };

  return (
    <Link to={`/blog/${news.slug}`} className="news-card">
      <div className="news-image">
        <img 
          src={news.image || 'https://via.placeholder.com/400x300'} 
          alt={news.title || 'News image'}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        {news.category && (
          <span className="news-category">{news.category}</span>
        )}
      </div>
      <div className="news-content">
        <h3 className="news-title">{news.title}</h3>
        <p className="news-excerpt">{news.excerpt}</p>
        <div className="news-meta">
          {news.author?.name && (
            <span className="news-author">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              {news.author.name}
            </span>
          )}
          <span className="news-date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path 
                d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {formatDate(news.publishDate || news.createdAt)}
          </span>
          {news.stats?.views !== undefined && (
            <span className="news-views">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              {news.stats.views}
            </span>
          )}
        </div>
        {news.location?.city && (
          <div className="news-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path 
                d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {news.location.city}
          </div>
        )}
      </div>

    </Link>
  );
};

export default NewsCard;