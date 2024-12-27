// /src/routes/paymentRoutes.ts

import express, { Request, Response } from 'express';
import stripe from '../config/stripe';
import User from '../models/user';
import authMiddleware from '../middleware/auth';
import rateLimit from 'express-rate-limit';

// Create a limiter for payment routes
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const router = express.Router();

// Apply rate limiter to all payment routes
router.use(paymentLimiter);

// Test endpoint to verify API connection
router.get('/test', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'Payment API is working',
    user: req.user 
  });
});

// Route to create Stripe Checkout Session
router.post('/create-checkout-session', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user?.email) {
      res.status(400).json({ message: 'User email is required' });
      return;
    }

    console.log('Creating checkout session for user:', req.user.email);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: req.user.email,
      line_items: [
        {
          price: 'price_1QTLYwLcvMEEt83aNKacRDL5',
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user.id
      },
      success_url: `${process.env.CLIENT_URL}/account?status=success`,
      cancel_url: `${process.env.CLIENT_URL}/account?status=cancelled`,
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
  } catch (error) {
    console.error('Detailed Stripe session creation error:', error);
    res.status(500).json({ message: 'Failed to create checkout session.' });
  }
});

// Stripe Webhook Endpoint
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request<never, any, Buffer>, res: Response): Promise<void> => {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      console.error('Webhook Error: Missing Stripe signature');
      res.status(400).send('Webhook Error: Missing Stripe signature');
      return;
    }

    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Webhook Error';
      console.error(`Webhook Error: ${message}`);
      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }

    // Handle Stripe event
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const userId = session.metadata?.userId;

          if (!userId) {
            console.error('No user ID found in session metadata');
            break;
          }

          const user = await User.findById(userId);
          if (user) {
            user.isPremium = true;
            await user.save();
            console.log(`✅ User ${user.email} upgraded to premium.`);
          } else {
            console.warn(`⚠️ User with ID ${userId} not found.`);
          }
          break;
        }

        case 'customer.subscription.deleted':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as any;
          const userId = subscription.metadata?.userId;

          if (userId) {
            const user = await User.findById(userId);
            if (user) {
              // Update premium status based on subscription status
              user.isPremium = subscription.status === 'active';
              await user.save();
              console.log(`✅ Updated premium status for user ${user.email}: ${user.isPremium}`);
            }
          }
          break;
        }

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

// Check if user has premium status
router.get('/is-premium', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ isPremium: user.isPremium });
  } catch (error) {
    console.error('Error fetching premium status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;