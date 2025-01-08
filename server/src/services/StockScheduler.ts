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
    // Schedule updates during market hours (9:30 AM to 4:00 PM EST, Monday-Friday)
    this.task = cron.schedule('*/15 9-16 * * 1-5', () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Only run between 9:30 AM and 4:00 PM
      if ((hour === 9 && minute >= 30) || (hour > 9 && hour < 16)) {
        console.log('⏰ Starting scheduled stock update...');
        this.updateStocks();
      }
    }, {
      timezone: 'America/New_York'
    });

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