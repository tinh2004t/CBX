import React, { useState, useEffect, useRef } from 'react';
import VideoModal from './VideoModal';
import settingAPI from '../../api/settingApi';

const VideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  /**
   * Extract YouTube video ID from various URL formats
   * Supports:
   * - https://www.youtube.com/watch?v=VIDEO_ID
   * - https://youtu.be/VIDEO_ID
   * - https://www.youtube.com/embed/VIDEO_ID
   */
  const extractVideoId = (url) => {
    if (!url) return null;
    
    try {
      const urlObj = new URL(url);
      
      // Format: youtube.com/watch?v=VIDEO_ID
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
        return urlObj.searchParams.get('v');
      }
      
      // Format: youtu.be/VIDEO_ID
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      
      // Format: youtube.com/embed/VIDEO_ID
      if (urlObj.pathname.includes('/embed/')) {
        return urlObj.pathname.split('/embed/')[1];
      }
      
      return null;
    } catch (error) {
      console.error('Invalid URL:', url, error);
      return null;
    }
  };

  // Check scroll position and update arrow visibility
  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Scroll left
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  };

  // Scroll right
  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy settings từ API
        const response = await settingAPI.getSettings();
        
        if (!response.success || !response.data) {
          throw new Error('Không thể tải dữ liệu settings');
        }

        const videoUrls = response.data.videoUrls || [];
        
        if (videoUrls.length === 0) {
          setVideoData([]);
          setLoading(false);
          return;
        }

        // Extract video IDs và load data cho mỗi video
        const videos = await Promise.all(
          videoUrls.map(async (url) => {
            const videoId = extractVideoId(url);
            
            if (!videoId) {
              console.error('Không thể extract video ID từ URL:', url);
              return null;
            }

            try {
              // Lấy thông tin video từ YouTube oEmbed API
              const oembedResponse = await fetch(
                `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
              );
              
              if (!oembedResponse.ok) {
                throw new Error('Failed to fetch video data');
              }
              
              const data = await oembedResponse.json();
              
              return {
                id: videoId,
                url: url,
                title: data.title || 'Video Title',
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                thumbnailAlt: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
           
              };
            } catch (error) {
              console.error(`Error loading data for video ${videoId}:`, error);
              
              // Fallback data nếu API fails
              return {
                id: videoId,
                url: url,
                title: 'Video không có tiêu đề',
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                thumbnailAlt: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
              
              };
            }
          })
        );

        // Filter out null values (invalid URLs)
        const validVideos = videos.filter(video => video !== null);
        setVideoData(validVideos);
        
      } catch (error) {
        console.error('Error loading videos:', error);
        setError(error.message || 'Có lỗi xảy ra khi tải video');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Update scroll buttons after videos load and on scroll
  useEffect(() => {
    if (videoData.length > 0) {
      // Initial check
      setTimeout(updateScrollButtons, 100);
      
      // Add scroll event listener
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);
        
        return () => {
          container.removeEventListener('scroll', updateScrollButtons);
          window.removeEventListener('resize', updateScrollButtons);
        };
      }
    }
  }, [videoData]);

  const handleVideoClick = (videoId) => {
    setSelectedVideo(videoId);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="youtube">
        <section className="video-section">
          <div className="container">
            <h2 className="section-title">Video</h2>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Đang tải video...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="youtube">
        <section className="video-section">
          <div className="container">
            <h2 className="section-title">Video</h2>
            <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
              <p>Lỗi: {error}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Empty state
  if (videoData.length === 0) {
    return (
      <div className="youtube">
        <section className="video-section">
          <div className="container">
            <h2 className="section-title">Video</h2>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Chưa có video nào</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const showScrollButtons = videoData.length > 3;

  return (
    <div className="youtube">
      <section className="video-section">
        <div className="container">
          <h2 className="section-title">Video</h2>
          
          <div className="video-carousel-wrapper" style={{ position: 'relative' }}>
            {/* Left Arrow */}
            {showScrollButtons && canScrollLeft && (
              <button
                className="scroll-arrow scroll-arrow-left"
                onClick={scrollLeft}
                aria-label="Scroll left"
                style={{
                  position: 'absolute',
                  left: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}

            {/* Video Grid with Scroll */}
            <div 
              ref={scrollContainerRef}
              className="video-grid-scroll"
              style={{
                display: 'flex',
                gap: '20px',
                overflowX: videoData.length > 3 ? 'auto' : 'visible',
                scrollBehavior: 'smooth',
                padding: '10px 0',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
              }}
            >
              <style>
                {`
                  .video-grid-scroll::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, Opera */
                  }
                `}
              </style>
              
              {videoData.map((video) => (
                <div 
                  key={video.id}
                  className="video-item" 
                  onClick={() => handleVideoClick(video.id)}
                  style={{ 
                    cursor: 'pointer',
                    minWidth: videoData.length > 3 ? 'calc(33.333% - 14px)' : 'calc(33.333% - 14px)',
                    flex: videoData.length > 3 ? '0 0 auto' : '1',
                  }}
                >
                  <div className="video-thumbnail">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      onError={(e) => {
                        e.target.src = video.thumbnailAlt;
                      }}
                    />
                    <div className="play-button">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <circle cx="30" cy="30" r="30" fill="rgba(255, 0, 0, 0.8)" />
                        <polygon points="22,18 22,42 42,30" fill="white" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="video-title">{video.title}</h3>
                  {video.author && (
                    <p className="video-author" style={{ 
                      fontSize: '0.9em', 
                      color: '#666', 
                      marginTop: '5px' 
                    }}>
                      {video.author}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {showScrollButtons && canScrollRight && (
              <button
                className="scroll-arrow scroll-arrow-right"
                onClick={scrollRight}
                aria-label="Scroll right"
                style={{
                  position: 'absolute',
                  right: '-20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {selectedVideo && (
        <VideoModal 
          videoId={selectedVideo} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default VideoSection;