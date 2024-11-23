// src/app/types/stock.ts
export interface HistoricalMetric {
  year: number;
  revenue: number;
  netIncome: number;
  fcf: number;
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
  price: number;
  change: number;
  changePercent: number;
  logo: string;
  
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
}