import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LanguageProvider from './components/LanguageProvider';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import TourismPage from './pages/TourismPage';
import TourDetailPage from './pages/TourDetailPage';
import NorthernToursPage from './pages/DomensticTour/NorthernToursPage';
import CentralToursPage from './pages/DomensticTour/CentralToursPage';
import SouthernToursPage from './pages/DomensticTour/SouthernToursPage';

import AsiaToursPage from './pages/OverseaTour/AsiaToursPage';
import AmericaToursPage from './pages/OverseaTour/AmericaToursPage';
import AfricaToursPage from './pages/OverseaTour/AfricaToursPage';
import EuropeToursPage from './pages/OverseaTour/EuropeToursPage';

import FlightTicketsPage from './pages/ComboVoucher/FlightTicketsPage';
import HotelResort from './pages/ComboVoucher/HotelResortsPage';
import HotelResortDetailPage from './pages/ComboVoucher/HotelResortDetailPage';
import HomestayVillaPage from './pages/ComboVoucher/HomstayVillaPage';
import TeamBuildingBooking from './pages/ComboVoucher/TeambuildingGaladinner';
import TransportBooking from './pages/ComboVoucher/TransportBookingPage';
import MiceToursPage from './pages/ComboVoucher/MiceToursPage';

import TravelBlogPage from './pages/Blog/TravelBlog';
import TravelBlogPageData from './pages/Blog/TravelBlogPageData';


function NotFound() {
  return (
    <div className="not-found-container" style={{ 
      textAlign: "center", 
      padding: "50px",
      width: "100%",
      maxWidth: "100%"
    }}>
      <h1>404</h1>
      <p>Trang bạn tìm không tồn tại.</p>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App" style={{ 
          width: "100%", 
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100vw",
          overflowX: "hidden"
        }}>
          <Header />

          <main style={{ 
            flex: 1, 
            width: "100%",
            maxWidth: "100%"
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/TourismPage" element={<TourismPage />} />

              <Route path="search" element={<SearchPage />} />

              {/*DomesticTourPage */}
              <Route path="/tour-noi-dia/mien-bac" element={<NorthernToursPage />} />
              <Route path="/tour-noi-dia/mien-trung" element={<CentralToursPage />} />
              <Route path="/tour-noi-dia/mien-nam" element={<SouthernToursPage />} />

              {/* OverseasTourPage */}
              <Route path="//tour-quoc-te/chau-a" element={<AsiaToursPage />} />
              <Route path="//tour-quoc-te/chau-my" element={<AmericaToursPage />} />
              <Route path="//tour-quoc-te/chau-phi" element={<AfricaToursPage />} />
              <Route path="//tour-quoc-te/chau-au" element={<EuropeToursPage />} />

              {/* Combo & Voucher */}
              <Route path="/ve-may-bay" element={<FlightTicketsPage />} />

              <Route path="/hotel-resorts" element={<HotelResort />} />
              <Route path="/hotel-resorts/:slug" element={<HotelResortDetailPage />} />

              <Route path="/homestay-villa" element={<HomestayVillaPage />} />
              <Route path="/homestay-villa/:slug" element={<HomestayVillaPage />} />

              <Route path="/team-building" element={<TeamBuildingBooking />} />

              <Route path="/mice" element={<MiceToursPage />} />

              <Route path="/dich-vu-van-tai" element={<TransportBooking />} />

              {/* Tralvel Blog */}
              <Route path="/blog" element={<TravelBlogPage />} />
              <Route path="/blog/:slug" element={<TravelBlogPageData />} />

              {/* TourDetailPage */}
              <Route path="/tours/:slug" element={<TourDetailPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;