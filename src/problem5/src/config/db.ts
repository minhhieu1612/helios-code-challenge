import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_db';
    await mongoose.connect(mongoURI);
    console.log(`[Database] MongoDB connected successfully to ${mongoURI}`);
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error);
    process.exit(1);
  }
};
