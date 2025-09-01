import React, { useState, useEffect } from 'react';

const TourismPage = ({ tourismData }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mock data - sẽ được thay thế bằng props từ backend
  const defaultData = {
    title: "Cao Bằng",
    mainImage: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
    shortDescription: "Tỉnh Cao Bằng là một trong những tỉnh đẹp nhất Việt Nam, cách Hà Nội 272km về phía bắc. Là tỉnh miền núi phía Bắc, giáp biên giới với Trung Quốc ở phía bắc. Nằm ở độ cao 300m, Cao Bằng có khí hậu nhiệt đới ôn hòa và dễ chịu qua bốn mùa rõ rệt, nhiệt độ cao nhất vào tháng 5 và lạnh nhất vào tháng 1.",
    fullDescription: `Tỉnh Cao Bằng là một trong những tỉnh đẹp nhất Việt Nam, cách Hà Nội 272km về phía bắc. Là tỉnh miền núi phía Bắc, giáp biên giới với Trung Quốc ở phía bắc. Nằm ở độ cao 300m, Cao Bằng có khí hậu nhiệt đới ôn hòa và dễ chịu qua bốn mùa rõ rệt, nhiệt độ cao nhất vào tháng 5 và lạnh nhất vào tháng 1.

Thành phố Cao Bằng có ít điểm thu hút so với các vùng lân cận. Tuy nhiên, bạn vẫn có thể khám phá đài tưởng niệm liệt sĩ, được dựng trên đỉnh một ngọn đồi. Từ đó, bạn sẽ có tầm nhìn toàn cảnh tuyệt đẹp.

Ở các vùng lân cận Cao Bằng, có nhiều địa điểm không thể bỏ qua, đặc biệt là hồ Thang Hen, hang Pac Bo, và thác nước Bản Giốc.

Hồ Thang Hen nằm trên đỉnh một ngọn núi, ở khu vực Trà Lĩnh, cách Cao Bằng khoảng 20 km. Dài 1.000m và rộng 300m, có thể tham quan ququanh năm. Tuy nhiên, bạn sẽ thấy một số khác biệt tùy theo thời điểm bạn đến. Trong mùa mưa, từ tháng 5 đến tháng 9, 36 hồ trong khu vực Trà Lĩnh được ngăn cách bởi các khối đá. Thời gian còn lại trong năm, hầu hết các hồ này đều cạn nước, trừ Thang Hen. Bạn có thể tận hưởng việc khám phá hang động bằng thuyền tre. Nhiều chuyến đi bộ đẹp cũng bắt đầu từ hồ.

Thác Bản Giốc nằm ở xã Đàm Thủy, huyện Trùng Khánh, cách Cao Bằng 85km. Chúng được mệnh danh là thác đẹp nhất Việt Nam. Cao 53m, chúng đặc biệt rộng, hơn 300m với một đầu nằm ở Trung Quốc và đầu kia ở Việt Nam. Nhiệt độ xung quanh luôn mát mẻ. Sông Quay Sơn đổ xuống dòng nước nơi có thể tìm thấy loài cá trầm hương nổi tiếng.

Hang Pac Bo nằm chỉ cách biên giới Trung Quốc 3km và khoảng 60km về phía tây bắc Cao Bằng. Hang động và khu vực xung quanh là vùng đất thiêng liêng đối với các nhà cách mạng Việt Nam. Chủ tịch Hồ Chí Minh đã sống ẩn náu trong hang này sau 30 năm lưu vong ở nước ngoài trong khi chờ đợi chiến tranh thế giới thứ hai kết thúc.

Cao Bằng là một tỉnh rất thú vị để dạo chơi và xứng đáng quan tâm với nhiều địa điểm tự nhiên tuyệt đẹp.`,
    gallery: [
      "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg"
    ],
    transportation: [
      "Xe ô tô riêng",
      "Xe máy (bằng lái xe quốc tế và bảo hiểm du lịch xe máy là bắt buộc. Liên hệ chúng tôi để có thêm thông tin)",
      "Xe buýt công cộng"
    ],
    activities: [
      "Đi bộ dạo chơi",
      "Tham quan thác Bản Giốc",
      "Đi thuyền để ngắm thác gần hơn",
      "Tham quan hang Ngườm Ngao (hang Hổ)",
      "Tham quan làng thợ rèn Phúc Sen của dân tộc Nùng",
      "Khám phá dấu tích tuyến đường thuộc địa 4",
      "Tham quan hồ Thang Hen",
      "Tham quan hang Hồ Chí Minh, Pac Po",
      "Tham quan làng người Lô Lô đen và chợ phiên Bảo Lạc",
      "Trekking tại Cao Bằng"
    ],
    accommodations: [
      {
        type: "Homestay",
        image: "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg"
      },
      {
        type: "Ecolodge",
        image: ""
      }
    ]
  };

  // Sử dụng data từ props hoặc defaultData
  const data = tourismData || defaultData;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const getDisplayContent = () => {
    if (showFullContent) {
      return data.fullDescription;
    }
    return data.shortDescription;
  };

  return (
    <div className="content content-detail-maps">
      <div className="container background-white padding-bottom">
        {/* Header */}
        <div className="row justify-content-center">
          <h1 className="color-A85D00 border-2line text-center h1-name margin-top">
            {data.title}
          </h1>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10 wow fadeInUp" style={{ 
            visibility: isVisible ? 'visible' : 'hidden',
            animationName: isVisible ? 'fadeInUp' : 'none'
          }}>
            <p className="introduct-content text-center">
              {data.shortDescription}
            </p>
          </div>
        </div>

        {/* Main Image */}
        <div className="margin-bottom">
          <br />
          <img 
            className="img-fluid" 
            src={data.mainImage} 
            alt={data.title}
          />
        </div>

        {/* Content Section */}
        <div className="margin-top wow fadeInUp" style={{ 
          visibility: isVisible ? 'visible' : 'hidden',
          animationName: isVisible ? 'fadeInUp' : 'none'
        }}>
          <div className="container">
            <div className="row justify-content-center">
              <h2 className="font-30 text-center border-line color-A85D00 margin-top-50">
                {data.title}
              </h2>
            </div>

            <div className="row margin-top">
              {/* Text Content */}
              <div className="col-lg-4 col-12">
                <div className="introduct-detail-maps align-bottom">
                  <div className="introduct-content text-align-justify introduct-content-detail-maps more">
                    <div style={{ textAlign: 'justify' }}>
                      {getDisplayContent()}
                      {!showFullContent && data.fullDescription.length > data.shortDescription.length && (
                        <span className="moreellipses">...&nbsp;</span>
                      )}
                      {showFullContent && (
                        <span className="morecontent">
                          <span>&nbsp;&nbsp;</span>
                        </span>
                      )}
                    </div>
                    {data.fullDescription.length > data.shortDescription.length && (
                      <a href="#" className="morelink" onClick={(e) => {
                        e.preventDefault();
                        toggleContent();
                      }}>
                        {showFullContent ? 'Ẩn bớt' : 'Hiển thị thêm'}
                      </a>
                    )}
                  </div>

                  <h4 className="more-photo text-right">
                    <a className="link-more-photo" href={`/viet-nam/${data.title.toLowerCase()}`}>
                      <img 
                        className="margin--15" 
                        width="50px" 
                        src="/Content/assets/images/6-61262_free-vector-comic-right-arrow-clip-art-right-arrow.png" 
                        alt="" 
                      />
                      <span> Đọc tiếp </span>
                    </a>
                  </h4>
                </div>
              </div>

              {/* Main Gallery Image */}
              <div className="col-lg-4 col-12">
                <img 
                  src={data.gallery[0]} 
                  className="img-fluid member-title-img height-400" 
                  alt={`${data.title} gallery`}
                />
              </div>

              {/* Side Gallery */}
              <div className="col-lg-4 col-12" id="nonepadding">
                <ul>
                  {data.gallery.slice(1, 3).map((image, index) => (
                    <li key={index} className="col-lg-12">
                      <img 
                        src={image} 
                        className="img-fluid member-title-img height-190" 
                        alt={`${data.title} gallery ${index + 2}`}
                      />
                    </li>
                  ))}
                </ul>
                <h4 className="more-photo text-right">
                  <a className="link-more-photo" href={`/viet-nam/${data.title.toLowerCase()}`}>
                    <img 
                      className="margin--15" 
                      width="50px" 
                      src="/Content/assets/images/6-61262_free-vector-comic-right-arrow-clip-art-right-arrow.png" 
                      alt="" 
                    />
                    <span> Thêm ảnh </span>
                  </a>
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="row justify-content-center">
          <div className="col-md-10">
            {/* Transportation */}
            <div style={{ textAlign: 'justify' }}>
              <strong>Làm thế nào để đến Cao Bằng?</strong>
            </div>
            <div style={{ textAlign: 'justify' }}>&nbsp;</div>
            {data.transportation.map((transport, index) => (
              <div key={index} style={{ textAlign: 'justify' }}>
                - {transport}
              </div>
            ))}

            <div style={{ textAlign: 'justify' }}>&nbsp;</div>

            {/* Activities */}
            <div style={{ textAlign: 'justify' }}>
              <strong>Có gì để làm ở Cao Bằng?</strong>
            </div>
            <div style={{ textAlign: 'justify' }}>&nbsp;</div>
            {data.activities.map((activity, index) => (
              <div key={index} style={{ textAlign: 'justify' }}>
                - {activity}
              </div>
            ))}

            <div style={{ textAlign: 'justify' }}>&nbsp;</div>

            {/* Accommodations */}
            <div style={{ textAlign: 'justify' }}>
              <strong>Nơi lưu trú tại Cao Bằng:</strong>
            </div>
            <div style={{ textAlign: 'justify' }}>&nbsp;</div>
            {data.accommodations.map((accommodation, index) => (
              <div key={index} style={{ textAlign: 'justify' }}>
                {accommodation.type} (Ảnh)
                {accommodation.image && (
                  <>
                    <br />
                    <img 
                      alt={accommodation.type}
                      src={accommodation.image}
                      style={{ height: '538px', width: '850px', maxWidth: '100%'}}
                    />
                  </>
                )}
                <div style={{ textAlign: 'justify' }}>&nbsp;</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .color-A85D00 { color: #A85D00; }
        .border-2line { border-bottom: 2px solid #A85D00; }
        .h1-name { font-size: 2.5rem; font-weight: bold; }
        .margin-top { margin-top: 20px; }
        .margin-bottom { margin-bottom: 20px; }
        .margin-top-50 { margin-top: 50px; }
        .background-white { background-color: white; }
        .padding-bottom { padding-bottom: 40px; }
        .introduct-content { font-size: 16px; line-height: 1.6; }
        .text-align-justify { text-align: justify; }
        .font-30 { font-size: 30px; }
        .border-line { 
          position: relative; 
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .border-line::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background-color: #A85D00;
        }
        .height-400 { height: 400px; object-fit: cover; }
        .height-190 { height: 190px; object-fit: cover; }
        .member-title-img { width: 100%; }
        .margin--15 { margin-right: 15px; }
        .more-photo { margin-top: 15px; }
        .link-more-photo { 
          text-decoration: none; 
          color: #A85D00; 
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .moreellipses { color: #999; }
        .morelink { 
          color: #A85D00; 
          text-decoration: none; 
          font-weight: bold;
        }
        .morelink:hover { text-decoration: underline; }
        ul { list-style: none; padding: 0; margin: 0; }
        li { margin-bottom: 10px; }
        #nonepadding { padding: 0; }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 40px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        .wow { animation-duration: 1s; }
        
        @media (max-width: 768px) {
          .h1-name { font-size: 2rem; }
          .font-30 { font-size: 24px; }
          .col-lg-4 { margin-bottom: 20px; }
          .height-400, .height-190 { height: 250px; }
        }
      `}</style>
    </div>
  );
};

export default TourismPage;