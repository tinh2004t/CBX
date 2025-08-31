import React from 'react';
import TopContact from './TopContact';
import Navigation from './Navigation';
import { useLanguage } from '../../hooks/useLanguage';


const Header = () => {
  return (
    <header>
      <style>{`
        img.img-loca {
            opacity: 0.7;
        }

        img.img-loca:hover {
            opacity: 1;
        }

        .link-loca:hover {
            opacity: 1;
        }

        .div-text {
            position: absolute;
            top: 30px;
            width: 80%;
            text-align: center
        }

        .icon-close i {
            position: absolute;
            top: 0px;
            left: 150px;
            width: 80%;
        }

        .footer-pad {
            font-size: 14px;
        }
    `}</style>
      <TopContact />
      
      {/* Header Top Section */}
      <div className="header-top">
        <div className="container">
          <div className="row align-items-center">
            {/* Logo */}
            <div className="col-lg-2 col-md-12">
              <div className="logo">
                <img src="files/images/logádao.jpg" alt="Logo" />
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-12">
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>Hotline: 0123.456.789</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>info@travel.com</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>123 Đường ABC, Hà Nội</span>
                </div>
              </div>
            </div>

            {/* Search Box */}
            <div className="col-lg-4 col-md-12">
              <SearchBox />
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

// Search Box Component
const SearchBox = () => {
  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value;
    if (searchValue.trim()) {
      alert('Tìm kiếm: ' + searchValue);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          name="search"
          className="search-box" 
          placeholder="Tìm kiếm tour, địa điểm..." 
        />
        <button type="submit" className="search-btn">
          <i className="fas fa-search"></i>
        </button>
      </form>
    </div>
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
        <img src="/files/images/VI.png" alt="Vietnamese" width="30" height="17" />
      </a>
      <a 
        href="#" 
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          switchLanguage('en');
        }}
      >
        <img src="/files/images/EN.png" alt="English" width="30" height="17" />
      </a>
    </div>
  );
};

export default Header;