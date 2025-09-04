import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

const MapLocation = ({ id, href, style, image, titleKey, introKey }) => {
  const { t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <a 
      className="maps-ab" 
      id={id}
      href={href}
      style={{
        position: 'absolute',
        ...style
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <img className="img-maps" src={image} alt="" />
      
      {showTooltip && (
        <div className="title-maps">
          <div className="general">
            <h2 className="name-province">
              {t(titleKey) || titleKey}
            </h2>
            <div className="introduce-province">
              {t(introKey) || introKey}
            </div>
          </div>
          <span className="more-info">
            {t('more_info') || 'Xem thêm'}
          </span>
        </div>
      )}
    </a>
  );
};

export default MapLocation;