import React from 'react';
import Header from './components/Header/Header';
import Banner from './components/Banner/Banner';
import InteractiveMap from './components/Maps/InteractiveMap';
import TourSection from './components/TourSection/TourSection';
import VideoSection from './components/VideoSection/VideoSection';
import NewsSection from './components/NewsSection/NewsSection';
import Footer from './components/Footer/Footer';
import LanguageProvider from './components/LanguageProvider';
import './styles/header.css';
import './styles/style.css';
import './styles/navbar.css';
import './styles/animate.css';
import './styles/footer.css';
import './styles/responsive.css';
import './styles/latolatinfonts.css';
import './styles/maps.css';


function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <Header />
        <Banner />
        <main>
          <InteractiveMap />
          <TourSection />
          <VideoSection />
          <NewsSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;