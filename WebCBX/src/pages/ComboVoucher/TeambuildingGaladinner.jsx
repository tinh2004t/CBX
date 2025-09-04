import React, { useState } from 'react';
import { Star, Eye, Phone, Mail, MapPin, Clock, Users, Calendar, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import '../../styles/TeamBuilding.css';

// Mock data - sẽ được thay thế bằng data từ database
const mockData = {
    service: {
        id: 1,
        title: "Tổ chức Team Building & Gala Dinner",
        rating: 4.8,
        reviewCount: 156,
        viewCount: 2341,
        price: "Liên hệ",
        location: "Hà Nội, Hồ Chí Minh",
        description: "Tổ chức team building ngày càng được nhiều doanh nghiệp quan tâm. Một đơn vị tổ chức teambuilding chuyên nghiệp phải bằng kinh nghiệm của mình để lắng nghe và thấu hiểu mong muốn của khách hàng, đáp ứng nhu cầu, giúp khách hàng không những đạt được mục tiêu của chuyến đi mà còn khai thác chiều sâu và để lại nhiều cảm xúc lắng đọng sau chuyến đi. Ở Du Lịch Việt mọi loại hình tour, teambuilding từ các chương trình team building vui chơi vận động sôi động gắn kết đồng đội, xây dựng đội ngũ,  đến các chương trình teambuilding chuyên đề bồi dưỡng và đào đạo nhân sự, những chương trình team building đặc biệt để kick off doanh nghiệp hay những sự kiện nhằm lan tỏa thương hiệu, xây dựng văn hóa nội bộ bền vững.. đều có thể thực hiện được. Đội ngũ chuyên viên teambuilding của Du Lịch Việt năng động, nhiệt huyết và không ngừng sáng tạo với những kịch bản mới lạ và độc đáo, đưa các đia danh du lịch trên nhiều tỉnh thành trong nước TPHCM, Hà Nội, Đà Nẵng, Bình Dương, Đồng Nai, Bến Tre, Vũng Tàu..Ninh Bình, Sapa, Thái Nguyên, Hòa Bình, Quảng Ninh...và các nước trong khu vực như Singapore, Thái Lan, Malaysia, Hàn Quốc.. để khai thác teambuilding..đáp ứng được các nhu cầu của khách hàng 3 miền. Du Lịch Việt, top 10 công ty du lịch hàng đầu Việt Nam, tự hào là một trong những đơn vị tổ chức team building uy tín, chuyên nghiệp hàng đầu Việt Nam! Du Lịch Việt luôn đồng hành cùng doanh nghiệp trên con đường phát triển thịnh vượng."
    },
    contact: {
        phone: "024 36760 888",
        email: "dulichcanhbuomxanh@gmail.com",
        address: "123 Đường ABC, Quận 1, TP.HCM"
    },
    images: [
        "https://dulichviet.com.vn/images/bandidau/images/Khach-Doan/Slide-400/a10-du-lich-viet.jpg",
        "https://dulichviet.com.vn/images/bandidau/images/Khach-Doan/Slide-400/a10-du-lich-viet.jpg",
        "https://dulichviet.com.vn/images/bandidau/images/Khach-Doan/Slide-400/a10-du-lich-viet.jpg",
        "https://dulichviet.com.vn/images/bandidau/images/Khach-Doan/Slide-400/a10-du-lich-viet.jpg",
        "https://dulichviet.com.vn/images/bandidau/images/Khach-Doan/Slide-400/a10-du-lich-viet.jpg"
    ],
    teamBuilding: {
        definition: "Team building là hoạt động tập thể nhằm tăng cường sự gắn kết, hợp tác và hiểu biết lẫn nhau giữa các thành viên trong tổ chức.",
        roles: [
            "Tăng cường tinh thần đoàn kết",
            "Cải thiện kỹ năng giao tiếp",
            "Phát triển khả năng làm việc nhóm",
            "Giảm stress và tạo động lực làm việc"
        ],
        types: [
            {
                name: "Team Building Ngoài Trời",
                description: "Các hoạt động thể thao, trò chơi ngoài trời"
            },
            {
                name: "Team Building Trong Nhà",
                description: "Các trò chơi trí tuệ, workshop"
            },
            {
                name: "Gala Dinner",
                description: "Tiệc tối trang trọng kết hợp entertainment"
            }
        ]
    }
};

export default function TeamBuildingBooking() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedTab, setSelectedTab] = useState('overview');
    const [expandedCards, setExpandedCards] = useState(new Set());


    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % mockData.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + mockData.images.length) % mockData.images.length);
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
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="app">
            {/* Header Section */}
            <div className="header-section">
                <div className="container">
                    <div className="header-content">
                        <div className="header-info">
                            <h1 className="main-title">
                                {mockData.service.title}
                            </h1>
                            <div className="header-meta">
                                <div className="meta-item">
                                    <MapPin className="icon" />
                                    <span>{mockData.service.location}</span>
                                </div>
                                <div className="meta-item rating">
                                    <Star className="icon star-icon" />
                                    <span className="rating-value">{mockData.service.rating}</span>
                                    <span>({mockData.service.reviewCount} đánh giá)</span>
                                </div>
                                <div className="meta-item">
                                    <Eye className="icon" />
                                    <span>{mockData.service.viewCount.toLocaleString()} lượt xem</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="contact-card">
                            <h3 className="contact-title">Liên hệ đặt lịch</h3>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <Phone className="contact-icon" />
                                    <a href={`tel:${mockData.contact.phone}`} className="contact-link">
                                        {mockData.contact.phone}
                                    </a>
                                </div>
                                <div className="contact-item">
                                    <Mail className="contact-icon" />
                                    <a href={`mailto:${mockData.contact.email}`} className="contact-email">
                                        {mockData.contact.email}
                                    </a>
                                </div>
                            </div>
                            <button className="book-button">
                                Đặt lịch ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Gallery Section */}
            <div className="gallery-section">
                <div className="container">
                    <div className="gallery-wrapper">
                        <div className="main-image-container">
                            <img
                                src={mockData.images[currentImageIndex]}
                                alt={`Team Building ${currentImageIndex + 1}`}
                                className="main-image"
                            />
                            <div className="image-overlay">
                                <Play className="play-icon" />
                            </div>

                            {/* Navigation Arrows */}
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
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="thumbnail-strip">
                            {mockData.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                >
                                    <img src={image} alt={`Thumbnail ${index + 1}`} className="thumbnail-image" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
                                            {mockData.service.description}
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
                                            {mockData.teamBuilding.definition}
                                        </p>
                                    </div>

                                    <div className="importance-card">
                                        <h3 className="importance-title">
                                            Tại sao Team Building quan trọng?
                                        </h3>
                                        <p className="importance-text">
                                            Team Building không chỉ là những hoạt động giải trí đơn thuần, mà còn là công cụ
                                            quản lý hiệu quả giúp doanh nghiệp xây dựng văn hóa làm việc tích cực và nâng cao
                                            hiệu suất làm việc của toàn bộ tổ chức.
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
                                        {mockData.teamBuilding.roles.map((role, index) => (
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
                                        {mockData.teamBuilding.types.map((type, index) => {
                                            const isExpanded = expandedCards.has(index);
                                            const shouldTruncate = type.description.length > 150;

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
                            <button className="cta-btn primary">
                                Gọi ngay: {mockData.contact.phone}
                            </button>
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