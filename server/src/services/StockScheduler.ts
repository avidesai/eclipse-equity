// src/services/StockScheduler.ts

import cron from 'node-cron';
import Stock from '../models/stock';
import StockDataFetcher from '../scripts/StockDataFetcher';

class StockScheduler {
  private static instance: StockScheduler;
  private tasks: cron.ScheduledTask[] = [];
  private isUpdating: boolean = false;

  private constructor() {}

  public static getInstance(): StockScheduler {
    if (!StockScheduler.instance) {
      StockScheduler.instance = new StockScheduler();
    }
    return StockScheduler.instance;
  }

  private isMarketOpen(nyTime: Date): boolean {
    const hour = nyTime.getHours();
    const minute = nyTime.getMinutes();
    const dayOfWeek = nyTime.getDay();

    // Check if it's a weekday (Monday = 1, Friday = 5)
    if (dayOfWeek < 1 || dayOfWeek > 5) return false;

    // Check if it's during market hours (9:30 AM - 4:00 PM ET)
    return (
      (hour === 9 && minute >= 30) ||
      (hour > 9 && hour < 16) ||
      (hour === 16 && minute === 0)
    );
  }

  public async updateStocks(forceUpdate: boolean = false): Promise<void> {
    if (this.isUpdating) {
      console.log('🔄 Update already in progress, skipping...');
      return;
    }

    try {
      this.isUpdating = true;
      const now = new Date();
      const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

      if (!forceUpdate && !this.isMarketOpen(nyTime)) {
        console.log('📅 Market is closed, skipping update');
        return;
      }

      console.log(`✅ Starting stock update... ${forceUpdate ? '(Forced Update)' : ''}`);
      const stocks = await Stock.find();
      const fetcher = StockDataFetcher.getInstance();

      // Use Promise.all with a chunk size to avoid overwhelming the API
      const chunkSize = 5;
      for (let i = 0; i < stocks.length; i += chunkSize) {
        const chunk = stocks.slice(i, i + chunkSize);
        await Promise.all(
          chunk.map(async (stock) => {
            console.log(`🔄 Updating ${stock.symbol}...`);
            try {
              await fetcher.updateStockData(stock);
            } catch (error) {
              console.error(`❌ Error updating ${stock.symbol}:`, error);
            }
          })
        );
      }

      console.log('✅ All stocks updated successfully');
    } catch (error) {
      console.error('❌ Error updating stocks:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  public startScheduler(): void {
    // Run an initial update when the server starts, regardless of market hours
    console.log('🚀 Running initial server start update...');
    this.updateStocks(true);

    // Pre-market update at 9:15 AM ET
    this.tasks.push(
      cron.schedule('15 9 * * 1-5', async () => {
        console.log('🌅 Running pre-market update...');
        await this.updateStocks();
      }, {
        timezone: 'America/New_York'
      })
    );

    // Market open update at 9:31 AM ET
    this.tasks.push(
      cron.schedule('31 9 * * 1-5', async () => {
        console.log('🔔 Running market open update...');
        await this.updateStocks();
      }, {
        timezone: 'America/New_York'
      })
    );

    // Regular updates every 15 minutes during market hours
    this.tasks.push(
      cron.schedule('*/15 10-15 * * 1-5', async () => {
        console.log('⏰ Running scheduled market hours update...');
        await this.updateStocks();
      }, {
        timezone: 'America/New_York'
      })
    );

    // Market close updates at 4:01 PM and 4:15 PM ET
    ['1 16 * * 1-5', '15 16 * * 1-5'].forEach(schedule => {
      this.tasks.push(
        cron.schedule(schedule, async () => {
          console.log('🔔 Running market close update...');
          await this.updateStocks(true);
        }, {
          timezone: 'America/New_York'
        })
      );
    });

    console.log('🚀 Stock scheduler initialized');
  }

  public stopScheduler(): void {
    this.tasks.forEach(task => {
      task.stop();
    });
    this.tasks = [];
    console.log('⏹️ Stock scheduler stopped');
  }
}

export default StockScheduler;