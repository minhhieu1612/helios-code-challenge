import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { StudentModel } from '../src/models/studentModel';

dotenv.config();

const sampleStudents = [
  {
    name: 'Alice Johnson',
    dateOfBirth: new Date('2001-03-15'),
    gender: 'female',
  },
  {
    name: 'Bob Smith',
    dateOfBirth: new Date('2000-07-22'),
    gender: 'male',
  },
  {
    name: 'Charlie Davis',
    dateOfBirth: new Date('2002-11-05'),
    gender: 'other',
  },
  {
    name: 'Diana Prince',
    dateOfBirth: new Date('1999-04-12'),
    gender: 'female',
  },
  {
    name: 'Ethan Hunt',
    dateOfBirth: new Date('2001-09-30'),
    gender: 'male',
  },
];

const seedDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_db';
    console.log(`[Seed Script] Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI);

    console.log('[Seed Script] Clearing existing student records...');
    await StudentModel.deleteMany({});

    console.log('[Seed Script] Inserting sample student records...');
    const inserted = await StudentModel.insertMany(sampleStudents);
    console.log(`[Seed Script] Successfully seeded ${inserted.length} students into database!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script] Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
