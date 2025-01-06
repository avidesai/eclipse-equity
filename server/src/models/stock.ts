// /src/models/stock.ts

import mongoose, { Schema, Document } from 'mongoose';

interface IStock extends Document {
  symbol: string;
  name: string;
  price: number;
  change?: number;
  changePercent?: number;
  marketCap?: number;
  enterpriseValue?: number;
  roic?: number;
  revenue?: object;
  netIncome?: object;
  fcf?: object;
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
  historicalMetrics?: Array<object>;
  dcfModelUrl?: string; // URL to the DCF model file
}

const StockSchema: Schema = new Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number },
  changePercent: { type: Number },
  marketCap: { type: Number },
  enterpriseValue: { type: Number },
  roic: { type: Number },
  revenue: { type: Object },
  netIncome: { type: Object },
  fcf: { type: Object },
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
  historicalMetrics: { type: Array },
  dcfModelUrl: { type: String },
});

export default mongoose.model<IStock>('Stock', StockSchema);
