// src/services/StockScheduler.ts

import cron from 'node-cron';
import Stock from '../models/stock';
import StockDataFetcher from '../scripts/StockDataFetcher';

class StockScheduler {
  private static instance: StockScheduler;
  private task: cron.ScheduledTask | null = null;

  private constructor() {}

  public static getInstance(): StockScheduler {
    if (!StockScheduler.instance) {
      StockScheduler.instance = new StockScheduler();
    }
    return StockScheduler.instance;
  }

  private async updateStocks(): Promise<void> {
    try {
      console.log('✅ Starting stock update...');
      const stocks = await Stock.find();
      const fetcher = StockDataFetcher.getInstance();

      for (const stock of stocks) {
        console.log(`🔄 Updating ${stock.symbol}...`);
        await fetcher.updateStockData(stock);
      }
      console.log('✅ All stocks updated successfully');
    } catch (error) {
      console.error('❌ Error updating stocks:', error);
    }
  }

  public startScheduler(): void {
    // Schedule updates every 30 minutes during market hours (9:30 AM to 4:00 PM EST, Monday-Friday)
    this.task = cron.schedule('*/30 9-16 * * 1-5', async () => {
      const now = new Date();
      const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const hour = nyTime.getHours();
      const minute = nyTime.getMinutes();

      // Only run between 9:30 AM and 4:00 PM ET
      if ((hour === 9 && minute >= 30) || (hour > 9 && hour < 16) || (hour === 16 && minute === 0)) {
        console.log(`⏰ Starting scheduled stock update at ${nyTime.toLocaleString()}...`);
        await this.updateStocks();
      }
    }, {
      timezone: 'America/New_York'
    });

    // Initial update when server starts during market hours
    const now = new Date();
    const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const hour = nyTime.getHours();
    const minute = nyTime.getMinutes();
    const dayOfWeek = nyTime.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5 && // Monday-Friday
        ((hour === 9 && minute >= 30) || (hour > 9 && hour < 16) || (hour === 16 && minute === 0))) {
      console.log('🚀 Running initial market hours update...');
      this.updateStocks();
    }

    console.log('🚀 Stock scheduler initialized');
  }

  public stopScheduler(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log('⏹️ Stock scheduler stopped');
    }
  }
}

export default StockScheduler;