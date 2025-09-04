import React from 'react';
import { Calendar, Eye, MapPin, Tag, User } from 'lucide-react';

// Demo data - sau này sẽ được thay thế bằng dữ liệu từ database
const blogData = {
  id: 1,
  title: "Khám Phá Vẻ Đẹp Huyền Bí Của Hạ Long Bay - Kỳ Quan Thế Giới",
  views: 2847,
  location: "Hạ Long, Quảng Ninh",
  category: "Điểm đến nổi tiếng",
  author: {
    name: "Nguyễn Mai Linh",
  },
  publishDate: "2024-03-15",
  content: `
    <div>
      <img src="https://cdn3.ivivu.com/2022/09/T%E1%BB%95ng-quan-du-l%E1%BB%8Bch-V%C5%A9ng-T%C3%A0u-ivivu.jpg" alt="Hạ Long Bay" style="width: 100%; border-radius: 8px; margin-bottom: 20px;" />
      
      <h2>Vịnh Hạ Long - Kỳ quan thiên nhiên thế giới</h2>
      <p>Vịnh Hạ Long là một trong những điểm đến du lịch nổi tiếng nhất Việt Nam, được UNESCO công nhận là Di sản Thiên nhiên Thế giới. Với hơn 1600 hòn đảo đá vôi nhô lên từ mặt nước xanh biếc, tạo nên một khung cảnh tuyệt đẹp như tranh vẽ.</p>
      
      <h3>Lịch sử hình thành</h3>
      <p>Theo truyền thuyết, Hạ Long Bay được hình thành từ những viên ngọc do Rồng mẹ và đàn con nhả ra để giúp dân Việt chống giặc. Tên "Hạ Long" có nghĩa là "rồng xuống", biểu tượng cho sự bảo vệ thiêng liêng của vùng đất này.</p>
      
      <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 20px 0; font-style: italic; color: #64748b;">
        "Hạ Long Bay không chỉ là một điểm du lịch, mà là một kiệt tác nghệ thuật của thiên nhiên, nơi mỗi hòn đảo đều có một câu chuyện riêng để kể."
      </blockquote>
      
      <h3>Những điểm tham quan không thể bỏ qua</h3>
      <ul>
        <li><strong>Hang Sửng Sốt:</strong> Một trong những hang động đẹp nhất và lớn nhất của vịnh</li>
        <li><strong>Đảo Titop:</strong> Nơi có bãi biển đẹp và điểm ngắm toàn cảnh vịnh từ trên cao</li>
        <li><strong>Làng chài Cửa Vạn:</strong> Trải nghiệm cuộc sống của người dân địa phương</li>
        <li><strong>Hang Luôn:</strong> Khám phá hang động bằng thuyền kayak</li>
      </ul>
      
      <img src="https://cdn3.ivivu.com/2022/09/T%E1%BB%95ng-quan-du-l%E1%BB%8Bch-V%C5%A9ng-T%C3%A0u-ivivu.jpg" alt="Hang Sửng Sốt" style="width: 100%; border-radius: 8px; margin: 20px 0;" />
      
      <h3>Trải nghiệm du thuyền qua đêm</h3>
      <p>Một trong những cách tuyệt vời nhất để khám phá Hạ Long là tham gia tour du thuyền qua đêm. Bạn sẽ được:</p>
      <ul>
        <li>Ngắm hoàng hôn trên vịnh với màu sắc rực rỡ</li>
        <li>Thưởng thức hải sản tươi ngon trên du thuyền</li>
        <li>Tham gia câu mực đêm - trải nghiệm thú vị</li>
        <li>Thức dậy trong khung cảnh bình minh tuyệt đẹp</li>
      </ul>
      
      <h3>Lời khuyên cho chuyến đi</h3>
      <p><strong>Thời gian tốt nhất:</strong> Từ tháng 10 đến tháng 4 năm sau, thời tiết mát mẻ và ít mưa.</p>
      <p><strong>Chuẩn bị:</strong> Nên mang theo áo ấm, kem chống nắng, và máy ảnh để ghi lại những khoảnh khắc đẹp.</p>
      <p><strong>Lưu ý:</strong> Hãy tôn trọng môi trường và không vứt rác xuống biển để bảo vệ vẻ đẹp thiên nhiên này cho thế hệ tương lai.</p>
      
      <img src="https://cdn3.ivivu.com/2022/09/T%E1%BB%95ng-quan-du-l%E1%BB%8Bch-V%C5%A9ng-T%C3%A0u-ivivu.jpg" alt="Hoàng hôn Hạ Long" style="width: 100%; border-radius: 8px; margin-top: 20px;" />
    </div>
  `
};

const TravelBlogPageData = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header thông tin bài viết */}
      <div className="mb-8">
        {/* Tiêu đề */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
          {blogData.title}
        </h1>
        
        {/* Thông tin meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
          {/* Lượt xem */}
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{blogData.views.toLocaleString()} lượt xem</span>
          </div>
          
          {/* Địa điểm */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{blogData.location}</span>
          </div>
          
          {/* Category */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {blogData.category}
            </span>
          </div>
        </div>
        
        {/* Thông tin tác giả và ngày đăng */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3">
            
            <div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">{blogData.author.name}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date(blogData.publishDate).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>
      
      {/* Nội dung bài viết */}
      <div className="prose prose-lg max-w-none">
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blogData.content }}
        />
      </div>
      
      {/* CSS cho nội dung blog */}
      <style jsx>{`
        .blog-content {
          line-height: 1.8;
        }
        
        .blog-content h2 {
          color: #1f2937;
          font-size: 1.75rem;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        
        .blog-content h3 {
          color: #374151;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.5rem 0 1rem 0;
        }
        
        .blog-content p {
          margin: 1rem 0;
          color: #4b5563;
          font-size: 1rem;
        }
        
        .blog-content ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .blog-content li {
          margin: 0.5rem 0;
          color: #4b5563;
        }
        
        .blog-content img {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .blog-content blockquote {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        
        .blog-content strong {
          color: #1f2937;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default TravelBlogPageData;