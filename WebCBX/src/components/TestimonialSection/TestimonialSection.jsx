import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

const TestimonialCarousel = ({ 
  testimonials = [],
  title = "",
}) => {
    const { t } = useLanguage();
    
  // Default data nếu không có props
  const defaultTestimonials = [
    {
      id: 1,
      name: "TONY ET ELA",
      image: "/files/images/11_2.jpg",
      backgroundImage: "files/images/anhfeedback.jpg",
      review: "Đây là chuyến đi tuyệt nhất tôi từng có đến Việt Nam. Hướng dẫn viên Boo đã làm rất tốt khi giới thiệu lịch sử và văn hóa Việt Nam. Tôi đã có cơ hội tham quan chợ đen và các khu dân cư trong thành phố. Tôi rất thích!",
      package: "Hanoi - Nghia Lo - Mu Cang Chai - Bac Ha - Suoi Thau - Ha Giang - Hai Phong - Tam Coc - Hue - Hoi An - Da Nang - Cai Be - Can Tho - Cu Chi - Saigon. 2 les gens - 18 jour.",
      stars: 5,
      isActive: true
    },
    {
      id: 2,
      name: "Mr.ABCD",
      image: "/files/images/7-31.jpg",
      backgroundImage: "files/images/anhfeedback.jpg",
      review: "",
      package: "Ha Noi - Mai Chau - Sa Pa. 2 les gens - 18 jour.",
      stars: 5,
      isActive: false
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i key={index} className={`fas fa-star ${index < count ? '' : 'text-muted'}`}></i>
    ));
  };

  const renderTestimonialSlide = (testimonial, index) => (
    <div key={testimonial.id} className={`carousel-item ${testimonial.isActive || index === 0 ? 'active' : ''}`}>
      <div className="vc_column-inner wpb_wrapper">
        <div className="infor-img">
          <img 
            className="talking-about-img" 
            src={testimonial.backgroundImage} 
            alt="feedback background" 
          />
        </div>

        <div className="infor-content">
          <i className="icon-talking-about margin-right fab fa-tripadvisor"></i>
          
          <span className="font-h1 border-botton-70 text-center margin-bottom">
            {t('ho_noi_gi_ve_chung_toi') || title}
          </span>
          
          <p className="text-content margin-top text-align-justify" data-key={`review${index > 0 ? index : ''}`}>
            {testimonial.review}
          </p>
          
          <div className="row">
            <div className="col-lg-3 col-md-4 col-5">
              <div className="img-people-talking-about">
                <img 
                  src={testimonial.image} 
                  className="people-talking-about" 
                  alt={testimonial.name}
                />
              </div>
            </div>
            
            <div className="col-lg-9 col-md-8 col-7">
              <div className="name-talking-about font-18-600">
                {testimonial.name}
              </div>
              
              <div className="star star-talking-about">
                {renderStars(testimonial.stars)}
              </div>
              
              <p className="travel-package">
                {testimonial.package}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="seemore-about font-14-600">
              <a href="#" data-key="doc_het_danh_gia">
                {t('doc_het_danh_gia')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCarouselIndicators = () => {
    if (displayTestimonials.length <= 1) return null;
    
    return (
      <ol className="carousel-indicators talking-about-ol">
        {displayTestimonials.map((_, index) => (
          <li
            key={index}
            data-target="#carousel-example-2"
            data-slide-to={index}
            className={index === 0 ? "active" : ""}
          ></li>
        ))}
      </ol>
    );
  };

  return (
    <section className="talking-about wow fadeInUp" style={{visibility: 'visible', animationName: 'fadeInUp'}}>
      <div id="carousel-example-2" className="carousel slide carousel-fade" data-ride="carousel">
        {renderCarouselIndicators()}
        
        <div className="carousel-inner carousel-talkingabout" role="listbox">
          {displayTestimonials.map((testimonial, index) => 
            renderTestimonialSlide(testimonial, index)
          )}
        </div>

        {/* Navigation controls - uncomment if needed */}
        {displayTestimonials.length > 1 && (
          <>
            <a className="carousel-control-prev" href="#carousel-example-2" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carousel-example-2" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </>
        )}
      </div>
    </section>
  );
};

export default TestimonialCarousel;