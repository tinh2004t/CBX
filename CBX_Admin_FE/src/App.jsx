import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'quill/dist/quill.snow.css';
import socketAPI from "./api/socket";
import Login from './components/Login/Login';
import Sidebar from './components/Home/Sidebar';
import Header from './components/Home/Header';
import Dashboard from './pages/Dashboard';
import AdminManagement from './pages/AdminManagement';
import TourismManagement from './pages/TourismManagement';

import BlogManagement from './pages/Blog/Blogmanagement';
import BlogEditor from './pages/Blog/BlogEditor';

import DomesticTourManagement from './pages/DomesticTour/DomesticTourManagement';
// import DomesticEditTour from './pages/DomesticTourEdit';
import DomesticTourDeleted from './pages/DomesticTour/DomesticTourDeleted';

import OverseaTourManagement from './pages/OverseaTour/OverseaTourManagement';
// import OverseaEditTour from './pages/OverseaTour/OverseaTourEdit';
import OverseaTourDeleted from './pages/OverseaTour/OverseaTourDeleted';

import EditTour from './pages/TourEdit';

import FlightManagement from './pages/Flight/FlightManagement';
import FlightDeleted from './pages/Flight/FlightDeleted';

import HotelResortManagement from './pages/Accommodation/HotelResortManagement';
import EditAccommodation from './pages/Accommodation/EditAccommodation';
import HomestayVillaManagement from './pages/Accommodation/HomestayVillaManagement';
import AccommodationDeleted from './pages/Accommodation/AccommodationDeleted';

import TeambuildingManagement from './pages/TeambuildingManagement';

import MiceTourManagement from './pages/MiceTour/MiceTourManagement';
import MiceTourDeleted from './pages/MiceTour/MiceTourDeleted';

import TransportManagement from './pages/Transport/TransportManagement';
import TransportDeleted from './pages/Transport/TransportDeleted';

