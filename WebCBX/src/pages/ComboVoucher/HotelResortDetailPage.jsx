import React, { useState } from 'react';

const HotelDetailCard = () => {
    // Sample data - replace with your actual props
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState('deluxe');
    const [showFullDescription, setShowFullDescription] = useState(false);

    const hotelData = {
        name: "Grand Luxury Hotel",
        location: "Hà Nội, Việt Nam",
        address: "123 Phố Cổ, Hoàn Kiếm, Hà Nội",
        description:"Khách sạn Hoàn Kiếm Charm tọa lạc ngay trung tâm phố cổ Hà Nội, chỉ cách Hồ Hoàn Kiếm vài phút đi bộ. Với kiến trúc kết hợp giữa phong cách cổ điển Pháp và hiện đại, khách sạn mang đến không gian sang trọng nhưng vẫn ấm cúng. Khách sạn có hơn 50 phòng nghỉ được trang bị đầy đủ tiện nghi: điều hòa, TV màn hình phẳng, minibar, Wi-Fi tốc độ cao và ban công riêng nhìn ra phố phường Hà Nội. Nhà hàng trong khách sạn phục vụ ẩm thực Việt Nam và quốc tế, đặc biệt là các món ăn truyền thống Hà Nội. Ngoài ra, khách sạn còn có dịch vụ spa thư giãn, quầy bar trên tầng thượng với tầm nhìn toàn cảnh phố cổ, và đội ngũ nhân viên thân thiện, sẵn sàng hỗ trợ 24/7. Đây là lựa chọn lý tưởng cho cả du khách nghỉ dưỡng lẫn chuyến công tác.",
        stars: 5,
        rating: 4.8,
        reviewCount: 1247,
        amenities: ["WiFi miễn phí", "Hồ bơi", "Spa & Wellness", "Nhà hàng", "Phòng gym", "Dịch vụ phòng 24/7"],
        distances: {
            airport: "25km",
            beach: "5km",
            mall: "2km",
            cityCenter: "1km"
        }
    };

    const images = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=500&fit=crop"
    ];

    const roomTypes = {
        standard: { name: "Phòng Standard", price: 1500000, description: "Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản" },
        deluxe: { name: "Phòng Deluxe", price: 2500000, description: "Phòng cao cấp với view thành phố và tiện nghi hiện đại" },
        suite: { name: "Suite Premium", price: 4000000, description: "Suite sang trọng với không gian rộng rãi và dịch vụ VIP" }
    };

    const basePrice = 1200000;
    const roomPrice = roomTypes[selectedRoom]?.price || 0;
    const totalPrice = basePrice + roomPrice;

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    const truncateDescription = (text, maxLength = 300) => {
        if (!text) return ""; // hoặc return "Không có mô tả"
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };


    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        heroSection: {
            position: 'relative',
            height: '400px',
            overflow: 'hidden'
        },
        heroImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
        },
        navButton: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#374151',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        navButtonLeft: {
            left: '20px'
        },
        navButtonRight: {
            right: '20px'
        },
        indicators: {
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px'
        },
        indicator: {
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        indicatorActive: {
            backgroundColor: '#ffffff'
        },
        indicatorInactive: {
            backgroundColor: 'rgba(255, 255, 255, 0.5)'
        },
        starBadge: {
            position: 'absolute',
            top: '24px',
            left: '24px',
            background: 'linear-gradient(to right, #f59e0b, #d97706)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        headerOverlay: {
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
            color: '#ffffff',
            padding: '32px'
        },
        hotelName: {
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 8px 0'
        },
        hotelLocation: {
            fontSize: '18px',
            margin: '0',
            opacity: '0.9'
        },
        content: {
            padding: '32px'
        },
        ratingSection: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            padding: '24px',
            background: 'linear-gradient(to right, #eff6ff, #e0e7ff)',
            borderRadius: '12px'
        },
        ratingLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        },
        stars: {
            display: 'flex',
            gap: '2px'
        },
        star: {
            fontSize: '20px',
            color: '#f59e0b'
        },
        ratingScore: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#4f46e5'
        },
        reviewCount: {
            color: '#6b7280'
        },
        ratingRight: {
            textAlign: 'right'
        },
        ratingLabel: {
            fontSize: '14px',
            color: '#6b7280',
            margin: '0'
        },
        ratingText: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#4f46e5',
            margin: '0'
        },
        mainGrid: {
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '32px',
            '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr'
            }
        },
        leftColumn: {
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
        },
        infoCard: {
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: '24px'
        },
        sectionTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        amenitiesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px'
        },
        amenityItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#374151'
        },
        bullet: {
            width: '8px',
            height: '8px',
            backgroundColor: '#4f46e5',
            borderRadius: '50%'
        },
        addressText: {
            color: '#6b7280',
            fontWeight: '500',
            margin: '0 0 4px 0'
        },
        addressValue: {
            color: '#1f2937',
            margin: '0 0 16px 0'
        },
        distanceGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
        },
        distanceItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #e5e7eb'
        },
        distanceLabel: {
            color: '#6b7280'
        },
        distanceValue: {
            fontWeight: '600',
            color: '#1f2937'
        },
        bookingCard: {
            position: 'sticky',
            top: '32px',
            backgroundColor: '#ffffff',
            border: '2px solid #e0e7ff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
        },
        bookingTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 24px 0',
            textAlign: 'center'
        },
        formGroup: {
            marginBottom: '24px'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 12px 0'
        },
        select: {
            width: '100%',
            padding: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '16px',
            transition: 'border-color 0.2s ease',
            outline: 'none'
        },
        description: {
            marginTop: '12px',
            fontSize: '14px',
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            padding: '12px',
            borderRadius: '8px'
        },
        priceBreakdown: {
            marginBottom: '24px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: '16px'
        },
        priceTitle: {
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 12px 0'
        },
        priceItem: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            marginBottom: '8px'
        },
        priceLabel: {
            color: '#6b7280'
        },
        priceValue: {
            fontWeight: '500'
        },
        totalPrice: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '12px',
            marginTop: '12px',
            borderTop: '1px solid #e5e7eb'
        },
        totalLabel: {
            fontWeight: 'bold',
            color: '#1f2937'
        },
        totalValue: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#4f46e5'
        },
        buttonGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        primaryButton: {
            width: '100%',
            background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
            color: '#ffffff',
            fontWeight: 'bold',
            padding: '16px 24px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        },
        secondaryButtonGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
        },
        secondaryButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '600',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            fontSize: '14px'
        },
        phoneButton: {
            backgroundColor: '#dcfce7',
            color: '#166534'
        },
        emailButton: {
            backgroundColor: '#dbeafe',
            color: '#1d4ed8'
        },
        trustBadges: {
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6b7280'
        },
        trustBadge: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px'
        },
        trustDot: {
            width: '12px',
            height: '12px',
            borderRadius: '50%'
        },
        greenDot: {
            backgroundColor: '#10b981'
        },
        blueDot: {
            backgroundColor: '#3b82f6'
        },
        icon: {
            width: '20px',
            height: '20px'
        }
    };

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.heroSection}>
                <img
                    src={images[currentImageIndex]}
                    alt={`${hotelData.name} - Luxury hotel interior`}
                    style={styles.heroImage}
                />

                {/* Navigation Buttons */}
                <button
                    onClick={prevImage}
                    style={{ ...styles.navButton, ...styles.navButtonLeft }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                >
                    ‹
                </button>
                <button
                    onClick={nextImage}
                    style={{ ...styles.navButton, ...styles.navButtonRight }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                >
                    ›
                </button>

                {/* Image Indicators */}
                <div style={styles.indicators}>
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            style={{
                                ...styles.indicator,
                                ...(index === currentImageIndex ? styles.indicatorActive : styles.indicatorInactive)
                            }}
                        />
                    ))}
                </div>

                {/* Hotel Badge */}
                <div style={styles.starBadge}>
                    <span>⭐</span>
                    <span>{hotelData.stars} sao</span>
                </div>

                {/* Hotel Header Info */}
                <div style={styles.headerOverlay}>
                    <h1 style={styles.hotelName}>{hotelData.name}</h1>
                    <p style={styles.hotelLocation}>📍 {hotelData.location}</p>
                </div>
            </div>

            <div style={styles.content}>
                {/* Rating Section */}
                <div style={styles.ratingSection}>
                    <div style={styles.ratingLeft}>
                        <div style={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    style={{
                                        ...styles.star,
                                        color: i < hotelData.stars ? '#f59e0b' : '#d1d5db'
                                    }}
                                >
                                    ⭐
                                </span>
                            ))}
                        </div>
                        <div style={styles.ratingScore}>{hotelData.rating}/5</div>
                        <div style={styles.reviewCount}>({hotelData.reviewCount.toLocaleString()} đánh giá)</div>
                    </div>
                    <div style={styles.ratingRight}>
                        <p style={styles.ratingLabel}>Được khách hàng</p>
                        <p style={styles.ratingText}>Đánh giá cao</p>
                    </div>
                </div>

                {/* Content Grid */}
                <div style={styles.mainGrid}>
                    {/* Left Column - Hotel Info */}
                    <div style={styles.leftColumn}>
                        {/* Hotel Description */}
                        <div style={styles.descriptionCard}>
                            <h2 style={styles.sectionTitle}>
                                <span>📖</span>
                                Mô Tả Khách Sạn
                            </h2>
                            <p style={styles.descriptionText}>
                                {showFullDescription
                                    ? hotelData.description
                                    : truncateDescription(hotelData.description)}
                            </p>
                            {hotelData.description.length > 300 && (
                                <button
                                    style={styles.readMoreButton}
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                >
                                    {showFullDescription ? 'Thu gọn ↑' : 'Xem thêm ↓'}
                                </button>
                            )}
                        </div>

                        {/* Amenities */}
                        <div style={styles.infoCard}>
                            <h2 style={styles.sectionTitle}>
                                <span>☕</span>
                                Tiện Ích Khách Sạn
                            </h2>
                            <div style={styles.amenitiesGrid}>
                                {hotelData.amenities.map((amenity, index) => (
                                    <div key={index} style={styles.amenityItem}>
                                        <div style={styles.bullet}></div>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Location Details */}
                        <div style={styles.infoCard}>
                            <h2 style={styles.sectionTitle}>
                                <span>📍</span>
                                Vị Trí & Khoảng Cách
                            </h2>
                            <div>
                                <p style={styles.addressText}>Địa chỉ:</p>
                                <p style={styles.addressValue}>{hotelData.address}</p>
                            </div>
                            <div style={styles.distanceGrid}>
                                <div>
                                    <div style={styles.distanceItem}>
                                        <span style={styles.distanceLabel}>Sân bay</span>
                                        <span style={styles.distanceValue}>{hotelData.distances.airport}</span>
                                    </div>
                                    <div style={styles.distanceItem}>
                                        <span style={styles.distanceLabel}>Bãi biển</span>
                                        <span style={styles.distanceValue}>{hotelData.distances.beach}</span>
                                    </div>
                                </div>
                                <div>
                                    <div style={styles.distanceItem}>
                                        <span style={styles.distanceLabel}>Trung tâm mua sắm</span>
                                        <span style={styles.distanceValue}>{hotelData.distances.mall}</span>
                                    </div>
                                    <div style={styles.distanceItem}>
                                        <span style={styles.distanceLabel}>Trung tâm thành phố</span>
                                        <span style={styles.distanceValue}>{hotelData.distances.cityCenter}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking */}
                    <div>
                        <div style={styles.bookingCard}>
                            <h2 style={styles.bookingTitle}>Đặt Phòng Ngay</h2>

                            {/* Room Selection */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Chọn loại phòng</label>
                                <select
                                    value={selectedRoom}
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                    style={styles.select}
                                    onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                >
                                    {Object.entries(roomTypes).map(([key, room]) => (
                                        <option key={key} value={key}>
                                            {room.name} - {room.price.toLocaleString()} VND
                                        </option>
                                    ))}
                                </select>
                                <p style={styles.description}>
                                    {roomTypes[selectedRoom]?.description}
                                </p>
                            </div>

                            {/* Price Breakdown */}
                            <div style={styles.priceBreakdown}>
                                <h3 style={styles.priceTitle}>Chi tiết giá</h3>
                                <div style={styles.priceItem}>
                                    <span style={styles.priceLabel}>Giá cơ bản:</span>
                                    <span style={styles.priceValue}>{basePrice.toLocaleString()} VND</span>
                                </div>
                                <div style={styles.priceItem}>
                                    <span style={styles.priceLabel}>Phí phòng:</span>
                                    <span style={styles.priceValue}>{roomPrice.toLocaleString()} VND</span>
                                </div>
                                <div style={styles.totalPrice}>
                                    <span style={styles.totalLabel}>Tổng cộng/đêm:</span>
                                    <span style={styles.totalValue}>{totalPrice.toLocaleString()} VND</span>
                                </div>
                            </div>

                            {/* Contact Buttons */}
                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.primaryButton}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    <span>📅</span>
                                    <span>Đặt Phòng Ngay</span>
                                </button>

                                <div style={styles.secondaryButtonGrid}>
                                    <button
                                        style={{ ...styles.secondaryButton, ...styles.phoneButton }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#bbf7d0'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dcfce7'}
                                    >
                                        <span>📞</span>
                                        <span>Gọi ngay</span>
                                    </button>
                                    <button
                                        style={{ ...styles.secondaryButton, ...styles.emailButton }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#bfdbfe'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dbeafe'}
                                    >
                                        <span>✉️</span>
                                        <span>Email</span>
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div style={styles.trustBadges}>
                                <div style={styles.trustBadge}>
                                    <div style={{ ...styles.trustDot, ...styles.greenDot }}></div>
                                    <span>Miễn phí hủy trong 24h</span>
                                </div>
                                <div style={styles.trustBadge}>
                                    <div style={{ ...styles.trustDot, ...styles.blueDot }}></div>
                                    <span>Thanh toán an toàn 100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetailCard;