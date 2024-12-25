// src/app/utils/stripe.ts
import axios from 'axios';

export async function createCheckoutSession() {
  try {
    const response = await axios.post('/api/payments/create-checkout-session');
    const { id } = response.data;

    if (!id) {
      throw new Error('Checkout session ID not returned.');
    }

    // Redirect to Stripe Checkout
    window.location.href = `https://checkout.stripe.com/checkout/session/${id}`;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert('Failed to create checkout session.');
  }
}
