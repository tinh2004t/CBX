import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import TourCard from './TourCard';

const TourSection = () => {
  const { t } = useLanguage();

  // Sample tour data - this would normally come from an API or props
  const bestSellingTours = [
    {
      id: 1,
      image: "files/images/Tours/1.jpg",
      title: t('thao_nguyen_mong_co') || "THẢO NGUYÊN MÔNG CỔ",
      price: "34.980.000 đ",
      duration: t('chuong_trinh_7_ngay_6_dem') || "Chương trình 7 ngày 6 đêm",
      airline: t('hang_hang_khong_air_china') || "Hãng hàng không Air China",
      departure: t('khoi_hanh_tu_viet_tri') || "Khởi hành từ VIỆT TRÌ >>",
      scheduleInfo: t('khoi_hanh_28_12_6_2') || "Khởi hành 28/12, 6/2"
    },
    {
      id: 2,
      image: "files/images/Tours/1.jpg",
      title: t('thao_nguyen_mong_co') || "THẢO NGUYÊN MÔNG CỔ",
      price: "34.980.000 đ",
      duration: t('chuong_trinh_7_ngay_6_dem') || "Chương trình 7 ngày 6 đêm",
      airline: t('hang_hang_khong_air_china') || "Hãng hàng không Air China",
      departure: t('khoi_hanh_tu_viet_tri') || "Khởi hành từ VIỆT TRÌ >>",
      scheduleInfo: t('khoi_hanh_28_12_6_2') || "Khởi hành 28/12, 6/2"
    },
    {
      id: 3,
      image: "files/images/Tours/1.jpg",
      title: t('thao_nguyen_mong_co') || "THẢO NGUYÊN MÔNG CỔ",
      price: "34.980.000 đ",
      duration: t('chuong_trinh_7_ngay_6_dem') || "Chương trình 7 ngày 6 đêm",
      airline: t('hang_hang_khong_air_china') || "Hãng hàng không Air China",
      departure: t('khoi_hanh_tu_viet_tri') || "Khởi hành từ VIỆT TRÌ >>",
      scheduleInfo: t('khoi_hanh_28_12_6_2') || "Khởi hành 28/12, 6/2"
    },
    {
      id: 4,
      image: "files/images/Tours/1.jpg",
      title: t('thao_nguyen_mong_co') || "THẢO NGUYÊN MÔNG CỔ",
      price: "34.980.000 đ",
      duration: t('chuong_trinh_7_ngay_6_dem') || "Chương trình 7 ngày 6 đêm",
      airline: t('hang_hang_khong_air_china') || "Hãng hàng không Air China",
      departure: t('khoi_hanh_tu_viet_tri') || "Khởi hành từ VIỆT TRÌ >>",
      scheduleInfo: t('khoi_hanh_28_12_6_2') || "Khởi hành 28/12, 6/2"
    },
    {
      id: 5,
      image: "files/images/Tours/1.jpg",
      title: t('thao_nguyen_mong_co') || "THẢO NGUYÊN MÔNG CỔ",
      price: "34.980.000 đ",
      duration: t('chuong_trinh_7_ngay_6_dem') || "Chương trình 7 ngày 6 đêm",
      airline: t('hang_hang_khong_air_china') || "Hãng hàng không Air China",
      departure: t('khoi_hanh_tu_viet_tri') || "Khởi hành từ VIỆT TRÌ >>",
      scheduleInfo: t('khoi_hanh_28_12_6_2') || "Khởi hành 28/12, 6/2"
    },
    // Add more tours as needed
  ];

  const comboVouchers = [
    {
      id: 1,
      image: "files/images/Tours/1.jpg",
      title: t('ha_noi_can_tho_soc_trang') || "HÀ NỘI - CẦN THƠ - SÓC TRĂNG...",
      price: "6.990.000 đ",
      duration: t('lo_trinh_4_ngay_3_dem') || "Lộ trình 4 ngày 3 đêm",
      departure: t('khoi_hanh_tu_ha_noi') || "Khởi hành từ Hà Nội",
      destination: t('diem_den_can_tho') || "Điểm đến Cần Thơ",
      schedule: t('lich_khoi_hanh_thu_5_hang_tuan') || "Lịch khởi hành thứ 5 hàng tuần"
    },
    {
      id: 2,
      image: "files/images/Tours/1.jpg",
      title: t('ha_noi_can_tho_soc_trang') || "HÀ NỘI - CẦN THƠ - SÓC TRĂNG...",
      price: "6.990.000 đ",
      duration: t('lo_trinh_4_ngay_3_dem') || "Lộ trình 4 ngày 3 đêm",
      departure: t('khoi_hanh_tu_ha_noi') || "Khởi hành từ Hà Nội",
      destination: t('diem_den_can_tho') || "Điểm đến Cần Thơ",
      schedule: t('lich_khoi_hanh_thu_5_hang_tuan') || "Lịch khởi hành thứ 5 hàng tuần"
    },
    {
      id: 3,
      image: "files/images/Tours/1.jpg",
      title: t('ha_noi_can_tho_soc_trang') || "HÀ NỘI - CẦN THƠ - SÓC TRĂNG...",
      price: "6.990.000 đ",
      duration: t('lo_trinh_4_ngay_3_dem') || "Lộ trình 4 ngày 3 đêm",
      departure: t('khoi_hanh_tu_ha_noi') || "Khởi hành từ Hà Nội",
      destination: t('diem_den_can_tho') || "Điểm đến Cần Thơ",
      schedule: t('lich_khoi_hanh_thu_5_hang_tuan') || "Lịch khởi hành thứ 5 hàng tuần"
    },
    {
      id: 4,
      image: "files/images/Tours/1.jpg",
      title: t('ha_noi_can_tho_soc_trang') || "HÀ NỘI - CẦN THƠ - SÓC TRĂNG...",
      price: "6.990.000 đ",
      duration: t('lo_trinh_4_ngay_3_dem') || "Lộ trình 4 ngày 3 đêm",
      departure: t('khoi_hanh_tu_ha_noi') || "Khởi hành từ Hà Nội",
      destination: t('diem_den_can_tho') || "Điểm đến Cần Thơ",
      schedule: t('lich_khoi_hanh_thu_5_hang_tuan') || "Lịch khởi hành thứ 5 hàng tuần"
    },
    // Add more combo tours as needed
  ];

  return (
    <section className="ss-about margin-top-50">
      <div className="introduction wow fadeInUp">
        <div className="container">
          {/* TOUR BÁN CHẠY NHẤT */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('tour_ban_chay') || 'TOUR BÁN CHẠY NHẤT'}
              </h2>
              <a href="xem-them.html" className="view-more">
                {t('more') || 'Xem thêm'} &gt;&gt;
              </a>
            </div>
            <div className="card-container">
              {bestSellingTours.map(tour => (
                <TourCard 
                  key={tour.id} 
                  tour={tour} 
                  type="bestselling"
                />
              ))}
            </div>
          </section>

          {/* COMBO & VOUCHER */}
          <section className="tour-section">
            <div className="section-header">
              <h2 className="section-title">
                {t('combo_voucher') || 'COMBO & VOUCHER'}
              </h2>
              <a href="xem-them.html" className="view-more">
                {t('more') || 'Xem thêm'} &gt;&gt;
              </a>
            </div>
            <div className="card-container">
              {comboVouchers.map(tour => (
                <TourCard 
                  key={tour.id} 
                  tour={tour} 
                  type="combo"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default TourSection;