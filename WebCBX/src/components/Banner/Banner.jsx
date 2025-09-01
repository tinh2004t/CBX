import React, { useState, useEffect } from 'react';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bannerImages = [
    "files/images/Banner/banner1.jpg",
    "files/images/Banner/banner2.jpg",
    "files/images/Banner/banner3.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <banner className="banner">
      <div className="carousel slide" data-ride="carousel" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
        <div className="carousel-inner">
          {bannerImages.map((image, index) => (
            <div 
              key={index}
              className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
              style={{ 
                display: index === currentSlide ? 'block' : 'none'
              }}
            >
              <img 
                className="d-block w-100 banner-index" 
                src={image}
                alt={`Banner ${index + 1}`}
                style={{
                  maxHeight: '100vh',
                  width: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Carousel indicators */}
        <ol className="carousel-indicators">
          {bannerImages.map((_, index) => (
            <li
              key={index}
              className={index === currentSlide ? 'active' : ''}
              onClick={() => setCurrentSlide(index)}
            ></li>
          ))}
        </ol>
        
        {/* Navigation arrows */}
        <a 
          className="carousel-control-prev" 
          href="#" 
          role="button"
          onClick={(e) => {
            e.preventDefault();
            setCurrentSlide((prev) => 
              prev === 0 ? bannerImages.length - 1 : prev - 1
            );
          }}
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        
        <a 
          className="carousel-control-next" 
          href="#" 
          role="button"
          onClick={(e) => {
            e.preventDefault();
            setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
          }}
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    </banner>
  );
};

export default Banner;