import TravelSettingsPage from './pages/SettingPage';
import authAPI from './api/auth';
import BlogDeleted from './pages/Blog/BlogDeleted';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Theo dõi kích thước màn hình và cập nhật trạng thái sidebar
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1280) { // xl: desktop
        setSidebarOpen(false);
        setSidebarCollapsed(false); // Sidebar expanded trên desktop lớn
      } else if (width >= 1024) { // lg: laptop  
        setSidebarOpen(false);
        setSidebarCollapsed(false); // Sidebar expanded trên laptop
      } else if (width >= 768) { // md: tablet
        setSidebarOpen(false);
        setSidebarCollapsed(true); // Sidebar collapsed trên tablet
      } else { // sm: mobile
        setSidebarCollapsed(false); // Mobile: sidebar overlay
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check authentication status on app start
  useEffect(() => {
    const checkAuth = () => {
      const token = authAPI.getToken();
      const savedUser = authAPI.getUserFromStorage();

      if (token && savedUser) {
        try {
          const decoded = jwtDecode(token); // giải mã JWT
          const now = Date.now() / 1000; // tính theo giây

          if (decoded.exp && decoded.exp < now) {
            console.warn("⚠️ Token đã hết hạn");
            handleLogout();
            return;
          }

          setUser(savedUser);
          setIsLoggedIn(true);

          // kết nối socket
          // ✅ Khởi tạo socket connection toàn cục
          socketAPI.connect(token);

          // Lắng nghe các events toàn cục
          socketAPI.on("connect", () => {
            console.log("✅ Socket connected globally");
          });

          socketAPI.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
          });

          socketAPI.on("force_disconnect", (data) => {
            alert(`Bạn đã bị ngắt kết nối: ${data.reason}`);
            handleLogout();
          });

        } catch (err) {
          console.error("Token không hợp lệ:", err);
          handleLogout();
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }

      setAuthLoading(false);
    };

    checkAuth();
  }, []);



  const handleLogin = async (loginResponse) => {
    try {
      if (loginResponse && loginResponse.user) {
        setUser(loginResponse.user);
        setIsLoggedIn(true);

        const token = authAPI.getToken();
        if (token) {
          socketAPI.connect(token);
        }
      } else {
        const fallbackUser = { username: 'admin', role: 'SuperAdmin' };
        setUser(fallbackUser);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(fallbackUser));

        const token = authAPI.getToken();
        if (token) {
          socketAPI.connect(token);
        }
      }
    } catch (error) {
      console.error('Login handler error:', error);
    }
  };


  const handleLogout = async () => {
    try {
      if (authAPI.isAuthenticated()) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      socketAPI.disconnect(); // ✅ disconnect socket khi logout
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("user");
    }
  };


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Xử lý khi sidebar collapse state thay đổi
  const handleSidebarCollapsedChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Tính toán class cho main-container
  const getMainContainerClass = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;

    // Mobile: không thêm class, sidebar sẽ overlay
    if (width < 768) {
      return "main-container";
    }

    // Desktop/Tablet: thêm class dựa trên trạng thái collapsed
    if (sidebarCollapsed) {
      return "main-container sidebar-collapsed";
    } else {
      return "main-container sidebar-expanded";
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="App">
        <div className="auth-loading">
          <div className="loading-spinner"></div>
          <p>Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {isLoggedIn ? (
        <Router>
          <div className="app-layout">
            <Header
              user={user}
              onLogout={handleLogout}
              onToggleSidebar={toggleSidebar}
            />
            <div className={getMainContainerClass()}>
              <Sidebar
                user={user}
                isOpen={sidebarOpen}
                onClose={closeSidebar}
                onCollapsedChange={handleSidebarCollapsedChange}
              />
              <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar}></div>
              <main className="content-area">
                <Routes>
                  <Route path="/" element={<Dashboard user={user} />} />

                  <Route path="/dashboard" element={<Dashboard user={user} />} />

                  <Route path="/quan-ly-admin" element={<AdminManagement currentUser={user} />} />

                  <Route path="/kham-pha" element={<TourismManagement currentUser={user} />} />

                  {/* Updated blog routes with proper props */}
                  <Route path="/blog" element={<BlogManagement currentUser={user} />} />
                  <Route path="/blog/editor" element={<BlogEditor currentUser={user} />} />
                  <Route path="/blog/deleted" element={<BlogDeleted currentUser={user} />} />


                  <Route path="/tour-noi-dia" element={<DomesticTourManagement currentUser={user} />} />
                  <Route path="/tour-noi-dia/editor" element={<EditTour currentUser={user} />} />
                  <Route path="/tour-noi-dia/editor/:slug" element={<EditTour currentUser={user} />} />
                  <Route path="/tour-noi-dia/deleted" element={<DomesticTourDeleted currentUser={user} />} />


                  <Route path="/tour-quoc-te" element={<OverseaTourManagement currentUser={user} />} />
                  <Route path="/tour-quoc-te/editor" element={<EditTour currentUser={user} />} />
                  <Route path="/tour-quoc-te/editor/:slug" element={<EditTour currentUser={user} />} />
                  <Route path="/tour-quoc-te/deleted" element={<OverseaTourDeleted currentUser={user} />} />



                  <Route path="/ve-may-bay" element={<FlightManagement currentUser={user} />} />
                  <Route path="/ve-may-bay/deleted" element={<FlightDeleted currentUser={user} />} />

                  <Route path="/hotel-resort" element={<HotelResortManagement currentUser={user} />} />
                  <Route path="/hotel-resort/edit/:slug" element={<EditAccommodation currentUser={user} />} />
                  <Route path="/hotel-resort/add" element={<EditAccommodation currentUser={user} />} />
                  <Route path="/hotel-resort/deleted" element={<AccommodationDeleted currentUser={user} />} />

                  <Route path="/homestay-villa" element={<HomestayVillaManagement currentUser={user} />} />
                  <Route path="/homestay-villa/edit/:slug" element={<EditAccommodation currentUser={user} />} />
                  <Route path="/homestay-villa/add" element={<EditAccommodation currentUser={user} />} />
                  <Route path="/homestay-villa/deleted" element={<AccommodationDeleted currentUser={user} />} />

                  <Route path="/teambuilding" element={<TeambuildingManagement currentUser={user} />} />

                  <Route path="/mice" element={<MiceTourManagement currentUser={user} />} />
                  <Route path="/mice/editor" element={<EditTour currentUser={user} />} />
                  <Route path="/mice/editor/:slug" element={<EditTour currentUser={user} />} />
                  <Route path="/mice/deleted" element={<MiceTourDeleted currentUser={user} />} />

                  <Route path="/dich-vu-van-tai" element={<TransportManagement currentUser={user} />} />
                  <Route path="/dich-vu-van-tai/deleted" element={<TransportDeleted currentUser={user} />} />

                  <Route path="/settings" element={<TravelSettingsPage currentUser={user} />} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;