import React from 'react';
import TourCard from '../../components/TourSection/TourCard'; // Import TourCard component của bạn
import { useLanguage } from '../../hooks/useLanguage';
import '../../styles/TourSections.css';

// Mock useLanguage hook for demo

const OverseasTourPage = () => {
  const { t } = useLanguage();

  // Sample data for Miền Bắc tours
  const asiaTours = [
    {
      id: 1,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Hà Nội - Hạ Long - Sapa",
      departure: "Khởi hành từ Hà Nội",
      price: "4.500.000 đ",
      duration: "Chương trình 4 ngày 3 đêm",
      airline: "Vietnam Airlines",
      scheduleInfo: "Khởi hành hàng ngày",
      href: "/TourDetailPage"
    },
    {
      id: 2,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Ninh Bình - Tràng An - Tam Cốc",
      departure: "Hà Nội",
      price: "2.800.000 đ",
      duration: "Chương trình 2 ngày 1 đêm",
      airline: "Xe du lịch",
      scheduleInfo: "Thứ 7, Chủ nhật",
      href: "/TourDetailPage"

    },
    {
      id: 3,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Hà Giang - Đồng Văn - Mèo Vạc",
      departure: "Hà Nội",
      price: "3.200.000 đ",
      duration: "Chương trình 3 ngày 2 đêm",
      airline: "Xe du lịch",
      scheduleInfo: "Cuối tuần",
      href: "/TourDetailPage"
    }
  ];

  // Sample data for Miền Trung tours
  const europeTours = [
    {
      id: 4,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Huế - Hội An - Đà Nẵng",
      departure: "Đà Nẵng",
      price: "3.800.000 đ",
      duration: "Chương trình 4 ngày 3 đêm",
      airline: "Vietnam Airlines",
      scheduleInfo: "Khởi hành hàng ngày",
      href: "/TourDetailPage"

    },
    {
      id: 5,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Phong Nha - Kẻ Bàng",
      departure: "Đồng Hới",
      price: "2.200.000 đ",
      duration: "Chương trình 2 ngày 1 đêm",
      airline: "Xe du lịch",
      scheduleInfo: "Cuối tuần",
      href: "/TourDetailPage"

    },
    {
      id: 6,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Đà Lạt - Nha Trang",
      departure: "TP.HCM",
      price: "4.200.000 đ",
      duration: "Chương trình 4 ngày 3 đêm",
      airline: "VietJet Air",
      scheduleInfo: "Thứ 6, Chủ nhật"
    }
  ];

  // Sample data for Miền Nam tours
  const americaTours = [
    {
      id: 7,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour TP.HCM - Cần Thơ - Châu Đốc",
      departure: "TP.HCM",
      price: "3.000.000 đ",
      duration: "Chương trình 3 ngày 2 đêm",
      airline: "Xe du lịch",
      scheduleInfo: "Cuối tuần",
      href: "/TourDetailPage"

    },
    {
      id: 8,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Phú Quốc - Nam Du",
      departure: "TP.HCM",
      price: "5.200.000 đ",
      duration: "Chương trình 4 ngày 3 đêm",
      airline: "Vietnam Airlines",
      scheduleInfo: "Hàng ngày",
      href: "/TourDetailPage"

    },
    {
      id: 9,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Côn Đảo",
      departure: "TP.HCM",
      price: "4.800.000 đ",
      duration: "Chương trình 3 ngày 2 đêm",
      airline: "VASCO",
      scheduleInfo: "Thứ 2, 4, 6",
      href: "/TourDetailPage"

    }
  ];

  const africaTours = [
    {
      id: 10,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour TP.HCM - Cần Thơ - Châu Đốc",
      departure: "TP.HCM",
      price: "3.000.000 đ",
      duration: "Chương trình 3 ngày 2 đêm",
      airline: "Xe du lịch",
      scheduleInfo: "Cuối tuần",
      href: "/TourDetailPage"

    },
    {
      id: 11,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Phú Quốc - Nam Du",
      departure: "TP.HCM",
      price: "5.200.000 đ",
      duration: "Chương trình 4 ngày 3 đêm",
      airline: "Vietnam Airlines",
      scheduleInfo: "Hàng ngày",
      href: "/TourDetailPage"

    },
    {
      id: 12,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Côn Đảo",
      departure: "TP.HCM",
      price: "4.800.000 đ",
      duration: "Chương trình 3 ngày 2 đêm",
      airline: "VASCO",
      scheduleInfo: "Thứ 2, 4, 6",
      href: "/TourDetailPage"

    }
  ];

  return (
    <section className="ss-about margin-top-50">
      <div className="introduction wow fadeInUp">
        {/* Asia */}
        <section className="tour-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {t('chau_a') || 'CHÂU Á'}
              </h2>
              <a href="/OverseasTourPage/AsiaToursPage" className="view-more">
                {t('more') || 'Xem thêm'} &gt;&gt;
              </a>
            </div>
            <div className="card-container">
              {asiaTours.map(tour => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  type="bestselling"
                  href={tour.href}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CHÂU ÂU */}
        <section className="tour-section tour-section-alt">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {t('chau_au') || 'CHÂU ÂU'}
              </h2>
              <a href="/OverseasTourPage/EuropeToursPage" className="view-more">
                {t('more') || 'Xem thêm'} &gt;&gt;
              </a>
            </div>
            <div className="card-container">
              {europeTours.map(tour => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  type="bestselling"
                />
              ))}
            </div>
          </div>
        </section>

        {/* CHÂU MỸ */}
        <section className="tour-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {t('chau_mi') || 'CHÂU MỸ'}
              </h2>
              <a href="/OverseasTourPage/AmericaToursPage" className="view-more">
                {t('more') || 'Xem thêm'} &gt;&gt;
              </a>
            </div>
            <div className="card-container">
              {americaTours.map(tour => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  type="bestselling"
                />
              ))}
            </div>
          </div>
        </section>

        {/* CHÂU PHI */}
        <section className="tour-section tour-section-alt">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {t('chau_phi') || 'CHÂU PHI'}
              </h2>
              <a href="/OverseasTourPage/AfricaToursPage" className="view-more">
                {t('more') || 'Xem thêm'} &gt;&gt;
              </a>
            </div>
            <div className="card-container">
              {africaTours.map(tour => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  type="bestselling"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default OverseasTourPage;