import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Server] Server running in mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[Server] Listening on http://localhost:${PORT}`);
    console.log(`[Server] Swagger Documentation available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();
