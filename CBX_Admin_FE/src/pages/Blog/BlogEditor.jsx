import React, { useState, useEffect, useRef } from 'react';
import { Save, ArrowLeft, Eye, X, Calendar, MapPin, Tag, User } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import blogAPI from '../../api/blogApi';

const BlogEditor = ({ currentUser }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const blogSlug = searchParams.get('slug');
  const blogId = searchParams.get('id'); // Fallback support
  const [isFullyInitialized, setIsFullyInitialized] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '<p>Nội dung đang được cập nhật...</p>',
    category: 'Du lịch',
    location: {
      city: ''
    },
    author: {
      name: currentUser?.name || currentUser?.username || ''
    },
    image: '',
    publishDate: new Date().toISOString().split('T')[0],
    status: 'published'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(!!(blogSlug || blogId));
  const [error, setError] = useState(null);
  const [currentBlogSlug, setCurrentBlogSlug] = useState(blogSlug);
  const [isEditMode, setIsEditMode] = useState(false);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  // Categories and cities
  const categories = ['Du lịch', 'Ẩm thực', 'Phiêu lưu', 'Nghỉ dưỡng', 'Văn hóa', 'Lễ hội'];
  const cities = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Huế', 'Nha Trang', 'Đà Lạt', 'Vũng Tàu', 'Phan Thiết',
    'Hạ Long', 'Sapa', 'Hội An', 'Quảng Ninh', 'Lào Cai'
  ];

  // Load existing blog data if editing
  useEffect(() => {
    console.log('URL params:', { blogSlug, blogId }); // Thêm dòng này
    if (blogSlug) {
      console.log('Loading by slug:', blogSlug);
      setIsEditMode(true);
      loadBlogDataBySlugUnified(blogSlug);
    } else if (blogId) {
      console.log('Loading by id (fallback):', blogId);
      setIsEditMode(true);
      loadBlogDataById(blogId);
    } else {
      console.log('Creating new blog');
      setIsEditMode(false);
      setLoadingBlog(false);
    }
  }, [blogSlug, blogId]);



  // useEffect đơn giản cho npm version
  useEffect(() => {
    if (quillRef.current && !quillInstance.current && !loadingBlog && formData.content) {
      console.log('Initializing Quill...');
      initializeQuill();
    }
  }, [loadingBlog, formData.content]);


  // Reset instance khi slug thay đổi
  useEffect(() => {
    const currentSlugOrId = blogSlug || blogId || 'new';
    const prevSlugOrId = currentBlogSlug || 'new';

    if (currentSlugOrId !== prevSlugOrId) {
      console.log('Slug changed, cleaning up instance...', { from: prevSlugOrId, to: currentSlugOrId });

      // Chỉ cleanup instance, không reset quillLoaded
      if (quillInstance.current) {
        try {
          const container = quillInstance.current.container;
          if (container && container.parentNode) {
            container.innerHTML = '';
          }
        } catch (e) {
          console.warn('Error cleaning up Quill instance:', e);
        }
        quillInstance.current = null;
      }

      setIsFullyInitialized(false);

      if (quillRef.current) {
        quillRef.current.innerHTML = '';
      }
    }
  }, [blogSlug, blogId, currentBlogSlug]);
  // Bỏ formData.content khỏi dependency
  //   useEffect(() => {
  //   if (quillLoaded && quillInstance.current && formData.content && !loadingBlog) {
  //     console.log('Force updating Quill content:', formData.content);
  //     const delta = quillInstance.current.clipboard.convert(formData.content);
  //     quillInstance.current.setContents(delta);
  //   }
  // }, [quillLoaded, formData.content, loadingBlog]);

  // 🚀 NEW: Load blog data using unified API
  const loadBlogDataBySlugUnified = async (slug) => {
    console.log('Loading blog with unified API, slug:', slug);
    setLoadingBlog(true);
    setError(null);

    try {
      // Use the new unified method to get both metadata and content in one call
      console.log('Calling getPostForEdit...');
      const response = await blogAPI.getPostForEdit(slug);

      console.log('Unified response:', response);

      if (response && response.success) {
        const blog = response.data;
        console.log('Blog data received:', blog);

        setCurrentBlogSlug(blog.slug);

        const newFormData = {
          title: blog.title || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '<p>Nội dung đang được cập nhật...</p>',
          category: blog.category || 'Du lịch',
          location: { city: blog.location?.city || '' },
          author: { name: blog.author?.name || currentUser?.username || '' },
          image: blog.image || '',
          publishDate: blog.publishDate
            ? new Date(blog.publishDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          status: blog.status || 'published'
        };

        console.log('Setting formData:', newFormData);
        setFormData(newFormData);
        setTimeout(() => {
          if (quillInstance.current) {
            quillInstance.current.enable(true);
          }
        }, 100);
        console.log('Content loaded:', newFormData.content);
      } else {
        console.error('Unified response failed:', response);
        setError(response?.message || 'Không thể tải dữ liệu blog');
      }
    } catch (err) {
      console.error('Error loading blog data with unified API:', err);

      // Fallback to separate calls if unified method fails
      console.log('Falling back to separate API calls...');
      try {
        await loadBlogDataBySlugSeparate(slug);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
        setError(err.message || 'Không thể tải dữ liệu blog');
      }
    } finally {
      console.log('Finished loading blog data');
      setLoadingBlog(false);
    }
  };



  // Fallback method using separate API calls
  const loadBlogDataBySlugSeparate = async (slug) => {
    console.log('Using separate API calls for slug:', slug);

    try {
      // Get metadata first
      const postRes = await blogAPI.getPostBySlug(slug);
      console.log('Post metadata response:', postRes);

      if (postRes && postRes.success) {
        const blog = postRes.data;
        setCurrentBlogSlug(blog.slug);

        const baseFormData = {
          title: blog.title || '',
          excerpt: blog.excerpt || '',
          content: '<p>Nội dung đang được cập nhật...</p>',
          category: blog.category || 'Du lịch',
          location: { city: blog.location?.city || '' },
          author: { name: blog.author?.name || currentUser?.username || '' },
          image: blog.image || '',
          publishDate: blog.publishDate
            ? new Date(blog.publishDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          status: blog.status || 'published'
        };

        setFormData(baseFormData);

        // Get content separately
        try {
          console.log('Loading content for slug:', slug);
          const dataRes = await blogAPI.getPostData(slug);
          console.log('Content response:', dataRes);

          if (dataRes && dataRes.success && dataRes.data && dataRes.data.content) {
            console.log('Updating content');
            setFormData(prev => ({
              ...prev,
              content: dataRes.data.content
            }));
          }
        } catch (contentError) {
          console.warn('Could not load content, using default:', contentError.message);
        }
      } else {
        throw new Error(postRes?.message || 'Không thể tải metadata blog');
      }
    } catch (err) {
      throw err;
    }
  };

  // Fallback for ID-based loading (backward compatibility)
  const loadBlogDataById = async (id) => {
    console.log('Loading by ID (fallback):', id);
    setLoadingBlog(true);
    setError(null);

    try {
      const postRes = await blogAPI.getPostById(id);
      console.log('Post by ID response:', postRes);

      if (postRes.success) {
        const blog = postRes.data;
        setCurrentBlogSlug(blog.slug);

        setFormData({
          title: blog.title || '',
          excerpt: blog.excerpt || '',
          content: '<p>Nội dung đang được cập nhật...</p>',
          category: blog.category || 'Du lịch',
          location: { city: blog.location?.city || '' },
          author: { name: blog.author?.name || currentUser?.username || '' },
          image: blog.image || '',
          publishDate: blog.publishDate
            ? new Date(blog.publishDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          status: blog.status || 'published'
        });

        // Try to get content if we have a slug
        if (blog.slug) {
          try {
            const dataRes = await blogAPI.getPostData(blog.slug);
            if (dataRes.success && dataRes.data.content) {
              setFormData(prev => ({
                ...prev,
                content: dataRes.data.content
              }));
            }
          } catch (contentError) {
            console.log('Could not load content for ID-based blog:', contentError.message);
          }
        }
      } else {
        setError(postRes.message || 'Không thể tải dữ liệu blog');
      }
    } catch (err) {
      console.error('Error loading blog data by ID:', err);
      setError(err.message || 'Không thể tải dữ liệu blog');
    } finally {
      setLoadingBlog(false);
    }
  };

  const initializeQuill = () => {
    console.log('Initializing Quill...', {
      hasRef: !!quillRef.current,
      hasInstance: !!quillInstance.current,
      loadingBlog
    });

    if (quillRef.current && !quillInstance.current && !loadingBlog) {
      // Clear container
      quillRef.current.innerHTML = '';

      try {
        quillInstance.current = new Quill(quillRef.current, {
          theme: 'snow',
          placeholder: 'Nhập nội dung blog của bạn...',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'align': [] }],
              ['link', 'image', 'video'],
              ['blockquote', 'code-block'],
              ['clean']
            ]
          }
        });

        // Set content
        const contentToSet = formData.content || '<p>Nội dung đang được cập nhật...</p>';
        quillInstance.current.root.innerHTML = contentToSet;

        quillInstance.current.on('text-change', () => {
          setFormData(prev => ({
            ...prev,
            content: quillInstance.current.root.innerHTML
          }));
        });

        setIsFullyInitialized(true);
        console.log('Quill initialized successfully');

      } catch (error) {
        console.error('Error initializing Quill:', error);
      }
    }
  };

  // Update Quill content when formData.content changes
  useEffect(() => {
    if (quillInstance.current && formData.content && !loadingBlog) {
      const currentContent = quillInstance.current.root.innerHTML;
      const newContent = formData.content;

      if (currentContent !== newContent) {
        // Temporarily disable text-change listener to avoid infinite loop
        const textChangeHandler = quillInstance.current.getModule('toolbar');

        // Update content
        quillInstance.current.root.innerHTML = newContent;

        // Re-enable by triggering a manual update
        setTimeout(() => {
          if (quillInstance.current) {
            const length = quillInstance.current.getLength();
            quillInstance.current.setSelection(length - 1, 0, 'silent');
          }
        }, 0);
      }
    }
  }, [formData.content, loadingBlog]);

  // Đồng bộ content khi cả Quill và data đều sẵn sàng
  useEffect(() => {
    if (quillInstance.current && formData.content && isFullyInitialized && !loadingBlog) {
      const currentContent = quillInstance.current.root.innerHTML;
      const newContent = formData.content;

      if (currentContent !== newContent && newContent !== '<p>Nội dung đang được cập nhật...</p>') {
        quillInstance.current.root.innerHTML = newContent;
      }
    }
  }, [formData.content, isFullyInitialized, loadingBlog]);


  // Reset state when slug changes - chỉ reset khi thực sự thay đổi slug
  useEffect(() => {
    const currentSlugOrId = blogSlug || blogId;
    const prevSlugOrId = currentBlogSlug || blogId;

    if (currentSlugOrId && currentSlugOrId !== prevSlugOrId) {
      console.log('Slug changed, resetting Quill state...', { from: prevSlugOrId, to: currentSlugOrId });

      // Reset Quill instance
      if (quillInstance.current) {
        try {
          const container = quillInstance.current.container;
          if (container && container.parentNode) {
            container.innerHTML = '';
          }
        } catch (e) {
          console.warn('Error cleaning up Quill:', e);
        }
        quillInstance.current = null;
      }

      setIsFullyInitialized(false);
      setError(null);

      // Clear container
      if (quillRef.current) {
        quillRef.current.innerHTML = '';
      }
    }
  }, [blogSlug, blogId, currentBlogSlug]);

  const checkQuillStatus = () => {
    if (quillInstance.current) {
      console.log('Quill enabled:', !quillInstance.current.container.classList.contains('ql-disabled'));
      console.log('Quill content length:', quillInstance.current.getLength());
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested objects
    if (name === 'city') {
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, city: value }
      }));
    } else if (name === 'authorName') {
      setFormData(prev => ({
        ...prev,
        author: { ...prev.author, name: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 🚀 UPDATED: Save method using unified API
  const handleSave = async () => {
    // Validate required fields
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề blog');
      return;
    }
    if (!formData.excerpt.trim()) {
      setError('Vui lòng nhập mô tả ngắn');
      return;
    }
    if (!formData.location.city) {
      setError('Vui lòng chọn địa điểm');
      return;
    }
    if (!formData.author.name.trim()) {
      setError('Vui lòng nhập tên tác giả');
      return;
    }

    // Validate image URL if provided
    if (formData.image && !formData.image.match(/^https?:\/\/.+/)) {
      setError('Hình ảnh phải là URL hợp lệ (http/https)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const currentContent = quillInstance.current
        ? quillInstance.current.root.innerHTML
        : formData.content;

      // Prepare data to save
      const dataToSave = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        category: formData.category,
        location: { city: formData.location.city },
        author: { name: formData.author.name.trim() },
        image: formData.image.trim(),
        publishDate: new Date(formData.publishDate),
        status: formData.status,
        content: currentContent // Include content for unified API
      };

      console.log('Saving data:', dataToSave);

      if (isEditMode && currentBlogSlug) {
        // 🚀 UPDATE: Use unified update method
        console.log('Updating post with unified API, slug:', currentBlogSlug);

        try {
          const updateResponse = await blogAPI.updatePostComplete(currentBlogSlug, dataToSave);
          console.log('Update response:', updateResponse);

          if (updateResponse.success) {
            // Handle slug change if it occurred
            if (updateResponse.slugChanged) {
              const { oldSlug, newSlug } = updateResponse.slugChanged;
              console.log(`Slug changed from ${oldSlug} to ${newSlug}`);
              setCurrentBlogSlug(newSlug);
              // Update URL if needed
              navigate(`/blog/edit?slug=${newSlug}`, { replace: true });
            }

            alert('Blog đã được cập nhật thành công!');
            navigate('/blog');
          } else {
            setError(updateResponse.message || 'Có lỗi xảy ra khi cập nhật blog');
          }
        } catch (updateError) {
          console.error('Unified update failed, trying fallback:', updateError);

          // Fallback to separate update calls
          try {
            if (blogId) {
              // Update metadata
              const { content, ...metadata } = dataToSave;
              const updateResponse = await blogAPI.updatePost(blogId, metadata);

              if (updateResponse.success) {
                // Update content separately
                await blogAPI.updatePostData(currentBlogSlug, { content: currentContent });
                alert('Blog đã được cập nhật thành công!');
                navigate('/blog');
              } else {
                setError(updateResponse.message || 'Có lỗi xảy ra khi cập nhật blog');
              }
            } else {
              setError('Không thể cập nhật: thiếu thông tin định danh blog');
            }
          } catch (fallbackError) {
            console.error('Fallback update also failed:', fallbackError);
            setError(fallbackError.message || 'Không thể cập nhật blog');
          }
        }
      } else {
        // 🚀 CREATE: Use existing create method (already handles content)
        console.log('Creating new post');
        const createResponse = await blogAPI.createPost(dataToSave);

        if (createResponse.success) {
          alert('Blog mới đã được tạo thành công!');
          navigate('/blog');
        } else {
          setError(createResponse.message || 'Có lỗi xảy ra khi tạo blog');
        }
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      setError(error.message || 'Không thể lưu blog. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 NEW: Quick save methods for better UX
  const handleQuickSaveContent = async () => {
    if (!currentBlogSlug) return;

    try {
      const currentContent = quillInstance.current
        ? quillInstance.current.root.innerHTML
        : formData.content;

      console.log('Quick saving content...');
      await blogAPI.updatePostContent(currentBlogSlug, currentContent);

      // Show temporary success indicator
      const originalText = 'Lưu nhanh nội dung';
      // You could add a temporary success message here
    } catch (error) {
      console.error('Quick save content failed:', error);
    }
  };

  const handleQuickSaveMetadata = async () => {
    if (!currentBlogSlug) return;

    try {
      const { content, ...metadata } = formData;
      metadata.publishDate = new Date(metadata.publishDate);

      console.log('Quick saving metadata...');
      await blogAPI.updatePostMetadata(currentBlogSlug, metadata);

      // Show temporary success indicator
    } catch (error) {
      console.error('Quick save metadata failed:', error);
    }
  };

  const getQuillPreviewContent = () => {
    if (!formData.content) return '';

    // Chỉ cần xử lý alignment, giữ nguyên cấu trúc Quill
    return formData.content
      .replace(/class="ql-align-center"/g, 'style="text-align: center;"')
      .replace(/class="ql-align-right"/g, 'style="text-align: right;"')
      .replace(/class="ql-align-left"/g, 'style="text-align: left;"')
      .replace(/class="ql-align-justify"/g, 'style="text-align: justify;"');

  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleBack = () => {
    if (window.confirm('Bạn có chắc muốn thoát? Các thay đổi chưa lưu sẽ bị mất.')) {
      navigate('/blog');
    }
  };

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold">Xem trước Blog</h3>
          <button
            onClick={() => setIsPreview(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {formData.image && (
            <img
              src={formData.image}
              alt={formData.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Tag size={16} />
              {formData.category}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              {formData.location.city}
            </div>
            <div className="flex items-center gap-1">
              <User size={16} />
              {formData.author.name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(formData.publishDate).toLocaleDateString('vi-VN')}
            </div>
          </div>

          <p className="text-lg text-gray-600 mb-6">{formData.excerpt}</p>

          {/* Content với inline styles */}
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: getQuillPreviewContent() }}
            style={{
              border: 'none',
              padding: 0,
              fontSize: '16px',
              lineHeight: 1.6
            }}
          />

          {/* Inline CSS cho preview */}
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
      </div>
    </div>
  );

  // Loading state for blog data
  if (loadingBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky  z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold">
                {isEditMode ? 'Chỉnh sửa Blog' : 'Tạo Blog Mới'}
              </h1>

            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreview(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Eye size={16} />
                <span className="hidden sm:inline">Xem trước</span>
              </button>



              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {isLoading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Có lỗi xảy ra</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tiêu đề blog..."
                    required
                  />
                  {formData.title && (
                    <p className="text-sm text-gray-500 mt-1">
                      Slug: {generateSlug(formData.title)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả ngắn *
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows="3"
                    maxLength="200"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mô tả ngắn cho blog..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.excerpt.length}/200 ký tự
                  </p>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Hình ảnh đại diện</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Dán link URL ảnh (http/https)..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {formData.image && (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }} className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Không thể tải ảnh. Vui lòng kiểm tra URL.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Nội dung</h2>
              <div
                key={`quill-${blogSlug || blogId || 'new'}`} // Thêm key này
                ref={quillRef}
                className="bg-white"
                style={{
                  minHeight: '400px',
                  display: !isFullyInitialized ? 'none' : 'block'
                }}
              />
              {!isFullyInitialized && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div className="text-gray-500 ml-3">
                    Đang tải editor...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories & Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Phân loại</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa điểm *
                  </label>
                  <select
                    name="city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn địa điểm</option>
                    {cities.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Tác giả</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên tác giả *
                </label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.author.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên tác giả..."
                  required
                />
              </div>
            </div>

            {/* Save Actions Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Thao tác lưu</h3>
              <div className="space-y-3">

                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  💾 {isLoading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật toàn bộ' : 'Tạo blog mới')}
                  <div className="text-xs text-blue-100 mt-1">
                    {isEditMode ? 'Lưu tất cả thay đổi' : 'Tạo blog và nội dung'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreview && <PreviewModal />}

      {/* Custom Styles for Quill */}
      <style jsx>{`
  /* ... existing styles ... */

  .preview-content h1,
  .preview-content h2,
  .preview-content h3,
  .preview-content h4,
  .preview-content h5,
  .preview-content h6 {
    font-weight: bold;
    margin: 1em 0 0.5em 0;
    line-height: 1.2;
  }
  
  .preview-content h1 { 
    font-size: 2em; 
    margin-top: 0.67em;
    margin-bottom: 0.67em;
  }
  .preview-content h2 { 
    font-size: 1.5em; 
    margin-top: 0.75em;
    margin-bottom: 0.75em;
  }
  .preview-content h3 { 
    font-size: 1.17em; 
    margin-top: 0.83em;
    margin-bottom: 0.83em;
  }
  .preview-content h4 { 
    font-size: 1em; 
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .preview-content h5 { 
    font-size: 0.83em; 
    margin-top: 1.17em;
    margin-bottom: 1.17em;
  }
  .preview-content h6 { 
    font-size: 0.67em; 
    margin-top: 1.33em;
    margin-bottom: 1.33em;
  }

  /* Lists styling */
  .preview-content ol {
    list-style-type: decimal;
    margin-left: 1.5em;
    margin-bottom: 1em;
  }
  
  .preview-content ul {
    list-style-type: disc;
    margin-left: 1.5em;
    margin-bottom: 1em;
  }
  
  .preview-content li {
    margin-bottom: 0.5em;
  }
  
  /* Images */
  .preview-content img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1em 0;
  }
  
  /* Paragraphs */
  .preview-content p {
    margin-bottom: 1em;
    line-height: 1.6;
  }
  
  /* Make sure inline styles take precedence */
  .preview-content [style*="text-align"] {
    text-align: inherit !important;
  }
  
  .preview-content [style*="color"] {
    color: inherit !important;
  }

  /* ... rest of existing styles ... */
`}</style>

    </div>
  );
};

export default BlogEditor;