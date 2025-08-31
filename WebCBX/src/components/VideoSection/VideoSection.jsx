import React, { useState, useEffect } from 'react';
import VideoModal from './VideoModal';

const VideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoData, setVideoData] = useState([]);

  const videoIds = [
    'EUm6py_f888',
    'YFycbgNwzLE', 
    'oHHe01KoRfg'
  ];

  useEffect(() => {
    // Load video data for each video ID
    const loadVideoData = async () => {
      const videos = await Promise.all(
        videoIds.map(async (videoId) => {
          try {
            // Get video title from YouTube oEmbed API
            const response = await fetch(
              `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`
            );
            const data = await response.json();
            
            return {
              id: videoId,
              title: data.title || 'Video Title',
              thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              duration: '0:00' // Duration would need YouTube API key
            };
          } catch (error) {
            console.error('Error loading video data:', error);
            return {
              id: videoId,
              title: 'Video Title',
              thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              duration: '0:00'
            };
          }
        })
      );
      setVideoData(videos);
    };

    loadVideoData();
  }, []);

  const handleVideoClick = (videoId) => {
    setSelectedVideo(videoId);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="youtube">
      <section className="video-section">
        <div className="container">
          <h2 className="section-title">Video</h2>
          <div className="video-grid">
            {videoData.map((video) => (
              <div 
                key={video.id}
                className="video-item" 
                onClick={() => handleVideoClick(video.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt="Video thumbnail" />
                  <div className="play-button">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <circle cx="30" cy="30" r="30" fill="rgba(255, 0, 0, 0.8)" />
                      <polygon points="22,18 22,42 42,30" fill="white" />
                    </svg>
                  </div>
                  {video.duration && (
                    <div className="video-duration">{video.duration}</div>
                  )}
                </div>
                <h3 className="video-title">{video.title}</h3>
              </div>
            ))}
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