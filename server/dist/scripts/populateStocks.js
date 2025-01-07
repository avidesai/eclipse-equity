"use strict";
// /src/scripts/populateStocks.ts
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
// npx ts-node src/scripts/populateStocks.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const stock_1 = __importDefault(require("../models/stock"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize AWS S3
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
});
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/stockdb';
const jsonDataPath = path_1.default.join(__dirname, '../../stockmodels/jsondata');
const modelsPath = path_1.default.join(__dirname, '../../stockmodels/models');
// Upload file to S3
const uploadToS3 = (filePath, key) => __awaiter(void 0, void 0, void 0, function* () {
    const fileContent = fs_1.default.readFileSync(filePath);
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileContent,
    };
    const uploadResult = yield s3.upload(params).promise();
    return uploadResult.Location; // Returns the public URL
});
function populateDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connected to MongoDB');
            const files = fs_1.default.readdirSync(jsonDataPath);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path_1.default.join(jsonDataPath, file);
                    const data = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
                    // Upload corresponding Excel file to S3
                    const modelFilePath = path_1.default.join(modelsPath, `${data.symbol}.xlsx`);
                    let modelUrl = '';
                    if (fs_1.default.existsSync(modelFilePath)) {
                        console.log(`Uploading ${modelFilePath} to S3...`);
                        modelUrl = yield uploadToS3(modelFilePath, `models/${data.symbol}.xlsx`);
                    }
                    else {
                        console.warn(`Excel file for ${data.symbol} not found.`);
                    }
                    // Add S3 URL to stock data
                    data.dcfModelUrl = modelUrl;
                    // Upsert the stock document in MongoDB
                    yield stock_1.default.findOneAndUpdate({ symbol: data.symbol }, data, { upsert: true });
                    console.log(`Upserted stock: ${data.symbol}`);
                }
            }
            console.log('Database population complete!');
        }
        catch (error) {
            console.error('Error populating database:', error);
        }
        finally {
            mongoose_1.default.disconnect();
        }
    });
}
populateDatabase();
//# sourceMappingURL=populateStocks.js.map