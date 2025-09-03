import React from 'react';
import TourCard from '../../components/TourSection/TourCard'; // Import TourCard component của bạn
import { useLanguage } from '../../hooks/useLanguage';
import '../../styles/TourSections.css';


// Mock useLanguage hook for demo

const ComboVouchersPage = () => {
    const { t } = useLanguage();

    // Sample data for Miền Bắc tours
    // 1. Vé máy bay
    const flightTickets = [
        {
            id: 1,
            image: "files/images/Flights/vietnamairlines.jpg",
            title: t('ve_may_bay_ha_noi_da_nang') || "Vé máy bay Hà Nội - Đà Nẵng (Khứ hồi)",
            price: "2.300.000 đ",
            duration: t('thoi_gian_bay_1h20') || "Thời gian bay: 1h20",
            departure: t('san_bay_noi_bai') || "Sân bay Nội Bài",
            destination: t('san_bay_da_nang') || "Sân bay Đà Nẵng",
            schedule: t('khoi_hanh_hang_ngay') || "Khởi hành hàng ngày"
        },
    ];

    // 2. Khách sạn & resort
    const hotelsResorts = [
        {
            id: 1,
            image: "files/images/Hotels/resortphuquoc.jpg",
            title: t('vinpearl_resort_phu_quoc') || "Vinpearl Resort & Spa Phú Quốc",
            price: "3.200.000 đ / đêm",
            duration: t('3_ngay_2_dem') || "Combo 3 ngày 2 đêm",
            departure: t('check_in_tu_14h') || "Check-in từ 14h",
            destination: t('phu_quoc') || "Phú Quốc",
            schedule: t('ap_dung_thu_6_chu_nhat') || "Áp dụng Thứ 6 - Chủ nhật"
        },
    ];

    // 3. Homestay & villa
    const homestayVillas = [
        {
            id: 1,
            image: "files/images/Homestay/villadalat.jpg",
            title: t('villa_dalat_nguyen_can') || "Villa Đà Lạt nguyên căn (10 khách)",
            price: "4.500.000 đ / đêm",
            duration: t('2_ngay_1_dem') || "2 ngày 1 đêm",
            departure: t('check_in_13h') || "Check-in từ 13h",
            destination: t('da_lat') || "Đà Lạt",
            schedule: t('ap_dung_quanh_nam') || "Áp dụng quanh năm"
        },
    ];

    // 4. Teambuilding & Gala Dinner
    const teambuildingGala = [
        {
            id: 1,
            image: "files/images/Teambuilding/halong.jpg",
            title: t('teambuilding_ha_long') || "Teambuilding & Gala Dinner tại Hạ Long",
            price: "12.000.000 đ / gói",
            duration: t('2_ngay_1_dem') || "2 ngày 1 đêm",
            departure: t('xuat_phat_tu_ha_noi') || "Xuất phát từ Hà Nội",
            destination: t('ha_long_quang_ninh') || "Hạ Long - Quảng Ninh",
            schedule: t('dat_truoc_2_tuan') || "Đặt trước ít nhất 2 tuần"
        },
    ];

    // 5. MICE
    const miceServices = [
        {
            id: 1,
            image: "files/images/MICE/danangconference.jpg",
            title: t('hoi_nghi_danang') || "Hội nghị khách hàng Đà Nẵng (300 khách)",
            price: "65.000.000 đ / gói",
            duration: t('3_ngay_2_dem') || "3 ngày 2 đêm",
            departure: t('to_chuc_tai_khach_san_5sao') || "Khách sạn 5* Đà Nẵng",
            destination: t('da_nang') || "Đà Nẵng",
            schedule: t('thoi_gian_linh_hoat') || "Thời gian linh hoạt"
        },
    ];

    // 6. Dịch vụ vận tải
    const transportationServices = [
        {
            id: 1,
            image: "files/images/Transport/xe45cho.jpg",
            title: t('thue_xe_45cho') || "Thuê xe 45 chỗ du lịch",
            price: "5.500.000 đ / ngày",
            duration: t('thue_theo_ngay') || "Thuê theo ngày",
            departure: t('don_tai_ha_noi') || "Đón tại Hà Nội",
            destination: t('di_tinh') || "Đi tỉnh",
            schedule: t('dat_truoc_3_ngay') || "Đặt trước ít nhất 3 ngày"
        },
    ];

    return (
        <section className="ss-about margin-top-50">
            <div className="introduction wow fadeInUp">
                {/* VÉ MÁY BAY */}
                <section className="tour-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">
                                {t('ve_may_bay') || 'VÉ MÁY BAY'}
                            </h2>
                            <a href="/services/flight-tickets" className="view-more">
                                {t('more') || 'Xem thêm'} &gt;&gt;
                            </a>
                        </div>
                        <div className="card-container">
                            {flightTickets.map(service => (
                                <TourCard
                                    key={service.id}
                                    tour={service}
                                    type="combo"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* KHÁCH SẠN & RESORT */}
                <section className="tour-section tour-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">
                                {t('khach_san_resort') || 'KHÁCH SẠN & RESORT'}
                            </h2>
                            <a href="/services/hotels-resorts" className="view-more">
                                {t('more') || 'Xem thêm'} &gt;&gt;
                            </a>
                        </div>
                        <div className="card-container">
                            {hotelsResorts.map(service => (
                                <TourCard
                                    key={service.id}
                                    tour={service}
                                    type="combo"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* HOMESTAY & VILLA */}
                <section className="tour-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">
                                {t('homestay_villa') || 'HOMESTAY & VILLA'}
                            </h2>
                            <a href="/services/homestay-villa" className="view-more">
                                {t('more') || 'Xem thêm'} &gt;&gt;
                            </a>
                        </div>
                        <div className="card-container">
                            {homestayVillas.map(service => (
                                <TourCard
                                    key={service.id}
                                    tour={service}
                                    type="combo"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* TEAMBUILDING & GALA DINNER */}
                <section className="tour-section tour-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">
                                {t('teambuilding_gala') || 'TEAMBUILDING & GALA DINNER'}
                            </h2>
                            <a href="/services/teambuilding-gala" className="view-more">
                                {t('more') || 'Xem thêm'} &gt;&gt;
                            </a>
                        </div>
                        <div className="card-container">
                            {teambuildingGala.map(service => (
                                <TourCard
                                    key={service.id}
                                    tour={service}
                                    type="combo"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* MICE */}
                <section className="tour-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">
                                {t('mice') || 'MICE'}
                            </h2>
                            <a href="/services/mice" className="view-more">
                                {t('more') || 'Xem thêm'} &gt;&gt;
                            </a>
                        </div>
                        <div className="card-container">
                            {miceServices.map(service => (
                                <TourCard
                                    key={service.id}
                                    tour={service}
                                    type="combo"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* DỊCH VỤ VẬN TẢI */}
                <section className="tour-section tour-section-alt">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">
                                {t('van_tai') || 'DỊCH VỤ VẬN TẢI'}
                            </h2>
                            <a href="/services/transportation" className="view-more">
                                {t('more') || 'Xem thêm'} &gt;&gt;
                            </a>
                        </div>
                        <div className="card-container">
                            {transportationServices.map(service => (
                                <TourCard
                                    key={service.id}
                                    tour={service}
                                    type="combo"
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default ComboVouchersPage;