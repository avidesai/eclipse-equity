"use strict";
// index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const environment_1 = __importDefault(require("./config/environment"));
// Connect to MongoDB
(0, db_1.default)()
    .then(() => {
    app_1.default.listen(environment_1.default.PORT, () => {
        console.log(`✅ Server is running on port ${environment_1.default.PORT}`);
        console.log(`🌍 Environment: ${environment_1.default.NODE_ENV}`);
    });
})
    .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
});
