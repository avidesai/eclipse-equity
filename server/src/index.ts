// /src/index.ts
import app from './app';
import connectDB from './config/db';
import environment from './config/environment';

// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(environment.PORT, () => {
      console.log('\n🚀 Server Starting...\n');
      console.log(`✅ Server is running on port ${environment.PORT}`);
      console.log(`🌍 Environment: ${environment.NODE_ENV}`);
      console.log(`💳 Stripe Mode: ${environment.NODE_ENV === 'production' ? 'Live' : 'Test'}`);
      console.log(`🔗 Client URL: ${environment.CLIENT_URL}`);
      
      // Additional debug info
      if (environment.NODE_ENV !== 'production') {
        console.log('\n📌 Debug Information:');
        console.log(`- Stripe Price ID: ${environment.stripe.priceId}`);
        console.log(`- Webhook Configured: ${environment.stripe.webhookSecret ? 'Yes' : 'No'}`);
        console.log(`- Allowed Origins: ${environment.CLIENT_URLS.join(', ')}`);
      }
      
      console.log('\n🟢 Server is ready to accept connections\n');
    });
  })
  .catch((err) => {
    console.error('\n❌ Startup Error:');
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });