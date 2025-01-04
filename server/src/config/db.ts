// /src/config/db.ts

import mongoose from 'mongoose';
import environment from './environment';

const connectDB = async () => {
  try {
    await mongoose.connect(environment.MONGO_URI!);
    console.log(`✅ MongoDB Connected (${environment.NODE_ENV} environment)`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;