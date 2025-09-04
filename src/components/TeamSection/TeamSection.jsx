import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const TestimonialSection = () => {
  const { t } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "TONY ET ELA",
      image: "/files/images/11_2.jpg",
      backgroundImage: "/Content/assets/images/anhfeedback.jpg",
      rating: 5,
      reviewKey: "review",
      itinerary: "Hanoi - Nghia Lo - Mu Cang Chai - Bac Ha - Suoi Thau - Ha Giang - Hai Phong - Tam Coc - Hue - Hoi An - Da Nang - Cai Be - Can Tho - Cu Chi - Saigon. 2 les gens - 18 jour."
    },
    {
      id: 2,
      name: "Mr.ABCD",
      image: "/files/images/7-31.jpg",
      backgroundImage: "/Content/assets/images/anhfeedback.jpg",
      rating: 5,
      reviewKey: "review1",
      itinerary: "Ha Noi - Mai Chau - Sa Pa. 2 les gens - 18 jour."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000); // Change testimonial every 8 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentTestimonialData = testimonials[currentTestimonial];

  return (
    <section className="talking-about wow fadeInUp" style={{ visibility: 'visible', animationName: 'fadeInUp' }}>
      <div className="carousel slide carousel-fade">
        <div className="carousel-inner carousel-talkingabout">
          <div className="carousel-item active">
            <div className="vc_column-inner wpb_wrapper">
              <div className="infor-img">
                <img 
                  className="talking-about-img" 
                  src={currentTestimonialData.backgroundImage}
                  alt="Testimonial background"
                />
              </div>

              <div className="infor-content">
                <i className="icon-talking-about margin-right fab fa-tripadvisor"></i> 
                <span className="font-h1 border-botton-70 text-center margin-bottom">
                  {t('ho_noi_gi_ve_chung_toi') || 'Họ nói gì về chúng tôi'}
                </span>
                
                <p className="text-content margin-top text-align-justify">
                  {t(currentTestimonialData.reviewKey) || 'Review content'}
                </p>
                
                <div className="row">
                  <div className="col-lg-3 col-md-4 col-5">
                    <div className="img-people-talking-about">
                      <img 
                        src={currentTestimonialData.image} 
                        className="people-talking-about" 
                        alt={currentTestimonialData.name}
                      />
                    </div>
                  </div>
                  
                  <div className="col-lg-9 col-md-8 col-7">
                    <div className="name-talking-about font-18-600">
                      {currentTestimonialData.name}
                    </div>
                    
                    <div className="star star-talking-about">
                      {[...Array(currentTestimonialData.rating)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                    
                    <p className="travel-package">
                      {currentTestimonialData.itinerary}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="seemore-about font-18-600">
                    <a href="#">
                      {t('doc_het_danh_gia') || 'Đọc hết đánh giá'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial indicators */}
        <div className="testimonial-indicators">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
              onClick={() => setCurrentTestimonial(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;