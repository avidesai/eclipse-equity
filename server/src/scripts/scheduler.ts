// src/scripts/scheduler.ts

import cron from 'node-cron';
import mongoose from 'mongoose';
import Stock from '../models/stock';
import StockDataFetcher from './StockDataFetcher';
import dotenv from 'dotenv';

dotenv.config();

const updateStocks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!, {
        // Remove useNewUrlParser and useUnifiedTopology as they're no longer needed
      });
    console.log('✅ Connected to MongoDB');

    const stocks = await Stock.find();
    const fetcher = StockDataFetcher.getInstance();

    for (const stock of stocks) {
      console.log(`🔄 Updating ${stock.symbol}...`);
      await fetcher.updateStockData(stock);
    }

    console.log('✅ All stocks updated successfully');
  } catch (error) {
    console.error('❌ Error updating stocks:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

// Schedule updates during market hours (9:30 AM to 4:00 PM EST, Monday-Friday)
cron.schedule('*/15 9-16 * * 1-5', () => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Only run between 9:30 AM and 4:00 PM
  if ((hour === 9 && minute >= 30) || (hour > 9 && hour < 16)) {
    console.log('⏰ Starting scheduled stock update...');
    updateStocks();
  }
}, {
  timezone: 'America/New_York'
});

// Run once when the script starts
console.log('🚀 Starting initial stock update...');
updateStocks();