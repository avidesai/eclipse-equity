// /src/models/stock.ts

import mongoose, { Schema, Document } from 'mongoose';

interface MetricData {
  year: number;
  revenue: number;
  netIncome: number;
  fcf: number;
}

interface HistoricalMetricData extends MetricData {
  shares: number;
}

interface IStock extends Document {
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change?: number;
  changePercent?: number;
  marketCap?: number;
  enterpriseValue?: number;
  roic?: number;
  revenue?: {
    current: number;
    growth: number;
    cagr: number;
  };
  netIncome?: {
    current: number;
    growth: number;
    cagr: number;
  };
  fcf?: {
    current: number;
    growth: number;
    cagr: number;
  };
  grossMargin?: number;
  netMargin?: number;
  fcfMargin?: number;
  psRatio?: number;
  peRatio?: number;
  fcfYield?: number;
  cash?: number;
  debt?: number;
  netCash?: number;
  terminalValue?: number;
  intrinsicValue?: number;
  upside?: number;
  historicalMetrics?: HistoricalMetricData[];
  futureMetrics?: MetricData[]; // Add futureMetrics
  dcfModelUrl?: string;
  keywords: Array<{
    text: string;
    emoji: string;
  }>;
}

const MetricSchema = {
  year: { type: Number },
  revenue: { type: Number },
  netIncome: { type: Number },
  fcf: { type: Number },
};

const HistoricalMetricSchema = {
  ...MetricSchema,
  shares: { type: Number },
};

const StockSchema: Schema = new Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  logo: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number },
  changePercent: { type: Number },
  marketCap: { type: Number },
  enterpriseValue: { type: Number },
  roic: { type: Number },
  revenue: {
    type: {
      current: { type: Number },
      growth: { type: Number },
      cagr: { type: Number },
    },
  },
  netIncome: {
    type: {
      current: { type: Number },
      growth: { type: Number },
      cagr: { type: Number },
    },
  },
  fcf: {
    type: {
      current: { type: Number },
      growth: { type: Number },
      cagr: { type: Number },
    },
  },
  grossMargin: { type: Number },
  netMargin: { type: Number },
  fcfMargin: { type: Number },
  psRatio: { type: Number },
  peRatio: { type: Number },
  fcfYield: { type: Number },
  cash: { type: Number },
  debt: { type: Number },
  netCash: { type: Number },
  terminalValue: { type: Number },
  intrinsicValue: { type: Number },
  upside: { type: Number },
  historicalMetrics: { type: [HistoricalMetricSchema] },
  futureMetrics: { type: [MetricSchema] }, // Add futureMetrics schema
  dcfModelUrl: { type: String },
  keywords: [{
    text: { type: String, required: true },
    emoji: { type: String, required: true }
  }],
});

export default mongoose.model<IStock>('Stock', StockSchema);