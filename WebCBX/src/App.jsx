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

import ComboVouchersPage from './pages/ComboVoucher/ComboVouchersPage';

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404</h1>
      <p>Trang bạn tìm không tồn tại.</p>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/TourismPage" element={<TourismPage />} />

              {/*DomesticTourPage  */}
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
              <Route path="/ComboVouchersPage" element={<ComboVouchersPage />} />
              

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
