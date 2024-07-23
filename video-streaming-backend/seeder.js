// seeder.js
import { connectDB, Camera } from './db.js';
import mongoose from 'mongoose';

const seedDatabase = async () => {
  await connectDB();

  const cameraId = 'default_camera'; // Puedes cambiar este ID a lo que prefieras
  const rtspUrl = process.env.RTSP_URL;

  const camera = await Camera.findOneAndUpdate(
    { id: cameraId },
    { rtspUrl },
    { upsert: true, new: true }
  );

  console.log('Database seeded with camera:', camera);

  mongoose.disconnect();
};

seedDatabase();
