// src/app/utils/stripe.ts
import api from './api';

export async function createCheckoutSession() {
  try {
    const response = await api.post('/payments/create-checkout-session');
    const { url } = response.data;
    
    if (!url) {
      throw new Error('Checkout URL not returned.');
    }
    
    // Use the URL provided directly by Stripe
    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert('Failed to create checkout session.');
    throw error;
  }
}