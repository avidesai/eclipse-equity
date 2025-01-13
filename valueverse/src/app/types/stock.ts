// src/app/types/stock.ts

export interface MetricData {
  year: number;
  revenue: number;
  netIncome: number;
  fcf: number;
}

export interface HistoricalMetric extends MetricData {
  shares: number;
}

interface MetricWithGrowth {
  current: number;
  growth: number;
  cagr: number;
}

export interface Stock {
  // Basic Info
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change: number;
  changePercent: number;
  
  // Key Metrics
  marketCap: number;
  enterpriseValue: number;
  roic: number;
  
  // Growth Metrics
  revenue: MetricWithGrowth;
  netIncome: MetricWithGrowth;
  fcf: MetricWithGrowth;
  
  // Margins
  grossMargin: number;
  netMargin: number;
  fcfMargin: number;
  
  // Valuation
  psRatio: number;
  peRatio: number;
  fcfYield: number;
  
  // Balance Sheet
  cash: number;
  debt: number;
  netCash: number;
  
  // DCF Analysis
  terminalValue: number;
  intrinsicValue: number;
  upside: number;
  
  // Historical Data
  historicalMetrics: HistoricalMetric[];

  // Future Data
  futureMetrics: MetricData[];

  // Keywords
  keywords: Array<{
    text: string;
    emoji: string;
  }>;
}