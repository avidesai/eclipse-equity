"use strict";
// /src/routes/paymentRoutes.ts
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
const stripe_1 = __importDefault(require("../config/stripe"));
const router = express_1.default.Router();
// Route to create Stripe Checkout Session
router.post('/create-checkout-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe_1.default.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: 'price_1QTLYwLcvMEEt83aNKacRDL5', // Replace with your Stripe Price ID
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });
        res.json({ id: session.id });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message });
    }
}));
// Stripe Webhook Endpoint
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
        res.status(400).send('Webhook Error: Missing Stripe signature');
        return;
    }
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Webhook Error';
        res.status(400).send(`Webhook Error: ${message}`);
        return;
    }
    // Handle Stripe event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            console.log('✅ Payment successful:', session);
            // Fulfill your subscription logic here
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
}));
exports.default = router;
