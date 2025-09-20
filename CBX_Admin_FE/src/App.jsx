import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'quill/dist/quill.snow.css';
import Login from './components/Login/Login';
import Sidebar from './components/Home/Sidebar';
import Header from './components/Home/Header';
import Dashboard from './pages/Dashboard';
import AdminManagement from './pages/AdminManagement';
import TourismManagement from './pages/TourismManagement';
import BlogManagement from './pages/Blog/Blogmanagement';
import BlogEditor from './pages/Blog/BlogEditor';
import DomesticTourManagement from './pages/DomesticTourManagement';
import OverseaTourManagement from './pages/OverseaTourManagement';
import EditTour from './pages/TourEdit';
import FlightManagement from './pages/FlightManagement';
import HotelResortManagement from './pages/HotelResortManagement';
import EditAccommodation from './pages/EditAccommodation';
import HomestayVillaManagement from './pages/HomestayVillaManagement';
import TeambuildingManagement from './pages/TeambuildingManagement';
import MiceTourManagement from './pages/MiceTourManagement';
import TransportManagement from './pages/TransportManagement';
import TravelSettingsPage from './pages/SettingPage';
import authAPI from './api/auth';

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
      setUser(savedUser);
      setIsLoggedIn(true);
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
      // If loginResponse is provided (from API), use it
      if (loginResponse && loginResponse.user) {
        setUser(loginResponse.user);
        setIsLoggedIn(true);
      } else {
        // Fallback for development/testing
        const fallbackUser = { username: 'admin', role: 'SuperAdmin' };
        setUser(fallbackUser);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(fallbackUser));
      }
    } catch (error) {
      console.error('Login handler error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Call API logout if user is authenticated via API
      if (authAPI.isAuthenticated()) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clean up local state
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

                  <Route path="/tour-noi-dia" element={<DomesticTourManagement currentUser={user} />} />
                  <Route path="/tour-noi-dia/editor" element={<EditTour currentUser={user} />} />

                  <Route path="/tour-quoc-te" element={<OverseaTourManagement currentUser={user} />} />
                  <Route path="/tour-quoc-te/editor" element={<EditTour currentUser={user} />} />

                  <Route path="/ve-may-bay" element={<FlightManagement currentUser={user} />} />

                  <Route path="/khach-san-resort" element={<HotelResortManagement currentUser={user} />} />
                  <Route path="/khach-san-resort/editor" element={<EditAccommodation currentUser={user} />} />

                  <Route path="/homestay-villa" element={<HomestayVillaManagement currentUser={user} />} />
                  <Route path="/homestay-villa/editor" element={<EditAccommodation currentUser={user} />} />

                  <Route path="/teambuilding" element={<TeambuildingManagement currentUser={user} />} />

                  <Route path="/mice" element={<MiceTourManagement currentUser={user} />} />
                  <Route path="/mice/editor" element={<EditTour currentUser={user} />} />

                  <Route path="/dich-vu-van-tai" element={<TransportManagement currentUser={user} />} />

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