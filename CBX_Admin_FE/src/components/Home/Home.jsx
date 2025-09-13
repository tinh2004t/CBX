import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import './Home.css';

const Home = ({ onLogout }) => {
  return (
    <div className="home-container">
      <Header onLogout={onLogout} />
      <div className="home-content">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default Home;