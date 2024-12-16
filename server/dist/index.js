"use strict";
// index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, db_1.default)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
});
