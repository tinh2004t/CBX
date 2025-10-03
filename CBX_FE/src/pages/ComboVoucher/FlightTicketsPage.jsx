import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Loader2 } from 'lucide-react';
import FlightCard from '../../components/FlightCard/FlightCard';
import FlightDetails from '../../components/FlightCard/FlightDetails';
import flightAPI from '../../api/flightApi';
import '../../styles/FlightTicketsPage.css';

const FlightTicketsPage = () => {
  const [activeTab, setActiveTab] = useState('Hà Nội');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cityTabs = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Nha Trang', 'Phú Quốc', 'Đà Lạt'];

  // Fetch flights khi component mount hoặc activeTab thay đổi
  useEffect(() => {
    fetchFlights();
  }, [activeTab]);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API với filter theo departure city
      const response = await flightAPI.getFlights({
        departure: activeTab,
        // Chỉ lấy các chuyến bay chưa bị xóa
        isDeleted: false
      });

      // response.data sẽ chứa array các chuyến bay
      setFlights(response.data || []);
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError('Không thể tải dữ liệu chuyến bay. Vui lòng thử lại.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Loading State */}
        {loading && (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Loader2 className="empty-plane-icon animate-spin" />
            </div>
            <h3 className="empty-state__title">Đang tải...</h3>
            <p className="empty-state__description">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Plane className="empty-plane-icon" />
            </div>
            <h3 className="empty-state__title">Có lỗi xảy ra</h3>
            <p className="empty-state__description">{error}</p>
            <button 
              onClick={fetchFlights}
              className="retry-button"
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Flights Grid */}
        {!loading && !error && flights.length > 0 && (
          <div className="flights-grid">
            {flights.map((flight) => (
              <FlightCard
                key={flight._id}
                flight={flight}
                onClick={handleFlightClick}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && flights.length === 0 && (
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