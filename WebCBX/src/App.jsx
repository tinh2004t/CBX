import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LanguageProvider from './components/LanguageProvider';

import HomePage from './pages/HomePage';
import TourismPage from './pages/TourismPage';
import DomesticTourPage from './pages/DomensticTour/DomesticTourPage';
import TourDetailPage from './pages/TourDetailPage';
import NorthernToursPage from './pages/DomensticTour/NorthernToursPage';
import CentralToursPage from './pages/DomensticTour/CentralToursPage';
import SouthernToursPage from './pages/DomensticTour/SouthernToursPage';

import OverseasTourPage from './pages/OverseaTour/OverseasTourPage';
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
import MiceToursDetailPage from './pages/ComboVoucher/MiceToursDetailPage';

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

              {/*DomesticTourPage */}
              <Route path="/DomesticTourPage" element={<DomesticTourPage />} />
              <Route path="/DomesticTourPage/NorthernToursPage" element={<NorthernToursPage />} />
              <Route path="/DomesticTourPage/CentralToursPage" element={<CentralToursPage />} />
              <Route path="/DomesticTourPage/SouthernToursPage" element={<SouthernToursPage />} />

              {/* OverseasTourPage */}
              <Route path="/OverseasTourPage" element={<OverseasTourPage />} />
              <Route path="/OverseasTourPage/AsiaToursPage" element={<AsiaToursPage />} />
              <Route path="/OverseasTourPage/AmericaToursPage" element={<AmericaToursPage />} />
              <Route path="/OverseasTourPage/AfricaToursPage" element={<AfricaToursPage />} />
              <Route path="/OverseasTourPage/EuropeToursPage" element={<EuropeToursPage />} />

              {/* Combo & Voucher */}
              <Route path="/FlightTickets" element={<FlightTicketsPage />} />
              <Route path="/HotelResorts" element={<HotelResort />} />
              <Route path="/HotelResortDetail" element={<HotelResortDetailPage />} />
              <Route path="/HomestayVilla" element={<HomestayVillaPage />} />
              <Route path="/Teambuilding" element={<TeamBuildingBooking />} />
              <Route path="/MICE" element={<MiceToursPage />} />
              <Route path="/MiceDetail" element={<MiceToursDetailPage />} />
              <Route path="/Transport" element={<TransportBooking />} />

              {/* Tralvel Blog */}
              <Route path="/TravelBlog" element={<TravelBlogPage />} />
              <Route path="/TravelBlogData" element={<TravelBlogPageData />} />

              {/* TourDetailPage */}
              <Route path="/TourDetailPage" element={<TourDetailPage />} />

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