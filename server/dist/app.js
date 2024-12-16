"use strict";
// /src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const stockRoutes_1 = __importDefault(require("./routes/stockRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const authRoutes_1 = require("./routes/authRoutes"); // Named import
const passport_1 = __importDefault(require("passport"));
require("./config/passport");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api/stocks', stockRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use(passport_1.default.initialize());
app.use('/api/auth', authRoutes_1.authRoutes);
exports.default = app;
