import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const cameraId = 'default_camera';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">Live Stream</h1>
      <VideoPlayer cameraId={cameraId} />
    </div>
  );
};

export default App;