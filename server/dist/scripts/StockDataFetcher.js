"use strict";
// src/scripts/StockDataFetcher.ts
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
const axios_1 = __importDefault(require("axios"));
const stock_1 = __importDefault(require("../models/stock"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const TIMEOUT_MS = 10000; // 10 second timeout for API calls
class StockDataFetcher {
    constructor() {
        this.lastRequestTime = 0;
        this.minRequestInterval = 12100; // 12.1 seconds between requests
    }
    static getInstance() {
        if (!StockDataFetcher.instance) {
            StockDataFetcher.instance = new StockDataFetcher();
        }
        return StockDataFetcher.instance;
    }
    enforceRateLimit() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequestTime;
            if (timeSinceLastRequest < this.minRequestInterval) {
                const delayMs = this.minRequestInterval - timeSinceLastRequest;
                yield new Promise(resolve => setTimeout(resolve, delayMs));
            }
            this.lastRequestTime = Date.now();
        });
    }
    fetchWithTimeout(url) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.enforceRateLimit();
            try {
                const response = yield axios_1.default.get(url, { timeout: TIMEOUT_MS });
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                        throw new Error('Alpha Vantage rate limit exceeded');
                    }
                    if (error.code === 'ECONNABORTED') {
                        throw new Error(`Request timed out after ${TIMEOUT_MS}ms`);
                    }
                }
                throw error;
            }
        });
    }
    fetchQuote(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
                const data = yield this.fetchWithTimeout(url);
                const quote = data['Global Quote'];
                if (!quote || Object.keys(quote).length === 0) {
                    console.warn(`No quote data found for ${symbol}`);
                    return null;
                }
                return {
                    symbol: quote['01. symbol'],
                    price: parseFloat(quote['05. price']),
                    change: parseFloat(quote['09. change']),
                    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
                    volume: parseInt(quote['06. volume'], 10)
                };
            }
            catch (error) {
                console.error(`Error fetching quote for ${symbol}:`, error);
                return null;
            }
        });
    }
    calculateMetrics(stock, quote) {
        var _a, _b, _c, _d, _e;
        const metrics = {};
        // Basic metrics from quote
        metrics.price = quote.price;
        metrics.change = quote.change;
        metrics.changePercent = quote.changePercent;
        // Calculate market cap if we have price
        if (quote.price && ((_b = (_a = stock.historicalMetrics) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.shares)) {
            metrics.marketCap = quote.price * stock.historicalMetrics[0].shares;
        }
        // Calculate P/S Ratio
        if (metrics.marketCap && ((_c = stock.revenue) === null || _c === void 0 ? void 0 : _c.current)) {
            metrics.psRatio = metrics.marketCap / stock.revenue.current;
        }
        // Calculate P/E Ratio
        if (metrics.marketCap && ((_d = stock.netIncome) === null || _d === void 0 ? void 0 : _d.current)) {
            metrics.peRatio = metrics.marketCap / stock.netIncome.current;
        }
        // Calculate FCF Yield
        if (metrics.marketCap && ((_e = stock.fcf) === null || _e === void 0 ? void 0 : _e.current)) {
            metrics.fcfYield = (stock.fcf.current / metrics.marketCap) * 100;
        }
        // Calculate Upside
        if (stock.intrinsicValue && quote.price) {
            metrics.upside = ((stock.intrinsicValue - quote.price) / quote.price) * 100;
        }
        return metrics;
    }
    updateStockData(stock) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quote = yield this.fetchQuote(stock.symbol);
                if (!quote) {
                    console.warn(`No data available for ${stock.symbol}`);
                    return;
                }
                const metrics = this.calculateMetrics(stock, quote);
                yield stock_1.default.updateOne({ symbol: stock.symbol }, { $set: metrics });
                console.log(`✅ Updated ${stock.symbol} with latest metrics`);
            }
            catch (error) {
                console.error(`Error updating ${stock.symbol}:`, error);
            }
        });
    }
}
exports.default = StockDataFetcher;
//# sourceMappingURL=StockDataFetcher.js.map