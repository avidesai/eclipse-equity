// src/scripts/StockDataFetcher.ts

import axios from 'axios';
import Stock from '../models/stock';
import dotenv from 'dotenv';

dotenv.config();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY!;
const TIMEOUT_MS = 10000; // 10 second timeout for API calls

interface AlphaVantageQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  volume: number;
}

class StockDataFetcher {
  private static instance: StockDataFetcher;
  private lastRequestTime: number = 0;
  private readonly minRequestInterval: number = 12100; // 12.1 seconds between requests

  private constructor() {}

  public static getInstance(): StockDataFetcher {
    if (!StockDataFetcher.instance) {
      StockDataFetcher.instance = new StockDataFetcher();
    }
    return StockDataFetcher.instance;
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      const delayMs = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    this.lastRequestTime = Date.now();
  }

  private async fetchWithTimeout<T>(url: string): Promise<T> {
    await this.enforceRateLimit();
    try {
      const response = await axios.get<T>(url, { timeout: TIMEOUT_MS });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Alpha Vantage rate limit exceeded');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error(`Request timed out after ${TIMEOUT_MS}ms`);
        }
      }
      throw error;
    }
  }

  async fetchQuote(symbol: string): Promise<AlphaVantageQuote | null> {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const data = await this.fetchWithTimeout<any>(url);
      
      const quote = data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        console.warn(`No quote data found for ${symbol}`);
        return null;
      }

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume'], 10)
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  private calculateMetrics(stock: any, quote: AlphaVantageQuote): Record<string, number> {
    const metrics: Record<string, number> = {};

    // Basic metrics from quote
    metrics.price = quote.price;
    metrics.change = quote.change;
    metrics.changePercent = quote.changePercent;

    // Calculate market cap if we have price
    if (quote.price && stock.historicalMetrics?.[0]?.shares) {
      metrics.marketCap = quote.price * stock.historicalMetrics[0].shares;
    }

    // Calculate P/S Ratio
    if (metrics.marketCap && stock.revenue?.current) {
      metrics.psRatio = metrics.marketCap / stock.revenue.current;
    }

    // Calculate P/E Ratio
    if (metrics.marketCap && stock.netIncome?.current) {
      metrics.peRatio = metrics.marketCap / stock.netIncome.current;
    }

    // Calculate FCF Yield
    if (metrics.marketCap && stock.fcf?.current) {
      metrics.fcfYield = (stock.fcf.current / metrics.marketCap) * 100;
    }

    // Calculate Upside
    if (stock.intrinsicValue && quote.price) {
      metrics.upside = ((stock.intrinsicValue - quote.price) / quote.price) * 100;
    }

    return metrics;
  }

  async updateStockData(stock: any): Promise<void> {
    try {
      const quote = await this.fetchQuote(stock.symbol);

      if (!quote) {
        console.warn(`No data available for ${stock.symbol}`);
        return;
      }

      const metrics = this.calculateMetrics(stock, quote);

      await Stock.updateOne(
        { symbol: stock.symbol },
        { $set: metrics }
      );

      console.log(`✅ Updated ${stock.symbol} with latest metrics`);
    } catch (error) {
      console.error(`Error updating ${stock.symbol}:`, error);
    }
  }
}

export default StockDataFetcher;