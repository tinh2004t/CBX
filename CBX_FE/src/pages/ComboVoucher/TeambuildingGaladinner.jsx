import React, { useState, useEffect } from 'react';
import { Star, Eye, Phone, Mail, MapPin, Clock, Users, Calendar, ChevronLeft, ChevronRight, Play, Loader } from 'lucide-react';
import teamBuildingAPI from '../../api/teamBuildingApi';
import '../../styles/TeamBuilding.css';

export default function TeamBuildingBooking() {
    const [serviceData, setServiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedTab, setSelectedTab] = useState('overview');
    const [expandedCards, setExpandedCards] = useState(new Set());

    // Fetch data from API
    useEffect(() => {
        const fetchTeamBuildingData = async () => {
            try {
                setLoading(true);
                const response = await teamBuildingAPI.getAllTeamBuildingServices();
                console.log('API Response:', response);

                if (response.success && response.data && response.data.length > 0) {
                    // Lấy service đầu tiên hoặc bạn có thể lấy theo ID cụ thể
                    setServiceData(response.data[0]);
                } else {
                    setError('Không tìm thấy dữ liệu dịch vụ');
                }
            } catch (err) {
                console.error('Error fetching team building data:', err);
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamBuildingData();
    }, []);

    const nextImage = () => {
        if (serviceData?.images && serviceData.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % serviceData.images.length);
        }
    };

    const prevImage = () => {
        if (serviceData?.images && serviceData.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + serviceData.images.length) % serviceData.images.length);
        }
    };

    const toggleExpanded = (index) => {
        const newExpandedCards = new Set(expandedCards);
        if (newExpandedCards.has(index)) {
            newExpandedCards.delete(index);
        } else {
            newExpandedCards.add(index);
        }
        setExpandedCards(newExpandedCards);
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Loading state
    if (loading) {
        return (
            <div className="app">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <Loader className="icon" style={{ animation: 'spin 1s linear infinite' }} />
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !serviceData) {
        return (
            <div className="app">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: '#ef4444'
                }}>
                    <p>{error || 'Không thể tải dữ liệu'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                        }}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    const images = serviceData.images || [];
    const contact = serviceData.contact || {};
    const teamBuilding = serviceData.teamBuilding || {};

    return (
        <div className="app">
            {/* Header Section */}
            <div className="header-section">
                <div className="container">
                    <div className="header-content">
                        <div className="header-info">
                            <h1 className="main-title">
                                {serviceData.service?.title || 'Team Building Service'}
                            </h1>
                            <div className="header-meta">
                                <div className="meta-item">
                                    <MapPin className="icon" />
                                    <span>{serviceData.service?.location || 'Chưa cập nhật'}</span>
                                </div>
                                {serviceData.service?.rating && (
                                    <div className="meta-item rating">
                                        <Star className="icon star-icon" />
                                        <span className="rating-value">{serviceData.service.rating}</span>
                                        <span>({serviceData.service.reviewCount || 0} đánh giá)</span>
                                    </div>
                                )}
                                {serviceData.viewCount && (
                                    <div className="meta-item">
                                        <Eye className="icon" />
                                        <span>{serviceData.viewCount.toLocaleString()} lượt xem</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="contact-card">
                            <h3 className="contact-title">Liên hệ đặt lịch</h3>
                            <div className="contact-info">
                                {contact.phone && (
                                    <div className="contact-item">
                                        <Phone className="contact-icon" />
                                        <a href={`tel:${contact.phone}`} className="contact-link">
                                            {contact.phone}
                                        </a>
                                    </div>
                                )}
                                {contact.email && (
                                    <div className="contact-item">
                                        <Mail className="contact-icon" />
                                        <a href={`mailto:${contact.email}`} className="contact-email">
                                            {contact.email}
                                        </a>
                                    </div>
                                )}
                            </div>
                            <button className="book-button">
                                Đặt lịch ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Gallery Section */}
            {images.length > 0 && (
                <div className="gallery-section">
                    <div className="container">
                        <div className="gallery-wrapper">
                            <div className="main-image-container">
                                <img
                                    src={images[currentImageIndex]}
                                    alt={`Team Building ${currentImageIndex + 1}`}
                                    className="main-image"
                                />
                                <div className="image-overlay">
                                    <Play className="play-icon" />
                                </div>

                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="nav-arrow prev-arrow"
                                        >
                                            <ChevronLeft className="arrow-icon" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="nav-arrow next-arrow"
                                        >
                                            <ChevronRight className="arrow-icon" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {images.length > 1 && (
                                <div className="thumbnail-strip">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                        >
                                            <img src={image} alt={`Thumbnail ${index + 1}`} className="thumbnail-image" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Content Tabs */}
            <div className="content-section">
                <div className="container">
                    <div className="content-wrapper">
                        {/* Tab Navigation */}
                        <div className="tab-navigation">
                            <nav className="tab-nav">
                                {[
                                    { id: 'overview', label: 'Tổng quan' },
                                    { id: 'teambuilding', label: 'Team Building là gì?' },
                                    { id: 'roles', label: 'Vai trò & Lợi ích' },
                                    { id: 'types', label: 'Các hình thức' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedTab(tab.id)}
                                        className={`tab-button ${selectedTab === tab.id ? 'active' : ''}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="tab-content">
                            {selectedTab === 'overview' && (
                                <div className="overview-content">
                                    <div className="overview-description">
                                        <h2 className="section-title">Về dịch vụ của chúng tôi</h2>
                                        <p className="description-text">
                                            {serviceData.service?.description || 'Chưa có mô tả'}
                                        </p>
                                    </div>

                                    <div className="features-grid">
                                        <div className="feature-card blue">
                                            <Users className="feature-icon" />
                                            <h3 className="feature-title">Đội ngũ chuyên nghiệp</h3>
                                            <p className="feature-desc">Kinh nghiệm hơn 10 năm</p>
                                        </div>

                                        <div className="feature-card green">
                                            <Calendar className="feature-icon" />
                                            <h3 className="feature-title">Lên kế hoạch chi tiết</h3>
                                            <p className="feature-desc">Tư vấn miễn phí</p>
                                        </div>

                                        <div className="feature-card yellow">
                                            <Clock className="feature-icon" />
                                            <h3 className="feature-title">Hỗ trợ 24/7</h3>
                                            <p className="feature-desc">Luôn sẵn sàng hỗ trợ</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedTab === 'teambuilding' && (
                                <div className="teambuilding-content">
                                    <div className="definition-section">
                                        <h2 className="section-title">Team Building là gì?</h2>
                                        <p className="definition-text">
                                            {teamBuilding.definition || 'Team building là hoạt động tập thể nhằm tăng cường sự gắn kết, hợp tác và hiểu biết lẫn nhau giữa các thành viên trong tổ chức.'}
                                        </p>
                                    </div>


                                </div>
                            )}

                            {selectedTab === 'roles' && (
                                <div className="roles-content">
                                    <div className="roles-header">
                                        <h2 className="section-title">Vai trò & Lợi ích</h2>
                                    </div>

                                    <div className="roles-grid">
                                        {(teamBuilding.roles || []).map((role, index) => (
                                            <div key={index} className="role-card">
                                                <div className="role-number">
                                                    {index + 1}
                                                </div>
                                                <div className="role-content">
                                                    <p className="role-text">{role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedTab === 'types' && (
                                <div className="types-content">
                                    <div className="types-header">
                                        <h2 className="section-title">Các hình thức Team Building</h2>
                                    </div>

                                    <div className="types-list">
                                        {(teamBuilding.types || []).map((type, index) => {
                                            const isExpanded = expandedCards.has(index);
                                            const shouldTruncate = type.description && type.description.length > 150;

                                            return (
                                                <div key={index} className="type-card">
                                                    <h3 className="type-title">{type.name}</h3>
                                                    <p className="type-description">
                                                        {isExpanded || !shouldTruncate
                                                            ? type.description
                                                            : truncateText(type.description)
                                                        }
                                                    </p>

                                                    {shouldTruncate && (
                                                        <button
                                                            className="learn-more-btn"
                                                            onClick={() => toggleExpanded(index)}
                                                        >
                                                            {isExpanded ? 'Thu gọn ←' : 'Xem thêm →'}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2 className="cta-title">Sẵn sàng tổ chức sự kiện của bạn?</h2>
                        <p className="cta-subtitle">
                            Liên hệ ngay để được tư vấn miễn phí và báo giá chi tiết
                        </p>
                        <div className="cta-buttons">
                            {contact.phone && (
                                <button className="cta-btn primary">
                                    Gọi ngay: {contact.phone}
                                </button>
                            )}
                            <button className="cta-btn secondary">
                                Gửi yêu cầu báo giá
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}