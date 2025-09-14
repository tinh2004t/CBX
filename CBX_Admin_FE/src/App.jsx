import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Sidebar from './components/Home/Sidebar';
import Header from './components/Home/Header';
import Dashboard from './pages/Dashboard';
import AdminManager from './pages/AdminManager';
import TourismManager from './pages/TourismManager';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    const finalUser = userData || { username: 'admin', role: 'SuperAdmin' };
    setIsLoggedIn(true);
    setUser(finalUser);
    localStorage.setItem("user", JSON.stringify(finalUser));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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
            <div className="main-container">
              <Sidebar 
                user={user} 
                isOpen={sidebarOpen}
                onClose={closeSidebar}
              />
              <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar}></div>
              <main className="content-area">
                <Routes>
                  <Route path="/" element={<Dashboard user={user} />} />
                  <Route path="/dashboard" element={<Dashboard user={user} />} />
                  <Route path="/quan-ly-admin" element={<AdminManager currentUser={user} />} />
                  <Route path="/kham-pha" element={<TourismManager currentUser={user} />} />

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