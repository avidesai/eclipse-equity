// src/app/utils/stripe.ts
import api from './api';

export async function createCheckoutSession() {
  try {
    const response = await api.post('/payments/create-checkout-session');
    const { id } = response.data;
    
    if (!id) {
      throw new Error('Checkout session ID not returned.');
    }
    
    // Redirect to Stripe Checkout
    window.location.href = `https://checkout.stripe.com/checkout/session/${id}`;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert('Failed to create checkout session.');
    throw error;
  }
}