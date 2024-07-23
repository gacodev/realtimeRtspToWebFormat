// ws.js
import WebSocket, { WebSocketServer } from 'ws';
import axios from 'axios';

const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const cameraId = params.get('cameraId');

    if (!cameraId) {
      ws.close(1008, 'Missing cameraId parameter');
      return;
    }

    console.log(`Client connected for cameraId: ${cameraId}`);

    try {
      const response = await axios.get(`http://localhost:3000/api/stream?cameraId=${cameraId}`, {
        responseType: 'stream',
      });

      response.data.on('data', (chunk) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(chunk);
        }
      });

      response.data.on('end', () => {
        console.log(`Stream ended for cameraId: ${cameraId}`);
        ws.close(1000, 'Stream ended');
      });

      response.data.on('error', (error) => {
        console.error(`Stream error for cameraId: ${cameraId}:`, error);
        ws.close(1011, 'Stream error');
      });

    } catch (error) {
      console.error('Error fetching stream:', error);
      ws.close(1011, 'Internal server error');
    }

    ws.on('close', (code, reason) => {
      console.log(`Client disconnected for cameraId: ${cameraId}. Code: ${code}, Reason: ${reason}`);
    });
  });

  return wss;
};

export default createWebSocketServer;