import React, { useEffect, useRef, useState } from 'react';
import './VideoPlayer.css'; // Asegúrate de tener los estilos en un archivo CSS

const VideoPlayer = ({ cameraId }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = `http://localhost:3000/stream/${cameraId}`;
      videoRef.current.onloadeddata = () => {
        setIsLoading(false); // Oculta el texto de carga cuando el video está cargado
        videoRef.current.play(); // Reproducir automáticamente cuando esté cargado
      };
      videoRef.current.onerror = (e) => {
        console.error('Video error:', e);
        setIsLoading(false); // Ocultar texto en caso de error
      };
    }
  }, [cameraId]);

  return (
    <div className="video-player-container">
      {isLoading && (
        <div className="loading-text">
          <p>Loading video...</p>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        muted
        autoPlay
        playsInline
        className="video-player"
      />
    </div>
  );
};

export default VideoPlayer;
