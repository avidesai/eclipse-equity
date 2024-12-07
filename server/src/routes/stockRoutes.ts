// /routes/stockRoutes.ts

import express from 'express';
import Stock from '../models/Stock';

const router = express.Router();

// Get all stocks
router.get('/', async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message });
    }
});

// Add a new stock
router.post('/', async (req, res) => {
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
