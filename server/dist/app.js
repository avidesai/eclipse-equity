"use strict";
// /src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const stockRoutes_1 = __importDefault(require("./routes/stockRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const authRoutes_1 = require("./routes/authRoutes");
const passport_1 = __importDefault(require("passport"));
require("./config/passport");
const environment_1 = __importDefault(require("./config/environment"));
const app = (0, express_1.default)();
// Allowed origins for CORS
const allowedOrigins = environment_1.default.CLIENT_URLS;
// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
// Apply CORS to all routes except the webhook
app.use((0, cors_1.default)(corsOptions));
// For Stripe webhook (Stripe doesn't send an Origin header)
app.use('/api/payments/webhook', express_1.default.raw({ type: 'application/json' }), (_req, _res, next) => {
    next();
});
// General middleware
app.use(express_1.default.json());
// Routes
app.use('/api/stocks', stockRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use(passport_1.default.initialize());
app.use('/api/auth', authRoutes_1.authRoutes);
// Global error handler
app.use((err, _req, res, _next) => {
    console.error('❌ Global Error Handler:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});
exports.default = app;
//# sourceMappingURL=app.js.map