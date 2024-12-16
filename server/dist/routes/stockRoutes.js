"use strict";
// /routes/stockRoutes.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stock_1 = __importDefault(require("../models/stock"));
const router = express_1.default.Router();
// Get all stocks
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stocks = yield stock_1.default.find();
        res.json(stocks);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message });
    }
}));
// Add a new stock
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol, name, price, dcfModelUrl } = req.body;
    const stock = new stock_1.default({ symbol, name, price, dcfModelUrl });
    try {
        const savedStock = yield stock.save();
        res.status(201).json(savedStock);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(400).json({ message });
    }
}));
exports.default = router;
