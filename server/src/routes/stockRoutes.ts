// /routes/stockRoutes.ts

import express, { Request, Response, Router } from 'express';
import Stock from '../models/stock';
import fs from 'fs';
import path from 'path';

const router: Router = express.Router();
const jsonDataPath = path.join(__dirname, '../../stockmodels/jsondata');

// Define interfaces for type safety
interface StockRequest {
  symbol: string;
  name: string;
  price: number;
  dcfModelUrl: string;
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
    if (!fs.existsSync(jsonFilePath)) {
      return res.status(404).json({ error: 'Stock data not found' });
    }
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    res.json(jsonData);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message });
  }
}) as express.RequestHandler);

// Add a new stock (to MongoDB)
router.post('/', (async (req: Request<{}, {}, StockRequest>, res: Response) => {
  const { symbol, name, price, dcfModelUrl } = req.body;
  const stock = new Stock({ symbol, name, price, dcfModelUrl });
  try {
    const savedStock = await stock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ message });
  }
}) as express.RequestHandler);

export default router;