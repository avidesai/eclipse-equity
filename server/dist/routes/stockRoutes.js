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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
// Initialize AWS S3
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
});
const jsonDataPath = path_1.default.join(__dirname, '../../stockmodels/jsondata');
// Get all stocks from MongoDB
router.get('/', ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stocks = yield stock_1.default.find();
        res.json(stocks);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message });
    }
})));
// Get static stock data from JSON files
router.get('/static/:symbol', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol } = req.params;
    const jsonFilePath = path_1.default.join(jsonDataPath, `${symbol}.json`);
    try {
        const jsonData = require(jsonFilePath);
        res.json(jsonData);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Stock data not found or unavailable.';
        res.status(404).json({ message });
    }
})));
// Add a new stock (to MongoDB)
router.post('/', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol, name, price, dcfModelUrl } = req.body;
    const stock = new stock_1.default({ symbol, name, price, dcfModelUrl });
    try {
        const savedStock = yield stock.save();
        res.status(201).json(savedStock);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ message });
    }
})));
// Get S3 URL for a model
router.get('/model-url/:symbol', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol } = req.params;
    try {
        const stock = yield stock_1.default.findOne({ symbol });
        if (!stock || !stock.dcfModelUrl) {
            return res.status(404).json({ message: 'Model URL not found for the specified stock symbol.' });
        }
        res.json({ url: stock.dcfModelUrl });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message });
    }
})));
// Download model file from S3
router.get('/download-model/:symbol', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { symbol } = req.params;
    try {
        const stock = yield stock_1.default.findOne({ symbol });
        if (!stock || !stock.dcfModelUrl) {
            return res.status(404).json({ message: 'Model file not found for the specified stock symbol.' });
        }
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `models/${symbol}.xlsx`,
        };
        // Get the object from S3 and stream it to the client
        s3.getObject(params)
            .createReadStream()
            .on('error', (err) => {
            res.status(500).json({ message: 'Error downloading file', error: err.message });
        })
            .pipe(res);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message });
    }
})));
exports.default = router;
//# sourceMappingURL=stockRoutes.js.map