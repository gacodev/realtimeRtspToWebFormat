// server.js
import http from 'http';
import app from './stream.js';
import createWebSocketServer from './ws.js';
import { connectDB } from './db.js';

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  createWebSocketServer(server);

  server.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
};

startServer();
