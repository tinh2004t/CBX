import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

const Navigation = () => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dropdown hover functionality for desktop
  useEffect(() => {
    if (window.innerWidth > 991) {
      const dropdowns = document.querySelectorAll('.dropdown');
      
      dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
          const dropdownMenu = dropdown.querySelector('.dropdown-menu');
          if (dropdownMenu) {
            dropdownMenu.classList.add('show');
          }
        });

        dropdown.addEventListener('mouseleave', () => {
          const dropdownMenu = dropdown.querySelector('.dropdown-menu');
          if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
          }
        });
      });
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg main-navbar">
      <div className="container">
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon">
            <i className="fas fa-bars" style={{color: 'white'}}></i>
          </span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav">
            {/* Trang chủ */}
            <li className="nav-item">
              <a className="nav-link" href="/">
                {t('trang_chu') || 'Trang chủ'}
              </a>
            </li>

            {/* Tour nội địa */}
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button"
              >
                {t('tour_noi_dia') || 'Tour nội địa'}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    {t('mien_bac') || 'Miền Bắc'}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    {t('mien_trung') || 'Miền Trung'}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    {t('mien_nam') || 'Miền Nam'}
                  </a>
                </li>
              </ul>
            </li>

            {/* Tour quốc tế */}
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button"
              >
                {t('tour_quoc_te') || 'Tour quốc tế'}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    {t('chau_a') || 'Châu Á'}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    {t('chau_au') || 'Châu Âu'}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    {t('chau_phi') || 'Châu Phi'}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    {t('chau_my') || 'Châu Mỹ'}
                  </a>
                </li>
              </ul>
            </li>

            {/* Combo & Voucher */}
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button"
              >
                {t('combo_voucher') || 'Combo & Voucher'}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    {t('ve_may_bay') || 'Vé máy bay'}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    {t('khach_san_resort') || 'Khách sạn & Resort'}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    {t('homestay_villa') || 'Homestay & Villa'}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    {t('teambuilding_gala_dinner') || 'Teambuilding & Gala Dinner'}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    {t('mice') || 'MICE'}
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    {t('dich_vu_van_tai') || 'Dịch vụ vận tải'}
                  </a>
                </li>
              </ul>
            </li>

            {/* Blog du lịch */}
            <li className="nav-item">
              <a className="nav-link" href="/blog">
                {t('blog_du_lich') || 'Blog du lịch'}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;