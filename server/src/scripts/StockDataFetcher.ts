// src/scripts/StockDataFetcher.ts

import axios from 'axios';
import Stock from '../models/stock';
import dotenv from 'dotenv';

dotenv.config();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY!;
const TIMEOUT_MS = 10000;

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

interface GlobalQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

class StockDataFetcher {
  private static instance: StockDataFetcher;
  private lastRequestTime: number = 0;
  private readonly minRequestInterval: number = 12100;

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
      const data = await this.fetchWithTimeout<GlobalQuoteResponse>(url);
      
      console.log(`Raw API response for ${symbol}:`, JSON.stringify(data, null, 2));
  
      if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
        console.warn(`No quote data found for ${symbol}`);
        return null;
      }
  
      const quote = data['Global Quote'];
      
      const changePercent = parseFloat(quote['10. change percent'].replace('%', '')) / 100;
      
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: changePercent,
        volume: parseInt(quote['06. volume'])
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

    metrics.price = quote.price;
    metrics.change = quote.change;
    metrics.changePercent = quote.changePercent;

    const mostRecentFuture = stock.futureMetrics?.[0];
    const mostRecentHistorical = stock.historicalMetrics?.[0];

    if (quote.price && mostRecentHistorical?.shares) {
      metrics.marketCap = quote.price * mostRecentHistorical.shares;
    }

    if (metrics.marketCap && mostRecentFuture) {
      metrics.psRatio = metrics.marketCap / mostRecentFuture.revenue;
      metrics.peRatio = metrics.marketCap / mostRecentFuture.netIncome;
      metrics.fcfYield = (mostRecentFuture.fcf / metrics.marketCap);
    }

    if (stock.intrinsicValue && quote.price) {
      metrics.upside = ((stock.intrinsicValue - quote.price) / quote.price);
    }

    const lastFutureMetric = stock.futureMetrics?.[stock.futureMetrics.length - 1];

    if (mostRecentFuture && lastFutureMetric && mostRecentHistorical) {
      metrics.projectedRevenueGrowth = (lastFutureMetric.revenue - mostRecentHistorical.revenue) / mostRecentHistorical.revenue;
      metrics.projectedNetIncomeGrowth = (lastFutureMetric.netIncome - mostRecentHistorical.netIncome) / mostRecentHistorical.netIncome;
      metrics.projectedFcfGrowth = (lastFutureMetric.fcf - mostRecentHistorical.fcf) / mostRecentHistorical.fcf;
    }

    console.log(`Calculated metrics for ${stock.symbol}:`, {
      price: `$${metrics.price.toFixed(2)}`,
      change: `$${metrics.change.toFixed(2)}`,
      changePercent: `${metrics.changePercent.toFixed(2)}%`,
      marketCap: metrics.marketCap ? `$${(metrics.marketCap / 1e9).toFixed(2)}B` : 'N/A',
      psRatio: metrics.psRatio?.toFixed(2) || 'N/A',
      peRatio: metrics.peRatio?.toFixed(2) || 'N/A',
      fcfYield: metrics.fcfYield ? `${(metrics.fcfYield * 100).toFixed(2)}%` : 'N/A',
      upside: metrics.upside ? `${(metrics.upside * 100).toFixed(2)}%` : 'N/A',
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