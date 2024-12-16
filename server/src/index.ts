// index.ts

import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
