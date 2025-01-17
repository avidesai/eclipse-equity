"use strict";
// /src/models/stock.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const StockSchema = new mongoose_1.Schema({
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    price: { type: Number, required: true },
    change: { type: Number },
    changePercent: { type: Number },
    marketCap: { type: Number },
    enterpriseValue: { type: Number },
    roic: { type: Number },
    revenue: {
        type: {
            current: { type: Number },
            growth: { type: Number },
            cagr: { type: Number },
        },
    },
    netIncome: {
        type: {
            current: { type: Number },
            growth: { type: Number },
            cagr: { type: Number },
        },
    },
    fcf: {
        type: {
            current: { type: Number },
            growth: { type: Number },
            cagr: { type: Number },
        },
    },
    grossMargin: { type: Number },
    netMargin: { type: Number },
    fcfMargin: { type: Number },
    psRatio: { type: Number },
    peRatio: { type: Number },
    fcfYield: { type: Number },
    cash: { type: Number },
    debt: { type: Number },
    netCash: { type: Number },
    terminalValue: { type: Number },
    intrinsicValue: { type: Number },
    upside: { type: Number },
    historicalMetrics: {
        type: [
            {
                year: { type: Number },
                revenue: { type: Number },
                netIncome: { type: Number },
                fcf: { type: Number },
                shares: { type: Number },
            },
        ],
    },
    dcfModelUrl: { type: String }, // S3 URL
});
exports.default = mongoose_1.default.model('Stock', StockSchema);
//# sourceMappingURL=stock.js.map