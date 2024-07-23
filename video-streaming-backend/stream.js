// stream.js
import express from 'express';
import { PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import { Camera } from './db.js';

const app = express();
app.use(express.json());

app.get('/', async(req, res) => {
  res.send('Video streaming server');
});

app.get('/api/stream', async (req, res) => {
  const { cameraId } = req.query;
  
  if (!cameraId) {
    return res.status(400).json({ error: 'Missing cameraId parameter' });
  }

  const camera = await Camera.findOne({ id: cameraId });
  
  if (!camera) {
    return res.status(404).json({ error: 'Camera not found' });
  }

  const rtspUrl = camera.rtspUrl;
  const videoStream = new PassThrough();

  let isConnected = false;
  const timeoutDuration = 10000; // 10 segundos

  const ffmpegProcess = ffmpeg(rtspUrl)
    .inputOptions('-rtsp_transport', 'tcp')
    .outputFormat('flv')
    .videoCodec('libx264')
    .audioCodec('aac')
    .outputOptions('-preset', 'veryfast')
    .on('start', () => {
      console.log('FFmpeg process started');
    })
    .on('error', (err) => {
      console.error('FFmpeg error:', err);
      if (!isConnected) {
        res.status(503).json({ error: 'Camera not available' });
      }
    })
    .on('end', () => {
      console.log('FFmpeg process ended');
      if (!isConnected) {
        res.status(503).json({ error: 'Camera not available' });
      }
    });

  const timeout = setTimeout(() => {
    if (!isConnected) {
      ffmpegProcess.kill('SIGKILL');
      res.status(503).json({ error: 'Camera not available' });
    }
  }, timeoutDuration);

  ffmpegProcess.pipe(videoStream, { end: true });

  videoStream.on('data', () => {
    if (!isConnected) {
      isConnected = true;
      clearTimeout(timeout);
      console.log('Stream connected successfully');
    }
  });

  videoStream.pipe(res);

  req.on('close', () => {
    console.log('Client disconnected');
    ffmpegProcess.kill('SIGKILL');
  });
});


export default app;
