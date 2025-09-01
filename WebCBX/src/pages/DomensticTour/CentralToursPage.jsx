import React from 'react';
import TourCard from '../../components/TourSection/TourCard'; // Import TourCard component của bạn
import { useLanguage } from '../../hooks/useLanguage';

// Mock useLanguage hook for demo

const CentralToursPage = () => {
  const { t } = useLanguage();

  // Sample data for Miền Bắc tours
  const centralTours = [
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

    },
    {
      id: 6,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Cao Bằng - Bắc Kạn",
      departure: "Hà Nội",
      price: "3.800.000 đ",
      duration: "Chương trình 3 ngày 2 đêm",
      airline: "Xe du lịch",
      scheduleInfo: "Thứ 6 hàng tuần",
      href: "/TourDetailPage"

    },
    {
      id: 7,
      image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      title: "Tour Cao Bằng - Bắc Kạn",
      departure: "Hà Nội",
      price: "3.800.000 đ",
      duration: "Chương trình 3 ngày 2 đêm",
      airline: "Xe du lịch",
      scheduleInfo: "Thứ 6 hàng tuần",
      href: "/TourDetailPage"

    },
    {
      id: 8,
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

  return (
    <section className="ss-about margin-top-50">
      <div className="introduction wow fadeInUp">
        <div className="container">
          {/* MIỀN TRUNG */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('mien_trung') || 'MIỀN TRUNG'}
              </h2>
            </div>
            <div className="card-container">
              {centralTours.map(tour => (
                <TourCard 
                  key={tour.id} 
                  tour={tour} 
                  type="bestselling"
                  href={tour.href}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default CentralToursPage;