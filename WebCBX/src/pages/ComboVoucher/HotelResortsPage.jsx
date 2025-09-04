import React, { useState } from 'react';
import { MapPin } from 'react-feather'; // icon MapPin
import HotelCard from '../../components/HotelCard/HotelCard';

const cityTabs = ['Hà Nội', 'Đà Nẵng', 'TP. Hồ Chí Minh'];

const hotelsData = {
  'Hà Nội': [
    {
      id: 1,
      location: 'Hà Nội',
      image: 'https://ik.imagekit.io/tvlk/apr-asset/Ixf4aptF5N2Qdfmh4fGGYhTN274kJXuNMkUAzpL5HuD9jzSxIGG5kZNhhHY-p7nw/hotel/asset/20050636-b02da2d82245b290beb4e8284828bee4.jpeg?_src=imagekit&tr=dpr-2,c-at_max,f-jpg,fo-auto,h-332,pr-true,q-80,w-480',
      name: 'Khách sạn Hà Nội 1',
      rating: 4.5,
      reviewCount: 120,
      stars: 4,
      price: '1,200,000 VND',
    },
    {
      id: 2,
      location: 'Hà Nội',
      image: 'https://ik.imagekit.io/tvlk/apr-asset/Ixf4aptF5N2Qdfmh4fGGYhTN274kJXuNMkUAzpL5HuD9jzSxIGG5kZNhhHY-p7nw/hotel/asset/20050636-b02da2d82245b290beb4e8284828bee4.jpeg?_src=imagekit&tr=dpr-2,c-at_max,f-jpg,fo-auto,h-332,pr-true,q-80,w-480',
      name: 'Khách sạn Hà Nội 2',
      rating: 4.0,
      reviewCount: 80,
      stars: 3,
      price: '900,000 VND',
    },
  ],
  'Đà Nẵng': [
    {
      id: 3,
      location: 'Đà Nẵng',
      image: 'https://ik.imagekit.io/tvlk/apr-asset/Ixf4aptF5N2Qdfmh4fGGYhTN274kJXuNMkUAzpL5HuD9jzSxIGG5kZNhhHY-p7nw/hotel/asset/20050636-b02da2d82245b290beb4e8284828bee4.jpeg?_src=imagekit&tr=dpr-2,c-at_max,f-jpg,fo-auto,h-332,pr-true,q-80,w-480',
      name: 'Khách sạn Đà Nẵng 1',
      rating: 4.8,
      reviewCount: 200,
      stars: 5,
      price: '2,000,000 VND',
    },
  ],
  'TP. Hồ Chí Minh': [
    {
      id: 4,
      location: 'TP. Hồ Chí Minh',
      image: 'https://ik.imagekit.io/tvlk/apr-asset/Ixf4aptF5N2Qdfmh4fGGYhTN274kJXuNMkUAzpL5HuD9jzSxIGG5kZNhhHY-p7nw/hotel/asset/20050636-b02da2d82245b290beb4e8284828bee4.jpeg?_src=imagekit&tr=dpr-2,c-at_max,f-jpg,fo-auto,h-332,pr-true,q-80,w-480',
      name: 'Khách sạn HCM 1',
      rating: 4.3,
      reviewCount: 150,
      stars: 4,
      price: '1,500,000 VND',
    },
  ],
};

const HotelResortsPage = () => {
  const [activeTab, setActiveTab] = useState(cityTabs[0]);

  return (
    <div className="hotel-resort container mt-5 mb-5">
      {/* City Tabs Navigation */}
      <nav className="tabs-section" aria-label="City selection tabs">
        <ul className="tabs-container">
          {cityTabs.map((city) => (
            <li key={city}>
              <button
                onClick={() => setActiveTab(city)}
                className={`tab-button ${activeTab === city ? 'tab-button--active' : ''}`}
                aria-selected={activeTab === city}
                role="tab"
              >
                <MapPin className="tab-icon" aria-hidden="true" />
                <span className="tab-label">{city}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hotel Cards */}
      <section className="hotel-cards-container" role="tabpanel">
        {hotelsData[activeTab].map((hotel) => (
          <HotelCard
            key={hotel.id}
            location={hotel.location}
            image={hotel.image}
            name={hotel.name}
            rating={hotel.rating}
            reviewCount={hotel.reviewCount}
            stars={hotel.stars}
            price={hotel.price}
            href={`/HotelResortDetail`}
          />
        ))}
      </section>
    </div>

  );
};

export default HotelResortsPage;
