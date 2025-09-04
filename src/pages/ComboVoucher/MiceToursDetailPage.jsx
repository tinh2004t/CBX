import React, { useState } from 'react';
import { MapPin, Calendar, Users, Star, Clock, Phone, Mail, User, X } from 'lucide-react';

const MiceToursDetailPage = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [activeImageTab, setActiveImageTab] = useState('landscape'); // Thêm state cho tab hình ảnh
  const [showConsultForm, setShowConsultForm] = useState(false);

  const [imagePage, setImagePage] = useState(0);
  const IMAGES_PER_PAGE = 3;
  const handleImageTabClick = (tab) => {
    setActiveImageTab(tab);
    setImagePage(0);
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Sample tour data
  const tourData = {
    title: "Hội thảo & Teambuilding Đà Lạt",
    location: "Đà Lạt, Lâm Đồng",
    duration: "3 ngày 2 đêm",
    price: "2,999,000",
    originalPrice: "3,500,000",
    rating: 4.8,
    reviews: 127,
    groupSize: "15-20 người",
    highlights: [
      "Chinh phục đỉnh Fansipan",
      "Thăm bản Cát Cát",
      "Ngắm ruộng bậc thang Mường Hoa",
      "Trải nghiệm tàu hỏa leo núi"
    ]
  };

  const scheduleData = [
    {
      day: "Ngày 1",
      title: "Hà Nội - Sapa",
      activities: [
        "06:00 - Xe đón tại điểm hẹn, khởi hành đi Sapa",
        "12:00 - Dùng cơm trưa tại Yên Bái",
        "15:00 - Đến Sapa, nhận phòng khách sạn",
        "16:00 - Tham quan thị trấn Sapa",
        "19:00 - Dùng cơm tối, nghỉ ngơi"
      ]
    },
    {
      day: "Ngày 2",
      title: "Chinh phục Fansipan - Bản Cát Cát",
      activities: [
        "07:00 - Ăn sáng tại khách sạn",
        "08:00 - Lên cáp treo chinh phục đỉnh Fansipan",
        "12:00 - Dùng cơm trưa tại nhà hàng",
        "14:00 - Tham quan bản Cát Cát",
        "17:00 - Về khách sạn nghỉ ngơi",
        "19:00 - Dùng cơm tối, tự do khám phá"
      ]
    },
    {
      day: "Ngày 3",
      title: "Ruộng bậc thang - Về Hà Nội",
      activities: [
        "07:00 - Ăn sáng, trả phòng khách sạn",
        "08:00 - Tham quan ruộng bậc thang Mường Hoa",
        "10:00 - Mua sắm đặc sản địa phương",
        "12:00 - Dùng cơm trưa, khởi hành về Hà Nội",
        "19:00 - Về đến Hà Nội, kết thúc chuyến đi"
      ]
    }
  ];

  const priceIncludes = [
    "Xe ô tô đời mới, máy lạnh",
    "Khách sạn 3* (phòng đôi, có điều hòa)",
    "Các bữa ăn theo chương trình",
    "Vé tham quan các điểm theo chương trình",
    "Hướng dẫn viên kinh nghiệm",
    "Bảo hiểm du lịch",
    "Nước uống trên xe"
  ];

  const priceExcludes = [
    "Chi phí cá nhân",
    "Đồ uống có cồn",
    "Tip cho hướng dẫn viên và tài xế",
    "Phụ thu phòng đơn: 500,000 VNĐ",
    "Chi phí phát sinh ngoài chương trình"
  ];

  // Ảnh mẫu cho 2 tab
  const landscapeImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80 ",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80"
  ];


  const images = landscapeImages;
  const maxPage = Math.floor((images.length - 1) / IMAGES_PER_PAGE);
  const currentImages = images.slice(imagePage * IMAGES_PER_PAGE, (imagePage + 1) * IMAGES_PER_PAGE);

  const handleFormSubmit = () => {
    if (!formData.name || !formData.phone) {
      alert('Vui lòng nhập đầy đủ họ tên và số điện thoại!');
      return;
    }
    alert(`Cảm ơn ${formData.name}! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.`);
    setShowConsultForm(false);
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      position: 'relative',
      zIndex: 999,
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      width: '100%',
      paddingTop: '20px',
      paddingBottom: '50px'
    }}>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        marginBottom: '32px'
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: '30px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          {tourData.title}
        </h1>

        {/* Image Tabs */}
        <div style={{ marginBottom: '24px' }}>
          <nav style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '16px' }}>
            <button
              onClick={() => handleImageTabClick('landscape')}
              style={{
                padding: '12px 24px',
                borderBottom: activeImageTab === 'landscape' ? '3px solid #3b82f6' : '3px solid transparent',
                fontWeight: activeImageTab === 'landscape' ? '700' : '500',
                color: activeImageTab === 'landscape' ? '#2563eb' : '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                marginRight: '24px'
              }}
            >
              Phong cảnh
            </button>
          </nav>




          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Nút mũi tên trái */}
            <button
              onClick={() => setImagePage(prev => Math.max(prev - 1, 0))}
              disabled={imagePage === 0}
              style={{
                cursor: imagePage === 0 ? 'not-allowed' : 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                color: imagePage === 0 ? '#d1d5db' : '#2563eb',
                userSelect: 'none'
              }}
              aria-label="Ảnh trước"
            >
              &#8592;
            </button>

            {/* Ảnh */}
            <div style={{ display: 'flex', gap: '16px', flex: 1, justifyContent: 'center' }}>
              {currentImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={activeImageTab === 'landscape' ? `Phong cảnh ${imagePage * IMAGES_PER_PAGE + index + 1}` : `Ẩm thực ${imagePage * IMAGES_PER_PAGE + index + 1}`}
                  style={{
                    width: 'calc((100% / 3) - 10.66px)',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    height: '180px'
                  }}
                />
              ))}
            </div>

            {/* Nút mũi tên phải */}
            <button
              onClick={() => setImagePage(prev => Math.min(prev + 1, maxPage))}
              disabled={imagePage === maxPage}
              style={{
                cursor: imagePage === maxPage ? 'not-allowed' : 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                color: imagePage === maxPage ? '#d1d5db' : '#2563eb',
                userSelect: 'none'
              }}
              aria-label="Ảnh tiếp theo"
            >
              &#8594;
            </button>
          </div>

        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '32px'
        }}>

          {/* Main Content */}
          <div>
            {/* Tour Info */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                  <MapPin size={16} style={{ marginRight: '4px' }} />
                  <span>{tourData.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                  <Calendar size={16} style={{ marginRight: '4px' }} />
                  <span>{tourData.duration}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                  <Users size={16} style={{ marginRight: '4px' }} />
                  <span>{tourData.groupSize}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#eab308' }}>
                  <Star size={16} style={{ marginRight: '4px', fill: 'currentColor' }} />
                  <span style={{ fontWeight: '600' }}>{tourData.rating}</span>
                  <span style={{ color: '#6b7280', marginLeft: '4px' }}>({tourData.reviews} đánh giá)</span>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  Điểm nổi bật:
                </h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#6b7280' }}>
                  {tourData.highlights.map((highlight, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ borderBottom: '1px solid #e5e7eb' }}>
                <nav style={{ display: 'flex', padding: '0 24px' }}>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    style={{
                      padding: '16px 4px',
                      borderBottom: activeTab === 'schedule' ? '2px solid #3b82f6' : '2px solid transparent',
                      fontWeight: '500',
                      fontSize: '14px',
                      color: activeTab === 'schedule' ? '#2563eb' : '#6b7280',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: '32px'
                    }}
                  >
                    Lịch trình chi tiết
                  </button>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    style={{
                      padding: '16px 4px',
                      borderBottom: activeTab === 'pricing' ? '2px solid #3b82f6' : '2px solid transparent',
                      fontWeight: '500',
                      fontSize: '14px',
                      color: activeTab === 'pricing' ? '#2563eb' : '#6b7280',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: '32px'
                    }}
                  >
                    Giá chi tiết
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    style={{
                      padding: '16px 4px',
                      borderBottom: activeTab === 'comments' ? '2px solid #3b82f6' : '2px solid transparent',
                      fontWeight: '500',
                      fontSize: '14px',
                      color: activeTab === 'comments' ? '#2563eb' : '#6b7280',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Bình luận
                  </button>
                </nav>
              </div>

              <div style={{ padding: '24px' }}>
                {activeTab === 'schedule' && (
                  <div>
                    {scheduleData.map((day, index) => (
                      <div key={index} style={{
                        borderLeft: '4px solid #3b82f6',
                        paddingLeft: '16px',
                        marginBottom: index < scheduleData.length - 1 ? '24px' : '0'
                      }}>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#1f2937',
                          marginBottom: '8px'
                        }}>
                          {day.day}: {day.title}
                        </h3>
                        <ul>
                          {day.activities.map((activity, actIndex) => (
                            <li key={actIndex} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              marginBottom: '8px'
                            }}>
                              <Clock size={16} style={{
                                marginTop: '4px',
                                marginRight: '8px',
                                color: '#9ca3af',
                                flexShrink: 0
                              }} />
                              <span style={{ color: '#6b7280' }}>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'pricing' && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#059669',
                        marginBottom: '16px'
                      }}>
                        Giá bao gồm:
                      </h3>
                      <ul>
                        {priceIncludes.map((item, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '8px'
                          }}>
                            <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                            <span style={{ color: '#6b7280' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#dc2626',
                        marginBottom: '16px'
                      }}>
                        Giá không bao gồm:
                      </h3>
                      <ul>
                        {priceExcludes.map((item, index) => (
                          <li key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '8px'
                          }}>
                            <span style={{ color: '#ef4444', marginRight: '8px' }}>✗</span>
                            <span style={{ color: '#6b7280' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div>
                    <div style={{
                      backgroundColor: '#eff6ff',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ color: '#1d4ed8' }}>
                        Plugin Facebook Comments sẽ được tích hợp tại đây.
                      </p>
                    </div>
                    <div style={{
                      border: '2px dashed #d1d5db',
                      padding: '32px',
                      textAlign: 'center',
                      color: '#6b7280'
                    }}>
                      Facebook Comments Plugin
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              position: 'sticky',
              top: '16px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  color: '#6b7280',
                  textDecoration: 'line-through',
                  fontSize: '18px',
                  marginBottom: '4px'
                }}>
                  {parseInt(tourData.originalPrice).toLocaleString()} VNĐ
                </div>
                <div style={{
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  marginBottom: '8px'
                }}>
                  {parseInt(tourData.price).toLocaleString()} VNĐ
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>/ người</div>
                <div style={{
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '14px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  display: 'inline-block',
                  marginTop: '8px'
                }}>
                  Tiết kiệm {(parseInt(tourData.originalPrice) - parseInt(tourData.price)).toLocaleString()} VNĐ
                </div>
              </div>

              <button
                onClick={() => setShowConsultForm(true)}
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  fontSize: '16px'
                }}
              >
                Đăng ký tư vấn
              </button>

              <div style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                <div style={{ marginBottom: '4px' }}>Hotline: 1900 1234</div>
                <div style={{ marginBottom: '4px' }}>Email: info@travel.com</div>
                <div style={{ color: '#059669', fontWeight: '600' }}>Tư vấn miễn phí 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showConsultForm && (
        <div style={{
          position: 'fixed',
          inset: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '448px',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0'
              }}>
                Đăng ký tư vấn
              </h3>
              <button
                onClick={() => setShowConsultForm(false)}
                style={{
                  color: '#9ca3af',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  Họ và tên *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '12px',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '12px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  Số điện thoại *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '12px',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '12px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '12px',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '12px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Nhập email (không bắt buộc)"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  Tin nhắn
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  placeholder="Để lại lời nhắn để được tư vấn tốt hơn..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowConsultForm(false)}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    color: '#374151',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Gửi yêu cầu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiceToursDetailPage;