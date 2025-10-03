import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import { useEffect, useState } from "react";
import settingAPI from '../../api/settingApi';

const Footer = () => {
  const { t } = useLanguage();

  const [contact, setContacts] = React.useState({});

   useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await settingAPI.getSettings();
        if (res.success) {
          setContacts(res.data);
        }
      } catch (err) {
        console.error("Lỗi lấy settings:", err);
      }
    };
    fetchContacts();
  }, []);



  return (
    <footer style={{
      background: 'linear-gradient(135deg, #cdebf1 0%, #60a5fa 50%, #1e3a8a 100%)',
      color: '#ffffff'
    }}>
      <section className="clearfix footer-wrapper">
        <section className="clearfix footer-pad" style={{ padding: '40px 0' }}>
          <div className="row justify-content-center margin-0">
            {/* Logo Section */}
            <div className="widget about-us-widget col-md-2 col-sm-6 text-center">
              <a href="/">
                <img
                  src="/files/images/logo/logo.jpg"
                  alt="Logo"
                  width="150px"
                  className="img-fluid img-fotter"
                  style={{
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                />
              </a>
            </div>

            {/* Contact Information */}
            <div className="col-md-7 widget about-us-widget">
              <h4 className="widget_title" style={{
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '20px',
                borderBottom: '2px solid rgba(255,255,255,0.3)',
                paddingBottom: '10px'
              }}>
                {t('lien_lac_voi_chung_toi') || 'Entrer en contact'}
              </h4>
              <div className="row">
                <div className="widget widget-links col-md-4 col-sm-6" style={{
                  color: '#ffffff',
                  marginBottom: '15px'
                }}>
                  <i className="fa fa-map-marker" style={{
                    color: '#60a5fa',
                    fontSize: '18px',
                    marginRight: '8px'
                  }}></i>
                  <span className="fleft location_address">
                    <b style={{ color: '#e0f2fe' }}>Address:</b>
                  </span>
                  <br />
                  <span style={{ 
                    color: '#f0f9ff',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginLeft: '26px'
                  }}>
                    {contact.address}
                  </span>
                </div>

                <div className="widget widget-links col-md-4 col-sm-6" style={{
                  color: '#ffffff',
                  marginBottom: '15px'
                }}>
                  <i className="fa fa-phone" style={{
                    color: '#60a5fa',
                    fontSize: '18px',
                    marginRight: '8px'
                  }}></i>
                  <span className="fleft location_address">
                    <b style={{ color: '#e0f2fe' }}>Phone:</b>
                  </span>
                  <br />
                  <span style={{ 
                    color: '#f0f9ff',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginLeft: '26px'
                  }}>
                  {contact.hotline}
                  </span>
                </div>

                <div className="widget widget-links col-md-4 col-sm-6" style={{
                  color: '#ffffff',
                  marginBottom: '15px'
                }}>
                  <i className="far fa-envelope" style={{
                    color: '#60a5fa',
                    fontSize: '18px',
                    marginRight: '8px'
                  }}></i>
                  <span className="fleft location_address">
                    <b style={{ color: '#e0f2fe' }}>Email:</b>
                  </span>
                  <br />
                  <span style={{ 
                    color: '#f0f9ff',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginLeft: '26px'
                  }}>
                    {contact.email}
                  </span>
                </div>

                <div className="col-md-12" style={{ marginTop: '20px' }}>
                  <p style={{ 
                    marginTop: '10px', 
                    marginBottom: '0', 
                    color: '#e0f2fe',
                    fontSize: '16px',
                    fontWeight: '500',
                    textAlign: 'center',
                    padding: '15px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    CÔNG TY TNHH TMDV & DU LỊCH CÁNH BUỒM XANH
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="col-md-2">
              <div className="icon-contact-footer">
                <h4 className="widget_title" style={{
                  color: '#ffffff',
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  {t('follow_us') || 'Entrer en contact'}
                </h4>
                <SocialLinks />
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="container clearfix footer-b-pad" style={{
            marginTop: '30px',
            paddingTop: '25px',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div className="footer-copy">
              <div className="pull-left fo-txt text-center" style={{ width: '100%' }}>
                <p style={{
                  color: '#f0f9ff',
                  fontSize: '14px',
                  margin: '0',
                  textAlign: 'center'
                }}>
                  Copyright © CÔNG TY TNHH TMDV & DU LỊCH CÁNH BUỒM XANH
                  <span style={{ margin: '0 10px' }}> | </span>
                  <span>Power by: </span>
                  <a 
                    className="text-transform" 
                    style={{ 
                      color: '#60a5fa',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'color 0.3s ease'
                    }} 
                    href="#"
                    onMouseOver={(e) => e.target.style.color = '#93c5fd'}
                    onMouseOut={(e) => e.target.style.color = '#60a5fa'}
                  >
                    canhbuomxanh.vn
                  </a>
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
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await settingAPI.getSettings();
        if (res.success) {
          const data = res.data;
          // 🔹 Tạo mảng link từ dữ liệu API
          const links = [
            { href: data.fbLink, icon: "fab fa-facebook-f" },
            { href: `mailto:${data.email}`, icon: "fas fa-envelope" },
            { href: `tel:${data.hotline}`, icon: "fas fa-phone" }
          ];
          setSocialLinks(links);
        }
      } catch (err) {
        console.error("Lỗi khi gọi settings:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "15px"
      }}
    >
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            textAlign: "center",
            lineHeight: "40px",
            transition: "all 0.3s ease",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <i
            className={link.icon}
            style={{
              color: "#ffffff",
              fontSize: "18px"
            }}
          ></i>
        </a>
      ))}
    </div>
  );
};

export default Footer;