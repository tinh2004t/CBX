import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import './Navigation.css';

const Navigation = () => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({});

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (index) => {
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileDropdown = (index) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const menuItems = [
    {
      title: t('trang_chu'),
      href: '/',
      type: 'link'
    },
    {
      title: t('tour_noi_dia'),
      type: 'dropdown',
      href : '/DomesticTourPage',
      items: [
        { title: t('mien_bac'), href: '/DomesticTourPage/NorthernToursPage' },
        { title: t('mien_trung'), href: '/DomesticTourPage/CentralToursPage' },
        { title: t('mien_nam'), href: '/DomesticTourPage/SouthernToursPage' }
      ]
    },
    {
      title: t('tour_quoc_te'),
      type: 'dropdown',
      href : '/OverseasTourPage',
      items: [
        { title: t('chau_a'), href: '/OverseasTourPage/AsiaToursPage' },
        { title: t('chau_au'), href: '/OverseasTourPage/EuropeToursPage' },
        { title: t('chau_phi'), href: '/OverseasTourPage/AfricaToursPage' },
        { title: t('chau_mi'), href: '/OverseasTourPage/AmericaToursPage' }
      ]
    },
    {
      title: t('combo_voucher'),
      type: 'dropdown',
      items: [
        { title: t('ve_may_bay'), href: '/FlightTickets' },
        { title: t('khach_san_resort'), href: '/HotelResorts' },
        { title: t('homestay'), href: '/HomestayVilla' },
        { title: t('teambuilding'), href: '/Teambuilding' },
        { title: t('mice'), href: '/Mice' },
        { title: t('dich_vu_van_tai'), href: 'Transport' }
      ]
    },
    {
      title: t('blog_du_lich'),
      href: '/TravelBlog',
      type: 'link'
    }
  ];

  return (
    <>
      <nav className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <ul className="nav-menu">
            {menuItems.map((item, index) => (
              <li 
                key={index}
                className="nav-item"
                onMouseEnter={() => item.type === 'dropdown' ? handleDropdownEnter(index) : null}
                onMouseLeave={() => item.type === 'dropdown' ? handleDropdownLeave() : null}
              >
                {item.type === 'link' ? (
                  <a href={item.href} className="nav-link">
                    {item.title}
                  </a>
                ) : (
                  <>
                    <a href={item.href} className="nav-link">
                      {item.title}
                      <span className="dropdown-arrow">▼</span>
                    </a>
                    <ul className={`dropdown-menu ${activeDropdown === index ? 'show' : ''}`}>
                      {item.items.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a href={subItem.href} className="dropdown-item">
                            {subItem.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          {menuItems.map((item, index) => (
            <li key={index} className="mobile-nav-item">
              {item.type === 'link' ? (
                <a href={item.href} className="mobile-nav-link">
                  {item.title}
                </a>
              ) : (
                <>
                  <a 
                    href="#" 
                    className="mobile-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMobileDropdown(index);
                    }}
                  >
                    {item.title} <span style={{float: 'right'}}>{mobileDropdowns[index] ? '▲' : '▼'}</span>
                  </a>
                  <div className={`mobile-dropdown ${mobileDropdowns[index] ? 'open' : ''}`}>
                    {item.items.map((subItem, subIndex) => (
                      <a 
                        key={subIndex}
                        href={subItem.href} 
                        className="mobile-nav-link mobile-dropdown-item"
                      >
                        {subItem.title}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navigation;