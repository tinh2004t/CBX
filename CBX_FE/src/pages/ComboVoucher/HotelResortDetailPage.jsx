import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import accommodationDetailAPI from '../../api/accommodationDetailApi';

const HotelDetailCard = () => {
    const { slug } = useParams(); // Lấy slug từ URL
    const [hotelData, setHotelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Fetch data from API
    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await accommodationDetailAPI.getAccommodationDetailBySlug(slug);
                
                if (response.success && response.data) {
                    setHotelData(response.data);
                    // Set default room selection to first available room
                    if (response.data.roomTypes && response.data.roomTypes.length > 0) {
                        setSelectedRoom(response.data.roomTypes[0].type);
                    }
                } else {
                    setError('Không tìm thấy thông tin khách sạn');
                }
            } catch (err) {
                console.error('Error fetching hotel data:', err);
                setError('Có lỗi xảy ra khi tải thông tin khách sạn');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchHotelData();
        }
    }, [slug]);

    const prevImage = () => {
        if (!hotelData?.images) return;
        setCurrentImageIndex((prev) => (prev === 0 ? hotelData.images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        if (!hotelData?.images) return;
        setCurrentImageIndex((prev) => (prev === hotelData.images.length - 1 ? 0 : prev + 1));
    };

    const truncateDescription = (text, maxLength = 300) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    // Convert roomTypes array to object for easier access
    const getRoomTypesObject = () => {
        if (!hotelData?.roomTypes) return {};
        return hotelData.roomTypes.reduce((acc, room) => {
            acc[room.type] = room;
            return acc;
        }, {});
    };

    const roomTypes = getRoomTypesObject();
    const selectedRoomData = roomTypes[selectedRoom];
    const totalPrice = selectedRoomData?.price || 0;

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
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            fontSize: '18px',
            color: '#6b7280'
        },
        errorContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            fontSize: '18px',
            color: '#dc2626',
            padding: '32px',
            textAlign: 'center',
            gap: '16px'
        },
        backButton: {
            padding: '12px 24px',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'background-color 0.2s'
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
            gap: '32px'
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
        descriptionText: {
            color: '#374151',
            lineHeight: '1.6',
            margin: '0'
        },
        readMoreButton: {
            marginTop: '12px',
            background: 'none',
            border: 'none',
            color: '#4f46e5',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0'
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
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingContainer}>
                    <div>Đang tải thông tin khách sạn...</div>
                </div>
            </div>
        );
    }

    if (error || !hotelData) {
        return (
            <div style={styles.container}>
                <div style={styles.errorContainer}>
                    <div>{error || 'Không tìm thấy thông tin khách sạn'}</div>
                    <button 
                        style={styles.backButton}
                        onClick={() => window.history.back()}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.heroSection}>
                <img
                    src={hotelData.images?.[currentImageIndex] || 'https://via.placeholder.com/800x500'}
                    alt={`${hotelData.name}`}
                    style={styles.heroImage}
                />

                {/* Navigation Buttons - Only show if multiple images */}
                {hotelData.images && hotelData.images.length > 1 && (
                    <>
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
                            {hotelData.images.map((_, index) => (
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
                    </>
                )}

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
                        <div style={styles.infoCard}>
                            <h2 style={styles.sectionTitle}>
                                <span>📖</span>
                                Mô Tả Khách Sạn
                            </h2>
                            <p style={styles.descriptionText}>
                                {showFullDescription
                                    ? hotelData.description
                                    : truncateDescription(hotelData.description)}
                            </p>
                            {hotelData.description && hotelData.description.length > 300 && (
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
                        {hotelData.amenities && hotelData.amenities.length > 0 && (
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
                        )}

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
                            {hotelData.distances && (
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
                            )}
                        </div>
                    </div>

                    {/* Right Column - Booking */}
                    <div>
                        <div style={styles.bookingCard}>
                            <h2 style={styles.bookingTitle}>Đặt Phòng Ngay</h2>

                            {/* Room Selection */}
                            {hotelData.roomTypes && hotelData.roomTypes.length > 0 ? (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Chọn loại phòng</label>
                                    <select
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                        style={styles.select}
                                        onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    >
                                        {hotelData.roomTypes.map((room) => (
                                            <option key={room.type} value={room.type}>
                                                {room.name} - {formatCurrency(room.price)} VND
                                            </option>
                                        ))}
                                    </select>
                                    {selectedRoomData && (
                                        <p style={styles.description}>
                                            {selectedRoomData.description}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p style={styles.description}>Hiện chưa có thông tin phòng</p>
                            )}

                            {/* Price Breakdown */}
                            {selectedRoomData && (
                                <div style={styles.priceBreakdown}>
                                    <h3 style={styles.priceTitle}>Chi tiết giá</h3>
                                    <div style={styles.totalPrice}>
                                        <span style={styles.totalLabel}>Tổng cộng/đêm:</span>
                                        <span style={styles.totalValue}>{formatCurrency(totalPrice)} VND</span>
                                    </div>
                                </div>
                            )}

                            {/* Contact Buttons */}
                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.primaryButton}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    onClick={() => alert('Chức năng đặt phòng sẽ được triển khai')}
                                >
                                    <span>📅</span>
                                    <span>Đặt Phòng Ngay</span>
                                </button>

                                <div style={styles.secondaryButtonGrid}>
                                    <button
                                        style={{ ...styles.secondaryButton, ...styles.phoneButton }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#bbf7d0'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dcfce7'}
                                        onClick={() => alert('Chức năng gọi điện sẽ được triển khai')}
                                    >
                                        <span>📞</span>
                                        <span>Gọi ngay</span>
                                    </button>
                                    <button
                                        style={{ ...styles.secondaryButton, ...styles.emailButton }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#bfdbfe'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dbeafe'}
                                        onClick={() => alert('Chức năng email sẽ được triển khai')}
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