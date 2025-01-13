// /routes/stockRoutes.ts

import express, { Request, Response, Router } from 'express';
import Stock from '../models/stock';
import StockScheduler from '../services/StockScheduler';
import AWS from 'aws-sdk';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const router: Router = express.Router();

// Initialize AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

const jsonDataPath = path.join(__dirname, '../../stockmodels/jsondata');

// Define interfaces for type safety
interface StockRequest {
  symbol: string;
  name: string;
  price: number;
  dcfModelUrl: string;
  keywords: Array<{
    text: string;
    emoji: string;
  }>;
}

// Get all stocks from MongoDB
router.get('/', (async (_req: Request, res: Response) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message });
  }
}) as express.RequestHandler);

// Get static stock data from JSON files
router.get('/static/:symbol', (async (req: Request, res: Response) => {
  const { symbol } = req.params;
  const jsonFilePath = path.join(jsonDataPath, `${symbol}.json`);
  try {
    const jsonData = require(jsonFilePath);
    res.json(jsonData);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stock data not found or unavailable.';
    res.status(404).json({ message });
  }
}) as express.RequestHandler);

// Add a new stock (to MongoDB)
router.post('/', (async (req: Request<{}, {}, StockRequest>, res: Response) => {
  const { symbol, name, price, dcfModelUrl, keywords} = req.body;
  const stock = new Stock({ symbol, name, price, dcfModelUrl, keywords});
  try {
    const savedStock = await stock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ message });
  }
}) as express.RequestHandler);

// Force update all stocks
router.post('/force-update', (async (_req: Request, res: Response) => {
  try {
    const scheduler = StockScheduler.getInstance();
    await scheduler.updateStocks(true);
    res.json({ message: 'Stock update completed successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message });
  }
}) as express.RequestHandler);

// Get S3 URL for a model
router.get('/model-url/:symbol', (async (req: Request, res: Response) => {
  const { symbol } = req.params;
  try {
    const stock = await Stock.findOne({ symbol });
    if (!stock || !stock.dcfModelUrl) {
      return res.status(404).json({ message: 'Model URL not found for the specified stock symbol.' });
    }
    res.json({ url: stock.dcfModelUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message });
  }
}) as express.RequestHandler);

// Download model file from S3
router.get('/download-model/:symbol', (async (req: Request, res: Response) => {
  const { symbol } = req.params;
  try {
    const stock = await Stock.findOne({ symbol });
    if (!stock || !stock.dcfModelUrl) {
      return res.status(404).json({ message: 'Model file not found for the specified stock symbol.' });
    }
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `models/${symbol}.xlsx`,
    };
    // Get the object from S3 and stream it to the client
    s3.getObject(params)
      .createReadStream()
      .on('error', (err) => {
        res.status(500).json({ message: 'Error downloading file', error: err.message });
      })
      .pipe(res);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message });
  }
}) as express.RequestHandler);

export default router;