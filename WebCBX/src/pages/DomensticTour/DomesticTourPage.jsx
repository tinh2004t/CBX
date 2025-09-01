import React from 'react';
import TourCard from '../../components/TourSection/TourCard'; // Import TourCard component của bạn
import { useLanguage } from '../../hooks/useLanguage';

// Mock useLanguage hook for demo

const DomesticTourPage = () => {
  const { t } = useLanguage();

  // Sample data for Miền Bắc tours
  const northernTours = [
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
    },
    {
      id: 4,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Mai Châu - Pù Luông",
      departure: "Hà Nội",
      price: "2.500.000 đ",
      duration: "Chương trình 2 ngày 1 đêm",
      airline: "Xe du lịch",
      scheduleInfo: "Hàng ngày",
      href: "/TourDetailPage"

    },
    {
      id: 5,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Cao Bằng - Bắc Kạn",
      departure: "Hà Nội",
      price: "3.800.000 đ",
      duration: "Chương trình 3 ngày 2 đêm",
      airline: "Xe du lịch",
      scheduleInfo: "Thứ 6 hàng tuần",
      href: "/TourDetailPage"

    }
  ];

  // Sample data for Miền Trung tours
  const centralTours = [
    {
      id: 6,
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
      id: 7,
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
      id: 8,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Đà Lạt - Nha Trang",
      departure: "TP.HCM",
      price: "4.200.000 đ",
      duration: "Chương trình 4 ngày 3 đêm",
      airline: "VietJet Air",
      scheduleInfo: "Thứ 6, Chủ nhật"
    },
    {
      id: 9,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Quy Nhon - Phú Yên",
      departure: "Quy Nhon",
      price: "3.500.000 đ",
      duration: "Chương trình 3 ngày 2 đêm",
      airline: "Bamboo Airways",
      scheduleInfo: "Hàng tuần",
      href: "/TourDetailPage"

    }
  ];

  // Sample data for Miền Nam tours
  const southernTours = [
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

    },
    {
      id: 13,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Vũng Tàu - Hồ Tràm",
      departure: "TP.HCM",
      price: "1.800.000 đ",
      duration: "Chương trình 2 ngày 1 đêm",
      airline: "Xe du lịch",
      scheduleInfo: "Cuối tuần",
      href: "/TourDetailPage",

    }
  ];

  return (
    <section className="ss-about margin-top-50">
      <div className="introduction wow fadeInUp">
        <div className="container">
          {/* MIỀN BẮC */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('mien_bac') || 'MIỀN BẮC'}
              </h2>
              <a href="/DomesticTourPage/NorthernToursPage" className="view-more">
                {t('more') || 'Xem thêm'} &gt;&gt;
              </a>
            </div>
            <div className="card-container">
              {northernTours.map(tour => (
                <TourCard 
                  key={tour.id} 
                  tour={tour} 
                  type="bestselling"
                  href={tour.href}
                />
              ))}
            </div>
          </section>

          {/* MIỀN TRUNG */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('mien_trung') || 'MIỀN TRUNG'}
              </h2>
              <a href="/DomesticTourPage/CentralToursPage" className="view-more">
                {t('more') || 'Xem thêm'} &gt;&gt;
              </a>
            </div>
            <div className="card-container">
              {centralTours.map(tour => (
                <TourCard 
                  key={tour.id} 
                  tour={tour} 
                  type="bestselling"
                />
              ))}
            </div>
          </section>

          {/* MIỀN NAM */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('mien_nam') || 'MIỀN NAM'}
              </h2>
              <a href="/DomesticTourPage/SouthernToursPage" className="view-more">
                {t('more') || 'Xem thêm'} &gt;&gt;
              </a>
            </div>
            <div className="card-container">
              {southernTours.map(tour => (
                <TourCard 
                  key={tour.id} 
                  tour={tour} 
                  type="bestselling"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default DomesticTourPage;