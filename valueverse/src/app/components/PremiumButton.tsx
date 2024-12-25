// src/app/components/PremiumButton.tsx

'use client';
import { createCheckoutSession } from '../utils/stripe';
import { useAuth } from '../contexts/AuthContext';

export default function PremiumButton() {
  const { user } = useAuth();

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
    try {
      await createCheckoutSession();
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      alert('Failed to initiate premium upgrade.');
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:scale-105 active:scale-95 transition-all duration-200"
    >
      Upgrade to Premium
    </button>
  );
}
