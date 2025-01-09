// src/scripts/StockDataFetcher.ts

import axios from 'axios';
import Stock from '../models/stock';
import dotenv from 'dotenv';

dotenv.config();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY!;
const TIMEOUT_MS = 10000; // 10-second timeout for API calls

interface AlphaVantageQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  volume: number;
}

interface MetricData {
  year: number;
  revenue: number;
  netIncome: number;
  fcf: number;
}

interface HistoricalMetricData extends MetricData {
  shares: number;
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
      // Use TIME_SERIES_INTRADAY for real-time quotes
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const data = await this.fetchWithTimeout<any>(url);
      
      console.log(`Raw API response for ${symbol}:`, JSON.stringify(data, null, 2));
  
      if (data['Note'] || data['Information']) {
        console.warn(`API message: ${data['Note'] || data['Information']}`);
        return null;
      }
  
      const timeSeries = data['Time Series (5min)'];
      if (!timeSeries || Object.keys(timeSeries).length === 0) {
        console.warn(`No intraday data found for ${symbol}`);
        return null;
      }
  
      // Get the most recent quote
      const latestTimestamp = Object.keys(timeSeries)[0];
      const latestQuote = timeSeries[latestTimestamp];
  
      // Get previous close for change calculation
      const previousClose = parseFloat(latestQuote['4. close']); // Using previous interval's close
      const currentPrice = parseFloat(latestQuote['1. open']); // Using current interval's open
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;
  
      return {
        symbol,
        price: currentPrice,
        change,
        changePercent,
        volume: parseInt(latestQuote['5. volume'], 10),
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  private calculateMetrics(stock: {
    symbol: string;
    historicalMetrics?: HistoricalMetricData[];
    futureMetrics?: MetricData[];
    revenue?: { current: number };
    netIncome?: { current: number };
    fcf?: { current: number };
    intrinsicValue?: number;
  }, quote: AlphaVantageQuote): Record<string, number> {
    const metrics: Record<string, number> = {};

    // Basic metrics from quote
    metrics.price = quote.price;
    metrics.change = quote.change;
    metrics.changePercent = quote.changePercent * 0.01; // Store as percentage (e.g., 5.25 for 5.25%)

    // Get most recent data for calculations
    const mostRecentFuture = stock.futureMetrics?.[0];
    const mostRecentHistorical = stock.historicalMetrics?.[0]; // For shares count

    // Calculate market cap if we have price and historical shares
    if (quote.price && mostRecentHistorical?.shares) {
      metrics.marketCap = quote.price * mostRecentHistorical.shares;
    }

    // Use future metrics for ratios if available
    if (metrics.marketCap && mostRecentFuture) {
      // Calculate P/S Ratio using future revenue
      metrics.psRatio = metrics.marketCap / mostRecentFuture.revenue;

      // Calculate P/E Ratio using future net income
      metrics.peRatio = metrics.marketCap / mostRecentFuture.netIncome;

      // Calculate FCF Yield as percentage using future FCF
      metrics.fcfYield = (mostRecentFuture.fcf / metrics.marketCap); // Store as percentage
    }

    // Calculate Upside as percentage
    if (stock.intrinsicValue && quote.price) {
      metrics.upside = ((stock.intrinsicValue - quote.price) / quote.price); // Store as percentage
    }

    // Include growth metrics from future projections if available
    const lastFutureMetric = stock.futureMetrics?.[stock.futureMetrics.length - 1];

    if (mostRecentFuture && lastFutureMetric && mostRecentHistorical) {
      // Calculate projected growth rates from historical to end of projection
      metrics.projectedRevenueGrowth = (lastFutureMetric.revenue - mostRecentHistorical.revenue) / mostRecentHistorical.revenue;
      metrics.projectedNetIncomeGrowth = (lastFutureMetric.netIncome - mostRecentHistorical.netIncome) / mostRecentHistorical.netIncome;
      metrics.projectedFcfGrowth = (lastFutureMetric.fcf - mostRecentHistorical.fcf) / mostRecentHistorical.fcf;
    }

    console.log(`Calculated metrics for ${stock.symbol}:`, {
      price: metrics.price,
      change: metrics.change,
      changePercent: `${metrics.changePercent}%`,
      marketCap: metrics.marketCap ? `$${(metrics.marketCap / 1e9).toFixed(2)}B` : 'N/A',
      psRatio: metrics.psRatio?.toFixed(2) || 'N/A',
      peRatio: metrics.peRatio?.toFixed(2) || 'N/A',
      fcfYield: metrics.fcfYield ? `${metrics.fcfYield.toFixed(2)}%` : 'N/A',
      upside: metrics.upside ? `${metrics.upside.toFixed(2)}%` : 'N/A',
      projectedGrowth: {
        revenue: metrics.projectedRevenueGrowth ? `${(metrics.projectedRevenueGrowth * 100).toFixed(2)}%` : 'N/A',
        netIncome: metrics.projectedNetIncomeGrowth ? `${(metrics.projectedNetIncomeGrowth * 100).toFixed(2)}%` : 'N/A',
        fcf: metrics.projectedFcfGrowth ? `${(metrics.projectedFcfGrowth * 100).toFixed(2)}%` : 'N/A',
      }
    });

    return metrics;
  }

  async updateStockData(stock: any): Promise<void> {
    try {
      // Log the API key being used (but mask most of it)
      const maskedKey = ALPHA_VANTAGE_API_KEY.substring(0, 4) + '...' + ALPHA_VANTAGE_API_KEY.substring(ALPHA_VANTAGE_API_KEY.length - 4);
      console.log(`Using API key: ${maskedKey}`);

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