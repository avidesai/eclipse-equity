// src/scripts/fetchLiveStockData.ts

import axios from 'axios';
import mongoose, { ConnectOptions } from 'mongoose';
import Stock from '../models/stock';
import dotenv from 'dotenv';

dotenv.config();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY!;
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/stockdb';

// Utility to delay execution for rate-limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', (error as Error).message);
    process.exit(1);
  }
};

// Fetch stock data from Alpha Vantage
const fetchStockData = async (symbol: string) => {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await axios.get(url);
    const data = response.data['Global Quote'];

    if (!data || Object.keys(data).length === 0) {
      console.warn(`⚠️ No data found for ${symbol}`);
      return null;
    }

    const price = parseFloat(data['05. price']);
    const change = parseFloat(data['09. change']);
    const changePercent = parseFloat(data['10. change percent']?.replace('%', '') || '0');
    const marketCap = parseFloat(data['06. market cap']);
    const peRatio = parseFloat(data['08. PE ratio']);
    const psRatio = parseFloat(data['12. PS ratio']);

    return {
      price: isNaN(price) ? null : price,
      change: isNaN(change) ? null : change,
      changePercent: isNaN(changePercent) ? null : changePercent,
      marketCap: isNaN(marketCap) ? null : marketCap,
      peRatio: isNaN(peRatio) ? null : peRatio,
      psRatio: isNaN(psRatio) ? null : psRatio,
    };
  } catch (error) {
    console.error(`❌ Error fetching data for ${symbol}:`, (error as Error).message);
    return null;
  }
};

// Update MongoDB with fetched data
const updateStocks = async () => {
  const stocks = await Stock.find();
  for (const stock of stocks) {
    console.log(`🔄 Fetching data for ${stock.symbol}...`);
    const liveData = await fetchStockData(stock.symbol);

    if (!liveData) {
      console.warn(`⚠️ Skipping update for ${stock.symbol} (no data).`);
      continue;
    }

    const { price, change, changePercent, marketCap, peRatio, psRatio } = liveData;

    // Calculate fcfYield and upside
    const fcfYield = stock.fcf?.current && marketCap ? (stock.fcf.current / marketCap) * 100 : null;
    const upside = stock.intrinsicValue && price
      ? ((price / stock.intrinsicValue) - 1) * 100
      : null;

    // Update stock in MongoDB
    try {
      await Stock.updateOne(
        { symbol: stock.symbol },
        {
          $set: {
            price,
            change,
            changePercent,
            marketCap,
            psRatio,
            peRatio,
            fcfYield,
            upside,
          },
        }
      );
      console.log(`✅ Updated ${stock.symbol}`);
    } catch (error) {
      console.error(`❌ Error updating ${stock.symbol}:`, (error as Error).message);
    }

    // Respect Alpha Vantage rate limit
    await delay(12000); // 12 seconds between requests
  }
};

// Main function
const main = async () => {
  await connectDB();
  await updateStocks();
  mongoose.disconnect();
};

main().catch((error) => {
  console.error('❌ Script error:', (error as Error).message);
  process.exit(1);
});
