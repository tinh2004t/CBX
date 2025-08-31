import React, { useState, useEffect } from 'react';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const bannerImages = [
    "/files/images/1.jpg",
    "/files/images/7.jpg",
    "/files/images/vietnam/1%20Nord/lao-cai/1%20-%20Bac%20Ha/_MG_0362.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <banner className="banner">
      <div className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          {bannerImages.map((image, index) => (
            <div 
              key={index}
              className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
            >
              <img 
                className="d-block w-100 banner-index" 
                src={image}
                alt={`Banner ${index + 1}`}
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