// /src/config/stripe.ts

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export default stripe;