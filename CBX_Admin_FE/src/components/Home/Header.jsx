import React, { useState, useEffect, useRef } from "react";
import ProfileModal from "./ProfileModal";

const Header = ({ user, onLogout, onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user display info
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.fullName || user.name || user.username || 'User';
  };

  const getUserRole = () => {
    if (!user) return 'User';
    
    // Map role values to display names
    const roleMap = {
      'SuperAdmin': 'Super Admin',
      'Admin': 'Admin',
      'Editor': 'Editor',
      'Viewer': 'Viewer'
    };
    
    return roleMap[user.role] || user.role || 'User';
  };

  const getUserAvatar = () => {
    // Return user avatar if available, otherwise default
    return user?.avatar || 
           user?.profilePicture || 
           "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format";
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    setProfileModalOpen(true);
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    // Navigate to settings page or open settings modal
    window.location.href = '/settings';
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between bg-white shadow-sm border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        {/* Left Section */}
        <div className="flex items-center min-w-0 flex-shrink-0">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 mr-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          {/* Notification Bell */}
          <div className="relative flex-shrink-0">
            <button 
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              aria-label="Notifications"
            >
              <svg
                width="20"
                height="20"
                className="sm:w-6 sm:h-6 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {/* Notification Badge */}
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-medium">
              3
            </span>
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 min-w-0"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={getUserAvatar()}
                  alt={`${getUserDisplayName()} Avatar`}
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover border border-gray-200"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format";
                  }}
                />
              </div>

              {/* User Info - Hidden on mobile, visible on tablet+ */}
              <div className="hidden md:flex flex-col text-left min-w-0 max-w-32 lg:max-w-none">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {getUserDisplayName()}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {getUserRole()}
                </span>
              </div>

              {/* Dropdown Arrow */}
              <svg
                width="14"
                height="14"
                className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 transition-transform duration-200"
                style={{
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50 overflow-hidden">
                {/* Mobile only: User info at top */}
                <div className="md:hidden px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getUserRole()}
                  </div>
                  {user?.email && (
                    <div className="text-xs text-gray-400 truncate mt-1">
                      {user.email}
                    </div>
                  )}
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <svg 
                      className="w-4 h-4 mr-3 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                    <span>Thông tin cá nhân</span>
                  </button>
                  
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <svg 
                      className="w-4 h-4 mr-3 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                    <span>Cài đặt</span>
                  </button>
                </div>

                <div className="border-t border-gray-100">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <svg 
                      className="w-4 h-4 mr-3 text-red-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                      />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
      />
    </>
  );
};

export default Header;