// src/config/stripe.ts
import Stripe from 'stripe';
import dotenv from 'dotenv';
import environment from './environment';
dotenv.config();

if (!environment.stripe.secretKey) {
  throw new Error('Stripe secret key must be defined in environment variables');
}

const stripe = new Stripe(environment.stripe.secretKey, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export default stripe;