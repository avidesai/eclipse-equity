// /src/routes/paymentRoutes.ts

import express, { Request, Response } from 'express';
import stripe from '../config/stripe';
import User from '../models/user';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// Route to create Stripe Checkout Session
router.post('/create-checkout-session', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user?.email) {
      res.status(400).json({ message: 'User email is required' });
      return;
    }

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
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    if (!session.id) {
      throw new Error('Session creation failed, no session ID returned.');
    }

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
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
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
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