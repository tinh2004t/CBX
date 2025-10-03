import React from 'react';
import { useEffect, useState } from "react";
import Navigation from './Navigation';
import { useLanguage } from '../../hooks/useLanguage';
import settingAPI from '../../api/settingApi';

const Header = () => {
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
    <header>
      {/* Header Top Section */}
      <div className="header-top">
        <div className="container" style={{ maxWidth: '1180px' }}>
          <div className="row align-items-center">
            {/* Logo */}
            <div className="col-lg-2 col-md-12">
              <div className="logo">
                <img src="/files/images/logo/logo.jpg" alt="Logo" />
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-12">



              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>{contact.hotline}</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>{contact.email}</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{contact.address}</span>
                </div>
              </div>

            </div>

            {/* Search Box */}
            <div className="col-lg-4 col-md-12">
              <div className="search-container">
                <input
                  type="text"
                  className="search-box"
                  placeholder={t('tim_kiem') || 'Tìm kiếm tour, địa điểm...'}

                />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="col-lg-3 col-md-12">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </header>
  );
};

// Language Switcher Component
const LanguageSwitcher = () => {
  const { language, switchLanguage } = useLanguage();

  return (
    <div className="language-switcher justify-content-end">
      <a
        href="#"
        className={`lang-btn ${language === 'vi' ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          switchLanguage('vi');
        }}
      >
        <img src="/files/images/logo/flags/VI.png" alt="" width="30" height="17" />
      </a>
      <a
        href="#"
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          switchLanguage('en');
        }}
      >
        <img src="/files/images/logo/flags/EN.png" alt="" width="30" height="17" />
      </a>
    </div>
  );
};

export default Header;