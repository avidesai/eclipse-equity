"use strict";
// src/scripts/scheduler.ts
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
const node_cron_1 = __importDefault(require("node-cron"));
const mongoose_1 = __importDefault(require("mongoose"));
const stock_1 = __importDefault(require("../models/stock"));
const StockDataFetcher_1 = __importDefault(require("./StockDataFetcher"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const updateStocks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield mongoose_1.default.connect(process.env.MONGO_URI, {
        // Remove useNewUrlParser and useUnifiedTopology as they're no longer needed
        });
        console.log('✅ Connected to MongoDB');
        const stocks = yield stock_1.default.find();
        const fetcher = StockDataFetcher_1.default.getInstance();
        for (const stock of stocks) {
            console.log(`🔄 Updating ${stock.symbol}...`);
            yield fetcher.updateStockData(stock);
        }
        console.log('✅ All stocks updated successfully');
    }
    catch (error) {
        console.error('❌ Error updating stocks:', error);
    }
    finally {
        yield mongoose_1.default.disconnect();
        console.log('📡 Disconnected from MongoDB');
    }
});
// Schedule updates during market hours (9:30 AM to 4:00 PM EST, Monday-Friday)
node_cron_1.default.schedule('*/15 9-16 * * 1-5', () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    // Only run between 9:30 AM and 4:00 PM
    if ((hour === 9 && minute >= 30) || (hour > 9 && hour < 16)) {
        console.log('⏰ Starting scheduled stock update...');
        updateStocks();
    }
}, {
    timezone: 'America/New_York'
});
// Run once when the script starts
console.log('🚀 Starting initial stock update...');
updateStocks();
//# sourceMappingURL=scheduler.js.map