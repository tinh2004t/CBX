import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // để lấy slug từ URL
import { Calendar, Eye, MapPin, Tag, User } from 'lucide-react';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import blogAPI from '../../api/blogApi';

const TravelBlogPageData = () => {
  const { slug } = useParams(); // URL: /blog/:slug
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      // gọi API unified để lấy cả metadata + content + views
      const response = await blogAPI.getPostBySlugUnified(slug);

      if (response.success) {
        setPost(response.data);
      } else {
        setError('Không tìm thấy bài viết');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Lỗi khi tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-20">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center text-gray-600 py-20">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header thông tin bài viết */}
      <div className="mb-8">
        {/* Tiêu đề */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Thông tin meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{(post.views || 0).toLocaleString()} lượt xem</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{post.location?.city || post.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {post.category}
            </span>
          </div>
        </div>

        {/* Tác giả + ngày đăng */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">{post.author?.name}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.publishDate).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Nội dung */}
      <div className="prose prose-lg max-w-none">
        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

      </div>

      {/* CSS cho nội dung */}
      
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
      <style dangerouslySetInnerHTML={{
            __html: `
    /* Force display và override tất cả */
    .ql-editor h1,
    .ql-editor h2,
    .ql-editor h3,
    .ql-editor h4,
    .ql-editor h5,
    .ql-editor h6 {
      display: block !important;
      font-weight: 700 !important;
      line-height: 1.2 !important;
      margin: 0.5em 0 !important;
    }
    
    .ql-editor h1 { font-size: 2em !important; }
    .ql-editor h2 { font-size: 1.5em !important; }
    .ql-editor h3 { font-size: 1.17em !important; }
    .ql-editor h4 { font-size: 1em !important; }
    .ql-editor h5 { font-size: 0.83em !important; }
    .ql-editor h6 { font-size: 0.67em !important; }
    
    /* Remove border/padding */
    .ql-editor {
      border: none !important;
      padding: 0 !important;
    }
  `
          }} />
    </div>
  );
};

export default TravelBlogPageData;
