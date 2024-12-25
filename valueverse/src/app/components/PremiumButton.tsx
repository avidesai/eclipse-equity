// src/app/components/PremiumButton.tsx

'use client';
import { useState } from 'react';
import { createCheckoutSession } from '../utils/stripe';
import { useAuth } from '../contexts/AuthContext';

export default function PremiumButton() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (user?.isPremium) {
    return (
      <button
        className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg font-medium cursor-default"
        disabled
      >
        Premium Plan
      </button>
    );
  }

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await createCheckoutSession();
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      alert('Failed to initiate premium upgrade.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={isLoading}
      className={`px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium 
        hover:scale-105 active:scale-95 transition-all duration-200
        ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
    >
      {isLoading ? 'Processing...' : 'Upgrade to Premium'}
    </button>
  );
}