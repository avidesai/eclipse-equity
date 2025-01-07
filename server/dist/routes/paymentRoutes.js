"use strict";
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
// /src/routes/paymentRoutes.ts
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("../config/stripe"));
const user_1 = __importDefault(require("../models/user"));
const auth_1 = __importDefault(require("../middleware/auth"));
const environment_1 = __importDefault(require("../config/environment"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Create a limiter for payment routes
const paymentLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
const router = express_1.default.Router();
// Apply rate limiter to all payment routes
router.use(paymentLimiter);
// Test endpoint to verify API connection
router.get('/test', auth_1.default, (req, res) => {
    res.status(200).json({
        message: 'Payment API is working',
        user: req.user,
        environment: environment_1.default.NODE_ENV
    });
});
// Route to create Stripe Checkout Session
router.post('/create-checkout-session', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.email)) {
            res.status(400).json({ message: 'User email is required' });
            return;
        }
        console.log('Creating checkout session for user:', req.user.email);
        console.log('Environment:', environment_1.default.NODE_ENV);
        console.log('Using price ID:', environment_1.default.stripe.priceId);
        const session = yield stripe_1.default.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: req.user.email,
            line_items: [
                {
                    price: environment_1.default.stripe.priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: req.user.id
            },
            success_url: `${environment_1.default.CLIENT_URL}/account?status=success`,
            cancel_url: `${environment_1.default.CLIENT_URL}/account?status=cancelled`,
            billing_address_collection: 'required',
            allow_promotion_codes: true,
            ui_mode: 'hosted'
        });
        console.log('Full Stripe session response:', JSON.stringify(session, null, 2));
        if (!session.url) {
            console.error('Session created but URL is missing:', session);
            res.status(500).json({ message: 'Checkout URL not generated' });
            return;
        }
        res.status(200).json({
            id: session.id,
            url: session.url
        });
    }
    catch (error) {
        console.error('Detailed Stripe session creation error:', error);
        res.status(500).json({
            message: 'Failed to create checkout session',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Stripe Webhook Endpoint
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const sig = req.headers['stripe-signature'];
    if (!sig) {
        console.error('Webhook Error: Missing Stripe signature');
        res.status(400).send('Webhook Error: Missing Stripe signature');
        return;
    }
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, sig, environment_1.default.stripe.webhookSecret);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Webhook Error';
        console.error(`Webhook Error: ${message}`);
        res.status(400).send(`Webhook Error: ${message}`);
        return;
    }
    // Handle Stripe event
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    console.error('No user ID found in session metadata');
                    break;
                }
                const user = yield user_1.default.findById(userId);
                if (user) {
                    user.isPremium = true;
                    yield user.save();
                    console.log(`✅ User ${user.email} upgraded to premium. Environment: ${environment_1.default.NODE_ENV}`);
                }
                else {
                    console.warn(`⚠️ User with ID ${userId} not found.`);
                }
                break;
            }
            case 'customer.subscription.deleted':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const userId = (_b = subscription.metadata) === null || _b === void 0 ? void 0 : _b.userId;
                if (userId) {
                    const user = yield user_1.default.findById(userId);
                    if (user) {
                        // Update premium status based on subscription status
                        user.isPremium = subscription.status === 'active';
                        yield user.save();
                        console.log(`✅ Updated premium status for user ${user.email}: ${user.isPremium}. Environment: ${environment_1.default.NODE_ENV}`);
                    }
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}. Environment: ${environment_1.default.NODE_ENV}`);
        }
        res.status(200).json({ received: true });
    }
    catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
}));
// Check if user has premium status
router.get('/is-premium', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ isPremium: user.isPremium });
    }
    catch (error) {
        console.error('Error fetching premium status:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map