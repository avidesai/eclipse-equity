"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// /src/index.ts
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const environment_1 = __importDefault(require("./config/environment"));
// Connect to MongoDB
(0, db_1.default)()
    .then(() => {
    app_1.default.listen(environment_1.default.PORT, () => {
        console.log('\n🚀 Server Starting...\n');
        console.log(`✅ Server is running on port ${environment_1.default.PORT}`);
        console.log(`🌍 Environment: ${environment_1.default.NODE_ENV}`);
        console.log(`💳 Stripe Mode: ${environment_1.default.NODE_ENV === 'production' ? 'Live' : 'Test'}`);
        console.log(`🔗 Client URL: ${environment_1.default.CLIENT_URL}`);
        // Additional debug info
        if (environment_1.default.NODE_ENV !== 'production') {
            console.log('\n📌 Debug Information:');
            console.log(`- Stripe Price ID: ${environment_1.default.stripe.priceId}`);
            console.log(`- Webhook Configured: ${environment_1.default.stripe.webhookSecret ? 'Yes' : 'No'}`);
            console.log(`- Allowed Origins: ${environment_1.default.CLIENT_URLS.join(', ')}`);
        }
        console.log('\n🟢 Server is ready to accept connections\n');
    });
})
    .catch((err) => {
    console.error('\n❌ Startup Error:');
    console.error('MongoDB connection failed:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map