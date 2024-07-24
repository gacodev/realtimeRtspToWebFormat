import express from 'express';
import cors from 'cors';
import ffmpeg from 'fluent-ffmpeg';
import { Camera, connectDB } from './db.js';

const app = express();
app.use(cors());
connectDB();

app.get('/stream/:cameraId', async (req, res) => {
  try {
    const camera = await Camera.findOne({ id: req.params.cameraId });
    if (!camera) {
      return res.status(404).send('Camera not found');
    }

    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Transfer-Encoding': 'chunked'
    });

    const command = ffmpeg(camera.rtspUrl)
      .inputOptions([
        '-rtsp_transport tcp',
        '-buffer_size 1024000'
      ])
      .outputOptions([
        '-preset veryfast', 
        '-tune zerolatency', 
        '-f mp4',
        '-movflags frag_keyframe+empty_moov',
        '-g 50',
        '-crf 20', 
        '-maxrate 2000k', 
        '-bufsize 4000k'
      ])
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
      });

    const ffstream = command.pipe();
    ffstream.pipe(res);

  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
