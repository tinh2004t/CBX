import React, { useState } from "react";

const Header = ({ onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between bg-white shadow px-4 py-2">
      {/* Logo */}
      <div className="flex items-center">
        <h2 className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
          CBX Admin
        </h2>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Notification */}
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-600"
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
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            className="flex items-center space-x-2"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {/* Avatar */}
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />

            {/* Info (ẩn bớt trên mobile, hiện trên md) */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-medium">Nguyễn Văn A</span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>

            {/* Arrow */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-600"
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

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
              <a
                href="#"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span>Thông tin cá nhân</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span>Cài đặt</span>
              </a>
              <div className="border-t my-1"></div>
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
