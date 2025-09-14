import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle window resize with proper breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width >= 1280) { // xl: desktop
        setIsMobileMenuOpen(false);
        setIsCollapsed(false);
      } else if (width >= 1024) { // lg: laptop
        setIsMobileMenuOpen(false);
        setIsCollapsed(false);
      } else if (width >= 768) { // md: tablet
        setIsMobileMenuOpen(false);
        setIsCollapsed(true);
      } else { // sm: mobile
        setIsCollapsed(false);
        // Keep mobile menu state as is
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simplified menu items for demonstration
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      type: 'link',
      href: '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12H15V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    },
    {
      id: 'users',
      name: 'Quản lý Admin',
      type: 'link',
      href: '/quan-ly-admin',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'KhamPha',
      name: 'Khám Phá',
      type: 'link',
      href: '/kham-pha',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="3.27,6.96 12,12.01 20.73,6.96"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="22.08"
            x2="12"
            y2="12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'Blog',
      name: 'Blog',
      type: 'link',
      href: '/blog',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="14,2 14,8 20,8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'DomesticTour',
      name: 'Tour Nội Địa',
      type: 'link',
      href: '/tour-noi-dia',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'OverseaTour',
      name: 'Tour Nước Ngoài',
      type: 'link',
      href: '/tour-nuoc-ngoai',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 12H22" stroke="currentColor" strokeWidth="2"/>
          <path
            d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: 'ComboVoucher',
      name: 'Combo & Voucher',
      type: 'dropdown',
      href: '/combo-voucher',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M21.44 11.05L12.25 1.86C11.9 1.51 11.44 1.31 10.97 1.31H4C3.45 1.31 2.95 1.81 2.95 2.36V9.33C2.95 9.8 3.15 10.26 3.5 10.61L12.69 19.8C13.4 20.51 14.56 20.51 15.27 19.8L21.44 13.63C22.15 12.92 22.15 11.76 21.44 11.05Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      children: [
        { id: 'product-list', name: 'Vé máy bay', href: '/products/list' },
        { id: 'product-categories', name: 'Khách sạn & Resort', href: '/products/categories' },
        { id: 'product-inventory', name: 'Homestay & Villa', href: '/products/inventory' },
        { id: 'teambuilding', name: 'Teambuilding & Gala Dinner', href: '/products/teambuilding' },
        { id: 'mice', name: 'MICE', href: '/products/mice' },
        { id: 'transport', name: 'Dịch vụ vận tải', href: '/products/transport' }
      ]
    },
    {
      id: 'settings',
      name: 'Cài đặt',
      type: 'link',
      href: '/settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5842 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6642 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2579 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6642 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.02405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15V15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    },
  ];

  const toggleDropdown = (itemId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleItemClick = (item, child = null) => {
    if (item.type === 'dropdown' && !child) {
      toggleDropdown(item.id);
    } else {
      const targetId = child ? child.id : item.id;
      setActiveItem(targetId);
      
      // Close mobile menu when selecting an item
      if (window.innerWidth < 768) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  // Icon Components
  const ChevronIcon = ({ isOpen }) => (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const CollapseIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  );

  const renderMenuItem = (item) => {
    const baseClasses = "w-full flex items-center py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-800 group relative";
    const paddingClasses = isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3';

    if (item.type === "link") {
      return (
        <NavLink
          to={item.href}
          className={({ isActive }) =>
            `${baseClasses} ${paddingClasses} ${
              isActive ? "bg-blue-600 text-white" : "text-gray-300"
            }`
          }
          onClick={() => setActiveItem(item.id)}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          {!isCollapsed && <span className="truncate">{item.name}</span>}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
              {item.name}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </NavLink>
      );
    }

    return (
      <div className="relative">
        <button
          className={`${baseClasses} ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} ${
            activeItem === item.id ? "bg-blue-600 text-white" : "text-gray-300"
          }`}
          onClick={() => handleItemClick(item)}
        >
          <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
            <span className="flex-shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </div>
          {item.type === "dropdown" && !isCollapsed && (
            <ChevronIcon isOpen={openDropdowns[item.id]} />
          )}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
              {item.name}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </button>
      </div>
    );
  };

  const renderChildMenuItem = (child) => (
    <NavLink
      key={child.id}
      to={child.href}
      className={({ isActive }) =>
        `block w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 hover:bg-gray-800 truncate ${
          isActive ? "bg-blue-600 text-white" : "text-gray-300"
        }`
      }
      onClick={() => setActiveItem(child.id)}
    >
      {child.name}
    </NavLink>
  );

  // Calculate sidebar classes
  const getSidebarClasses = () => {
    const baseClasses = "bg-gray-900 text-white h-screen flex flex-col overflow-hidden z-40 transition-all duration-300 ease-in-out";
    
    // Mobile (< 768px)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return `${baseClasses} fixed left-0 top-0 w-64 transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`;
    }
    
    // Tablet and up (>= 768px)
    return `${baseClasses} fixed left-0 top-0 ${isCollapsed ? 'w-16' : 'w-64'}`;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={getSidebarClasses()}>
        {/* Header */}
        <div className={`flex-shrink-0 border-b border-gray-800 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <div className="flex items-center justify-between h-12">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-white truncate">Admin Panel</h1>
            )}
            
            {/* Collapse button for tablet and desktop */}
            {window.innerWidth >= 768 && (
              <button
                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors duration-200 flex-shrink-0"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Mở rộng" : "Thu gọn"}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <CollapseIcon />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <ul className="space-y-1 py-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                {renderMenuItem(item)}

                {/* Dropdown Menu - Only show when not collapsed */}
                {item.type === 'dropdown' && !isCollapsed && openDropdowns[item.id] && (
                  <ul className="mt-1 ml-6 space-y-1 border-l border-gray-700 pl-3">
                    {item.children?.map((child) => (
                      <li key={child.id}>
                        {renderChildMenuItem(child)}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer - Optional */}
        {!isCollapsed && (
          <div className="flex-shrink-0 p-4 border-t border-gray-800">
            <div className="text-xs text-gray-400 text-center">
              © 2024 Admin Panel
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;