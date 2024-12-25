// src/app/utils/stripe.ts

import axios from './api';

export async function createCheckoutSession() {
  try {
    const response = await axios.post('/payments/create-checkout-session');
    const { id } = response.data;

    // Redirect to Stripe Checkout
    window.location.href = `https://checkout.stripe.com/pay/${id}`;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert('Failed to create checkout session.');
  }
}
