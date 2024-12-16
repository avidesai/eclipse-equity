// /routes/stockRoutes.ts

import express, { Request, Response } from 'express';
import Stock from '../models/stock';

const router = express.Router();

interface StockRequest {
  symbol: string;
  name: string;
  price: number;
  dcfModelUrl: string;
}

// Get all stocks
router.get('/', async (req: Request, res: Response) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ message });
  }
});

// Add a new stock
router.post('/', async (req: Request<{}, {}, StockRequest>, res: Response) => {
  const { symbol, name, price, dcfModelUrl } = req.body;
  const stock = new Stock({ symbol, name, price, dcfModelUrl });
  try {
    const savedStock = await stock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ message });
  }
});

export default router;