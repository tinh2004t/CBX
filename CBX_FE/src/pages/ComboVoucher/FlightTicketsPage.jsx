import React, { useState } from 'react';
import { Plane, MapPin } from 'lucide-react';
import FlightCard from '../../components/FlightCard/FlightCard';
import FlightDetails from '../../components/FlightCard/FlightDetails';
import '../../styles/FlightTicketsPage.css';

const FlightTicketsPage = () => {
  const [activeTab, setActiveTab] = useState('Hà Nội');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const cityTabs = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Nha Trang', 'Phú Quốc', 'Đà Lạt'];

  const flightData = {
    'Hà Nội': [ 
      {
        id: 1,
        departure: 'Hà Nội',
        destination: 'HCM',
        airline: 'Vietnam Airlines',
        airlineLogo: 'https://tse1.mm.bing.net/th/id/OIP.mCWXPfBxEdoPr5KNOhoA-wHaFA?pid=Api&P=0&h=220',
        date: '2025-01-15',
        price: '12,500,000',
        flights: [
          { time: '06:00 - 12:30', duration: '3h 30m', flightCode: 'VN301', aircraft: 'Boeing 787', status: 'Còn chỗ' },
          { time: '14:30 - 21:00', duration: '3h 30m', flightCode: 'VN303', aircraft: 'Boeing 787', status: 'Còn chỗ' },
          { time: '22:15 - 04:45+1', duration: '3h 30m', flightCode: 'VN305', aircraft: 'Airbus A350', status: 'Sắp hết' }
        ]
      },
      {
        id: 2,
        departure: 'Hà Nội',
        destination: 'Đà Nẵng',
        airline: 'Bamboo Airways',
        airlineLogo: 'https://tse1.mm.bing.net/th/id/OIP.mCWXPfBxEdoPr5KNOhoA-wHaFA?pid=Api&P=0&h=220',
        date: '2025-01-20',
        price: '8,900,000',
        flights: [
          { time: '08:00 - 10:15', duration: '2h 15m', flightCode: 'TG564', aircraft: 'Boeing 777', status: 'Còn chỗ' },
          { time: '16:45 - 19:00', duration: '2h 15m', flightCode: 'TG566', aircraft: 'Boeing 777', status: 'Còn chỗ' }
        ]
      },
      {
        id: 3,
        departure: 'Hà Nội',
        destination: 'Huế',
        airline: 'Vietnam Airlines',
        airlineLogo: 'https://tse1.mm.bing.net/th/id/OIP.mCWXPfBxEdoPr5KNOhoA-wHaFA?pid=Api&P=0&h=220',
        date: '2025-01-25',
        price: '15,200,000',
        flights: [
          { time: '07:30 - 11:15', duration: '3h 45m', flightCode: 'SQ178', aircraft: 'Airbus A350', status: 'Còn chỗ' },
          { time: '19:20 - 23:05', duration: '3h 45m', flightCode: 'SQ172', aircraft: 'Boeing 777', status: 'Còn chỗ' }
        ]
      }
    ],
    'Hồ Chí Minh': [
      {
        id: 4,
        departure: 'Hồ Chí Minh',
        destination: 'Hà Nội',
        airline: 'Vietnam Air',
        airlineLogo: 'https://tse1.mm.bing.net/th/id/OIP.mCWXPfBxEdoPr5KNOhoA-wHaFA?pid=Api&P=0&h=220',
        date: '2025-01-18',
        price: '14,300,000',
        flights: [
          { time: '10:30 - 17:50', duration: '4h 20m', flightCode: 'KE688', aircraft: 'Boeing 787', status: 'Còn chỗ' },
          { time: '23:50 - 07:10+1', duration: '4h 20m', flightCode: 'KE682', aircraft: 'Airbus A330', status: 'Còn chỗ' }
        ]
      }
    ],
    'Đà Nẵng': [],
    'Nha Trang': [],
    'Phú Quốc': [],
    'Đà Lạt': []
  };

  const getCurrentFlights = () => flightData[activeTab] || [];

  const handleFlightClick = (flight) => {
    setSelectedFlight(flight);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedFlight(null);
  };

  if (showDetails && selectedFlight) {
    return (
      <div className="flight-booking-container">
        <FlightDetails flight={selectedFlight} onBack={handleBackToList} />
      </div>
    );
  }

  return (
    <div className="flight-booking-container">
      {/* City Tabs Navigation */}
      <div className="tabs-section">
        <div className="tabs-container">
          {cityTabs.map((city) => (
            <button
              key={city}
              onClick={() => setActiveTab(city)}
              className={`tab-button ${activeTab === city ? 'tab-button--active' : ''}`}
            >
              <MapPin className="tab-icon" />
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Flight Cards Grid */}
      <div className="flights-section">
        {getCurrentFlights().length > 0 ? (
          <div className="flights-grid">
            {getCurrentFlights().map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onClick={handleFlightClick}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Plane className="empty-plane-icon" />
            </div>
            <h3 className="empty-state__title">Chưa có chuyến bay</h3>
            <p className="empty-state__description">
              Hiện tại chưa có chuyến bay nào cho điểm đến này. Hãy thử chọn điểm đến khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightTicketsPage;