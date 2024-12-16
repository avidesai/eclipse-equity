// index.ts

import app from './app';
import connectDB from './config/db';
import environment from './config/environment';

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(environment.PORT, () => {
      console.log(`✅ Server is running on port ${environment.PORT}`);
      console.log(`🌍 Environment: ${environment.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });