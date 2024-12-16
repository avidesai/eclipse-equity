// /src/routes/paymentRoutes.ts

import express, { Request, Response } from 'express';
import stripe from '../config/stripe';
const router = express.Router();

// Route to create Stripe Checkout Session
router.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message });
  }
});

// Stripe Webhook Endpoint
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request<never, any, Buffer>, res: Response): Promise<void> => {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      res.status(400).send('Webhook Error: Missing Stripe signature');
      return;
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
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
  }
);

export default router;