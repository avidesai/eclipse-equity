// src/app/utils/stripe.ts

import api from './api';

export async function createCheckoutSession() {
  try {
    console.log('Creating checkout session...');
    
    const response = await api.post('/payments/create-checkout-session');
    console.log('Checkout session response:', response.data);
    
    const { url } = response.data;
    
    if (!url) {
      console.error('Missing URL in response:', response.data);
      throw new Error('Checkout URL not returned.');
    }
    
    // Use the URL provided directly by Stripe
    window.location.href = url;
  } catch (error: any) {
    console.error('Full error object:', error);
    console.error('Error response:', error.response?.data);
    
    // Check for specific error types
    if (error.response?.status === 401) {
      throw new Error('Please log in to continue');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Invalid request');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later');
    }
    
    throw new Error('Failed to create checkout session');
  }
}