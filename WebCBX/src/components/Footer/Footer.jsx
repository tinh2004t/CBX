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
            <div className="widget about-us-widget col-md-2 col-sm-6 text-center">
              <a href="/">
                <img
                  src="/files/images/logo/logo.jpg"
                  alt="Logo"
                  width="150px"
                  className="img-fluid img-fotter"
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
                  <i className="fa fa-map-marker"></i>&nbsp;
                  <span className="fleft location_address">
                    <b>Address:</b>
                  </span>
                  <br /> Xóm 9 xã Phù Đổng, thành phố Hà Nội
                </div>

                <div className="widget widget-links col-md-4 col-sm-6 color-fff">
                  <i className="fa fa-phone"></i>
                  <span className="fleft location_address">&nbsp;
                    <b>Phone</b>
                  </span>
                  <br /> 024 36760 888
                </div>

                <div className="widget widget-links col-md-4 col-sm-6 color-fff">
                  <i className="far fa-envelope"></i>
                  <span className="fleft location_address">&nbsp;
                    <b>Email:</b>
                  </span>
                  <br /> dulichcanhbuomxanh@gmail.com
                </div>

                <div className="col-md-12 color-fff">
                  <p style={{ marginTop: '10px', marginBottom: '0', color: '#FFF' }}>
                    CÔNG TY TNHH TMDV & DU LỊCH CÁNH BUỒM XANH
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
                  Copyright © CÔNG TY TNHH TMDV & DU LỊCH CÁNH BUỒM XANH
                  <span> Power by:
                    <a className="text-transform" style={{ color: '#94C120' }} href="#">
                      canhbuomxanh.vn
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