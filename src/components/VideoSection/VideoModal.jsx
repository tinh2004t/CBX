import React, { useEffect } from 'react';

const VideoModal = ({ videoId, onClose }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle ESC key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleModalClick = (e) => {
    // Close modal if clicking on backdrop
    if (e.target.classList.contains('video-modal')) {
      onClose();
    }
  };

  return (
    <div 
      className="video-modal" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={handleModalClick}
    >
      <div 
        className="modal-content" 
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '800px',
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <button 
          className="close-modal"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 10000,
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          &times;
        </button>
        <div className="video-container">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            width="100%"
            height="450"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;