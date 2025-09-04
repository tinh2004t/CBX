import React from 'react';
import TourCard from '../../components/TourSection/TourCard'; // Import TourCard component của bạn
import { useLanguage } from '../../hooks/useLanguage';
import '../../styles/TourSections.css';


// Mock useLanguage hook for demo

const DomesticTourPage = () => {
  const { t } = useLanguage();

  // Sample data for Miền Bắc tours
  const northernTours = [

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

    },
    {
      id: 7,
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
        {/* MIỀN BẮC */}
        <section className="tour-section">
          <div className="container">
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
          </div>
        </section>

        {/* MIỀN TRUNG */}
        <section className="tour-section tour-section-alt">
          <div className="container">
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
          </div>
        </section>

        {/* MIỀN NAM */}
        <section className="tour-section">
          <div className="container">
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
          </div>
        </section>
      </div>
    </section>
  );
};

export default DomesticTourPage;