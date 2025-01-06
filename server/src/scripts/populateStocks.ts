// /src/scripts/populateStocks.ts

// npx ts-node src/scripts/populateStocks.ts

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Stock from '../models/stock';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/stockdb';

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

const jsonDataPath = path.join(__dirname, '../../stockmodels/jsondata');

async function populateDatabase() {
  try {
    const files = fs.readdirSync(jsonDataPath);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(jsonDataPath, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Upsert: insert or update the stock document
        await Stock.findOneAndUpdate({ symbol: data.symbol }, data, { upsert: true });
        console.log(`Upserted stock: ${data.symbol}`);
      }
    }

    console.log('Database population complete!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error populating database:', error);
    mongoose.disconnect();
  }
}

populateDatabase();
