"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/environment.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const environment = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 11000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    // Client URLs
    CLIENT_URLS: [
        'https://valueverse.pro',
        'https://www.valueverse.pro',
        'https://valueverse-git-main-avidesais-projects.vercel.app',
        'http://localhost:3000'
    ],
    // Stripe Configuration
    stripe: {
        secretKey: process.env.NODE_ENV === 'production'
            ? process.env.STRIPE_LIVE_SECRET_KEY
            : process.env.STRIPE_TEST_SECRET_KEY,
        webhookSecret: process.env.NODE_ENV === 'production'
            ? process.env.STRIPE_LIVE_WEBHOOK_SECRET
            : process.env.STRIPE_TEST_WEBHOOK_SECRET,
        priceId: process.env.NODE_ENV === 'production'
            ? process.env.STRIPE_LIVE_PRICE_ID
            : process.env.STRIPE_TEST_PRICE_ID
    },
    // Google OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // SendGrid
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_USER: process.env.EMAIL_USER,
    // Base client URL for redirects
    CLIENT_URL: process.env.NODE_ENV === 'production'
        ? 'https://valueverse.pro'
        : 'http://localhost:3000'
};
exports.default = environment;
//# sourceMappingURL=environment.js.map