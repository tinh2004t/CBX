import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer>
      <section className="clearfix footer-wrapper">
        <section className="clearfix footer-pad">
          <div className="row justify-content-center margin-0">
            {/* Logo Section */}
            <div className="widget about-us-widget col-md-2 col-sm-6">
              <a href="/">
                <img 
                  src="/files/images/logoád.jpg" 
                  width="150px" 
                  alt="Logo"
                  className="img-fluid img-fotter" 
                />
              </a>
              <a href="">
                <img 
                  src="/Content/assets/images/TA_brand_logo.pngádsd" 
                  width="150px"
                  style={{ marginTop: '15px' }} 
                  className="img-fluid img-fotter" 
                  alt="TripAdvisor" 
                />
              </a>
            </div>

            {/* Contact Information */}
            <div className="col-md-7 widget about-us-widget">
              <h4 className="widget_title">
                {t('lien_lac_voi_chung_toi') || 'Entrer en contact'}
              </h4>
              <div className="row">
                <div className="widget widget-links col-md-4 col-sm-6 color-fff">
                  <i className="fa fa-map-marker"></i>
                  <span className="fleft location_address">
                    <b>Address:</b>
                  </span>
                  <br /> 364 Minh Khai street, Hai Ba Trung Square, Hanoi, Vietnam
                </div>
                
                <div className="widget widget-links col-md-4 col-sm-6 color-fff">
                  <i className="fa fa-phone"></i>
                  <span className="fleft location_address">
                    <b>Phone</b>
                  </span>
                  <br /> +84 912 550 212
                </div>
                
                <div className="widget widget-links col-md-4 col-sm-6 color-fff">
                  <i className="far fa-envelope"></i>
                  <span className="fleft location_address">
                    <b>Email:</b>
                  </span>
                  <br /> asdadsd@gmail.com
                </div>
                
                <div className="col-md-12 color-fff">
                  <p style={{ marginTop: '10px', marginBottom: '0', color: '#FFF' }}>
                    Commercial license number 01-882/2016/TCDL-GPLHQT issued by the Ministry of Culture, Sports and Tourism.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="col-md-2">
              <div className="icon-contact-footer">
                <h4 className="widget_title">Follow Us</h4>
                <SocialLinks />
              </div>
            </div>
          </div>
          
          {/* Copyright Section */}
          <div className="container clearfix footer-b-pad">
            <div className="footer-copy">
              <div className="pull-left fo-txt text-center">
                <p>
                  Copyright © ajsdnadnskk
                  <span> Power by: 
                    <a className="text-transform" style={{ color: '#94C120' }} href="#">
                      kjaskda.casj
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </footer>
  );
};

// Social Media Links Component
const SocialLinks = () => {
  const socialLinks = [
    { 
      href: "https://www.facebook.com/Vietnam-Impression-Travel-890079197757256/", 
      icon: "fab fa-facebook-f" 
    },
    { 
      href: "https://www.youtube.com/channel/UCYVE8MubhP1DqzLio4oXIWw", 
      icon: "fab fa-youtube" 
    },
    { 
      href: "https://www.instagram.com/?hl=vi", 
      icon: "fab fa-instagram" 
    },
    { 
      href: "https://www.facebook.com/Vietnam-Impression-Travel-890079197757256/", 
      icon: "fab fa-twitter" 
    },
    { 
      href: "https://www.youtube.com/channel/UCYVE8MubhP1DqzLio4oXIWw", 
      icon: "fab fa-whatsapp" 
    },
    { 
      href: "https://www.instagram.com/?hl=vi", 
      icon: "fab fa-linkedin-in" 
    }
  ];

  return (
    <>
      {socialLinks.map((link, index) => (
        <a key={index} href={link.href} target="_blank" rel="noopener noreferrer">
          <i className={link.icon} style={{ color: '#FFF' }}></i>
        </a>
      ))}
    </>
  );
};

export default Footer;