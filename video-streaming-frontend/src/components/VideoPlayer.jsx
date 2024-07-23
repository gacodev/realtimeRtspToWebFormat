// src/VideoPlayer.jsx
import React, { useState, useEffect, useRef } from 'react';
import flvjs from 'flv.js';

const VideoPlayer = ({ cameraId }) => {
  const videoRef = useRef(null);
  const flvPlayerRef = useRef(null);
  const wsRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading', 'playing', 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeoutId;

    const setupWebSocket = () => {
      wsRef.current = new WebSocket(`ws://localhost:3000/ws?cameraId=${cameraId}`);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setupFlvPlayer();
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Error al conectar con el servidor');
        setStatus('error');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        if (status === 'loading') {
          setError('La conexión con la cámara se ha cerrado');
          setStatus('error');
        }
      };
    };

    const setupFlvPlayer = () => {
      if (flvjs.isSupported()) {
        flvPlayerRef.current = flvjs.createPlayer({
          type: 'flv',
          url: `ws://localhost:3000/ws?cameraId=${cameraId}`,
          isLive: true,
        });
        flvPlayerRef.current.attachMediaElement(videoRef.current);
        flvPlayerRef.current.load();

        flvPlayerRef.current.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
          console.error('FLV player error:', errorType, errorDetail);
          setError('Error en la reproducción del video');
          setStatus('error');
        });

        flvPlayerRef.current.on(flvjs.Events.LOADING_COMPLETE, () => {
          setStatus('playing');
        });

        flvPlayerRef.current.play().catch(playError => {
          console.error('Error playing video:', playError);
          setError('Haga clic para reproducir el video');
          setStatus('error');
        });
      } else {
        setError('Su navegador no soporta FLV');
        setStatus('error');
      }
    };

    setStatus('loading');
    setError(null);

    setupWebSocket();

    // Set a timeout for 10 seconds
    timeoutId = setTimeout(() => {
      if (status === 'loading') {
        setError('Tiempo de espera agotado. Problemas para conectar con la cámara');
        setStatus('error');
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (flvPlayerRef.current) {
        flvPlayerRef.current.destroy();
      }
    };
  }, [cameraId]);

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Conectando con la cámara...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        controls
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default VideoPlayer;