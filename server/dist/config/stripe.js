"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/stripe.ts
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const environment_1 = __importDefault(require("./environment"));
dotenv_1.default.config();
if (!environment_1.default.stripe.secretKey) {
    throw new Error('Stripe secret key must be defined in environment variables');
}
const stripe = new stripe_1.default(environment_1.default.stripe.secretKey, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
});
exports.default = stripe;
//# sourceMappingURL=stripe.js.map