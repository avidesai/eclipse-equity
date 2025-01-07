// /src/scripts/populateStocks.ts

// npx ts-node src/scripts/populateStocks.ts

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Stock from '../models/stock';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/stockdb';
const jsonDataPath = path.join(__dirname, '../../stockmodels/jsondata');
const modelsPath = path.join(__dirname, '../../stockmodels/models');

// Upload file to S3
const uploadToS3 = async (filePath: string, key: string): Promise<string> => {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: fileContent,
  };
  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // Returns the public URL
};

async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log('Connected to MongoDB');

    const files = fs.readdirSync(jsonDataPath);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(jsonDataPath, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Upload corresponding Excel file to S3
        const modelFilePath = path.join(modelsPath, `${data.symbol}.xlsx`);
        let modelUrl = '';
        if (fs.existsSync(modelFilePath)) {
          console.log(`Uploading ${modelFilePath} to S3...`);
          modelUrl = await uploadToS3(modelFilePath, `models/${data.symbol}.xlsx`);
        } else {
          console.warn(`Excel file for ${data.symbol} not found.`);
        }

        // Add S3 URL to stock data
        data.dcfModelUrl = modelUrl;

        // Upsert the stock document in MongoDB
        await Stock.findOneAndUpdate({ symbol: data.symbol }, data, { upsert: true });
        console.log(`Upserted stock: ${data.symbol}`);
      }
    }

    console.log('Database population complete!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    mongoose.disconnect();
  }
}

populateDatabase();
