// /src/models/stock.ts

import mongoose, { Schema, Document } from 'mongoose';

interface IStock extends Document {
    symbol: string;
    name: string;
    price: number;
    dcfModelUrl?: string; // URL to the DCF model file
}

const StockSchema: Schema = new Schema({
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    dcfModelUrl: { type: String },
});

export default mongoose.model<IStock>('Stock', StockSchema);
