import React, { useState, useEffect } from 'react';
import { MapPin, Home } from 'react-feather';
import accommodationAPI from '../../api/accommodationApi';
import HotelCard from '../../components/HotelCard/HotelCard';

const HotelResortsPage = () => {
  const [allAccommodations, setAllAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [activeType, setActiveType] = useState('all'); // 'all', 'hotel', 'resort'
  const [activeLocation, setActiveLocation] = useState('all'); // 'all', 'Hà Nội', 'Đà Nẵng', etc.
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch hotels và resorts khi component mount
  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Gọi API lấy hotels
        const hotelResponse = await accommodationAPI.getAccommodationsByType('Hotel');
        
        // Gọi API lấy resorts
        const resortResponse = await accommodationAPI.getAccommodationsByType('Resort');
        
        const hotels = hotelResponse.success ? (hotelResponse.data || []) : [];
        const resorts = resortResponse.success ? (resortResponse.data || []) : [];
        
        // Gộp cả 2 mảng
        const combined = [...hotels, ...resorts];
        setAllAccommodations(combined);
        setFilteredAccommodations(combined);
        
        // Lấy danh sách địa điểm unique
        const uniqueLocations = [...new Set(combined.map(item => item.location).filter(Boolean))];
        setLocations(uniqueLocations);
        
      } catch (err) {
        console.error('Error fetching accommodations:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  // Áp dụng bộ lọc khi activeType hoặc activeLocation thay đổi
  useEffect(() => {
    let filtered = [...allAccommodations];

    // Lọc theo loại hình
    if (activeType !== 'all') {
      filtered = filtered.filter(item => 
        item.type?.toLowerCase() === activeType.toLowerCase()
      );
    }

    // Lọc theo địa điểm
    if (activeLocation !== 'all') {
      filtered = filtered.filter(item => 
        item.location === activeLocation
      );
    }

    setFilteredAccommodations(filtered);
  }, [activeType, activeLocation, allAccommodations]);

  // Đếm số lượng theo loại
  const hotelCount = allAccommodations.filter(item => 
    item.type?.toLowerCase() === 'hotel'
  ).length;
  const resortCount = allAccommodations.filter(item => 
    item.type?.toLowerCase() === 'resort'
  ).length;

  // Đếm số lượng theo địa điểm (đã áp dụng lọc type)
  const getLocationCount = (location) => {
    let items = allAccommodations;
    if (activeType !== 'all') {
      items = items.filter(item => item.type?.toLowerCase() === activeType.toLowerCase());
    }
    if (location === 'all') return items.length;
    return items.filter(item => item.location === location).length;
  };

  return (
    <div className="hotel-resort container mt-5 mb-5">
      {/* Type Filter */}
      <nav className="tabs-section mb-3" aria-label="Accommodation type selection">
        <ul className="tabs-container">
          <li>
            <button
              onClick={() => setActiveType('all')}
              className={`tab-button ${activeType === 'all' ? 'tab-button--active' : ''}`}
              aria-selected={activeType === 'all'}
              role="tab"
            >
              <Home className="tab-icon" aria-hidden="true" />
              <span className="tab-label">Tất cả ({allAccommodations.length})</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveType('hotel')}
              className={`tab-button ${activeType === 'hotel' ? 'tab-button--active' : ''}`}
              aria-selected={activeType === 'hotel'}
              role="tab"
            >
              <Home className="tab-icon" aria-hidden="true" />
              <span className="tab-label">Khách sạn ({hotelCount})</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveType('resort')}
              className={`tab-button ${activeType === 'resort' ? 'tab-button--active' : ''}`}
              aria-selected={activeType === 'resort'}
              role="tab"
            >
              <Home className="tab-icon" aria-hidden="true" />
              <span className="tab-label">Resort ({resortCount})</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Location Filter */}
      {locations.length > 0 && (
        <nav className="tabs-section mb-4" aria-label="Location selection">
          <ul className="tabs-container">
            <li>
              <button
                onClick={() => setActiveLocation('all')}
                className={`tab-button ${activeLocation === 'all' ? 'tab-button--active' : ''}`}
                aria-selected={activeLocation === 'all'}
                role="tab"
              >
                <MapPin className="tab-icon" aria-hidden="true" />
                <span className="tab-label">Tất cả địa điểm ({getLocationCount('all')})</span>
              </button>
            </li>
            {locations.map((location) => (
              <li key={location}>
                <button
                  onClick={() => setActiveLocation(location)}
                  className={`tab-button ${activeLocation === location ? 'tab-button--active' : ''}`}
                  aria-selected={activeLocation === location}
                  role="tab"
                >
                  <MapPin className="tab-icon" aria-hidden="true" />
                  <span className="tab-label">{location} ({getLocationCount(location)})</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Accommodation Cards */}
      {!loading && !error && (
        <section className="hotel-cards-container" role="tabpanel">
          {filteredAccommodations.length > 0 ? (
            filteredAccommodations.map((item) => (
              <HotelCard
                key={item._id}
                location={item.location || 'Việt Nam'}
                image={item.images?.[0] || 'https://via.placeholder.com/480x332'}
                name={item.name}
                rating={item.rating || 0}
                reviewCount={item.reviewCount || 0}
                stars={item.stars || 0}
                price={item.pricePerNight ? `${item.pricePerNight.toLocaleString('vi-VN')} VND` : 'Liên hệ'}
                href={`/hotel-resorts/${item.slug}`}
              />
            ))
          ) : (
            <div className="text-center py-5 w-100">
              <p className="text-muted">
                Không tìm thấy {activeType === 'hotel' ? 'khách sạn' : activeType === 'resort' ? 'resort' : 'chỗ nghỉ'} nào
                {activeLocation !== 'all' && ` tại ${activeLocation}`}.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default HotelResortsPage;